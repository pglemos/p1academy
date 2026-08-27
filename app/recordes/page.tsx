import Link from "next/link";
import { Compass, Download, ExternalLink, Flag, Gauge, MapPin, Trophy, Zap } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Lift, Reveal } from "@/components/Motion";
import { getLegendsPublicData } from "@/lib/p1Data";

export const metadata = {
  title: "Recordes de Pista & Melhores Voltas | P1 Academy",
  description:
    "Quadro oficial de recordes e melhores voltas por bateria da Legends Kart Series no Kartódromo Internacional de Betim.",
};

export const dynamic = "force-dynamic";

export default async function RecordesPage() {
  const { results, classification } = await getLegendsPublicData();
  const publishedResults = results.filter((r) => r.complete && r.bestLap && r.bestLap !== "-");
  
  // Find absolute best lap across all published results
  const sortedByLap = [...publishedResults].sort((a, b) => {
    return a.bestLap.localeCompare(b.bestLap);
  });
  const absoluteRecord = sortedByLap[0] ?? null;

  return (
    <>
      <PageHero
        title="Quadro de Recordes"
        text="Melhores voltas oficiais registradas na Legends Kart Series 2026. Tempos aferidos por telemetria e cronometragem oficial no Kartódromo Internacional de Betim."
        image="/images/timing-telemetry.png"
      />

      {absoluteRecord ? (
        <section className="section tight pb-0">
          <div className="container">
            <Reveal className="p1-hero-record-banner">
              <div className="record-banner-left">
                <span className="record-badge"><Zap size={16} /> Recorde Absoluto da Temporada</span>
                <h2>{absoluteRecord.bestLap}</h2>
                <p>
                  Registrado por <strong>{absoluteRecord.winner}</strong> na {absoluteRecord.heat} ({absoluteRecord.date}).
                </p>
              </div>
              <div className="record-banner-actions">
                <Link className="btn primary" href="/tracados">
                  <Compass size={18} /> Ver Traçado Oficial
                </Link>
                {absoluteRecord.pdfHref ? (
                  <a className="btn secondary" href={absoluteRecord.pdfHref} target="_blank" rel="noreferrer">
                    <Download size={18} /> Ver PDF da Bateria
                  </a>
                ) : null}
              </div>
            </Reveal>
          </div>
        </section>
      ) : null}

      <section className="section">
        <div className="container grid-2 align-start">
          <Reveal className="section-head">
            <Gauge size={32} color="var(--acid)" />
            <h2>Melhores Voltas por Bateria</h2>
            <div className="accent-line" />
            <p>
              Cada bateria disputada gera um tempo de referência oficial. Os tempos abaixo foram homologados pelos comissários desportivos da Legends Kart Series.
            </p>
            <div className="button-row">
              <Link className="btn primary" href="/tracados">
                <MapPin size={18} /> Biblioteca de Traçados
              </Link>
              <Link className="btn secondary" href="/campeonatos/pontuacao">
                <Trophy size={18} /> Classificação Geral
              </Link>
            </div>
          </Reveal>

          <div className="table-like record-table">
            <div className="table-head-row">
              <span>Bateria</span>
              <span>Vencedor</span>
              <span>Melhor Volta</span>
            </div>
            {publishedResults.map((item) => (
              <Reveal className="row record-row" key={`${item.heat}-${item.date}`}>
                <div className="record-heat-info">
                  <strong>{item.heat}</strong>
                  <small>{item.date}</small>
                </div>
                <span className="record-driver">{item.winner}</span>
                <div className="record-time-badge">
                  <strong>{item.bestLap}</strong>
                  {item.pdfHref ? (
                    <a href={item.pdfHref} target="_blank" rel="noreferrer" title="Abrir PDF oficial" aria-label={`PDF de ${item.heat}`}>
                      <ExternalLink size={13} />
                    </a>
                  ) : null}
                </div>
              </Reveal>
            ))}
            {!publishedResults.length ? (
              <p className="p-20 text-muted">Nenhum tempo oficial homologado no momento.</p>
            ) : null}
          </div>
        </div>
      </section>

      <section className="section carbon-section">
        <div className="container grid-2 align-center">
          <Reveal className="section-head">
            <h2>Quer Baixar Seus Tempos em Betim?</h2>
            <div className="accent-line" />
            <p>
              Participe dos treinos de alta performance da P1 Academy. Com análise de telemetria setorizada e orientação curva a curva de André Felisberto, você aprende exatamente onde estão os décimos que faltam.
            </p>
            <div className="button-row">
              <Link className="btn primary" href="/aulas">
                Agendar Treino Técnico
              </Link>
              <Link className="btn secondary" href="/dicas">
                Ver Dicas de Freada & Traçado
              </Link>
            </div>
          </Reveal>
          <Reveal className="legends-panel">
            <h3>Critérios de Homologação</h3>
            <p>
              Os recordes oficiais são válidos somente em sessões cronometradas com transponder homologado, pesagem aferida e pista em condições normais de aderência.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
