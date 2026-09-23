import { Fragment } from "react";
import { Container } from "@/components/ui/Container";
import { SITE } from "@/content/site";

type LegalContent = {
  eyebrow: string;
  h1: string;
  draftNotice: string;
  sections: readonly { title: string; body: string }[];
};

/** Body text of the Privacy/Terms pages; `{email}` in a section renders as a mailto link. */
export function LegalDocument({ page }: { page: LegalContent }) {
  return (
    <Container narrow className="py-16 lg:py-24">
      <p className="mb-2 text-xs tracking-[0.15em] text-accent uppercase">{page.eyebrow}</p>
      <h1 className="font-display text-4xl font-light text-text">{page.h1}</h1>
      <p className="mt-4 text-sm text-text-secondary">{page.draftNotice}</p>

      <div className="prose-content mt-10 space-y-8 text-text-secondary">
        {page.sections.map((section) => (
          <section key={section.title}>
            <h2 className="mb-2 font-display text-xl text-text">{section.title}</h2>
            <p>
              {section.body.split("{email}").map((part, index) => (
                <Fragment key={index}>
                  {index > 0 && (
                    <a href={`mailto:${SITE.email}`} className="text-accent hover:underline">
                      <bdi>{SITE.email}</bdi>
                    </a>
                  )}
                  {part}
                </Fragment>
              ))}
            </p>
          </section>
        ))}
      </div>
    </Container>
  );
}
