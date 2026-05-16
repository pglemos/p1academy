import Image from "next/image";
import { Reveal } from "./Motion";

type PageHeroProps = {
  title: string;
  text: string;
  image?: string;
  compact?: boolean;
};

export function PageHero({ title, text, image = "/images/hero-kart-night.png", compact = false }: PageHeroProps) {
  return (
    <section className={`page-hero ${compact ? "page-hero-compact" : ""}`}>
      <div className="page-hero-photo" aria-hidden="true">
        <Image src={image} alt="" fill priority sizes="100vw" />
      </div>
      <div className="container">
        <Reveal className="section-head">
          <Image className="page-hero-seal" src="/brand/p1-academy-seal-alpha.png" alt="" width={96} height={96} priority />
          <h1>{title}</h1>
          <div className="accent-line" />
          <p>{text}</p>
        </Reveal>
      </div>
    </section>
  );
}
