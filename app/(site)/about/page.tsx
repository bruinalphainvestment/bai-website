import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About — Bruin Alpha Investment at UCLA',
  description: 'Bruin Alpha Investment was founded in Spring 2026 to provide blanket coverage across finance disciplines through specialized committees and real project work.',
};

export default function AboutPage() {
  return (
    <main className="bg-cream text-navy min-h-screen pt-32 pb-24 selection:bg-navy selection:text-cream">
      {/* Hero Section */}
      <section className="px-6 md:px-12 lg:px-24 mb-24 max-w-7xl mx-auto">
        <h1 className="font-serif text-h1 font-light tracking-tight mb-6">Our Story</h1>
        <p className="text-xl md:text-2xl font-light leading-relaxed max-w-3xl">
          Founded in Spring 2026, Bruin Alpha Investment was built to bridge the gap in UCLA&apos;s finance club landscape by combining broad accessibility with deep, specialized training.
        </p>
      </section>

      {/* Origin Story */}
      <section className="px-6 md:px-12 lg:px-24 mb-32 max-w-4xl mx-auto">
        <div className="prose prose-lg prose-navy max-w-none space-y-6 text-lg leading-relaxed opacity-90">
          <p>
            The vision for Bruin Alpha Investment began in the Spring of 2026. Mack Haymond and four co-founders recognized a clear gap in the existing financial organization landscape at UCLA. While other organizations focused heavily on single disciplines or maintained extremely narrow funnels for entry, there was a profound need for a community that offered both an inclusive starting point and a pathway to highly specialized expertise.
          </p>
          <p>
            We realized that true financial education doesn&apos;t happen in silos. It happens when students are exposed to the full spectrum of the industry—from investment banking and wealth management to trading and accounting—before they are forced to specialize. 
          </p>
          <p>
            By establishing our multi-committee structure, we ensure that every member receives blanket coverage of the financial world during their rotational period, followed by rigorous, hands-on development within their chosen focus area. Our goal is not just to teach finance, but to execute real, meaningful projects that deliver tangible value to our members and the broader community.
          </p>
        </div>
      </section>

      {/* Quote Block */}
      <section className="px-6 md:px-12 lg:px-24 mb-32 max-w-5xl mx-auto">
        <blockquote className="border-l-4 border-gold-start pl-8 py-4">
          <p className="font-serif text-h2 font-light leading-snug mb-6">
            &ldquo;We are starting it, we are building it, so we can decide what direction it wants to go.&rdquo;
          </p>
          <footer className="text-sm tracking-widest uppercase opacity-70">
            &mdash; Mack Haymond, Spring 2026
          </footer>
        </blockquote>
      </section>

      {/* What Sets BAI Apart */}
      <section className="px-6 md:px-12 lg:px-24 mb-32 max-w-7xl mx-auto">
        <h2 className="font-serif text-h2 font-light mb-12 border-b border-border-subtle pb-4">What Sets Us Apart</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="font-serif text-2xl mb-4 text-gold-start">Blanket Coverage</h3>
            <p className="opacity-80 leading-relaxed">
              We don&apos;t limit our focus to just one area of finance. Our structure is designed to expose members to the entire landscape, ensuring a well-rounded understanding of the markets before deep specialization.
            </p>
          </div>
          <div>
            <h3 className="font-serif text-2xl mb-4 text-gold-start">Real Projects</h3>
            <p className="opacity-80 leading-relaxed">
              Theory only goes so far. Our committees operate through hands-on, deliverable-driven initiatives rather than passive lectures, ensuring every member builds a tangible track record.
            </p>
          </div>
          <div>
            <h3 className="font-serif text-2xl mb-4 text-gold-start">Rotational Program</h3>
            <p className="opacity-80 leading-relaxed">
              Our unique onboarding pipeline allows new analysts to experience every committee over a 10-week period, guaranteeing that their final placement aligns perfectly with their skills and interests.
            </p>
          </div>
        </div>
      </section>

      {/* Placeholder Signature Event */}
      <section className="px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
        <div className="bg-offwhite border border-border-subtle p-12 md:p-24 text-center rounded-sm">
          <h2 className="font-serif text-h2 font-light mb-4">Signature Trip</h2>
          <p className="text-lg opacity-70 uppercase tracking-widest">In Development</p>
        </div>
      </section>
    </main>
  );
}
