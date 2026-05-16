import Link from "next/link";

export function Logo() {
  return (
    <Link className="brand" href="/" aria-label="P1 Academy home">
      <span className="brand-mark" aria-hidden="true">
        <svg viewBox="0 0 64 64" role="img">
          <path
            d="M10 48V16h24c8.6 0 14 4.3 14 11.5S42.3 39 33.4 39H22v9H10Zm12-19h10.2c2.5 0 4.1-1.1 4.1-3.3 0-2.1-1.6-3.2-4.1-3.2H22V29Zm29 19V16h3v32h-3Z"
            fill="currentColor"
          />
          <path d="M10 53h44v3H10v-3Z" fill="oklch(60% 0.22 25)" />
          <path d="M42 8h12v3H42V8Z" fill="oklch(62% 0.18 250)" />
        </svg>
      </span>
      <span className="brand-copy">
        <strong>P1 Academy</strong>
        <span>Kart performance</span>
      </span>
    </Link>
  );
}
