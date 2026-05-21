type Props = {
  businessName: string;
  ownerName: string;
  email: string;
  password: string;
  errors: Partial<Record<"businessName" | "ownerName" | "email" | "password", string>>;
  onChange: (field: "businessName" | "ownerName" | "email" | "password", value: string) => void;
};

export function VendorAccountStep({ businessName, ownerName, email, password, errors, onChange }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <div>
        <h2 className="headline-large" style={{ marginBottom: "var(--space-1)" }}>Set up your account</h2>
        <p className="body-medium" style={{ color: "var(--color-on-surface-variant)" }}>
          You&apos;ll use these details to log in to your vendor portal.
        </p>
      </div>

      <div>
        <label className="field-label" htmlFor="va-business">Business name</label>
        <input id="va-business" type="text" className="field" value={businessName} onChange={(e) => onChange("businessName", e.target.value)} placeholder="e.g. Adire Studio" />
        {errors.businessName && <p className="field-error">{errors.businessName}</p>}
      </div>

      <div>
        <label className="field-label" htmlFor="va-owner">Your name</label>
        <input id="va-owner" type="text" className="field" value={ownerName} onChange={(e) => onChange("ownerName", e.target.value)} placeholder="e.g. Chioma Okafor" />
        {errors.ownerName && <p className="field-error">{errors.ownerName}</p>}
      </div>

      <div>
        <label className="field-label" htmlFor="va-email">Email</label>
        <input id="va-email" type="email" className="field" value={email} onChange={(e) => onChange("email", e.target.value)} placeholder="you@business.com" autoComplete="email" />
        {errors.email && <p className="field-error">{errors.email}</p>}
      </div>

      <div>
        <label className="field-label" htmlFor="va-password">Password</label>
        <input id="va-password" type="password" className="field" value={password} onChange={(e) => onChange("password", e.target.value)} placeholder="••••••••" autoComplete="new-password" />
        {errors.password && <p className="field-error">{errors.password}</p>}
      </div>
    </div>
  );
}
