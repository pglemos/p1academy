import Link from "next/link";
import { Compass, Flag, Home, Trophy } from "lucide-react";

export const metadata = {
  title: "Página Não Encontrada (404) | P1 Academy",
};

export default function NotFound() {
  return (
    <section className="section">
      <div className="container center" style={{ textAlign: "center", padding: "80px 20px" }}>
        <div style={{ display: "inline-flex", padding: "18px", borderRadius: "50%", background: "rgba(255, 255, 255, 0.05)", marginBottom: "20px" }}>
          <Flag size={48} color="var(--gold)" />
        </div>
        <span className="tip-tag mb-12 inline-block">Erro 404 · Fora do Traçado</span>
        <h1 style={{ fontFamily: "var(--font-headline)", fontStyle: "italic", fontSize: "clamp(2rem, 5vw, 3.5rem)", marginBottom: "16px", textTransform: "uppercase" }}>
          Página Não Encontrada
        </h1>
        <p style={{ color: "var(--muted)", maxWidth: "540px", margin: "0 auto 32px", lineHeight: "1.6" }}>
          O endereço que você tentou acessar não existe ou foi movido. Use os atalhos abaixo para voltar para a pista:
        </p>
        <div className="button-row" style={{ justifyContent: "center" }}>
          <Link className="btn primary" href="/">
            <Home size={18} /> Início
          </Link>
          <Link className="btn secondary" href="/campeonatos">
            <Trophy size={18} /> Campeonatos
          </Link>
          <Link className="btn ghost" href="/aulas">
            <Compass size={18} /> Aulas de Kart
          </Link>
        </div>
      </div>
    </section>
  );
}
