import Link from "next/link";
import { sanityClient } from "@/sanity/lib/client";

interface Social {
  platform: string;
  url: string;
}

const FALLBACK_DISCLAIMER = "Bruin Alpha Investment is a registered student organization at UCLA. Content on this site is educational only and does not constitute investment advice. BAI is not a registered investment adviser, broker-dealer, or financial advisor. This organization acts independently of UCLA and does not represent the University.";

async function getSiteSettings() {
  try {
    const settings = await sanityClient.fetch(
      `*[_type == "siteSettings"][0]{
        slogan,
        disclaimer,
        socials
      }`,
      {},
      { next: { revalidate: 3600 } }
    );
    return settings || {};
  } catch (error) {
    console.error("Failed to fetch site settings:", error);
    return {};
  }
}

export async function SiteFooter() {
  const settings = await getSiteSettings();
  const disclaimer = settings?.disclaimer || FALLBACK_DISCLAIMER;
  const slogan = settings?.slogan || "Investing in Bruin excellence.";
  
  const socials = settings?.socials || [];
  const instagram = socials.find((s: Social) => s.platform === 'instagram')?.url || 'https://instagram.com';
  const linkedin = socials.find((s: Social) => s.platform === 'linkedin')?.url || 'https://linkedin.com';
  const email = socials.find((s: Social) => s.platform === 'email')?.url || 'mailto:contact@bruinalpha.com';

  return (
    <footer className="bg-[#002147] text-white py-16">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          <div className="flex flex-col gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/logo-full.svg"
              alt="Bruin Alpha Investment"
              className="w-48 h-auto"
            />
            <p className="text-gray-300 text-sm mt-4 max-w-xs">{slogan}</p>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-[#C5A059] font-serif text-lg font-semibold">Navigation</h3>
            <ul className="flex flex-col gap-2">
              <li><Link href="/#home" className="text-gray-300 hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/#committees" className="text-gray-300 hover:text-white transition-colors">Committees</Link></li>
              <li><Link href="/#training" className="text-gray-300 hover:text-white transition-colors">Training</Link></li>
              <li><Link href="/#team" className="text-gray-300 hover:text-white transition-colors">Team</Link></li>
              <li><Link href="/#join" className="text-gray-300 hover:text-white transition-colors">Join</Link></li>
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-[#C5A059] font-serif text-lg font-semibold">Connect</h3>
            <ul className="flex flex-col gap-2">
              <li><a href={instagram} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">Instagram</a></li>
              <li><a href={linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">LinkedIn</a></li>
              <li><a href={email} className="text-gray-300 hover:text-white transition-colors">Email Us</a></li>
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-[#C5A059] font-serif text-lg font-semibold">Legal</h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              {disclaimer}
            </p>
            <p className="text-gray-500 text-xs mt-4">
              &copy; {new Date().getFullYear()} Bruin Alpha Investment. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}