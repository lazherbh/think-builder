import type { Metadata } from "next";
import { Fredoka, Nunito } from "next/font/google";
import "./globals.css";

const heading = Fredoka({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading-raw",
});

const body = Nunito({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body-raw",
});

export const metadata: Metadata = {
  title: "Think Builder — AI App & Website Generator",
  description: "Describe any app or website in plain language, and AI builds it instantly. No coding required.",
  openGraph: {
    title: "Think Builder",
    description: "Describe any app or website — AI builds it instantly.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Think Builder",
    description: "Describe any app or website — AI builds it instantly.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${heading.variable} ${body.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
