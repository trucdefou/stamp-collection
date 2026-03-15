import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Colección de Estampillas",
  description: "Sistema de coleccionismo de estampillas",
  icons: { icon: "/icon.svg", shortcut: "/icon.svg", apple: "/icon.svg" },
};

function StampSvg({ className }: { className?: string }) {
  const perf = [40, 76, 112, 148, 184, 220, 256, 292, 328, 364, 400, 436, 472];
  const perfSide = [76, 112, 148, 184, 220, 256, 292, 328, 364, 400, 436];
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className={className}>
      <rect width="512" height="512" fill="#2B2C31"/>
      <rect x="40" y="40" width="432" height="432" fill="#C0392B"/>
      {perf.map(cx => <circle key={`t${cx}`} cx={cx} cy="40" r="14" fill="#2B2C31"/>)}
      {perf.map(cx => <circle key={`b${cx}`} cx={cx} cy="472" r="14" fill="#2B2C31"/>)}
      {perfSide.map(cy => <circle key={`l${cy}`} cx="40" cy={cy} r="14" fill="#2B2C31"/>)}
      {perfSide.map(cy => <circle key={`r${cy}`} cx="472" cy={cy} r="14" fill="#2B2C31"/>)}
      <rect x="72" y="72" width="368" height="368" fill="none" stroke="white" strokeWidth="8"/>
      <rect x="136" y="170" width="240" height="172" fill="none" stroke="white" strokeWidth="12" rx="4"/>
      <polyline points="136,170 256,262 376,170" fill="none" stroke="white" strokeWidth="12" strokeLinejoin="round"/>
      <line x1="136" y1="342" x2="222" y2="274" stroke="white" strokeWidth="10" strokeLinecap="round"/>
      <line x1="376" y1="342" x2="290" y2="274" stroke="white" strokeWidth="10" strokeLinecap="round"/>
    </svg>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="font-body min-h-screen bg-canvas text-cream">

        {/* Top gold accent line */}
        <div className="h-px bg-gradient-to-r from-transparent via-gold to-transparent" />

        {/* Navigation */}
        <header className="border-b border-white/[0.06] py-5">
          <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 group-hover:rotate-[-5deg] group-hover:scale-110 transition-all duration-300">
                <StampSvg />
              </div>
              <div>
                <span className="font-display font-black text-base text-gold group-hover:text-gold-dark transition-colors tracking-tight block leading-none">
                  est.colección
                </span>
                <span className="text-[10px] text-cream-muted uppercase tracking-widest font-semibold">Paraguay</span>
              </div>
            </Link>

            <nav className="flex items-center gap-1">
              <Link href="/" className="text-cream-dim text-sm font-semibold px-4 py-2 hover:text-gold transition-colors">
                Home
              </Link>
              <a href="#contacto" className="text-cream-dim text-sm font-semibold px-4 py-2 hover:text-gold transition-colors">
                Contacto
              </a>
              <Link href="/admin" title="Administración" className="ml-4 text-cream-muted hover:text-gold transition-colors p-2 border border-white/10 hover:border-gold/40">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </Link>
            </nav>
          </div>
        </header>

        <main>{children}</main>

        {/* Contact Section */}
        <section id="contacto" className="relative overflow-hidden bg-[#1E1F23] mt-24 py-24">
          {/* Decorative stamp watermark */}
          <div className="absolute -right-16 top-1/2 -translate-y-1/2 pointer-events-none select-none opacity-[0.05]"
            style={{ width: "min(520px, 55vw)" }}>
            <StampSvg />
          </div>

          <div className="relative max-w-7xl mx-auto px-8">
            <p className="text-gold text-[11px] font-black uppercase tracking-[0.18em] mb-4">Ponerse en contacto</p>
            <h2 className="font-display font-black text-cream leading-none mb-5" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}>
              ¿Hablamos?
            </h2>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-px bg-gold" />
            </div>
            <p className="text-cream-dim text-sm leading-relaxed max-w-md mb-10">
              ¿Interesado en adquirir o intercambiar piezas? ¿Preguntas sobre alguna estampilla? No dudes en escribir.
            </p>

            <div className="flex flex-col gap-5">
              <a href="mailto:coleccion@estampillas.com" className="inline-flex items-center gap-3 group w-fit">
                <div className="w-8 h-8 flex items-center justify-center border border-gold/30 group-hover:border-gold group-hover:bg-maroon/30 transition-all">
                  <svg className="w-3.5 h-3.5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-cream text-sm group-hover:text-gold transition-colors">coleccion@estampillas.com</span>
              </a>
              <div className="inline-flex items-center gap-3 w-fit">
                <div className="w-8 h-8 flex items-center justify-center border border-white/10">
                  <svg className="w-3.5 h-3.5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="text-cream-dim text-sm">Paraguay</span>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        <footer className="bg-[#0D0905] py-5">
          <div className="max-w-7xl mx-auto px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-cream-muted text-[11px] uppercase tracking-widest">
            <span>est.colección · Catálogo Filatélico</span>
            <span>© {new Date().getFullYear()}</span>
          </div>
        </footer>

      </body>
    </html>
  );
}
