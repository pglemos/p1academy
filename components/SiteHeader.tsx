"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { navItems } from "@/data/site";
import { Logo } from "./Logo";

export function SiteHeader() {
  const pathname = usePathname();
  const [openPathname, setOpenPathname] = useState<string | null>(null);
  const open = Boolean(pathname && openPathname === pathname);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpenPathname(null);
        window.requestAnimationFrame(() => menuButtonRef.current?.focus());
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    navRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <header className="site-header">
      <div className="container nav-inner">
        <Logo />
        <nav ref={navRef} id="primary-navigation" className={`nav-links ${open ? "open" : ""}`} aria-label="Navegação principal">
          {navItems.map((item) => (
            <Link
              className={pathname === item.href ? "active" : ""}
              href={item.href}
              key={item.href}
              onClick={() => setOpenPathname(null)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link className="btn primary desktop-cta" href="/contato">
          Agendar agora
        </Link>
        <button
          ref={menuButtonRef}
          className="menu-button"
          type="button"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-controls="primary-navigation"
          aria-expanded={open}
          onClick={() => setOpenPathname((value) => (open ? null : pathname ?? value))}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
    </header>
  );
}
