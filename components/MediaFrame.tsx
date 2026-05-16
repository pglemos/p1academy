import Image from "next/image";

type MediaFrameProps = {
  label: string;
  src?: string;
  alt?: string;
  tall?: boolean;
};

export function MediaFrame({ label, src, alt, tall = false }: MediaFrameProps) {
  return (
    <div className={`media ${src ? "has-photo" : ""} ${tall ? "media-tall" : ""}`} data-label={label}>
      {src ? <Image src={src} alt={alt ?? label} fill sizes="(max-width: 900px) 100vw, 50vw" /> : null}
      {!src ? <span className="media-kart" aria-hidden="true" /> : null}
    </div>
  );
}
