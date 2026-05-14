import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Join — Bruin Alpha Investment at UCLA",
  description: "Apply to Bruin Alpha Investment. Learn about our recruitment timeline, application process, and FAQ.",
};

const faqs = [
  {
    q: "Do I need finance experience?",
    a: "No prior experience required for first-year applicants. We provide a structured rotational program covering all 4 verticals."
  },
  {
    q: "What year can I apply?",
    a: "All current and incoming UCLA undergraduates are welcome to apply. First-years are encouraged."
  },
  {
    q: "How is BAI different from other UCLA finance clubs?",
    a: "BAI combines blanket coverage of finance verticals with specialized committees and a rotational program — without requiring you to pick a single track on day one."
  },
  {
    q: "What's the time commitment?",
    a: "~3-5 hours per week during quarters, plus optional project work."
  },
  {
    q: "Is there a fee?",
    a: "No dues for general membership."
  },
  {
    q: "What happens after I'm accepted?",
    a: "You join the rotational program in Fall, cycle through all 4 committees over 8 weeks, then commit to one for the rest of the year."
  }
];

export default function JoinPage() {
  return (
    <div className="min-h-screen bg-cream text-navy pt-32 pb-24">
      <section className="px-4 md:px-8 max-w-7xl mx-auto mb-20 md:mb-32">
        <h1 className="font-display text-5xl md:text-7xl mb-6">Join the Cohort</h1>
        <p className="font-sans text-xl md:text-2xl text-navy/80 max-w-3xl">
          Four disciplines. One structured rotational program. Build your foundation in finance without locking into a single track on day one.
        </p>
      </section>

      <section className="px-4 md:px-8 max-w-7xl mx-auto mb-24 md:mb-32">
        <h2 className="font-display text-3xl md:text-4xl mb-12 border-b border-navy/10 pb-6">
          Application Process
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8 mb-16">
          {["Apply", "Coffee Chat", "Interview", "Decision"].map((step, index) => (
            <div key={step} className="bg-navy text-cream p-8 rounded-sm relative overflow-hidden group">
              <div className="text-cream/10 font-display text-8xl absolute -bottom-4 -right-2 pointer-events-none group-hover:scale-110 transition-transform duration-500">
                0{index + 1}
              </div>
              <h3 className="font-display text-2xl relative z-10">{step}</h3>
            </div>
          ))}
        </div>

        <div className="bg-deep/5 p-8 md:p-12 rounded-sm mb-16">
          <h3 className="font-display text-2xl mb-6">Recruitment Timeline</h3>
          <ul className="space-y-6">
            <li className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8 border-b border-navy/10 pb-4">
              <span className="font-sans font-medium text-navy/80 md:w-1/4">Fall 2026</span>
              <span className="font-sans text-navy">Priority Application Deadline</span>
            </li>
            <li className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8 border-b border-navy/10 pb-4">
              <span className="font-sans font-medium text-navy/80 md:w-1/4">Through Week 5</span>
              <span className="font-sans text-navy">Rolling Applications & Coffee Chats</span>
            </li>
            <li className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8 border-b border-navy/10 pb-4">
              <span className="font-sans font-medium text-navy/80 md:w-1/4">Weeks 5-6</span>
              <span className="font-sans text-navy">Interview Process (1x Technical + 1x Behavioral)</span>
            </li>
            <li className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8 pb-4">
              <span className="font-sans font-medium text-navy/80 md:w-1/4">Week 6</span>
              <span className="font-sans text-navy">Final Decisions Released</span>
            </li>
          </ul>
        </div>
      </section>

      <section className="px-4 md:px-8 max-w-7xl mx-auto mb-24 md:mb-32">
        <h2 className="font-display text-3xl md:text-4xl mb-12 border-b border-navy/10 pb-6">
          Application Form
        </h2>
        <div className="aspect-[4/3] md:aspect-[21/9] w-full bg-cream border border-navy/10 rounded-sm relative overflow-hidden flex items-center justify-center flex-col">
          <p className="font-display text-2xl md:text-3xl mb-4">Application opens Fall 2026</p>
          <a href="#" className="font-sans border border-navy px-6 py-3 hover:bg-navy hover:text-cream transition-colors duration-300">
            Link to Application
          </a>
          <iframe 
            src="about:blank" 
            data-tally-placeholder="true" 
            className="absolute inset-0 w-full h-full opacity-0 pointer-events-none" 
            title="Application Form"
          />
        </div>
      </section>

      <section className="px-4 md:px-8 max-w-7xl mx-auto mb-24 md:mb-32">
        <h2 className="font-display text-3xl md:text-4xl mb-12 border-b border-navy/10 pb-6">
          FAQ
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          {faqs.map((faq) => (
            <div key={faq.q} className="flex flex-col">
              <h3 className="font-display text-xl mb-3">{faq.q}</h3>
              <p className="font-sans text-navy/70 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 md:px-8 max-w-7xl mx-auto">
        <h2 className="font-display text-3xl md:text-4xl mb-12 border-b border-navy/10 pb-6">
          Get in Touch
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-deep/5 p-8 rounded-sm hover:bg-deep/10 transition-colors duration-300">
            <span className="block font-sans text-sm text-navy/60 mb-2 uppercase tracking-wider">Email</span>
            <a href="mailto:bruinalphainvestment26@gmail.com" className="font-display text-lg md:text-xl underline underline-offset-4 decoration-navy/30 hover:decoration-navy transition-colors">
              bruinalphainvestment26@gmail.com
            </a>
          </div>
          <div className="bg-deep/5 p-8 rounded-sm hover:bg-deep/10 transition-colors duration-300">
            <span className="block font-sans text-sm text-navy/60 mb-2 uppercase tracking-wider">Instagram</span>
            <a href="#" className="font-display text-lg md:text-xl underline underline-offset-4 decoration-navy/30 hover:decoration-navy transition-colors">
              @bruinalphainvestment
            </a>
          </div>
          <div className="bg-deep/5 p-8 rounded-sm hover:bg-deep/10 transition-colors duration-300">
            <span className="block font-sans text-sm text-navy/60 mb-2 uppercase tracking-wider">LinkedIn</span>
            <a href="#" className="font-display text-lg md:text-xl underline underline-offset-4 decoration-navy/30 hover:decoration-navy transition-colors">
              Bruin Alpha Investment
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
