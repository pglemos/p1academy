import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Motion";
import { tips } from "@/data/site";

export const metadata = {
  title: "Dicas | P1 Academy",
};

export default function DicasPage() {
  return (
    <>
      <PageHero
        title="Dicas"
        text="Técnica direta para quem quer sair do improviso e pilotar com mais leitura, consistência e respeito de pista."
        image="/images/academy-coaching.png"
      />
      <section className="section">
        <div className="container grid-4">
          {tips.map((tip) => {
            const Icon = tip.icon;
            return (
              <Reveal className="card" key={tip.title}>
                <Icon size={26} color="var(--cyan)" />
                <h3>{tip.title}</h3>
                <p>{tip.text}</p>
              </Reveal>
            );
          })}
        </div>
      </section>
    </>
  );
}
