"use client";
import { useState, useEffect } from "react";
import { getStamp, imageUrl, type Stamp } from "@/lib/api";
import { useParams } from "next/navigation";

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  if (!value) return null;
  return (
    <div className="flex justify-between items-baseline py-2.5 border-b border-sepia-100 last:border-0">
      <span className="text-xs uppercase tracking-wider text-ink-400">{label}</span>
      <span className="font-body text-sm text-ink-700 text-right">{value}</span>
    </div>
  );
}

export default function StampDetailPage() {
  const params = useParams();
  const [stamp, setStamp] = useState<Stamp | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const id = Number(params.id);
    if (!id) return;
    getStamp(id)
      .then(setStamp)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) return (
    <div className="max-w-4xl mx-auto px-6 py-20 text-center">
      <div className="inline-block w-8 h-8 border-2 border-sepia-300 border-t-stamp-gold rounded-full animate-spin" />
    </div>
  );

  if (error || !stamp) return (
    <div className="max-w-4xl mx-auto px-6 py-20 text-center">
      <p className="text-stamp-red font-display text-lg">{error || "Estampilla no encontrada"}</p>
      <a href="/" className="text-sm text-ink-400 hover:text-stamp-red mt-4 inline-block underline">← Volver a la galería</a>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 fade-up">
      <a href="/" className="inline-flex items-center gap-2 text-sm text-ink-400 hover:text-stamp-red transition-colors mb-8">
        <span>←</span> Volver a la galería
      </a>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Image */}
        <div className="stamp-border rounded-sm shadow-lg">
          <div className="aspect-[3/4] bg-sepia-100 rounded-sm overflow-hidden">
            {stamp.image_filename ? (
              <img src={imageUrl(stamp.image_filename)} alt={stamp.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-ink-300">
                <svg className="w-20 h-20 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" /></svg>
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div>
          <div className="mb-6">
            <h1 className="font-display text-3xl font-bold text-ink-800 leading-tight">{stamp.name}</h1>
            <p className="text-ink-400 mt-1 font-body">
              {stamp.country}{stamp.year ? ` · ${stamp.year}` : ""}
            </p>
          </div>

          <div className="bg-white/60 border border-sepia-200 rounded-sm p-5 mb-6">
            <h2 className="font-display text-sm font-semibold text-ink-500 uppercase tracking-wider mb-3">Detalles</h2>
            <InfoRow label="País" value={stamp.country} />
            <InfoRow label="Año" value={stamp.year ? <span className="font-mono">{stamp.year}</span> : null} />
            <InfoRow label="Categoría" value={stamp.category} />
            <InfoRow label="Estado" value={stamp.condition} />
            <InfoRow label="Fecha de Adquisición" value={stamp.acquisition_date} />
          </div>

          {(stamp.estimated_value != null || stamp.purchase_price != null) && (
            <div className="bg-white/60 border border-sepia-200 rounded-sm p-5 mb-6">
              <h2 className="font-display text-sm font-semibold text-ink-500 uppercase tracking-wider mb-3">Valoración</h2>
              <InfoRow label="Valor Estimado" value={stamp.estimated_value != null ? <span className="font-mono text-stamp-gold font-medium">${stamp.estimated_value.toLocaleString()}</span> : null} />
              <InfoRow label="Precio de Compra" value={stamp.purchase_price != null ? <span className="font-mono">${stamp.purchase_price.toLocaleString()}</span> : null} />
            </div>
          )}

          {stamp.notes && (
            <div className="bg-white/60 border border-sepia-200 rounded-sm p-5">
              <h2 className="font-display text-sm font-semibold text-ink-500 uppercase tracking-wider mb-3">Notas</h2>
              <p className="text-sm text-ink-600 leading-relaxed whitespace-pre-wrap">{stamp.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
