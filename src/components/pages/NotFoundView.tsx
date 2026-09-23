"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { LocalizedLink as Link } from "@/components/ui/LocalizedLink";
import { Container } from "@/components/ui/Container";
import { isRtl, splitLocaleFromPathname } from "@/content/i18n";

type Copy = { eyebrow: string; h1: string; body: string; links: { label: string; href: string }[] };

export function NotFoundView({ copy }: { copy: Record<string, Copy> }) {
  const { locale } = splitLocaleFromPathname(usePathname() ?? "/");
  const page = copy[locale] ?? copy.en;
  useEffect(() => {
    // The global 404 has one static <html lang="en">; fix it up for /ru, /th, /he.
    document.documentElement.lang = locale;
    document.documentElement.dir = isRtl(locale) ? "rtl" : "ltr";
    document.documentElement.classList.toggle("font-thai", locale === "th");
    document.documentElement.classList.toggle("font-hebrew", locale === "he");
  }, [locale]);
  return (
    <Container narrow className="py-24 lg:py-32">
      <Link href="/" className="mb-16 inline-block font-display text-xl font-medium tracking-tight text-text">
        CreativeLAB
      </Link>
      <p className="mb-4 text-xs tracking-[0.2em] text-accent uppercase">{page.eyebrow}</p>
      <h1 className="font-display text-4xl leading-tight font-light text-text sm:text-5xl">{page.h1}</h1>
      <p className="mt-6 text-lg leading-relaxed text-text-secondary">{page.body}</p>
      <ul className="mt-10 flex flex-wrap gap-3">
        {page.links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="inline-flex border border-line px-5 py-3 text-sm text-text hover:border-accent hover:text-accent">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  );
}
