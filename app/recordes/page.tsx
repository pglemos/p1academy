import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Motion";
import { recordes } from "@/data/site";

export const metadata = {
  title: "Recordes | P1 Academy",
};

export default function RecordesPage() {
  return (
    <>
      <PageHero
        title="Recordes"
        text="Quadro de melhores tempos por traçado e piloto, pronto para receber dados oficiais da temporada."
        image="/images/timing-telemetry.png"
      />
      <section className="section">
        <div className="container table-like">
          {recordes.map((item) => (
            <Reveal className="row" key={item.track}>
              <strong>{item.track}</strong>
              <span>{item.driver}</span>
              <span>Melhor volta</span>
              <span>{item.time}</span>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
