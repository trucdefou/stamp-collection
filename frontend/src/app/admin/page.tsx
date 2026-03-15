"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  getStamps, getFilters, getStats, createStamp, updateStamp, deleteStamp,
  isLoggedIn, clearToken, imageUrl,
  type Stamp, type Filters, type Stats,
} from "@/lib/api";

const CONDITIONS = ["Mint", "Near Mint", "Fine", "Very Fine", "Good", "Used", "Poor"];

function StampForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Stamp | null;
  onSave: (fd: FormData) => Promise<void>;
  onCancel: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState<string | null>(
    initial?.image_filename ? imageUrl(initial.image_filename) : null
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    // Remove empty optional fields so backend gets null
    for (const [key, value] of Array.from(fd.entries())) {
      if (value === "" && key !== "name" && key !== "country") fd.delete(key);
    }
    const fileInput = fd.get("image") as File;
    if (fileInput && fileInput.size === 0) fd.delete("image");
    try {
      await onSave(fd);
    } catch (err) {
      alert((err as Error).message);
    }
    setSaving(false);
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white/60 border border-sepia-200 rounded-sm p-6">
      <h2 className="font-display text-lg font-bold text-ink-800 mb-5">
        {initial ? "Editar Estampilla" : "Nueva Estampilla"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        {/* Image upload */}
        <div className="md:col-span-2">
          <label className="block text-xs uppercase tracking-wider text-ink-500 mb-1.5">Imagen</label>
          <div className="flex items-start gap-4">
            {preview && (
              <div className="w-24 h-32 rounded-sm overflow-hidden border border-sepia-200 flex-shrink-0">
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="text-sm text-ink-500 file:mr-3 file:py-2 file:px-4 file:rounded-sm file:border file:border-sepia-200 file:text-sm file:bg-parchment file:text-ink-600 hover:file:bg-sepia-100 file:cursor-pointer"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-ink-500 mb-1.5">Nombre *</label>
          <input name="name" required defaultValue={initial?.name || ""} className="w-full bg-parchment border border-sepia-200 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-stamp-gold" />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wider text-ink-500 mb-1.5">País *</label>
          <input name="country" required defaultValue={initial?.country || ""} className="w-full bg-parchment border border-sepia-200 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-stamp-gold" />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wider text-ink-500 mb-1.5">Año</label>
          <input name="year" type="number" defaultValue={initial?.year ?? ""} className="w-full bg-parchment border border-sepia-200 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-stamp-gold font-mono" />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wider text-ink-500 mb-1.5">Categoría</label>
          <input name="category" defaultValue={initial?.category || ""} placeholder="Ej: Conmemorativa, Aérea, Fauna..." className="w-full bg-parchment border border-sepia-200 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-stamp-gold placeholder:italic placeholder:text-ink-300" />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wider text-ink-500 mb-1.5">Estado de Conservación</label>
          <select name="condition" defaultValue={initial?.condition || ""} className="w-full bg-parchment border border-sepia-200 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-stamp-gold">
            <option value="">— Seleccionar —</option>
            {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wider text-ink-500 mb-1.5">Fecha de Adquisición</label>
          <input name="acquisition_date" type="date" defaultValue={initial?.acquisition_date || ""} className="w-full bg-parchment border border-sepia-200 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-stamp-gold font-mono" />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wider text-ink-500 mb-1.5">Valor Estimado ($)</label>
          <input name="estimated_value" type="number" step="0.01" defaultValue={initial?.estimated_value ?? ""} className="w-full bg-parchment border border-sepia-200 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-stamp-gold font-mono" />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wider text-ink-500 mb-1.5">Precio de Compra ($)</label>
          <input name="purchase_price" type="number" step="0.01" defaultValue={initial?.purchase_price ?? ""} className="w-full bg-parchment border border-sepia-200 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-stamp-gold font-mono" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs uppercase tracking-wider text-ink-500 mb-1.5">Notas</label>
          <textarea name="notes" rows={3} defaultValue={initial?.notes || ""} className="w-full bg-parchment border border-sepia-200 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-stamp-gold resize-none" />
        </div>
      </div>

      <div className="flex gap-3 mt-6 justify-end">
        <button type="button" onClick={onCancel} className="px-5 py-2 text-sm border border-sepia-200 rounded-sm hover:bg-sepia-50 transition-colors">
          Cancelar
        </button>
        <button type="submit" disabled={saving} className="px-5 py-2 text-sm bg-ink-800 text-parchment rounded-sm font-display font-semibold hover:bg-ink-700 transition-colors disabled:opacity-50">
          {saving ? "Guardando..." : initial ? "Actualizar" : "Crear"}
        </button>
      </div>
    </form>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const [stamps, setStamps] = useState<Stamp[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Stamp | null>(null);
  const pageSize = 10;

  useEffect(() => {
    if (!isLoggedIn()) router.push("/admin/login");
  }, [router]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [data, s] = await Promise.all([
        getStamps({ page, page_size: pageSize, search: search || undefined }),
        getStats(),
      ]);
      setStamps(data.stamps);
      setTotal(data.total);
      setStats(s);
    } catch (e: any) {
      if (e.message?.includes("Token")) {
        clearToken();
        router.push("/admin/login");
      }
    }
    setLoading(false);
  }, [page, search, router]);

  useEffect(() => { if (isLoggedIn()) load(); }, [load]);

  async function handleCreate(fd: FormData) {
    await createStamp(fd);
    setShowForm(false);
    setPage(1);
    load();
  }

  async function handleUpdate(fd: FormData) {
    if (!editing) return;
    await updateStamp(editing.id, fd);
    setEditing(null);
    setShowForm(false);
    load();
  }

  async function handleDelete(stamp: Stamp) {
    if (!confirm(`¿Eliminar "${stamp.name}"? Esta acción no se puede deshacer.`)) return;
    await deleteStamp(stamp.id);
    load();
  }

  function handleLogout() {
    clearToken();
    router.push("/admin/login");
  }

  const totalPages = Math.ceil(total / pageSize);

  if (!isLoggedIn()) return null;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-800">Panel de Administración</h1>
          <p className="text-sm text-ink-400 italic">Gestión del catálogo filatélico</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => { setEditing(null); setShowForm(!showForm); }}
            className="px-4 py-2 text-sm bg-stamp-green text-white rounded-sm font-display font-semibold hover:opacity-90 transition-opacity"
          >
            + Nueva Estampilla
          </button>
          <button onClick={handleLogout} className="px-4 py-2 text-sm border border-sepia-200 rounded-sm text-ink-500 hover:bg-sepia-50 transition-colors">
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/60 border border-sepia-200 rounded-sm px-4 py-3 text-center">
            <p className="text-xl font-display font-bold text-ink-800">{stats.total_stamps}</p>
            <p className="text-[10px] text-ink-400 uppercase tracking-wider">Estampillas</p>
          </div>
          <div className="bg-white/60 border border-sepia-200 rounded-sm px-4 py-3 text-center">
            <p className="text-xl font-display font-bold text-ink-800">{stats.total_countries}</p>
            <p className="text-[10px] text-ink-400 uppercase tracking-wider">Países</p>
          </div>
          <div className="bg-white/60 border border-sepia-200 rounded-sm px-4 py-3 text-center">
            <p className="text-xl font-display font-bold text-stamp-gold">${stats.total_estimated_value.toLocaleString()}</p>
            <p className="text-[10px] text-ink-400 uppercase tracking-wider">Valor Total</p>
          </div>
          <div className="bg-white/60 border border-sepia-200 rounded-sm px-4 py-3 text-center">
            <p className="text-xl font-display font-bold text-ink-800">${stats.total_invested.toLocaleString()}</p>
            <p className="text-[10px] text-ink-400 uppercase tracking-wider">Invertido</p>
          </div>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="mb-8 fade-up">
          <StampForm
            initial={editing}
            onSave={editing ? handleUpdate : handleCreate}
            onCancel={() => { setShowForm(false); setEditing(null); }}
          />
        </div>
      )}

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar en la colección..."
          className="w-full max-w-md bg-parchment border border-sepia-200 rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-stamp-gold focus:ring-1 focus:ring-stamp-gold/30 placeholder:text-ink-300 placeholder:italic"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-16">
          <div className="inline-block w-8 h-8 border-2 border-sepia-300 border-t-stamp-gold rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white/60 border border-sepia-200 rounded-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-sepia-200 bg-sepia-50/50">
                  <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-ink-500 font-semibold w-12"></th>
                  <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-ink-500 font-semibold">Nombre</th>
                  <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-ink-500 font-semibold">País</th>
                  <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-ink-500 font-semibold">Año</th>
                  <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-ink-500 font-semibold">Estado</th>
                  <th className="text-right px-4 py-3 text-[10px] uppercase tracking-wider text-ink-500 font-semibold">Valor</th>
                  <th className="text-right px-4 py-3 text-[10px] uppercase tracking-wider text-ink-500 font-semibold w-32">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {stamps.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-ink-400 italic">
                      No hay estampillas registradas
                    </td>
                  </tr>
                ) : stamps.map((stamp) => (
                  <tr key={stamp.id} className="border-b border-sepia-100 hover:bg-sepia-50/30 transition-colors">
                    <td className="px-4 py-2.5">
                      <div className="w-8 h-10 rounded-sm overflow-hidden bg-sepia-100 border border-sepia-200">
                        {stamp.image_filename ? (
                          <img src={imageUrl(stamp.image_filename)} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-ink-300 text-[8px]">—</div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2.5 font-display font-semibold text-ink-800">{stamp.name}</td>
                    <td className="px-4 py-2.5 text-ink-500">{stamp.country}</td>
                    <td className="px-4 py-2.5 font-mono text-ink-500">{stamp.year || "—"}</td>
                    <td className="px-4 py-2.5">
                      {stamp.condition ? (
                        <span className="inline-block bg-sepia-100 text-ink-600 text-[10px] px-2 py-0.5 rounded-sm uppercase tracking-wider">{stamp.condition}</span>
                      ) : "—"}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-stamp-gold">
                      {stamp.estimated_value != null ? `$${stamp.estimated_value.toLocaleString()}` : "—"}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <button
                        onClick={() => { setEditing(stamp); setShowForm(true); }}
                        className="text-stamp-blue hover:underline underline-offset-2 text-xs mr-3"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(stamp)}
                        className="text-stamp-red hover:underline underline-offset-2 text-xs"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center px-4 py-3 border-t border-sepia-200 bg-sepia-50/30">
              <span className="text-xs text-ink-400">{total} estampillas en total</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 text-xs border border-sepia-200 rounded-sm hover:bg-white disabled:opacity-30 transition-colors"
                >
                  ← Anterior
                </button>
                <span className="px-3 py-1 text-xs font-mono text-ink-500">{page}/{totalPages}</span>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1 text-xs border border-sepia-200 rounded-sm hover:bg-white disabled:opacity-30 transition-colors"
                >
                  Siguiente →
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
