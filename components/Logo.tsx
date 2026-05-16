import Link from "next/link";
import Image from "next/image";

export function Logo() {
  return (
    <Link className="brand" href="/" aria-label="P1 Academy home">
      <span className="brand-mark" aria-hidden="true">
        <Image src="/brand/p1-academy-seal-alpha.png" alt="" width={52} height={52} priority />
      </span>
      <span className="brand-copy">
        <strong>P1 Academy</strong>
        <span>Drive to perfection</span>
      </span>
    </Link>
  );
}
