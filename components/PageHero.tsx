import Image from "next/image";
import { Reveal } from "./Motion";

type PageHeroProps = {
  title: string;
  text: string;
  image?: string;
};

export function PageHero({ title, text, image = "/images/hero-kart-night.png" }: PageHeroProps) {
  return (
    <section className="page-hero">
      <div className="page-hero-photo" aria-hidden="true">
        <Image src={image} alt="" fill priority={false} sizes="100vw" />
      </div>
      <div className="container">
        <Reveal className="section-head">
          <Image className="page-hero-seal" src="/brand/p1-academy-seal.png" alt="" width={96} height={96} />
          <h1>{title}</h1>
          <div className="accent-line" />
          <p>{text}</p>
        </Reveal>
      </div>
    </section>
  );
}
