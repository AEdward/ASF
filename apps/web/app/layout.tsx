import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const SITE_URL = process.env.SITE_URL || "https://asf-agro.example.com";
const DESCRIPTION =
  "ASF Agro Industry — practical, scientific and reliable agro-processing solutions.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "ASF Agro Industry", template: "%s | ASF Agro Industry" },
  description: DESCRIPTION,
  icons: { icon: "/asf-logo.png" },
  openGraph: {
    title: "ASF Agro Industry",
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "ASF Agro Industry",
    images: ["/asf-logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
