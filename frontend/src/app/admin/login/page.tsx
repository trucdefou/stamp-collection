"use client";
import { useState } from "react";
import { login } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(username, password);
      router.push("/admin");
    } catch (err: any) {
      setError(err.message || "Error de autenticación");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="w-full max-w-sm fade-up">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-sm bg-stamp-red flex items-center justify-center text-white font-display font-bold text-2xl shadow-lg mb-4">
            S
          </div>
          <h1 className="font-display text-2xl font-bold text-ink-800">Acceso Administrador</h1>
          <p className="text-sm text-ink-400 italic mt-1">Ingrese sus credenciales</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/60 border border-sepia-200 rounded-sm p-6 space-y-4">
          {error && (
            <div className="bg-stamp-red/10 border border-stamp-red/30 text-stamp-red text-sm px-4 py-2.5 rounded-sm">
              {error}
            </div>
          )}
          <div>
            <label className="block text-xs uppercase tracking-wider text-ink-500 mb-1.5">Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full bg-parchment border border-sepia-200 rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-stamp-gold focus:ring-1 focus:ring-stamp-gold/30"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-ink-500 mb-1.5">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-parchment border border-sepia-200 rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-stamp-gold focus:ring-1 focus:ring-stamp-gold/30"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ink-800 text-parchment py-2.5 rounded-sm text-sm font-display font-semibold hover:bg-ink-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <p className="text-center text-xs text-ink-300 mt-4 italic">
          Credenciales por defecto: admin / admin123
        </p>
      </div>
    </div>
  );
}
