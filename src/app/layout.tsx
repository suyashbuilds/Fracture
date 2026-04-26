import type { Metadata } from "next";
import { Instrument_Sans, DM_Serif_Display, DM_Mono } from "next/font/google";
import "./globals.css";

const instrumentSans = Instrument_Sans({ 
  subsets: ["latin"],
  variable: "--font-instrument", 
});

const dmSerifDisplay = DM_Serif_Display({ 
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dm-serif", 
});

const dmMono = DM_Mono({ 
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-dm-mono", 
});

export const metadata: Metadata = {
  title: "Fracture | Algorithmic Stress Testing",
  description: "SaaS algorithmic stress-testing dashboard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${instrumentSans.variable} ${dmSerifDisplay.variable} ${dmMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
