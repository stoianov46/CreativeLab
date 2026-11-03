export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  inverse = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  inverse?: boolean;
}) {
  return (
    <div
      className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}
    >
      {eyebrow && (
        <p
          className={`mb-4 text-xs tracking-[0.15em] uppercase ${
            inverse ? "text-accent-soft" : "text-accent"
          }`}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={`font-display text-balance text-4xl leading-[1.1] font-light tracking-tight [overflow-wrap:anywhere] sm:text-5xl lg:text-[52px] ${
          inverse ? "text-text-inverse" : "text-text"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-5 text-lg leading-relaxed ${
            inverse ? "text-text-inverse-secondary" : "text-text-secondary"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
