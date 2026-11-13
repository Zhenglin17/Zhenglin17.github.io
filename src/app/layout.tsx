import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { ViewTransition } from "react";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const calSans = localFont({
  src: "../../public/fonts/CalSans-SemiBold.ttf",
  variable: "--font-calsans",
});

const SITE_DESCRIPTION =
  "Zhenglin (Greyson) Zhang: robotics and 3D vision by training, now building LLM systems, data tools and full-stack software.";

export const metadata: Metadata = {
  title: {
    default: "Zhenglin (Greyson) Zhang",
    template: "%s | Zhenglin (Greyson) Zhang",
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    title: "Zhenglin (Greyson) Zhang",
    description: SITE_DESCRIPTION,
    siteName: "Zhenglin (Greyson) Zhang",
    locale: "en-US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${calSans.variable}`}>
      <body className="antialiased">
        <ViewTransition>{children}</ViewTransition>
      </body>
    </html>
  );
}
