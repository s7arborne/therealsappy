"use client";
import { useState } from "react";
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

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`admin-field ${className ?? ""}`} style={{ ...fieldStyle, ...props.style }} />;
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`admin-field ${className ?? ""}`} style={{ ...fieldStyle, minHeight: 120, resize: "vertical", ...props.style }} />;
}

export function Select({ children, className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...props} className={`admin-field ${className ?? ""}`} style={{ ...fieldStyle, cursor: "pointer", ...props.style }}>
      {children}
    </select>
  );
}

/**
 * A self-contained toggle switch that submits with the form via its own
 * `name` (value "on" when checked), so the parent form can read it with
 * `FormData.get(name) === "on"`. Remounting the dialog resets it from
 * `defaultChecked`.
 */
export function ToggleField({ name, label, defaultChecked = false }: { name: string; label: string; defaultChecked?: boolean }) {
  const [on, setOn] = useState(defaultChecked);
  return (
    <label className="admin-toggle">
      <input type="checkbox" name={name} checked={on} onChange={e => setOn(e.target.checked)} />
      <span className="admin-toggle-track"><span className="admin-toggle-thumb" /></span>
      <span className="admin-toggle-label">{label}</span>
    </label>
  );
}

export function SubmitButton({ label = "Save", loading = false }: { label?: string; loading?: boolean }) {
  return (
    <button type="submit" className="admin-btn-primary" disabled={loading} style={{ padding: "10px 24px", fontSize: 14 }}>
      {loading ? "Saving…" : label}
    </button>
  );
}
