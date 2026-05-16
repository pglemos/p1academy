import { Download } from "lucide-react";
import { MediaFrame } from "@/components/MediaFrame";
import { PageHero } from "@/components/PageHero";
import { Lift } from "@/components/Motion";

const wallpapers = ["Carbon grid", "Apex night", "Blue sector", "Red heat", "Podium metal", "Telemetry dark"];

export const metadata = {
  title: "Wallpapers | P1 Academy",
};

export default function WallpapersPage() {
  return (
    <>
      <PageHero
        title="Wallpapers"
        text="Galeria visual para peças de marca, fundos de celular, stories e materiais de comunidade. Imagens são placeholders premium."
        image="/images/wallpaper-kart-dawn.png"
      />
      <section className="section">
        <div className="container grid-3">
          {wallpapers.map((item) => (
            <Lift className="feature-card" key={item}>
              <MediaFrame label={item} src="/images/wallpaper-kart-dawn.png" alt={item} tall />
              <div className="feature-body">
                <h3>{item}</h3>
                <p>Arte temporária de alto contraste com estética tech e motorsport.</p>
                <button className="btn ghost" type="button">
                  <Download size={18} /> Baixar
                </button>
              </div>
            </Lift>
          ))}
        </div>
      </section>
    </>
  );
}
