import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Joy / Reading",
  description: "A quiet, mobile reading companion for The Art of Joy.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "Joy / Reading",
    description: "A quiet, mobile reading companion for The Art of Joy.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Joy / Reading — The Art of Joy" }],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
