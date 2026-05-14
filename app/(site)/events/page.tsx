import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events — Bruin Alpha Investment at UCLA",
  description: "Find Bruin Alpha Investment at campus events, competitions, and speaker series.",
};

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-cream text-navy pt-32 pb-24">
      <section className="px-4 md:px-8 max-w-7xl mx-auto mb-20 md:mb-32">
        <h1 className="font-display text-5xl md:text-7xl mb-6">Where to Find Us</h1>
        <p className="font-sans text-xl md:text-2xl text-navy/80 max-w-3xl">
          Connect with us across campus and track our participation in premier collegiate competitions.
        </p>
      </section>

      <section className="px-4 md:px-8 max-w-7xl mx-auto mb-24 md:mb-32">
        <h2 className="font-display text-3xl md:text-4xl mb-12 border-b border-navy/10 pb-6">
          Upcoming & Ongoing
        </h2>
        <div className="space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-12 bg-deep/5 p-8 rounded-sm">
            <div className="md:w-1/4 flex-shrink-0">
              <span className="font-sans font-medium text-navy/80 uppercase tracking-wider text-sm block mb-1">Fall 2026</span>
              <span className="text-navy/60 text-sm">Location: TBD</span>
            </div>
            <div>
              <h3 className="font-display text-2xl mb-3">Enormous Activities Fair (EAF)</h3>
              <p className="font-sans text-navy/80 leading-relaxed">
                Bruin Alpha Investment will be tabling at the annual UCLA Enormous Activities Fair. Come meet our founding class, learn about the rotational program, and ask questions about our four verticals before applications close.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-12 p-8 border border-navy/10 rounded-sm">
            <div className="md:w-1/4 flex-shrink-0">
              <span className="font-sans font-medium text-navy/80 uppercase tracking-wider text-sm block mb-1">Coming Soon</span>
              <span className="text-navy/60 text-sm">Location: UCLA Campus</span>
            </div>
            <div>
              <h3 className="font-display text-2xl mb-3">Speakers & Workshops</h3>
              <p className="font-sans text-navy/80 leading-relaxed">
                Coming soon — speaker series in development. We are actively coordinating with industry professionals across trading, investment banking, and consulting.
              </p>
            </div>
          </div>

        </div>
      </section>

      <section className="px-4 md:px-8 max-w-7xl mx-auto mb-24 md:mb-32">
        <h2 className="font-display text-3xl md:text-4xl mb-12 border-b border-navy/10 pb-6">
          Competitions
        </h2>
        <div className="space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-12 border-b border-navy/5 pb-8">
            <div className="md:w-1/4 flex-shrink-0">
              <span className="font-sans font-medium text-navy/80 block mb-1">Trading Committee</span>
              <span className="text-navy/60 text-sm">Date: TBD</span>
            </div>
            <div>
              <h3 className="font-display text-xl mb-2">CME Trading Challenge</h3>
              <p className="font-sans text-navy/80 text-sm">
                Participation in the premier electronic trading competition utilizing CME Group&apos;s real-time professional trading platform.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-12 border-b border-navy/5 pb-8">
            <div className="md:w-1/4 flex-shrink-0">
              <span className="font-sans font-medium text-navy/80 block mb-1">Trading Committee</span>
              <span className="text-navy/60 text-sm">Date: TBD</span>
            </div>
            <div>
              <h3 className="font-display text-xl mb-2">IMC Prosperity</h3>
              <p className="font-sans text-navy/80 text-sm">
                Global trading challenge combining algorithmic trading, market making, and quantitative finance.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-12 border-b border-navy/5 pb-8">
            <div className="md:w-1/4 flex-shrink-0">
              <span className="font-sans font-medium text-navy/80 block mb-1">Accounting & IB</span>
              <span className="text-navy/60 text-sm">Date: TBD</span>
            </div>
            <div>
              <h3 className="font-display text-xl mb-2">Case Competitions</h3>
              <p className="font-sans text-navy/80 text-sm">
                Targeted participation in regional and national accounting and investment banking case competitions.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-12 pb-8">
            <div className="md:w-1/4 flex-shrink-0">
              <span className="font-sans font-medium text-navy/80 block mb-1">All Committees</span>
              <span className="text-navy/60 text-sm">Date: Spring 2027</span>
            </div>
            <div>
              <h3 className="font-display text-xl mb-2">Spring Stock Pitch</h3>
              <p className="font-sans text-navy/80 text-sm">
                Internal cross-committee competition synthesizing market research, financial modeling, and strategic presentation.
              </p>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
