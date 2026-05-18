import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, Geist_Mono } from "next/font/google";
import { draftMode } from "next/headers";
import Script from "next/script";
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

const GSC_VERIFICATION = process.env.NEXT_PUBLIC_GSC_VERIFICATION;
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID;

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
    alternates: { canonical: siteUrl },
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
    ...(GSC_VERIFICATION
      ? { verification: { google: GSC_VERIFICATION } }
      : {}),
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

  const brandName = settings.brandName ?? "Bruin Alpha Investment";
  const orgDescription =
    settings.organizationDescription ??
    settings.defaultMetaDescription ??
    "Bruin Alpha Investment is a student-led organization dedicated to bridging academic finance with real-world market application.";

  const organizationJsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": ["Organization", "EducationalOrganization"],
    "@id": `${siteUrl}/#organization`,
    name: brandName,
    alternateName: settings.uclaName ?? "Bruin Alpha Investment at UCLA",
    url: siteUrl,
    logo: `${siteUrl}/brand/logo/png/on-white/BAI_full_on-white@2x.png`,
    description: orgDescription,
    parentOrganization: {
      "@type": "CollegeOrUniversity",
      name: "University of California, Los Angeles",
      sameAs: "https://www.ucla.edu",
    },
  };
  if (settings.clubEmail) {
    organizationJsonLd.email = settings.clubEmail;
  }
  if (settings.sameAs && settings.sameAs.length > 0) {
    organizationJsonLd.sameAs = settings.sameAs;
  }

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: brandName,
    description: orgDescription,
    publisher: { "@id": `${siteUrl}/#organization` },
    inLanguage: "en-US",
  };

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

        {/* JSON-LD schemas — only allowed dangerouslySetInnerHTML usage. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />

        {GA_MEASUREMENT_ID ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_MEASUREMENT_ID}');`}
            </Script>
          </>
        ) : null}

        <Analytics />
        <SpeedInsights />

        {isDraftMode ? (
          <>
            <VisualEditing />
            <SanityLive />
          </>
        ) : null}
      </body>
    </html>
  );
}
