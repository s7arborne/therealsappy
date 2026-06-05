"use client";
import { useMemo, useState } from "react";
import { Trash2, Pencil, Eye, EyeOff, GripVertical, Search, Check, X } from "lucide-react";
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
  /** Enables drag-to-reorder. Receives the full ordered list of ids. */
  onReorder?: (ids: string[]) => Promise<void>;
  /** Keys whose values are matched against the live search box. */
  searchKeys?: string[];
}

export function AdminTable<T extends { id: string; visible?: boolean }>({
  data, columns, onEdit, onDelete, onToggleVisible, onReorder, searchKeys,
}: AdminTableProps<T>) {
  const [rows, setRows] = useState(data);
  const [prevData, setPrevData] = useState(data);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [dragId, setDragId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  // Adjust local rows when the server sends fresh data (React's recommended
  // "store info from prior render" pattern, no effect needed).
  if (data !== prevData) { setPrevData(data); setRows(data); }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || !searchKeys?.length) return rows;
    return rows.filter(r =>
      searchKeys.some(k => String((r as Record<string, unknown>)[k] ?? "").toLowerCase().includes(q))
    );
  }, [rows, query, searchKeys]);

  const dragEnabled = !!onReorder && !query.trim();

  const handleDrop = async () => {
    if (!dragId || !overId || dragId === overId) { setDragId(null); setOverId(null); return; }
    const from = rows.findIndex(r => r.id === dragId);
    const to = rows.findIndex(r => r.id === overId);
    if (from === -1 || to === -1) { setDragId(null); setOverId(null); return; }
    const next = [...rows];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setRows(next);
    setDragId(null); setOverId(null);
    try { await onReorder!(next.map(r => r.id)); toast.success("Order updated"); }
    catch { toast.error("Failed to reorder"); setRows(data); }
  };

  return (
    <div>
      {searchKeys?.length ? (
        <div style={{ marginBottom: 14 }}>
          <span className="admin-search-wrap">
            <Search size={15} />
            <input className="admin-search" placeholder="Search…" value={query}
              onChange={e => setQuery(e.target.value)} />
          </span>
        </div>
      ) : null}

      <div style={{ overflowX: "auto" }}>
        <table className="admin-table">
          <thead>
            <tr>
              {dragEnabled && <th style={{ width: 28 }}></th>}
              {columns.map(c => <th key={c.key}>{c.header}</th>)}
              <th style={{ textAlign: "right" }}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(row => (
              <tr key={row.id}
                className={`admin-row${dragId === row.id ? " is-dragging" : ""}${overId === row.id && dragId !== row.id ? " is-drag-over" : ""}`}
                style={{ opacity: row.visible === false ? 0.55 : 1 }}
                onDragOver={dragEnabled ? e => { e.preventDefault(); setOverId(row.id); } : undefined}
                onDrop={dragEnabled ? handleDrop : undefined}>
                {dragEnabled && (
                  <td style={{ width: 28 }}>
                    <span className="admin-drag-handle" draggable
                      onDragStart={() => setDragId(row.id)}
                      onDragEnd={() => { setDragId(null); setOverId(null); }}
                      aria-label="Drag to reorder">
                      <GripVertical size={16} />
                    </span>
                  </td>
                )}
                {columns.map(c => (
                  <td key={c.key}>
                    {c.render ? c.render(row) : String((row as Record<string, unknown>)[c.key] ?? "")}
                  </td>
                ))}
                <td style={{ textAlign: "right" }}>
                  <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
                    {confirmId === row.id ? (
                      <>
                        <span style={{ fontSize: 12, color: "var(--muted)", alignSelf: "center", marginRight: 4 }}>Delete?</span>
                        <button className="admin-icon-btn danger" aria-label="Confirm delete"
                          disabled={deleting === row.id}
                          onClick={async () => {
                            setDeleting(row.id);
                            try { await onDelete(row.id); toast.success("Deleted"); }
                            catch { toast.error("Failed to delete"); }
                            finally { setDeleting(null); setConfirmId(null); }
                          }}>
                          <Check size={16} />
                        </button>
                        <button className="admin-icon-btn" aria-label="Cancel" onClick={() => setConfirmId(null)}>
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <>
                        {onToggleVisible && (
                          <button className="admin-icon-btn" aria-label={row.visible ? "Hide" : "Show"}
                            onClick={async () => {
                              await onToggleVisible(row.id, !row.visible);
                              toast.success(row.visible ? "Hidden" : "Visible");
                            }}>
                            {row.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                          </button>
                        )}
                        <button className="admin-icon-btn" aria-label="Edit" onClick={() => onEdit(row)}>
                          <Pencil size={16} />
                        </button>
                        <button className="admin-icon-btn danger" aria-label="Delete" onClick={() => setConfirmId(row.id)}>
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filtered.length === 0 && (
        <div className="admin-empty">{query.trim() ? "No matches." : "No items yet."}</div>
      )}
    </div>
  );
}
