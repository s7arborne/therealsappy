"use client";
import type { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from "react";

const fieldStyle = {
  width: "100%", padding: "9px 12px", borderRadius: 10,
  background: "var(--glass)", border: "1px solid var(--glass-bd)",
  color: "var(--fg)", fontSize: 14, outline: "none",
};

interface FieldWrapProps { label: string; error?: string; children: React.ReactNode; }

export function FieldWrap({ label, error, children }: FieldWrapProps) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ fontSize: 13, color: "var(--muted)", display: "block", marginBottom: 6 }}>{label}</label>
      {children}
      {error && <p style={{ fontSize: 12, color: "var(--accent)", marginTop: 4 }}>{error}</p>}
    </div>
  );
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} style={{ ...fieldStyle, ...props.style }} />;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} style={{ ...fieldStyle, minHeight: 120, resize: "vertical", ...props.style }} />;
}

export function Select({ children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...props} style={{ ...fieldStyle, cursor: "pointer", ...props.style }}>
      {children}
    </select>
  );
}

export function CheckboxField({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", marginBottom: 16 }}>
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} style={{ width: 16, height: 16, accentColor: "var(--accent)", cursor: "pointer" }} />
      <span style={{ fontSize: 14 }}>{label}</span>
    </label>
  );
}

export function SubmitButton({ label = "Save", loading = false }: { label?: string; loading?: boolean }) {
  return (
    <button type="submit" disabled={loading}
      style={{ padding: "10px 24px", borderRadius: 10, background: "var(--fg)", color: "var(--bg)",
        border: "none", fontWeight: 600, fontSize: 14, cursor: loading ? "wait" : "pointer", opacity: loading ? 0.7 : 1 }}>
      {loading ? "Saving…" : label}
    </button>
  );
}
