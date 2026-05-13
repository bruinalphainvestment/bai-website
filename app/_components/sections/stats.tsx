export default function Stats() {
  const stats = [
    { label: "Est.", value: "2026" },
    { label: "Founding Members", value: "5" },
    { label: "Committees", value: "4" },
    { label: "Recruitment", value: "Fall 2026" }
  ];

  return (
    <section data-section="stats" className="bg-cream text-navy py-16 px-4 md:px-8 border-y border-navy/10">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center md:text-left">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col border-b-2 border-[#C5A059] pb-4">
              <div className="font-display text-4xl md:text-5xl lg:text-6xl mb-2 text-navy">
                {stat.value}
              </div>
              <div className="font-sans text-sm md:text-base uppercase tracking-widest text-navy/70">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}