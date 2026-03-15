import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Colección de Estampillas",
  description: "Sistema de coleccionismo de estampillas",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="font-body min-h-screen bg-parchment text-ink-800">
        <header className="border-b-2 border-sepia-200 bg-gradient-to-b from-sepia-50 to-parchment">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <a href="/" className="group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-sm bg-stamp-red flex items-center justify-center text-white font-display font-bold text-xl shadow-md group-hover:rotate-[-3deg] transition-transform">
                    S
                  </div>
                  <div>
                    <h1 className="font-display text-2xl font-bold text-ink-800 tracking-tight">
                      Colección de Estampillas
                    </h1>
                    <p className="text-sm text-ink-400 italic font-body">
                      Catálogo Filatélico Personal
                    </p>
                  </div>
                </div>
              </a>
              <nav className="flex gap-6 items-center text-sm font-body">
                <a href="/" className="text-ink-500 hover:text-stamp-red transition-colors">
                  Galería
                </a>
                <a href="/admin" className="text-ink-500 hover:text-stamp-red transition-colors">
                  Administración
                </a>
              </nav>
            </div>
          </div>
        </header>
        <main>{children}</main>
        <footer className="border-t-2 border-sepia-200 mt-20">
          <div className="max-w-7xl mx-auto px-6 py-8 text-center text-ink-400 text-sm font-body italic">
            Colección de Estampillas &middot; Sistema de Catalogación Filatélica
          </div>
        </footer>
      </body>
    </html>
  );
}
