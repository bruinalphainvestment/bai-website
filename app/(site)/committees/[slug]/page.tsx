import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

const committees = {
  'wealth-management': {
    name: 'Wealth Management',
    director: 'Mack Haymond',
    tagline: 'Soft skills, sales fundamentals, and the discipline behind a book of business.',
    learn: [
      'Rejection-resistance and emotional intelligence',
      'Relationship building and long-term client management',
      'SIE/Series exam awareness and preparation',
      'Wealth advisor career path fundamentals',
    ],
    projects: [
      {
        title: 'Wealth Advisory Mock Engagement',
        description: 'Simulate a realistic client scenario from initial prospecting to portfolio recommendation.'
      },
      {
        title: 'SIE Study Pod',
        description: 'Collaborative curriculum preparing members for the core Securities Industry Essentials exam.'
      }
    ],
    quote: '"Wealth management is the long game — built on conviction, rejection-handling, and the relationships you cultivate quarter after quarter." — Mack Haymond',
    differentiator: 'The only finance club at UCLA emphasizing the wealth advisory career path with hands-on practice.'
  },
  'trading': {
    name: 'Trading',
    director: 'Max',
    tagline: 'Markets, mechanics, and the systematic edge — from chart reading to hedge fund recruiting.',
    learn: [
      'Chart reading, price action, and order flow',
      'Volatility analysis and position sizing',
      'Systematic strategy basics and risk management',
      'Technical interview prep for trading roles and hedge fund coffee chats',
    ],
    projects: [
      {
        title: 'Event-Contract Modeling Research',
        description: 'Systematic identification and modeling of mispriced binary event contracts across various domains.'
      },
      {
        title: 'Internal Trading Competition',
        description: 'A CME-style simulation testing execution under pressure.'
      },
      {
        title: 'External Competitions',
        description: 'Preparation for and participation in the CME Trading Challenge (Fall) and IMC Prosperity (Spring).'
      }
    ],
    quote: '"The market is an incredible teacher. We focus on removing emotion and finding repeatable edge through systematic analysis." — Max',
    differentiator: 'A unique focus on hands-on quant and market structure across alternative asset classes.'
  },
  'accounting-consulting': {
    name: 'Accounting & Consulting',
    director: 'Helmer',
    tagline: 'Where the numbers and the strategy meet — modeling, audit, and advisory thinking under one roof.',
    learn: [
      '3-statement modeling and financial statement analysis',
      'Discounted Cash Flow (DCF) and LBO basics',
      'Audit fundamentals and operational review',
      'Case frameworks and structured advisory thinking',
    ],
    projects: [
      {
        title: 'UCLA Club Audit / Advisory',
        description: 'Analyze a peer club\'s operations and financial structures, providing actionable recommendations for improvement.'
      },
      {
        title: 'Industry Case Competitions',
        description: 'Tackle real-world business strategy problems in timed, team-based formats.'
      }
    ],
    quote: '"Understanding both the underlying accounting and the overarching strategy makes you significantly more dangerous in any advisory room." — Helmer',
    differentiator: 'Why Both? We explain the accounting-consulting overlap and why a unified committee best prepares you for both career paths.'
  },
  'investment-banking': {
    name: 'Investment Banking',
    director: 'TBD — announcement coming soon',
    tagline: 'Modeling, networking, and the mental models behind every deal.',
    learn: [
      'Advanced 3-statement modeling and DCF valuation',
      'M&A models, LBO mechanics, and accretion/dilution analysis',
      'Strategic networking, cold emailing, and coffee chat mastery',
      'Technical interview prep for top-tier banking groups',
    ],
    projects: [
      {
        title: 'Live Deal Tear-Down',
        description: 'Analyze a recent M&A deal, present the strategic rationale, and propose alternative theses.'
      },
      {
        title: 'Spring Stock Pitch',
        description: 'An all-club capstone where members synthesize their financial modeling and presentation skills.'
      }
    ],
    quote: '"Success in banking isn\'t just about building the model perfectly—it\'s about understanding the "why" behind the transaction and clearly communicating that narrative." — Director',
    differentiator: 'A rotational program first approach, transitioning to specialized IB prep with tight cohort camaraderie and access to a smaller community.'
  }
};

export function generateStaticParams() {
  return [
    { slug: 'wealth-management' },
    { slug: 'trading' },
    { slug: 'accounting-consulting' },
    { slug: 'investment-banking' }
  ];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const committee = committees[slug as keyof typeof committees];
  if (!committee) return { title: 'Committee Not Found' };
  
  return {
    title: `${committee.name} — Bruin Alpha Investment at UCLA`,
    description: committee.tagline,
  };
}

export default async function CommitteePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const committee = committees[slug as keyof typeof committees];
  
  if (!committee) {
    notFound();
  }

  const curriculum = [
    { week: 'Week 1', topic: 'Introduction & Core Concepts' },
    { week: 'Week 2', topic: 'Industry Overview & Terminology' },
    { week: 'Week 3', topic: 'Foundational Models & Tools' },
    { week: 'Week 4', topic: 'Advanced Case Studies' },
    { week: 'Week 5', topic: 'Midterm Project Review' },
    { week: 'Week 6', topic: 'Networking & Interview Strategies' },
    { week: 'Week 7', topic: 'Deep Dive: Specialized Topics' },
    { week: 'Week 8', topic: 'Final Presentations' },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-gray-900 font-sans pb-24">
      <section className="pt-32 pb-16 px-6 md:px-12 max-w-5xl mx-auto">
        <Link 
          href="/committees" 
          className="inline-flex items-center text-[#0A192F] hover:text-blue-700 transition-colors mb-8 font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Committees
        </Link>
        
        <h1 className="text-5xl md:text-6xl font-serif text-[#0A192F] mb-6 leading-tight">
          {committee.name}
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mb-8 leading-relaxed font-light">
          {committee.tagline}
        </p>
        
        <div className="inline-flex items-center bg-[#0A192F] text-[#FAF9F6] px-5 py-2.5 rounded-full text-sm font-medium tracking-wide">
          Director: {committee.director}
        </div>
      </section>

      <div className="px-6 md:px-12 max-w-5xl mx-auto space-y-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-serif text-[#0A192F] mb-4">The BAI Difference</h2>
            <p className="text-gray-700 leading-relaxed">
              {committee.differentiator}
            </p>
          </div>
          
          <blockquote className="text-xl md:text-2xl font-serif italic text-[#0A192F] leading-relaxed border-l-4 border-[#0A192F] pl-6 py-2">
            {committee.quote}
          </blockquote>
        </div>

        <section>
          <h2 className="text-3xl font-serif text-[#0A192F] mb-8 border-b border-gray-200 pb-4">
            What You&apos;ll Learn
          </h2>
          <ul className="grid md:grid-cols-2 gap-4">
            {committee.learn.map((item) => (
              <li key={item} className="flex items-start">
                <span className="text-[#0A192F] mr-3 mt-1">•</span>
                <span className="text-gray-700 leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-3xl font-serif text-[#0A192F] mb-8 border-b border-gray-200 pb-4">
            Signature Projects
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {committee.projects.map((project) => (
              <div key={project.title} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold text-[#0A192F] mb-3">{project.title}</h3>
                <p className="text-gray-600 leading-relaxed">{project.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-serif text-[#0A192F] mb-8 border-b border-gray-200 pb-4">
            Curriculum <span className="text-gray-400 text-2xl font-sans ml-2">(Fall 2026)</span>
          </h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {curriculum.map((item, idx) => (
              <div 
                key={item.week} 
                className={`flex flex-col sm:flex-row sm:items-center px-6 py-4 ${idx !== curriculum.length - 1 ? 'border-b border-gray-100' : ''}`}
              >
                <div className="w-32 font-bold text-[#0A192F] mb-1 sm:mb-0">
                  {item.week}
                </div>
                <div className="text-gray-700">
                  {item.topic}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
