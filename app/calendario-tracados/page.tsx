import { PageHero } from "@/components/PageHero";
import { MediaFrame } from "@/components/MediaFrame";
import { Reveal } from "@/components/Motion";
import { schedule } from "@/data/site";

export const metadata = {
  title: "Calendário e Traçados | P1 Academy",
};

export default function CalendarioTracadosPage() {
  return (
    <>
      <PageHero
        title="Calendário e traçados"
        text="Agenda mockada para publicar datas, pistas, sentidos, configurações e objetivos técnicos de cada encontro."
        image="/images/wallpaper-kart-dawn.png"
      />
      <section className="section">
        <div className="container split">
          <Reveal>
            <MediaFrame label="Mapa do traçado" src="/images/wallpaper-kart-dawn.png" alt="Kart parado no traçado ao amanhecer" tall />
          </Reveal>
          <div className="table-like">
            {schedule.map((item) => (
              <Reveal className="row" key={`${item.date}-${item.track}`}>
                <strong>{item.date}</strong>
                <span>{item.track}</span>
                <span>{item.event}</span>
                <span>Briefing</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
