import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const poppins = localFont({
  src: [
    {
      path: "../public/fonts/poppins-400.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/poppins-500.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/poppins-600.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/poppins-700.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-poppins",
  display: "swap",
});

const playfair = localFont({
  src: [
    {
      path: "../public/fonts/playfair-display-600.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/playfair-display-700.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "EventHub | Events start together",
  description: "One place for the people who plan, create, and bring every event to life.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
