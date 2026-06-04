const NIGERIAN_BANKS = [
  "Access Bank", "First Bank", "GTBank", "UBA", "Zenith Bank",
  "Fidelity Bank", "FCMB", "Stanbic IBTC", "Union Bank", "Wema Bank",
  "Polaris Bank", "Keystone Bank", "Jaiz Bank", "Kuda Bank",
  "Opay", "Moniepoint", "PalmPay",
];

type Props = {
  accountNumber: string;
  bankName: string;
  bvn: string;
  errors: Partial<Record<"accountNumber" | "bankName" | "bvn", string>>;
  onChange: (field: "accountNumber" | "bankName" | "bvn", value: string) => void;
};

export function VendorBankStep({ accountNumber, bankName, bvn, errors, onChange }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
      <div>
        <h2 className="headline-large" style={{ marginBottom: "var(--space-1)" }}>Bank details</h2>
        <p className="body-medium" style={{ color: "var(--color-on-surface-variant)" }}>
          Your payout account. Payments are split automatically via Flutterwave when customers order.
        </p>
      </div>

      <div>
        <label className="field-label" htmlFor="vb-bank">Bank</label>
        <select id="vb-bank" className="field field--select" value={bankName} onChange={(e) => onChange("bankName", e.target.value)}>
          <option value="">Select your bank</option>
          {NIGERIAN_BANKS.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
        {errors.bankName && <p className="field-error">{errors.bankName}</p>}
      </div>

      <div>
        <label className="field-label" htmlFor="vb-acct">Account number</label>
        <input id="vb-acct" type="text" className="field" inputMode="numeric" maxLength={10} value={accountNumber} onChange={(e) => onChange("accountNumber", e.target.value.replace(/\D/g, ""))} placeholder="0123456789" />
        {errors.accountNumber && <p className="field-error">{errors.accountNumber}</p>}
      </div>

      <div>
        <label className="field-label" htmlFor="vb-bvn">NIN</label>
        <input id="vb-bvn" type="text" className="field" inputMode="numeric" maxLength={11} value={bvn} onChange={(e) => onChange("bvn", e.target.value.replace(/\D/g, ""))} placeholder="••••••••••• (11 digits)" />
        {errors.bvn && <p className="field-error">{errors.bvn}</p>}
        <p className="body-small" style={{ color: "var(--color-on-surface-variant)", marginTop: "var(--space-2)" }}>
          Required to create your Flutterwave payout account. Stored securely and never shown to customers.
        </p>
      </div>
    </div>
  );
}
