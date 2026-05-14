import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects & Research — Bruin Alpha Investment at UCLA',
  description: 'Explore the hands-on initiatives, research, and engagements led by our specialized committees.',
};

const PROJECTS = [
  {
    title: 'Event-Contract Modeling Research',
    committee: 'Trading',
    status: 'Planning',
    summary: 'A quantitative initiative focused on pricing and analyzing probability-based event contracts. Analysts will build predictive models to evaluate mispricings in event-driven markets.',
  },
  {
    title: 'UCLA Club Audit Initiative',
    committee: 'Accounting & Consulting',
    status: 'Planning',
    summary: 'Pro-bono financial reviews for other campus organizations. Members will assess cash flow, budget allocations, and operational efficiency, culminating in a formalized advisory report.',
  },
  {
    title: 'Spring Stock Pitch',
    committee: 'Investment Banking (All-Club)',
    status: 'Planning',
    summary: 'Our capstone event where analysts across all committees form teams to deliver comprehensive investment pitches, emphasizing rigorous valuation, market sizing, and strategic rationale.',
  },
  {
    title: 'Wealth Advisory Mock Engagement',
    committee: 'Wealth Management',
    status: 'Planning',
    summary: 'Simulated client engagements requiring analysts to construct diversified portfolios based on specific risk profiles, tax considerations, and long-term financial objectives.',
  },
  {
    title: 'UCLA-Wide Stock Trading Competition',
    committee: 'Trading (Aspirational)',
    status: 'Planning',
    summary: 'A campus-wide initiative currently in the planning phase. The goal is to democratize market access and test trading strategies in a competitive, simulated environment.',
  },
];

export default function ProjectsPage() {
  return (
    <div className="bg-cream text-navy min-h-screen pt-32 pb-24">
      <section className="px-6 md:px-12 lg:px-24 mb-24 max-w-7xl mx-auto">
        <h1 className="font-serif text-h1 font-light tracking-tight mb-6">What We Build</h1>
        <p className="text-xl md:text-2xl font-light leading-relaxed max-w-3xl">
          At Bruin Alpha Investment, theory is immediately put into practice. Our committees drive independent research and structured deliverables.
        </p>
      </section>

      <section className="px-6 md:px-12 lg:px-24 mb-32 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PROJECTS.map((project) => (
            <div key={project.title} className="bg-offwhite border border-border-subtle p-8 flex flex-col hover:border-gold-start transition-colors">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="bg-navy text-cream text-xs font-bold uppercase tracking-widest px-3 py-1">
                  {project.committee}
                </span>
                <span className="border border-gold-start text-gold-start text-xs font-bold uppercase tracking-widest px-3 py-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gold-start animate-pulse"></span>
                  {project.status}
                </span>
              </div>
              <h2 className="font-serif text-2xl mb-4">{project.title}</h2>
              <p className="opacity-80 leading-relaxed mt-auto">
                {project.summary}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 md:px-12 lg:px-24 max-w-7xl mx-auto border-t border-border-subtle pt-12">
        <h3 className="text-sm font-bold uppercase tracking-widest mb-6 opacity-70">Status Legend</h3>
        <ul className="flex flex-col sm:flex-row gap-6 sm:gap-12 text-sm">
          <li className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-gold-start"></span>
            <span><strong className="block">Planning</strong> Scope and deliverables are currently being finalized.</span>
          </li>
          <li className="flex items-center gap-3 opacity-50 grayscale">
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            <span><strong className="block">Active</strong> Project is currently in execution phase.</span>
          </li>
          <li className="flex items-center gap-3 opacity-50 grayscale">
            <span className="w-3 h-3 rounded-full bg-navy"></span>
            <span><strong className="block">Completed</strong> Final deliverable has been published.</span>
          </li>
        </ul>
      </section>
    </div>
  );
}
