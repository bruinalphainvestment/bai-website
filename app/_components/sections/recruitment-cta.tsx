import Link from 'next/link';

export default function RecruitmentCTA() {
  return (
    <section data-section="cta" className="bg-cream text-navy py-32 px-4 md:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="font-display text-4xl md:text-6xl mb-6">
          Join the Founding Cohort
        </h2>
        <p className="font-sans text-lg md:text-2xl text-navy/80 mb-12 max-w-2xl mx-auto font-light">
          Priority application closes [date — placeholder TBD]. Applications open to all current and incoming UCLA students.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link 
            href="#" 
            className="bg-navy text-cream px-8 py-4 font-sans uppercase tracking-widest text-sm hover:bg-[#C5A059] transition-colors w-full sm:w-auto text-center"
            rel="noopener noreferrer"
          >
            Apply Now
          </Link>
          <a 
            href="mailto:bruinalphainvestment26@gmail.com" 
            className="text-navy font-sans uppercase tracking-widest text-sm border-b border-navy pb-1 hover:text-[#C5A059] hover:border-[#C5A059] transition-colors w-full sm:w-auto text-center"
          >
            Email Us
          </a>
        </div>
      </div>
    </section>
  );
}