import { Download } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Motion";
import { regulations } from "@/data/site";

export const metadata = {
  title: "Regulamentos | P1 Academy",
};

export default function RegulamentosPage() {
  return (
    <>
      <PageHero
        title="Regulamentos"
        text="Central de regras, conduta, segurança e documentos por competição. Arquivos finais podem substituir estes placeholders."
        image="/images/timing-telemetry.png"
      />
      <section className="section">
        <div className="container grid-3">
          {regulations.map((item) => (
            <Reveal className="card" key={item}>
              <Download size={24} color="var(--cyan)" />
              <h3>{item}</h3>
              <p>PDF placeholder para publicação oficial da temporada.</p>
              <button className="btn ghost" type="button">
                Baixar PDF
              </button>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
