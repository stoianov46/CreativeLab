import { Container } from "@/components/ui/Container";

export function DirectAnswer({ text }: { text: string }) {
  return (
    <section className="border-b border-line bg-surface">
      <Container className="py-12 lg:py-16">
        <p data-direct-answer className="max-w-[72ch] font-display text-xl leading-[1.5] font-light text-text sm:text-2xl">
          {text}
        </p>
      </Container>
    </section>
  );
}
