import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EventHub | Discover Great Events",
  description: "Browse trending events, festivals, workshops, and social experiences in one place.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#f5f7fb]">{children}</body>
    </html>
  );
}
