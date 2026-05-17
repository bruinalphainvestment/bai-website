import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, Geist_Mono } from "next/font/google";
import { draftMode } from "next/headers";
import { stegaClean } from "next-sanity";
import { VisualEditing } from "next-sanity/visual-editing";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { footerFallback } from "./_components/fallbacks/footer";
import { sanityFetch, SanityLive } from "@/sanity/lib/live";
import { urlForImage } from "@/sanity/lib/imageUrl";
import { siteSettingsQuery } from "@/sanity/lib/queries";
import type { SiteSettingsQueryResult } from "@/sanity/types/generated";

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "600"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

type SettingsForRender = NonNullable<SiteSettingsQueryResult>;

async function loadSettings(): Promise<SettingsForRender> {
  if (process.env.NEXT_PUBLIC_USE_SANITY !== "true") {
    return footerFallback;
  }
  try {
    const { data } = await sanityFetch({ query: siteSettingsQuery });
    return data ?? footerFallback;
  } catch (error) {
    console.error("[RootLayout] sanityFetch failed; using fallback:", error);
    return footerFallback;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const raw = await loadSettings();
  /* stegaClean strips Sanity Visual Editing's invisible U+E000-U+F8FF
     Private Use Area characters that get embedded in fetched strings (Metis §2.4).
     Required for ANY non-DOM serialization — metadata, JSON-LD, sitemap URLs. */
  const settings = stegaClean(raw);

  const brand = settings.brandName ?? "Bruin Alpha Investment";
  const suffix = settings.titleSuffix ?? " — Bruin Alpha Investment at UCLA";
  const description =
    settings.defaultMetaDescription ??
    "Bruin Alpha Investment is a student-led organization dedicated to bridging academic finance with real-world market application.";

  const ogImages = settings.defaultOgImage
    ? [urlForImage(settings.defaultOgImage).width(1200).height(630).url()]
    : [];

  return {
    metadataBase: new URL(siteUrl),
    title: `${brand}${suffix}`,
    description,
    openGraph: {
      siteName: brand,
      locale: "en_US",
      type: "website",
      url: siteUrl,
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#031E42",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDraftMode = (await draftMode()).isEnabled;
  const settings = stegaClean(await loadSettings());

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.brandName ?? "Bruin Alpha Investment",
    url: siteUrl,
    logo: `${siteUrl}/brand/logo/png/on-white/BAI_full_on-white@2x.png`,
    description:
      settings.organizationDescription ??
      settings.defaultMetaDescription ??
      "Bruin Alpha Investment is a student-led organization dedicated to bridging academic finance with real-world market application.",
  };
  if (settings.sameAs && settings.sameAs.length > 0) {
    jsonLd.sameAs = settings.sameAs;
  }

  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-body-family">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:p-4 focus:bg-surface-content focus:text-text-on-light"
        >
          Skip to main content
        </a>
        <div id="root-content" className="flex-grow flex flex-col">
          {children}
        </div>

        {/* JSON-LD Organization schema — only allowed dangerouslySetInnerHTML usage. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <Analytics />
        <SpeedInsights />

        {isDraftMode && <VisualEditing />}
        <SanityLive />
      </body>
    </html>
  );
}
