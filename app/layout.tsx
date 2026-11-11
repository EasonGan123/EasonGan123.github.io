import type { Metadata, Viewport } from "next";
import { Inter_Tight, Instrument_Serif, Geist_Mono } from "next/font/google";
import "./globals.css";
import { site } from "@/content/site";
import MotionRoot from "@/components/MotionRoot";
import Preloader from "@/components/Preloader";
import SmoothScroll from "@/components/SmoothScroll";
import ParticleField from "@/components/ParticleField";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Cursor from "@/components/Cursor";

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["italic"],
  display: "swap",
  preload: false,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.meta.title, template: `%s | ${site.name}` },
  description: site.meta.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  keywords: ["Eason Gan", "UC Berkeley", "Haas", "Spieker", "Data Science", "Founder", "Pickup Games", "HandsOnExams"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: site.name,
    title: site.meta.title,
    description: site.meta.description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: site.meta.title,
    description: site.meta.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F4F2EE" },
    { media: "(prefers-color-scheme: dark)", color: "#0E0E0E" },
  ],
  width: "device-width",
  initialScale: 1,
};

// Runs before paint: theme (saved choice, else system) and preloader skip.
const bootScript = `(function(){try{var d=document.documentElement;var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}d.dataset.theme=t;if(sessionStorage.getItem('seen')||matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('seen')}}catch(e){}})();`;

const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  url: site.url,
  email: `mailto:${site.contact.email}`,
  jobTitle: "Founder",
  alumniOf: { "@type": "CollegeOrUniversity", name: "University of California, Berkeley" },
  sameAs: [site.contact.linkedin],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-theme="light"
      suppressHydrationWarning
      className={`${interTight.variable} ${instrumentSerif.variable} ${geistMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}.preloader{display:none!important}`}</style>
        </noscript>
      </head>
      {/* Extensions like Grammarly inject attributes on <body> before hydration. */}
      <body suppressHydrationWarning>
        <MotionRoot>
          <a
            href="#content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-bg"
          >
            Skip to content
          </a>
          <Preloader />
          <SmoothScroll />
          <ParticleField />
          <Nav />
          <main id="content" className="relative z-10">
            {children}
          </main>
          <Footer />
          <Cursor />
          <div className="grain" aria-hidden />
        </MotionRoot>
      </body>
    </html>
  );
}
