import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Vintract — Industry 4.0 for the Indian factory",
  description:
    "Live material tracking, BOM-driven production planning, and AI built into every line of code. Industry 4.0 SaaS for Indian manufacturers.",
  openGraph: {
    title: "Vintract — Industry 4.0 for the Indian factory",
    description: "Where the shop floor becomes a real-time, intelligent system.",
    url: "https://vintract.com",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable}`}>
      <body>
        <div className="scan-line" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
