import { Play } from "lucide-react";
import { MediaFrame } from "@/components/MediaFrame";
import { PageHero } from "@/components/PageHero";
import { Lift } from "@/components/Motion";

const videos = ["Volta guiada", "Freada forte", "Disputa limpa", "Análise onboard", "Largada", "Traçado ideal"];

export const metadata = {
  title: "Vídeos | P1 Academy",
};

export default function VideosPage() {
  return (
    <>
      <PageHero
        title="Vídeos"
        text="Biblioteca placeholder para onboard, aulas, bastidores, highlights de etapas e análise de traçado."
        image="/images/hero-kart-night.png"
      />
      <section className="section">
        <div className="container grid-3">
          {videos.map((video) => (
            <Lift className="feature-card" key={video}>
              <MediaFrame label={video} src="/images/hero-kart-night.png" alt={video} />
              <div className="feature-body">
                <h3>{video}</h3>
                <p>Player placeholder para substituição por vídeo real da P1 Academy.</p>
                <button className="btn ghost" type="button">
                  <Play size={18} /> Assistir
                </button>
              </div>
            </Lift>
          ))}
        </div>
      </section>
    </>
  );
}
