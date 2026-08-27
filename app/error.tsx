"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("P1 Academy Error Boundary:", error);
  }, [error]);

  return (
    <section className="section">
      <div className="container center" style={{ textAlign: "center", padding: "60px 20px" }}>
        <div style={{ display: "inline-flex", padding: "16px", borderRadius: "50%", background: "rgba(234, 234, 0, 0.1)", marginBottom: "20px" }}>
          <AlertTriangle size={48} color="var(--gold)" />
        </div>
        <h2 style={{ fontFamily: "var(--font-headline)", fontStyle: "italic", fontSize: "2rem", marginBottom: "12px" }}>
          Ocorreu uma instabilidade temporária
        </h2>
        <p style={{ color: "var(--muted)", maxWidth: "540px", margin: "0 auto 28px", lineHeight: "1.6" }}>
          Não foi possível carregar os dados desta página. Isso pode decorrer de oscilação momentânea de conexão ou atualização em andamento.
        </p>
        <div className="button-row" style={{ justifyContent: "center" }}>
          <button type="button" className="btn primary" onClick={() => reset()}>
            <RotateCcw size={18} /> Tentar Novamente
          </button>
          <Link className="btn secondary" href="/">
            <Home size={18} /> Voltar ao Início
          </Link>
        </div>
      </div>
    </section>
  );
}
