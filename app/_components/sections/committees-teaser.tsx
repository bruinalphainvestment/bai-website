import Link from 'next/link';

export default function CommitteesTeaser() {
  const committees = [
    { name: "Wealth Management", tagline: "Soft skills, relationship building, and SIE/Series exam readiness.", slug: "wealth-management" },
    { name: "Trading", tagline: "Volatility, systematic strategies, and event-contract modeling research.", slug: "trading" },
    { name: "Accounting & Consulting", tagline: "3-statement modeling, DCF, and audit fundamentals.", slug: "accounting-consulting" },
    { name: "Investment Banking", tagline: "Modeling, networking, and technical interview prep.", slug: "investment-banking" }
  ];

  return (
    <section data-section="committees" className="bg-cream text-navy py-24 px-4 md:px-8">
      <div className="mx-auto max-w-7xl">
        <h2 className="font-display text-4xl md:text-5xl mb-12">Committees</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {committees.map((c) => (
            <Link 
              key={c.slug} 
              href={`/committees/${c.slug}`}
              className="group block bg-navy text-cream p-8 md:p-12 transition-transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:ring-offset-2 focus:ring-offset-cream"
            >
              <div className="flex flex-col h-full justify-between min-h-[240px]">
                <div>
                  <h3 className="font-display text-3xl md:text-4xl mb-4 group-hover:text-[#C5A059] transition-colors">
                    {c.name}
                  </h3>
                  <p className="font-sans text-cream/80 text-lg">
                    {c.tagline}
                  </p>
                </div>
                <div className="flex justify-end mt-8">
                  <span className="font-mono uppercase tracking-widest text-sm text-[#C5A059] flex items-center gap-2 group-hover:gap-4 transition-all">
                    Explore <span>&rarr;</span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}