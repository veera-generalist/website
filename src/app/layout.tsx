import { GoogleTagManager } from "@next/third-parties/google";
import type { Metadata, Viewport } from "next";
import { Space_Grotesk } from "next/font/google";
import localFont from "next/font/local";
import { Toaster } from "sonner";
import { CrispChat } from "@/components/crisp-chat";
import { MotionProvider } from "@/components/providers/motion-provider";
import { PostHogProvider } from "@/components/providers/posthog-provider";
import { profile } from "@/data/profile";
import { siteUrl } from "@/lib/utils";
import "./globals.css";

const sans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-sans",
  weight: "100 900",
});

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${profile.name} — ${profile.jobTitle}`,
    template: `%s · ${profile.name}`,
  },
  description: profile.shortBio,
  authors: [{ name: profile.name, url: siteUrl }],
  creator: profile.name,
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": "/feed.xml",
      "text/plain": "/llms.txt",
    },
  },
  openGraph: {
    type: "website",
    siteName: profile.name,
    locale: "en_US",
    url: "/",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#16213A",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`}>
      {gtmId && <GoogleTagManager gtmId={gtmId} />}
      <body className="overscroll-none">
        <PostHogProvider>
          <MotionProvider>{children}</MotionProvider>
        </PostHogProvider>
        <Toaster position="bottom-center" richColors />
        <CrispChat />
      </body>
    </html>
  );
}
