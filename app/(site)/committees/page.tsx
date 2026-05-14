import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "Committees — Bruin Alpha Investment at UCLA",
  description: "Explore our four core committees: Wealth Management, Trading, Accounting & Consulting, and Investment Banking.",
};

const COMMITTEES = [
  {
    name: "Wealth Management",
    slug: "wealth-management",
    director: "Mack Haymond",
    description: "Learn the fundamentals of relationship building, sales, and advisory services. Develop the skills required to one day build a book of business and guide clients through complex financial decisions.",
    bullets: [
      "Relationship building & networking",
      "Sales fundamentals & rejection resistance",
      "SIE exam awareness and prep methodologies",
    ],
  },
  {
    name: "Trading",
    slug: "trading",
    director: "Max",
    description: "Dive into the mechanics of markets. From chart reading and volatility analysis to systematic strategy basics, build a foundation in both discretionary and quantitative trading.",
    bullets: [
      "Chart reading & technical analysis",
      "Position sizing & risk management",
      "Hedge fund interview preparation",
    ],
  },
  {
    name: "Accounting & Consulting",
    slug: "accounting-consulting",
    director: "Helmer",
    description: "Master the intersection of financial reporting and strategic advisory. Build a dual skillset that opens doors to Big Four accounting, management consulting, and beyond.",
    bullets: [
      "3-statement modeling & DCF basics",
      "Audit fundamentals & operational analysis",
      "Industry case competition frameworks",
    ],
  },
  {
    name: "Investment Banking",
    slug: "investment-banking",
    director: "Announcement Coming Soon",
    description: "Prepare for the rigorous world of investment banking. Master core valuation techniques, deal mechanics, and the technical knowledge required to ace superdays.",
    bullets: [
      "Core valuation methodologies (DCF, Comps)",
      "M&A modeling fundamentals",
      "Technical interview preparation",
    ],
  },
];

export default function CommitteesIndexPage() {
  return (
    <div className="bg-cream min-h-screen text-navy pt-24 pb-16">
      <div className="container mx-auto px-4 md:px-8">
        <section className="mb-20 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold font-heading mb-6 tracking-tight text-navy">
            Four Committees.<br className="hidden md:block" /> One Club.
          </h1>
          <p className="text-lg md:text-xl text-navy/80 font-sans leading-relaxed">
            Bruin Alpha Investment is structured around four core committees. While each has a distinct focus, they work together to provide a comprehensive financial education through our rotational program.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          {COMMITTEES.map((committee) => (
            <div 
              key={committee.slug} 
              className="bg-white border border-gold/20 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full"
            >
              <div className="mb-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold font-heading text-navy">
                    {committee.name}
                  </h2>
                  <div className="w-10 h-10 bg-gold/10 text-gold flex items-center justify-center rounded-full font-bold font-heading text-lg">
                    {committee.name.charAt(0)}
                  </div>
                </div>
                <p className="text-sm text-gold font-semibold uppercase tracking-wider mb-4">
                  Director: {committee.director}
                </p>
                <p className="text-navy/80 font-sans mb-6">
                  {committee.description}
                </p>
                <div className="bg-cream/50 rounded-lg p-5 mb-8">
                  <h3 className="font-semibold text-navy mb-3">What you&apos;ll do:</h3>
                  <ul className="space-y-2">
                    {committee.bullets.map((bullet, i) => (
                      <li key={i} className="flex items-start text-sm text-navy/80">
                        <span className="text-gold mr-2 font-bold">•</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="mt-auto pt-4 border-t border-navy/10">
                <Link 
                  href={`/committees/${committee.slug}`}
                  className="inline-flex items-center font-bold text-navy hover:text-gold transition-colors"
                >
                  Explore {committee.name} <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </section>

        <section className="bg-navy text-white rounded-2xl p-8 md:p-16 text-center max-w-4xl mx-auto border border-gold/20">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-6 text-cream">Connected by Design</h2>
          <div className="w-24 h-1 bg-gold mx-auto mb-8"></div>
          <p className="text-lg text-cream/90 font-sans leading-relaxed mb-6">
            We don&apos;t believe in silos. Our unique rotational program ensures that every member gains exposure to all four disciplines during their early tenure. You might specialize in Wealth Management, but you&apos;ll understand how a trader sizes positions, how a consultant audits operations, and how an investment banker builds a DCF.
          </p>
          <p className="text-lg text-cream/90 font-sans leading-relaxed">
            This cross-pollination comes to life in our unified all-club projects, where members from different committees collaborate to tackle complex, multi-faceted financial challenges. We build well-rounded professionals who understand the entire financial ecosystem.
          </p>
        </section>
      </div>
    </div>
  );
}
