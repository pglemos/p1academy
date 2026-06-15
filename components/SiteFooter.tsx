"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { contactName, mapUrl, navItems, trackAddress, whatsappDisplay, whatsappNumber } from "@/data/site";
import { Logo } from "./Logo";

export function SiteFooter() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <Logo />
          <p className="lead">
            P1 Academy é uma experiência premium para quem quer aprender, competir e evoluir no kart com método.
          </p>
          <p className="footer-contact">
            <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer">
              {contactName}: {whatsappDisplay}
            </a>
            <a href={mapUrl} target="_blank" rel="noreferrer">
              {trackAddress}
            </a>
          </p>
        </div>
        <div className="footer-links">
          {navItems.map((item) => (
            <Link href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
