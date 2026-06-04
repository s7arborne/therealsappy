"use client";
import { useState } from "react";
import { Trash2, Pencil, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
}

interface AdminTableProps<T extends { id: string; visible?: boolean }> {
  data: T[];
  columns: Column<T>[];
  onEdit: (row: T) => void;
  onDelete: (id: string) => Promise<void>;
  onToggleVisible?: (id: string, visible: boolean) => Promise<void>;
}

export function AdminTable<T extends { id: string; visible?: boolean }>({
  data, columns, onEdit, onDelete, onToggleVisible
}: AdminTableProps<T>) {
  const [deleting, setDeleting] = useState<string | null>(null);

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--line)" }}>
            {columns.map(c => (
              <th key={c.key} style={{ padding: "8px 12px", textAlign: "left", fontSize: 12,
                fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".06em" }}>
                {c.header}
              </th>
            ))}
            <th style={{ padding: "8px 12px", textAlign: "right" }}></th>
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={row.id} style={{ borderBottom: "1px solid var(--line)", opacity: row.visible === false ? 0.5 : 1 }}>
              {columns.map(c => (
                <td key={c.key} style={{ padding: "12px 12px", fontSize: 14 }}>
                  {c.render ? c.render(row) : String((row as Record<string, unknown>)[c.key] ?? "")}
                </td>
              ))}
              <td style={{ padding: "12px 12px", textAlign: "right" }}>
                <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                  {onToggleVisible && (
                    <button onClick={async () => {
                      await onToggleVisible(row.id, !row.visible);
                      toast.success(row.visible ? "Hidden" : "Visible");
                    }}
                      style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", padding: 4 }}
                      aria-label={row.visible ? "Hide" : "Show"}>
                      {row.visible ? <Eye size={15} /> : <EyeOff size={15} />}
                    </button>
                  )}
                  <button onClick={() => onEdit(row)}
                    style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", padding: 4 }}
                    aria-label="Edit">
                    <Pencil size={15} />
                  </button>
                  <button onClick={async () => {
                    if (!confirm("Delete this item?")) return;
                    setDeleting(row.id);
                    try { await onDelete(row.id); toast.success("Deleted"); }
                    catch { toast.error("Failed to delete"); }
                    finally { setDeleting(null); }
                  }}
                    style={{ background: "none", border: "none", color: deleting === row.id ? "var(--muted)" : "var(--accent)", cursor: "pointer", padding: 4 }}
                    aria-label="Delete" disabled={deleting === row.id}>
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <div style={{ padding: "32px 0", textAlign: "center", color: "var(--muted)", fontSize: 14 }}>No items yet.</div>
      )}
    </div>
  );
}
