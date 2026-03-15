"use client";
import { useState, useEffect, useCallback } from "react";
import { getStamps, getFilters, getStats, imageUrl, type Stamp, type Filters, type Stats } from "@/lib/api";

function StampCard({ stamp }: { stamp: Stamp }) {
  return (
    <a href={`/stamp/${stamp.id}`} className="stamp-card block">
      <div className="stamp-border rounded-sm shadow-md hover:shadow-xl">
        <div className="aspect-[3/4] bg-sepia-100 rounded-sm overflow-hidden relative">
          {stamp.image_filename ? (
            <img
              src={imageUrl(stamp.image_filename)}
              alt={stamp.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center text-ink-300">
                <svg className="w-12 h-12 mx-auto mb-2 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" /></svg>
                <span className="text-xs italic">Sin imagen</span>
              </div>
            </div>
          )}
          {stamp.condition && (
            <span className="absolute top-2 right-2 bg-ink-800/80 text-parchment text-[10px] font-mono px-2 py-0.5 rounded-sm uppercase tracking-wider">
              {stamp.condition}
            </span>
          )}
        </div>
        <div className="p-3 space-y-1">
          <h3 className="font-display font-semibold text-ink-800 text-sm leading-tight truncate">
            {stamp.name}
          </h3>
          <div className="flex items-center justify-between text-xs text-ink-400">
            <span>{stamp.country}</span>
            {stamp.year && <span className="font-mono">{stamp.year}</span>}
          </div>
          {stamp.estimated_value != null && (
            <p className="text-stamp-gold font-mono text-xs font-medium">
              ${stamp.estimated_value.toLocaleString()}
            </p>
          )}
        </div>
      </div>
    </a>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/60 border border-sepia-200 rounded-sm px-5 py-4 text-center">
      <p className="text-2xl font-display font-bold text-ink-800">{value}</p>
      <p className="text-xs text-ink-400 uppercase tracking-wider mt-1">{label}</p>
    </div>
  );
}

export default function GalleryPage() {
  const [stamps, setStamps] = useState<Stamp[]>([]);
  const [filters, setFilters] = useState<Filters>({ countries: [], categories: [], conditions: [] });
  const [stats, setStats] = useState<Stats | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [loading, setLoading] = useState(true);
  const pageSize = 12;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [data, f, s] = await Promise.all([
        getStamps({ page, page_size: pageSize, search: search || undefined, country: country || undefined, category: category || undefined, condition: condition || undefined }),
        getFilters(),
        getStats(),
      ]);
      setStamps(data.stamps);
      setTotal(data.total);
      setFilters(f);
      setStats(s);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }, [page, search, country, category, condition]);

  useEffect(() => { load(); }, [load]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 fade-up">
          <StatBox label="Estampillas" value={stats.total_stamps.toLocaleString()} />
          <StatBox label="Países" value={stats.total_countries.toLocaleString()} />
          <StatBox label="Valor Estimado" value={`$${stats.total_estimated_value.toLocaleString()}`} />
          <StatBox label="Inversión" value={`$${stats.total_invested.toLocaleString()}`} />
        </div>
      )}

      {/* Search & Filters */}
      <div className="bg-white/50 border border-sepia-200 rounded-sm p-5 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-4">
            <input
              type="text"
              placeholder="Buscar estampillas por nombre, país o notas..."
              className="w-full bg-parchment border border-sepia-200 rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-stamp-gold focus:ring-1 focus:ring-stamp-gold/30 placeholder:text-ink-300 placeholder:italic"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <select value={country} onChange={(e) => { setCountry(e.target.value); setPage(1); }} className="bg-parchment border border-sepia-200 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-stamp-gold">
            <option value="">Todos los países</option>
            {filters.countries.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }} className="bg-parchment border border-sepia-200 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-stamp-gold">
            <option value="">Todas las categorías</option>
            {filters.categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={condition} onChange={(e) => { setCondition(e.target.value); setPage(1); }} className="bg-parchment border border-sepia-200 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-stamp-gold">
            <option value="">Cualquier estado</option>
            {filters.conditions.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <button onClick={() => { setSearch(""); setCountry(""); setCategory(""); setCondition(""); setPage(1); }} className="text-sm text-ink-400 hover:text-stamp-red transition-colors underline underline-offset-2">
            Limpiar filtros
          </button>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block w-8 h-8 border-2 border-sepia-300 border-t-stamp-gold rounded-full animate-spin" />
          <p className="mt-4 text-ink-400 italic text-sm">Cargando colección...</p>
        </div>
      ) : stamps.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-ink-400 italic font-display text-lg">No se encontraron estampillas</p>
          <p className="text-ink-300 text-sm mt-2">Intenta ajustar los filtros de búsqueda</p>
        </div>
      ) : (
        <>
          <p className="text-ink-400 text-sm mb-6">
            Mostrando <span className="font-mono">{stamps.length}</span> de{" "}
            <span className="font-mono">{total}</span> estampillas
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {stamps.map((stamp, i) => (
              <div key={stamp.id} className={`fade-up`} style={{ animationDelay: `${i * 0.05}s`, opacity: 0 }}>
                <StampCard stamp={stamp} />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-12">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-4 py-2 text-sm border border-sepia-200 rounded-sm bg-white hover:bg-sepia-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                ← Anterior
              </button>
              <span className="font-mono text-sm text-ink-500">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 text-sm border border-sepia-200 rounded-sm bg-white hover:bg-sepia-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Siguiente →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
