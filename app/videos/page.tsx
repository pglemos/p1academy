import { Play } from "lucide-react";
import { MediaFrame } from "@/components/MediaFrame";
import { PageHero } from "@/components/PageHero";
import { Lift } from "@/components/Motion";
import { instagramUrl } from "@/data/site";

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
                <p>Conteúdo onboard e de análise publicado no Instagram da P1 Academy.</p>
                <a className="btn ghost" href={instagramUrl} target="_blank" rel="noreferrer">
                  <Play size={18} /> Assistir
                </a>
              </div>
            </Lift>
          ))}
        </div>
      </section>
    </>
  );
}
