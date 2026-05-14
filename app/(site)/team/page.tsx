import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Team — Bruin Alpha Investment at UCLA",
  description: "Meet the founding class, members, and alumni of Bruin Alpha Investment.",
};

const team = [
  { monogram: "MH", name: "Mack Haymond", role: "President", bio: "Leading Bruin Alpha Investment's overall strategy and operations." },
  { monogram: "MX", name: "Max", role: "Trading Director", bio: "Directing quantitative and discretionary trading initiatives." },
  { monogram: "SM", name: "Sam", role: "Operations", bio: "Managing internal processes, structure, and organizational growth." },
  { monogram: "KX", name: "Kai", role: "Trading Co-Director", bio: "Co-directing trading strategies and market research." },
  { monogram: "HM", name: "Helmer", role: "Accounting & Consulting Director", bio: "Overseeing accounting principles, financial analysis, and consulting projects." }
];

export default function TeamPage() {
  return (
    <main className="min-h-screen bg-cream text-navy pt-32 pb-24">
      <section className="px-4 md:px-8 max-w-7xl mx-auto mb-20 md:mb-32">
        <h1 className="font-display text-5xl md:text-7xl mb-6">The Team</h1>
        <p className="font-sans text-xl md:text-2xl text-navy/80 max-w-3xl">
          Meet the minds behind Bruin Alpha Investment. A dedicated group of students pushing the boundaries of undergraduate finance.
        </p>
      </section>

      <section className="px-4 md:px-8 max-w-7xl mx-auto mb-24 md:mb-32">
        <h2 className="font-display text-3xl md:text-4xl mb-12 border-b border-navy/10 pb-6">
          Founding Class — Spring 2026
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {team.map((member) => (
            <div key={member.name} className="flex flex-col group">
              <div className="aspect-square bg-deep flex items-center justify-center mb-6 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-navy to-deep opacity-80" />
                <span className="relative z-10 font-display text-5xl md:text-6xl bg-gradient-to-br from-[#C5A059] to-[#8B6F38] bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-500">
                  {member.monogram}
                </span>
              </div>
              <h3 className="font-display text-xl md:text-2xl mb-1">
                {member.name}
              </h3>
              <p className="font-sans font-medium text-navy/90 text-sm md:text-base mb-3">
                {member.role}
              </p>
              <p className="font-sans text-navy/70 text-sm leading-relaxed">
                {member.bio}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 md:px-8 max-w-7xl mx-auto mb-24 md:mb-32">
        <h2 className="font-display text-3xl md:text-4xl mb-8">Members</h2>
        <div className="bg-cream border border-navy/10 p-8 md:p-12 text-center rounded-sm">
          <p className="font-sans text-lg text-navy/70">
            Our first cohort joins Fall 2026 — check back after recruitment.
          </p>
        </div>
      </section>

      <section className="px-4 md:px-8 max-w-7xl mx-auto">
        <h2 className="font-display text-3xl md:text-4xl mb-8">Alumni</h2>
        <div className="bg-cream border border-navy/10 p-8 md:p-12 text-center rounded-sm">
          <p className="font-sans text-lg text-navy/70">
            Our first alumni graduate in 2027.
          </p>
        </div>
      </section>
    </main>
  );
}
