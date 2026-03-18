import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter } from "next/font/google";
import "./globals.css";

// Force dynamic rendering for Supabase compatibility
export const dynamic = "force-dynamic";

const impactFont = localFont({
  src: "./fonts/impact.ttf",
  variable: "--font-impact",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport = {
  themeColor: "#000000",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Shadow Basketball | Saskatoon Youth Basketball",
    template: "%s | Shadow Basketball",
  },
  description: "Saskatoon's premier youth basketball club, dedicated to developing elite athletes through world-class training and provincial competition.",
  keywords: ["basketball", "youth basketball", "Saskatoon", "Shadow Basketball", "club basketball", "training", "tryouts", "athletes"],
  openGraph: {
    title: "Shadow Basketball | Saskatoon Youth Basketball",
    description: "Saskatoon's premier youth basketball club, dedicated to developing elite athletes through world-class training.",
    url: "/",
    siteName: "Shadow Basketball",
    locale: "en_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shadow Basketball | Saskatoon Youth Basketball",
    description: "Saskatoon's premier youth basketball club, dedicated to developing elite athletes.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${impactFont.variable} ${inter.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
