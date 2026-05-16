import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Motion";
import { legendsResultsPreview } from "@/data/legends";

export const metadata = {
  title: "Recordes | P1 Academy",
};

export default function RecordesPage() {
  return (
    <>
      <PageHero
        title="Recordes"
        text="Quadro de melhores voltas da Legends Kart Series. Os tempos oficiais serão publicados após as primeiras baterias."
        image="/images/timing-telemetry.png"
      />
      <section className="section">
        <div className="container table-like">
          {legendsResultsPreview.map((item) => (
            <Reveal className="row" key={item.heat}>
              <strong>{item.heat}</strong>
              <span>{item.winner}</span>
              <span>Melhor volta</span>
              <span>{item.bestLap}</span>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
