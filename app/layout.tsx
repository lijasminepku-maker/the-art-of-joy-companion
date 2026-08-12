import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Joy / Reading",
  description: "A quiet, mobile-first reading companion for The Art of Joy.",
  icons: { icon: "/favicon.svg" },
  manifest: "/manifest.json",
  openGraph: {
    title: "Joy / Reading",
    description: "A quiet, mobile-first reading companion for The Art of Joy.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Joy / Reading — The Art of Joy" }],
  },
};

function ServiceWorker() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js');
          }
        `,
      }}
    />
  );
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <head>
        <meta name="theme-color" content="#0d0d0d" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <ServiceWorker />
      </head>
      <body>{children}</body>
    </html>
  );
}
