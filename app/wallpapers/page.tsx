import { Download } from "lucide-react";
import { MediaFrame } from "@/components/MediaFrame";
import { PageHero } from "@/components/PageHero";
import { Lift } from "@/components/Motion";

const wallpapers: Array<{ name: string; src: string }> = [
  { name: "Carbon grid", src: "/images/wallpaper-kart-dawn.png" },
  { name: "Apex night", src: "/images/hero-kart-night.png" },
  { name: "Blue sector", src: "/images/timing-telemetry.png" },
  { name: "Red heat", src: "/images/competition-corner.png" },
  { name: "Podium metal", src: "/images/academy-coaching.png" },
  { name: "Telemetry dark", src: "/images/tracados/tracado-01-normal.jpg" },
];

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
            <Lift className="feature-card" key={item.name}>
              <MediaFrame label={item.name} src={item.src} alt={item.name} tall />
              <div className="feature-body">
                <h3>{item.name}</h3>
                <p>Arte de alto contraste com estética tech e motorsport.</p>
                <a className="btn ghost" href={item.src} download>
                  <Download size={18} /> Baixar
                </a>
              </div>
            </Lift>
          ))}
        </div>
      </section>
    </>
  );
}
