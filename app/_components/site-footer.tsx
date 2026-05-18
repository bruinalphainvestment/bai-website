import Link from 'next/link';

import { sanityFetch } from '@/sanity/lib/live';
import { siteSettingsQuery } from '@/sanity/lib/queries';
import type { SiteSettingsQueryResult } from '@/sanity/types/generated';

import { footerFallback } from './fallbacks/footer';

type FooterData = NonNullable<SiteSettingsQueryResult>;

export async function SiteFooter() {
  const data = await loadFooterData();
  return <FooterRender data={data} />;
}

async function loadFooterData(): Promise<FooterData> {
  if (process.env.NEXT_PUBLIC_USE_SANITY !== 'true') {
    return footerFallback;
  }
  try {
    const { data } = await sanityFetch({ query: siteSettingsQuery });
    return data ?? footerFallback;
  } catch (error) {
    console.error('[SiteFooter] sanityFetch failed; using fallback:', error);
    return footerFallback;
  }
}

function FooterRender({ data }: { data: FooterData }) {
  /* D21: disclaimer is empty string when Sanity returns null, NOT the hardcoded
     legal copy — that copy belongs only in the fallback module + Sanity initialValue. */
  const disclaimer = data.disclaimer ?? '';
  const slogan = data.slogan ?? '';
  const brandAlt = data.brandName ?? data.uclaName ?? 'Bruin Alpha Investment';
  const instagramHref = data.instagramUrl ?? '#';
  const linkedinHref = data.linkedinUrl ?? '#';
  const emailHref = data.clubEmail ? `mailto:${data.clubEmail}` : '#';
  const year = data.foundedYear ?? new Date().getFullYear();

  return (
    <footer className="bg-[#002147] text-white py-16">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          <div className="flex flex-col gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/logo/png/cream/BAI_full_cream@2x.png"
              alt={brandAlt}
              width={800}
              height={501}
              className="w-56 h-auto"
            />
            {slogan ? (
              <p className="text-gray-300 text-sm mt-4 max-w-xs">{slogan}</p>
            ) : null}
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-[#C5A059] font-serif text-lg font-semibold">Navigation</h3>
            <ul className="flex flex-col gap-2">
              <li><Link href="/" className="text-gray-300 hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/committees" className="text-gray-300 hover:text-white transition-colors">Committees</Link></li>
              <li><Link href="/training" className="text-gray-300 hover:text-white transition-colors">Training</Link></li>
              <li><Link href="/team" className="text-gray-300 hover:text-white transition-colors">Team</Link></li>
              <li><Link href="/join" className="text-gray-300 hover:text-white transition-colors">Join</Link></li>
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-[#C5A059] font-serif text-lg font-semibold">Connect</h3>
            <ul className="flex flex-col gap-2">
              <li><a href={instagramHref} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">Instagram</a></li>
              <li><a href={linkedinHref} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">LinkedIn</a></li>
              <li><a href={emailHref} className="text-gray-300 hover:text-white transition-colors">Email Us</a></li>
            </ul>
          </div>

           <div className="flex flex-col gap-4">
             <h3 className="text-[#C5A059] font-serif text-lg font-semibold">Legal</h3>
             {disclaimer ? (
               <p className="text-gray-400 text-xs leading-relaxed">{disclaimer}</p>
             ) : null}
             <p className="text-gray-400 text-xs mt-4">
               &copy; {year} {brandAlt}. All rights reserved.
             </p>
             <p className="text-xs mt-2">
               <Link
                 href="/studio"
                 className="text-gray-300 underline underline-offset-2 hover:text-white focus:text-white"
               >
                 Admin
               </Link>
             </p>
           </div>
        </div>
      </div>
    </footer>
  );
}
