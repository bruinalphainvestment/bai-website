import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Training & Rotational Program — Bruin Alpha Investment at UCLA',
  description: 'Our 10-week rotational program exposes analysts to Wealth Management, Trading, Accounting & Consulting, and Investment Banking before specialization.',
};

const PHASES = [
  { week: 'Wk 1-2', title: 'Wealth Management', desc: 'Personal finance fundamentals, portfolio allocation strategies, and risk assessment.' },
  { week: 'Wk 3-4', title: 'Trading', desc: 'Market mechanics, quantitative analysis, and event-contract modeling.' },
  { week: 'Wk 5-6', title: 'Accounting & Consulting', desc: 'Financial statement analysis, corporate strategy, and operational auditing.' },
  { week: 'Wk 7-8', title: 'Investment Banking', desc: 'Valuation methodologies, financial modeling, and strategic advisory.' },
  { week: 'Wk 9-10', title: 'Selection & Commit', desc: 'Final placement matching based on analyst preference and demonstrated aptitude.' },
];

export default function TrainingPage() {
  return (
    <main className="bg-cream text-navy min-h-screen pt-32 pb-24">
      {/* Hero */}
      <section className="px-6 md:px-12 lg:px-24 mb-24 max-w-7xl mx-auto">
        <h1 className="font-serif text-h1 font-light tracking-tight mb-6">The Rotational Program</h1>
        <p className="text-xl md:text-2xl font-light leading-relaxed max-w-3xl">
          A rigorous 10-week pipeline designed to build comprehensive financial acumen. Analysts rotate through every discipline before committing to a specialized committee.
        </p>
      </section>

      {/* Timeline */}
      <section className="px-6 md:px-12 lg:px-24 mb-32 max-w-7xl mx-auto">
        <h2 className="font-serif text-h2 font-light mb-12 border-b border-border-subtle pb-4">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {PHASES.map((phase, i) => (
            <div key={phase.title} className="relative bg-offwhite p-6 border border-border-subtle flex flex-col h-full group hover:border-gold-start transition-colors">
              <span className="text-sm font-bold tracking-widest text-gold-start mb-4 block uppercase">
                {phase.week}
              </span>
              <h3 className="font-serif text-xl mb-3">{phase.title}</h3>
              <p className="opacity-80 text-sm leading-relaxed mt-auto">
                {phase.desc}
              </p>
              {/* Connector (hidden on mobile) */}
              {i !== PHASES.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-4 border-t border-dashed border-border-subtle z-10" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Class Hierarchy & Expectations Grid */}
      <section className="px-6 md:px-12 lg:px-24 mb-32 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Hierarchy */}
          <div>
            <h2 className="font-serif text-h2 font-light mb-8 border-b border-border-subtle pb-4">Class Hierarchy</h2>
            <div className="flex flex-col space-y-4">
              <div className="p-6 bg-navy text-cream flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-2xl mb-1">Analyst</h3>
                  <p className="opacity-70 text-sm">Year 1</p>
                </div>
                <span className="text-gold-start text-xl">&uarr;</span>
              </div>
              <div className="p-6 bg-navy/90 text-cream flex items-center justify-between ml-4">
                <div>
                  <h3 className="font-serif text-2xl mb-1">Associate</h3>
                  <p className="opacity-70 text-sm">Year 2</p>
                </div>
                <span className="text-gold-start text-xl">&uarr;</span>
              </div>
              <div className="p-6 bg-navy/80 text-cream flex items-center justify-between ml-8">
                <div>
                  <h3 className="font-serif text-2xl mb-1">Director</h3>
                  <p className="opacity-70 text-sm">Committee Lead</p>
                </div>
                <span className="text-gold-start text-xl">✦</span>
              </div>
            </div>
          </div>

          {/* Sample Week & Assessment */}
          <div className="space-y-12">
            <div>
              <h2 className="font-serif text-h2 font-light mb-8 border-b border-border-subtle pb-4">Sample Week</h2>
              <div className="bg-offwhite p-8 border border-border-subtle">
                <ul className="space-y-6">
                  <li className="flex items-start">
                    <span className="text-gold-start font-bold mr-4 w-12 shrink-0">1 hr</span>
                    <div>
                      <h4 className="font-bold mb-1">Committee Meeting</h4>
                      <p className="opacity-80 text-sm">Synchronous instruction, project alignment, and progress reviews.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-start font-bold mr-4 w-12 shrink-0">2 hr</span>
                    <div>
                      <h4 className="font-bold mb-1">Asynchronous Work</h4>
                      <p className="opacity-80 text-sm">Independent research, modeling, and deliverable preparation.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="font-serif text-h2 font-light mb-4 border-b border-border-subtle pb-4">Assessment</h2>
              <p className="opacity-80 leading-relaxed">
                Members complete a 30-page consolidated study guide prior to recruiting interviews, ensuring technical readiness across all major financial disciplines.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quarterly Project */}
      <section className="px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
        <div className="bg-navy text-cream p-12 md:p-16 border-t-4 border-gold-start">
          <h2 className="font-serif text-h2 font-light mb-4">Quarterly All-Club Project</h2>
          <p className="text-lg opacity-80 max-w-3xl leading-relaxed">
            Beyond committee work, the entire organization unites once per quarter for a comprehensive, cross-disciplinary project. This ensures continued collaboration between groups and reinforces the interconnected nature of the financial ecosystem.
          </p>
        </div>
      </section>
    </main>
  );
}
