import { SiteHeader } from "@/app/_components/site-header";
import { SiteFooter } from "@/app/_components/site-footer";
import { LenisProvider } from "@/app/_components/lenis-provider";
import { GsapLenisBridge } from "@/app/_components/gsap-lenis-bridge";
import { RouteChangeHandler } from "@/app/_components/route-change-handler";
import { ReducedMotionGuard } from "@/app/_components/reduced-motion-guard";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LenisProvider>
      <GsapLenisBridge />
      <RouteChangeHandler />
      <ReducedMotionGuard />
      <SiteHeader />
      <main id="main-content" className="min-h-screen">
        {children}
      </main>
      <SiteFooter />
    </LenisProvider>
  );
}
