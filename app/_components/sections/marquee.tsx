export default function Marquee() {
  const text = "BAI · REAL IMPACT · LEGACY · BRUIN ALPHA · FOUNDED 2026 · ";
  const repeatedText = text.repeat(4);

  return (
    <section data-section="marquee" className="bg-deep text-[#C5A059] py-6 overflow-hidden border-y border-[#C5A059]/20 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-[#C5A059]/10 to-transparent opacity-20" />
      <div className="flex whitespace-nowrap animate-marquee hover:animation-paused">
        <span className="font-display text-4xl md:text-5xl lg:text-6xl uppercase tracking-wider mx-4">
          {repeatedText}
        </span>
        <span className="font-display text-4xl md:text-5xl lg:text-6xl uppercase tracking-wider mx-4" aria-hidden="true">
          {repeatedText}
        </span>
      </div>
    </section>
  );
}