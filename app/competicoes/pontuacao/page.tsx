import Link from "next/link";
import { Calculator, Download, Trophy } from "lucide-react";
import { LegendsScoringApp } from "@/components/LegendsScoringApp";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Motion";
import { legendsCompetition, legendsPdf } from "@/data/legends";
import type { HeatInput } from "@/lib/legendsScoring";

export const metadata = {
  title: "Sistema de Pontuação Legends Kart Series | P1 Academy",
};

type LegendsPontuacaoPageProps = {
  searchParams?: Promise<{
    data?: string | string[];
  }>;
};

export default async function LegendsPontuacaoPage({ searchParams }: LegendsPontuacaoPageProps) {
  const resolvedSearchParams = await searchParams;
  const initialHeat = decodeHeatParam(resolvedSearchParams?.data);

  return (
    <>
      <PageHero
        compact
        title="Sistema de pontuação Legends"
        text="Área operacional para lançar o melhor tempo de cada piloto, calcular a pontuação da bateria e publicar um link de resultado imediato para a Legends Kart Series."
        image="/images/timing-telemetry.png"
      />

      <section className="section tight">
        <div className="container legends-shell">
          <Reveal className="legends-status">
            <div>
              <span className="eyebrow">Regra oficial</span>
              <h2>10,000 menos a diferença</h2>
              <p>
                Em bateria regular, o melhor tempo soma 10,000 pontos. Os demais recebem a base menos a diferença em segundos para o vencedor. Na Super Final, a base é 5,000 pontos. Empates são ajustados por ordem de registro, com acréscimo de um milésimo para quem marcou depois.
              </p>
            </div>
            <div className="button-row">
              <a className="btn secondary" href={legendsPdf} target="_blank" rel="noreferrer">
                <Download size={18} /> Regulamento
              </a>
              <Link className="btn ghost" href="/competicoes">
                <Trophy size={18} /> Hub Legends
              </Link>
            </div>
          </Reveal>

          <div className="scoring-rules-grid">
            <Reveal className="metric-card">
              <Calculator size={22} />
              <strong>10,000</strong>
              <span>base da bateria regular</span>
            </Reveal>
            <Reveal className="metric-card">
              <Calculator size={22} />
              <strong>5,000</strong>
              <span>base da Super Final</span>
            </Reveal>
            <Reveal className="metric-card">
              <Calculator size={22} />
              <strong>1,000</strong>
              <span>mínimo acima de 9s</span>
            </Reveal>
            <Reveal className="metric-card">
              <Calculator size={22} />
              <strong>10</strong>
              <span>melhores resultados válidos</span>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section tight carbon-section">
        <div className="container">
          <LegendsScoringApp
            initialHeat={initialHeat}
            initialMessage={initialHeat ? "Resultado carregado a partir do link público." : ""}
          />
        </div>
      </section>

      <section className="section tight">
        <div className="container grid-2 align-start">
          <Reveal className="section-head">
            <h2>Como usar no dia da bateria</h2>
            <div className="accent-line" />
            <p>
              A organização lança o nome do piloto, kart sorteado e melhor volta no formato 1:05.500. Ao final da bateria, basta copiar o link público e divulgar para os participantes.
            </p>
          </Reveal>
          <Reveal className="legends-panel">
            <h3>{legendsCompetition.name}</h3>
            <p>O cálculo respeita a regra de diferença de tempo, ajuste de empates por milésimo, pontuação mínima acima de 9 segundos e base reduzida para Super Final.</p>
            <p>Resultados com DSQ ou sem tempo ficam marcados na tabela e podem ser descartados na classificação geral, conforme o regulamento.</p>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function decodeHeatParam(data?: string | string[]): HeatInput | null {
  const value = Array.isArray(data) ? data[0] : data;
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(Buffer.from(value, "base64").toString("utf-8")) as HeatInput;
  } catch {
    try {
      return JSON.parse(Buffer.from(decodeURIComponent(value), "base64").toString("utf-8")) as HeatInput;
    } catch {
      return null;
    }
  }
}
