import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Motion";
import { rankings } from "@/data/site";

export const metadata = {
  title: "Ranking | P1 Academy",
};

export default function RankingPage() {
  return (
    <>
      <PageHero
        title="Ranking"
        text="Classificação demonstrativa para pilotos, categorias, pontuação e melhores voltas da comunidade P1."
        image="/images/timing-telemetry.png"
      />
      <section className="section">
        <div className="container table-like">
          {rankings.map((item, index) => (
            <Reveal className="row" key={item.name}>
              <strong>
                {String(index + 1).padStart(2, "0")} {item.name}
              </strong>
              <span>{item.category}</span>
              <span>{item.points} pontos</span>
              <span>{item.best}</span>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
