"use client";
import { useState, useEffect, useCallback } from "react";
import { getStamps, getFilters, imageUrl, type Stamp, type Filters } from "@/lib/api";

/* Decorative stamp outline for hero watermark */
function StampWatermark() {
  const perf = [40, 76, 112, 148, 184, 220, 256, 292, 328, 364, 400, 436, 472];
  const perfSide = [76, 112, 148, 184, 220, 256, 292, 328, 364, 400, 436];
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-full h-full">
      <rect x="40" y="40" width="432" height="432" fill="none" stroke="white" strokeWidth="4"/>
      {perf.map(cx => <circle key={`t${cx}`} cx={cx} cy="40" r="10" fill="none" stroke="white" strokeWidth="3"/>)}
      {perf.map(cx => <circle key={`b${cx}`} cx={cx} cy="472" r="10" fill="none" stroke="white" strokeWidth="3"/>)}
      {perfSide.map(cy => <circle key={`l${cy}`} cx="40" cy={cy} r="10" fill="none" stroke="white" strokeWidth="3"/>)}
      {perfSide.map(cy => <circle key={`r${cy}`} cx="472" cy={cy} r="10" fill="none" stroke="white" strokeWidth="3"/>)}
      <rect x="72" y="72" width="368" height="368" fill="none" stroke="white" strokeWidth="2"/>
      <rect x="136" y="170" width="240" height="172" fill="none" stroke="white" strokeWidth="6" rx="4"/>
      <polyline points="136,170 256,262 376,170" fill="none" stroke="white" strokeWidth="6" strokeLinejoin="round"/>
    </svg>
  );
}

function StampCard({ stamp }: { stamp: Stamp }) {
  const subtitle = [stamp.country, stamp.year].filter(Boolean).join(" · ");
  return (
    <a href={`/stamp/${stamp.id}`} className="work-entry block">
      {/* Perforated stamp border (cream paper) */}
      <div className="stamp-border">
        {/* Image with hover overlay inside */}
        <div className="stamp-inner aspect-[3/4]">
          {stamp.image_filename ? (
            <img
              src={imageUrl(stamp.image_filename)}
              alt={stamp.name}
              className="entry-image w-full h-full object-cover"
            />
          ) : (
            <div className="entry-image w-full h-full bg-[#e8e8e8] flex items-center justify-center">
              <svg className="w-10 h-10 opacity-20" fill="none" stroke="#6B5A3A" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
              </svg>
            </div>
          )}
          {stamp.condition && (
            <span className="absolute top-2 left-2 z-10 bg-canvas/85 text-gold text-[9px] px-1.5 py-0.5 uppercase tracking-wider font-bold">
              {stamp.condition}
            </span>
          )}
          {/* Hover overlay */}
          <div className="work-entry-hover">
            <div>
              <div className="work-entry-title">{stamp.name}</div>
              {subtitle && <div className="work-entry-cat">{subtitle}</div>}
            </div>
          </div>
        </div>

        {/* Always-visible stamp label */}
        <div className="stamp-label">
          <p className="stamp-label-name">{stamp.name}</p>
          {subtitle && <p className="stamp-label-sub">{subtitle}</p>}
        </div>
      </div>
    </a>
  );
}

export default function GalleryPage() {
  const [stamps, setStamps] = useState<Stamp[]>([]);
  const [filters, setFilters] = useState<Filters>({ countries: [], categories: [], conditions: [] });
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
      const [data, f] = await Promise.all([
        getStamps({ page, page_size: pageSize, search: search || undefined, country: country || undefined, category: category || undefined, condition: condition || undefined }),
        getFilters(),
      ]);
      setStamps(data.stamps);
      setTotal(data.total);
      setFilters(f);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }, [page, search, country, category, condition]);

  useEffect(() => { load(); }, [load]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-white/[0.06]">
        {/* Large stamp outline watermark */}
        <div
          className="absolute -right-8 top-1/2 -translate-y-1/2 pointer-events-none select-none opacity-[0.05]"
          style={{ width: "min(560px, 58vw)" }}
        >
          <StampWatermark />
        </div>

        <div className="max-w-7xl mx-auto px-8 pt-24 pb-20">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 border border-gold/25 px-3 py-1.5 mb-10">
            <span className="w-1.5 h-1.5 bg-gold pulse-gold block" />
            <span className="text-gold text-[10px] font-black uppercase tracking-[0.2em]">
              Paraguay · Filatelia
            </span>
          </div>

          {/* Heading */}
          <h1 className="font-display font-black leading-[0.92]" style={{ fontSize: "clamp(3.5rem, 9vw, 7rem)" }}>
            <span className="block text-cream">Colección</span>
            <span className="block text-gold">de Estampillas.</span>
          </h1>

          {/* Divider */}
          <div className="flex items-center gap-5 mt-10">
            <div className="w-16 h-px bg-gold" />
            <span className="text-cream-dim text-[11px] font-bold uppercase tracking-[0.18em]">
              Catálogo Filatélico Personal
            </span>
          </div>
        </div>
      </section>

      {/* ── Filters ── */}
      <section className="border-b border-white/[0.06] py-4">
        <div className="max-w-7xl mx-auto px-8 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[180px] max-w-xs">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-cream-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              type="text"
              placeholder="Buscar..."
              className="w-full bg-[#35363B] border border-white/[0.08] pl-9 pr-4 py-2 text-sm text-cream placeholder:text-cream-muted focus:outline-none focus:border-gold/50 transition-colors"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>

          {[
            { value: country,   set: (v: string) => { setCountry(v);   setPage(1); }, label: "País",      opts: filters.countries },
            { value: category,  set: (v: string) => { setCategory(v);  setPage(1); }, label: "Categoría", opts: filters.categories },
            { value: condition, set: (v: string) => { setCondition(v); setPage(1); }, label: "Estado",    opts: filters.conditions },
          ].map(({ value, set, label, opts }) => (
            <select
              key={label}
              value={value}
              onChange={(e) => set(e.target.value)}
              className="bg-[#35363B] border border-white/[0.08] px-3 py-2 text-sm text-cream focus:outline-none focus:border-gold/50 transition-colors"
            >
              <option value="">{label}</option>
              {opts.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          ))}

          {(search || country || category || condition) && (
            <button
              onClick={() => { setSearch(""); setCountry(""); setCategory(""); setCondition(""); setPage(1); }}
              className="text-[11px] text-cream-muted hover:text-gold transition-colors font-bold uppercase tracking-widest"
            >
              × Limpiar
            </button>
          )}
        </div>
      </section>

      {/* ── Gallery ── */}
      <section className="max-w-7xl mx-auto px-8 py-12">
        {loading ? (
          <div className="flex flex-col items-center py-36 gap-5">
            <div className="w-8 h-8 border-2 border-white/10 border-t-gold rounded-full animate-spin" />
            <p className="text-cream-dim text-xs font-bold uppercase tracking-widest">Cargando colección...</p>
          </div>
        ) : stamps.length === 0 ? (
          <div className="flex flex-col items-center py-36 gap-3">
            <p className="text-cream-dim font-display font-black text-2xl">Sin resultados</p>
            <p className="text-cream-muted text-sm">Ajusta los filtros de búsqueda</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <p className="text-cream-muted text-[11px] font-bold uppercase tracking-widest">
                {total} {total === 1 ? "pieza" : "piezas"} en colección
              </p>
              <div className="w-20 h-px bg-gradient-to-r from-gold/40 to-transparent" />
            </div>

            {/* Grid — like stamps laid in an album */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {stamps.map((stamp, i) => (
                <div key={stamp.id} className="fade-up" style={{ animationDelay: `${i * 0.04}s`, opacity: 0 }}>
                  <StampCard stamp={stamp} />
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-8 mt-16 pt-8 border-t border-white/[0.06]">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="text-xs font-black text-cream-dim hover:text-gold disabled:opacity-20 disabled:cursor-not-allowed transition-colors uppercase tracking-widest"
                >
                  ← Anterior
                </button>
                <span className="text-cream-muted text-[11px] font-bold tracking-wider">
                  {page} <span className="text-cream-muted/40 mx-1">/</span> {totalPages}
                </span>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="text-xs font-black text-cream-dim hover:text-gold disabled:opacity-20 disabled:cursor-not-allowed transition-colors uppercase tracking-widest"
                >
                  Siguiente →
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
