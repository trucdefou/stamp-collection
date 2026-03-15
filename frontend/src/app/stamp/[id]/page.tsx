"use client";
import { useState, useEffect } from "react";
import { getStamp, imageUrl, type Stamp } from "@/lib/api";
import { useParams } from "next/navigation";
import Link from "next/link";

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  if (!value) return null;
  return (
    <div className="flex justify-between items-baseline py-3 border-b border-black/[0.07] last:border-0">
      <span className="text-[11px] uppercase tracking-widest text-[#888] font-bold">{label}</span>
      <span className="text-sm text-[#1a1a1a] font-semibold text-right">{value}</span>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ backgroundColor: "rgb(248 244 237)" }}>
      <div className="px-5 py-3 border-b border-black/[0.07]">
        <h2 className="text-[11px] font-black uppercase tracking-[0.18em] text-[#555]">{title}</h2>
      </div>
      <div className="px-5 py-1">{children}</div>
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
    <div className="max-w-4xl mx-auto px-8 py-24 text-center">
      <div className="inline-block w-8 h-8 border-2 border-white/10 border-t-gold rounded-full animate-spin" />
    </div>
  );

  if (error || !stamp) return (
    <div className="max-w-4xl mx-auto px-8 py-24 text-center">
      <p className="text-stamp-red font-display font-black text-lg">{error || "Estampilla no encontrada"}</p>
      <a href="/" className="text-sm text-cream-muted hover:text-gold mt-4 inline-block transition-colors">← Volver</a>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-8 py-10 fade-up">
      <Link href="/" className="inline-flex items-center gap-2 text-xs text-cream-muted hover:text-gold transition-colors mb-10 font-bold uppercase tracking-widest">
        ← Volver
      </Link>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Image */}
        <div className="stamp-border" style={{ alignSelf: "start" }}>
          <div className="aspect-[3/4] overflow-hidden bg-[#e8e8e8]">
            {stamp.image_filename ? (
              <img src={imageUrl(stamp.image_filename)} alt={stamp.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg className="w-16 h-16 opacity-20" fill="none" stroke="#555" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                </svg>
              </div>
            )}
          </div>
          <div className="stamp-label">
            <p className="stamp-label-name">{stamp.name}</p>
            {(stamp.country || stamp.year) && (
              <p className="stamp-label-sub">{[stamp.country, stamp.year].filter(Boolean).join(" · ")}</p>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-4">
          <div className="mb-2">
            <h1 className="font-display font-black text-cream leading-tight" style={{ fontSize: "clamp(1.6rem, 4vw, 2.2rem)" }}>
              {stamp.name}
            </h1>
            <p className="text-cream-dim text-sm mt-1 font-semibold">
              {[stamp.country, stamp.year].filter(Boolean).join(" · ")}
            </p>
          </div>

          <Section title="Detalles">
            <InfoRow label="País" value={stamp.country} />
            <InfoRow label="Año" value={stamp.year} />
            <InfoRow label="Categoría" value={stamp.category} />
            <InfoRow label="Estado" value={stamp.condition} />
            <InfoRow label="Fecha de Adquisición" value={stamp.acquisition_date} />
          </Section>

          {(stamp.estimated_value != null || stamp.purchase_price != null) && (
            <Section title="Valoración">
              <InfoRow
                label="Valor Estimado"
                value={stamp.estimated_value != null
                  ? <span className="font-black text-[#1a1a1a]">₲{stamp.estimated_value.toLocaleString()}</span>
                  : null}
              />
              <InfoRow
                label="Precio de Compra"
                value={stamp.purchase_price != null
                  ? `₲${stamp.purchase_price.toLocaleString()}`
                  : null}
              />
            </Section>
          )}

          {stamp.notes && (
            <Section title="Notas">
              <p className="text-sm text-[#333] leading-relaxed py-3 whitespace-pre-wrap">{stamp.notes}</p>
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}
