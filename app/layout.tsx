import type { Metadata } from "next";
import { Fraunces, Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LenisProvider } from "./_components/lenis-provider";
import { GsapLenisBridge } from "./_components/gsap-lenis-bridge";
import { RouteChangeHandler } from "./_components/route-change-handler";
import { ReducedMotionGuard } from "./_components/reduced-motion-guard";

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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Bruin Alpha Investment at UCLA",
  description: "Bruin Alpha Investment is a student-led organization dedicated to bridging academic finance with real-world market application.",
  openGraph: {
    siteName: "Bruin Alpha Investment",
    locale: "en_US",
    type: "website",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Bruin Alpha Investment",
  url: siteUrl,
  logo: `${siteUrl}/brand/logo-full.svg`,
  description: metadata.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
        <LenisProvider>
          <GsapLenisBridge />
          <RouteChangeHandler />
          <ReducedMotionGuard />
          
          <main id="main-content" className="flex-grow flex flex-col">
            {children}
          </main>
        </LenisProvider>

        {/* Note: JSON-LD script is the one allowed exception for dangerouslySetInnerHTML */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}