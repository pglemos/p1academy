import { PageHero } from "@/components/PageHero";
import { MediaFrame } from "@/components/MediaFrame";
import { Reveal } from "@/components/Motion";
import { legendsCompetition, legendsStageInfo } from "@/data/legends";

export const metadata = {
  title: "Calendário e Traçados | P1 Academy",
};

export default function CalendarioTracadosPage() {
  return (
    <>
      <PageHero
        title="Calendário e traçados"
        text="Agenda oficial da Legends Kart Series. Datas, horários, valores, briefing e traçados serão publicados pela organização antes do início da competição."
        image="/images/wallpaper-kart-dawn.png"
      />
      <section className="section">
        <div className="container split">
          <Reveal>
            <MediaFrame label="Mapa do traçado" src="/images/wallpaper-kart-dawn.png" alt="Kart parado no traçado ao amanhecer" tall />
          </Reveal>
          <div className="table-like">
            <Reveal className="row">
              <strong>Temporada 2026</strong>
              <span>{legendsCompetition.venue}</span>
              <span>{legendsCompetition.expectedStages}</span>
              <span>Em breve</span>
            </Reveal>
            {legendsStageInfo.map((item) => (
              <Reveal className="row" key={item.label}>
                <strong>{item.label}</strong>
                <span>{item.value}</span>
                <span>Legends</span>
                <span>Oficial</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
