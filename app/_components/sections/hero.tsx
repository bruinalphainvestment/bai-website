export default function Hero() {
  return (
    <section data-section="hero" className="relative flex min-h-screen flex-col items-center justify-center bg-deep text-cream pt-20">
      <div className="absolute inset-0 bg-gradient-to-b from-deep to-navy opacity-80" />
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl tracking-tight mb-6 max-w-6xl">
          Bruin <span className="bg-gradient-to-r from-[#C5A059] to-[#8B6F38] bg-clip-text text-transparent">Alpha</span> Investment
        </h1>
        <p className="font-sans text-xl md:text-2xl text-cream/80 max-w-2xl font-light">
          Have Passion, Believe in Legacy, Believe in BAI
        </p>
      </div>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center text-cream/50 animate-bounce">
        <span className="text-sm uppercase tracking-widest mb-2 font-mono">Scroll</span>
        <div className="w-[1px] h-12 bg-cream/30"></div>
      </div>
    </section>
  );
}