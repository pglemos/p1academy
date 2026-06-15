import Link from "next/link";
import { MapPin } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Motion";
import { getLegendsPublicData } from "@/lib/p1Data";

export const metadata = {
  title: "Recordes | P1 Academy",
};

export const dynamic = "force-dynamic";

export default async function RecordesPage() {
  const { results } = await getLegendsPublicData();

  return (
    <>
      <PageHero
        title="Recordes"
        text="Quadro de melhores voltas da Legends Kart Series. Os tempos oficiais serão publicados após as primeiras baterias."
        image="/images/timing-telemetry.png"
      />
      <section className="section">
        <div className="container split">
          <Reveal className="section-head">
            <h2>Tempos por configuração</h2>
            <div className="accent-line" />
            <p>Os recordes serão organizados por traçado, sentido e condição de pista. Use a biblioteca de mapas para identificar a configuração antes de comparar tempos.</p>
            <Link className="btn primary" href="/tracados">
              <MapPin size={18} /> Ver traçados
            </Link>
          </Reveal>
          <div className="table-like">
            {results.map((item) => (
              <Reveal className="row" key={item.heat}>
                <strong>{item.heat}</strong>
                <span>{item.winner}</span>
                <span>Melhor volta</span>
                <span>{item.bestLap}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
