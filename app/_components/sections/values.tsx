export default function Values() {
  const values = [
    { num: "01", title: "Active Community", desc: "Project-driven cohort, not just a newsletter." },
    { num: "02", title: "Strong Dedicated Leadership", desc: "Accountability rituals from day one." },
    { num: "03", title: "Passion for Legacy and Mission", desc: "Built to outlive the founders." },
    { num: "04", title: "Real Engagements, Real Companies, Real Alumni", desc: "Hands-on work that compounds." },
    { num: "05", title: "Real Impact Projects", desc: "Outcomes you can put on a resume — and defend in interviews." },
    { num: "06", title: "Strong Recruitment", desc: "A pipeline calibrated to the most competitive UCLA finance careers." },
    { num: "07", title: "Active Brand Presence", desc: "Discoverable across the channels prospective members already live on." }
  ];

  return (
    <section data-section="values" className="bg-cream text-navy py-24 md:py-32 px-4 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-12 md:gap-16">
          {values.map((v) => (
            <div key={v.num} className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 group">
              <div className="md:col-span-2 flex items-start">
                <span className="font-mono text-3xl md:text-5xl text-[#C5A059] opacity-80 group-hover:opacity-100 transition-opacity">
                  {v.num}
                </span>
              </div>
              <div className="md:col-span-10 flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8 border-b border-navy/10 pb-8 group-hover:border-navy/30 transition-colors">
                <h3 className="font-display text-2xl md:text-4xl flex-shrink-0 md:w-1/2">
                  {v.title}
                </h3>
                <p className="font-sans text-lg text-navy/70 md:w-1/2">
                  {v.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}