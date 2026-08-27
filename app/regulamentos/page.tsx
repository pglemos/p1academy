import Link from "next/link";
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Download,
  FileCheck,
  FileText,
  HelpCircle,
  Scale,
  ShieldCheck,
  Trophy,
  Zap,
} from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Lift, Reveal } from "@/components/Motion";
import { legendsCalendarPdf, legendsCompetition, legendsPdf } from "@/data/legends";

export const metadata = {
  title: "Regulamento Oficial Legends Kart Series 2026 | P1 Academy",
  description:
    "Regulamento oficial da Legends Kart Series 2026: sistema de pontuação por tempo, critérios de descarte, desempates milimétricos, lastro e conduta esportiva.",
};

const regulationChapters = [
  {
    icon: Trophy,
    article: "Artigo 8.1 — 8.3",
    title: "Sistema de Pontuação por Delta",
    content:
      "A classificação não é arbitrária. O piloto com a melhor volta da bateria recebe a pontuação base de 10,000 pontos. Os demais perdem 1 ponto a cada 1 segundo de diferença para o líder. Diferenças acima de 9 segundos recebem 1,000 ponto piso.",
    highlights: ["Base regular: 10,000 pontos", "Piso mínimo: 1,000 pontos", "Deltas calculados em 3 casas decimais"],
  },
  {
    icon: ShieldCheck,
    article: "Artigo 8.4",
    title: "Regra de Descarte Progressivo",
    content:
      "Ao longo da temporada regular, cada piloto soma no máximo 10 baterias válidas. Pontuações inferiores, ausências e desclassificações técnicas são progressivamente descartadas (retidas fora do total) para beneficiar a consistência.",
    highlights: ["Máximo de 10 válidas", "Descarte automático do pior resultado", "Resultados descartados continuam auditáveis"],
  },
  {
    icon: Zap,
    article: "Artigos 8.5 — 8.7",
    title: "Critérios de Desempate Homologados",
    content:
      "Em caso de empate em pontos totais, o desempate segue rigorosamente: 1º Maior número de vitórias (10,000 pts); 2º Maior pontuação secundária abaixo das vitórias; 3º Terceira melhor pontuação e assim sucessivamente; 4º Sorteio presencial em última instância.",
    highlights: ["1º Vitórias", "2º Melhores parciais sucessivas", "3º Sorteio oficial"],
  },
  {
    icon: Award,
    article: "Artigo 9.0",
    title: "Super Final (Pontuação Bônus)",
    content:
      "Os pilotos classificados disputam a Super Final com base de 5,000 pontos. A pontuação da Super Final é independente e soma diretamente ao total acumulado das 10 melhores regulares, não podendo ser descartada.",
    highlights: ["Base: 5,000 pontos", "Sem regra de descarte", "Soma direta no total"],
  },
  {
    icon: Scale,
    article: "Artigo 4.0",
    title: "Pesagem, Lastro & Equalização",
    content:
      "Todos os karts e pilotos são equalizados conforme a pesagem mínima estipulada em briefing antes da tomada de tempo. É obrigatório o uso de capacete homologado, macacão ou calça jeans resistente e calçado fechado.",
    highlights: ["Pesagem obrigatória", "Lastro oficial de Betim", "Vistoria pré-bateria"],
  },
  {
    icon: FileCheck,
    article: "Artigo 11.0",
    title: "Conduta de Pista & Recursos",
    content:
      "Toques deliberados, ziguezague em reta e atitudes antidesportivas acarretam punição em tempo ou desclassificação (DSQ). Qualquer recurso formal deve ser protocolado junto aos comissários desportivos em até 30 minutos após a bateria.",
    highlights: ["Bandeiras da CBA", "Recurso em 30 min", "Decisões de briefing soberanas"],
  },
];

export default function RegulamentosPage() {
  return (
    <>
      <PageHero
        title="Regulamento Oficial"
        text="Diretrizes esportivas, critérios matemáticos de pontuação, descartes, desempates e normas de conduta da Legends Kart Series 2026."
        image="/images/timing-telemetry.png"
      />

      <section className="section tight">
        <div className="container">
          <div className="grid-2 align-start mb-48">
            <Reveal className="section-head">
              <FileText size={32} color="var(--acid)" />
              <h2>{legendsCompetition.name}</h2>
              <div className="accent-line" />
              <p>
                {legendsCompetition.version} · {legendsCompetition.edition} · temporada oficial {legendsCompetition.season} no Kartódromo Internacional de Betim.
              </p>
              <p>
                Este regulamento vincula todos os pilotos inscritos, organizadores e equipe técnica. A transparência na apuração garante que toda decisão seja fundamentada e auditável.
              </p>
            </Reveal>

            <Reveal className="card p-24">
              <h3 className="mb-12">Downloads dos Documentos Oficiais</h3>
              <p className="text-muted mb-20">
                Acesse as versões completas em PDF homologadas para a temporada 2026:
              </p>
              <div className="grid-1 gap-12">
                <a className="btn primary" href={legendsPdf} target="_blank" rel="noreferrer">
                  <Download size={18} /> Baixar Regulamento Esportivo (PDF)
                </a>
                <a className="btn secondary" href={legendsCalendarPdf} target="_blank" rel="noreferrer">
                  <Calendar size={18} /> Baixar Calendário Oficial de Etapas (PDF)
                </a>
                <Link className="btn ghost" href="/campeonatos/pontuacao">
                  <Trophy size={18} /> Ver Matriz de Pontuação Ao Vivo
                </Link>
              </div>
            </Reveal>
          </div>

          <Reveal className="section-head center">
            <h2>Resumo Estruturado dos Artigos</h2>
            <div className="accent-line" />
            <p>Os principais pilares que regem a formação da classificação e a conduta nos boxes e na pista.</p>
          </Reveal>

          <div className="grid-2 gap-24">
            {regulationChapters.map((chapter) => {
              const Icon = chapter.icon;
              return (
                <Lift className="card regulation-chapter-card" key={chapter.title}>
                  <div className="tip-header">
                    <span className="tip-step">{chapter.article}</span>
                    <Icon className="tip-icon" size={24} color="var(--gold)" />
                  </div>
                  <h3>{chapter.title}</h3>
                  <p className="tip-summary">{chapter.content}</p>
                  <div className="tip-takeaways">
                    <strong>Normas vinculantes:</strong>
                    <ul>
                      {chapter.highlights.map((item, idx) => (
                        <li key={idx}>
                          <CheckCircle2 size={14} color="var(--acid)" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Lift>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section carbon-section">
        <div className="container grid-2 align-center">
          <Reveal className="section-head">
            <h2>Dúvidas sobre Interpretação do Regulamento?</h2>
            <div className="accent-line" />
            <p>
              A comissão técnica da P1 Academy está à disposição para esclarecer qualquer ponto de cálculo de pontuação, descartes ou procedimentos de inscrição.
            </p>
            <div className="button-row">
              <Link className="btn primary" href="/contato">
                Falar com a Comissão Técnica
              </Link>
              <Link className="btn secondary" href="/campeonatos">
                Ver Hub de Campeonatos
              </Link>
            </div>
          </Reveal>
          <Reveal className="legends-panel">
            <h3>Soberania do Briefing</h3>
            <p>
              Comunicações orais realizadas durante o briefing obrigatório de pilotos, alterações extraordinárias de traçado por motivos climáticos e notas oficiais publicadas no mural digital prevalecem sobre disposições gerais anteriores.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
