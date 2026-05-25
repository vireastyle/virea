import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  TokenRole,
} from "../lib/jwt";
import { AppError } from "../middleware/errorHandler";

const SALT_ROUNDS = 12;

// ─── Helpers ──────────────────────────────────────────────

function stripPassword<T extends { password: string }>(
  record: T
): Omit<T, "password"> {
  const { password: _pw, ...rest } = record;
  return rest;
}

async function issueTokens(id: string, role: TokenRole) {
  const accessToken = signAccessToken({ id, role });
  const refreshToken = signRefreshToken({ id, role });

  const expiresAt = new Date();
  expiresAt.setDate(
    expiresAt.getDate() + parseInt(process.env.JWT_REFRESH_EXPIRES_DAYS ?? "7", 10)
  );

  // Persist refresh token so we can rotate / invalidate it
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      ...(role === "user" ? { userId: id } : { vendorId: id }),
      expiresAt,
    },
  });

  return { accessToken, refreshToken };
}

// ─── User Auth ────────────────────────────────────────────

export async function registerUser(data: {
  email: string;
  password: string;
  name: string;
}) {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) throw new AppError(409, "Email already in use", "EMAIL_TAKEN");

  const hashed = await bcrypt.hash(data.password, SALT_ROUNDS);
  const user = await prisma.user.create({
    data: { email: data.email, password: hashed, name: data.name },
  });

  const tokens = await issueTokens(user.id, "user");
  return { user: stripPassword(user), ...tokens };
}

export async function loginUser(data: { email: string; password: string }) {
  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user) throw new AppError(401, "Invalid credentials", "INVALID_CREDENTIALS");

  const valid = await bcrypt.compare(data.password, user.password);
  if (!valid) throw new AppError(401, "Invalid credentials", "INVALID_CREDENTIALS");

  const tokens = await issueTokens(user.id, "user");
  return { user: stripPassword(user), ...tokens };
}

// ─── Vendor Auth ──────────────────────────────────────────

export async function registerVendor(data: {
  email: string;
  password: string;
  businessName: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  categories: string[];
}) {
  const existing = await prisma.vendor.findUnique({ where: { email: data.email } });
  if (existing) throw new AppError(409, "Email already in use", "EMAIL_TAKEN");

  const hashed = await bcrypt.hash(data.password, SALT_ROUNDS);

  const vendor = await prisma.vendor.create({
    data: {
      email: data.email,
      password: hashed,
      businessName: data.businessName,
      bankName: data.bankName,
      accountNumber: data.accountNumber,
      accountName: data.accountName,
      categories: data.categories as never,
    },
  });

  const tokens = await issueTokens(vendor.id, "vendor");
  return { vendor: stripPassword(vendor), ...tokens };
}

export async function loginVendor(data: { email: string; password: string }) {
  const vendor = await prisma.vendor.findUnique({ where: { email: data.email } });
  if (!vendor) throw new AppError(401, "Invalid credentials", "INVALID_CREDENTIALS");

  const valid = await bcrypt.compare(data.password, vendor.password);
  if (!valid) throw new AppError(401, "Invalid credentials", "INVALID_CREDENTIALS");

  const tokens = await issueTokens(vendor.id, "vendor");
  return { vendor: stripPassword(vendor), ...tokens };
}

// ─── Shared: Refresh & Logout ─────────────────────────────

export async function refreshTokens(incomingToken: string) {
  // 1. Verify signature + expiry
  let payload: { id: string; role: TokenRole };
  try {
    payload = verifyRefreshToken(incomingToken);
  } catch {
    throw new AppError(401, "Invalid or expired refresh token", "TOKEN_INVALID");
  }

  // 2. Check it exists in DB (rotation check — prevents reuse after logout)
  const stored = await prisma.refreshToken.findUnique({
    where: { token: incomingToken },
  });
  if (!stored || stored.expiresAt < new Date()) {
    throw new AppError(401, "Refresh token revoked or expired", "TOKEN_REVOKED");
  }

  // 3. Delete old token (rotation: each refresh issues a brand-new pair)
  await prisma.refreshToken.delete({ where: { token: incomingToken } });

  // 4. Issue new pair
  return issueTokens(payload.id, payload.role);
}

export async function logout(incomingToken: string) {
  // Best-effort — ignore if token not found (already logged out)
  await prisma.refreshToken
    .delete({ where: { token: incomingToken } })
    .catch(() => null);
}
