import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SiteFooter, SiteHeader } from "@/components/site-shell"
import { JsonLd } from "@/components/content"
import "./globals.css"

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" })

export const metadata: Metadata = {
  metadataBase: new URL("https://www.careomat.co.uk"),
  title: { default: "Careomat | UK Software Development & Consultancy", template: "%s | Careomat" },
  description: "Careomat is a UK software development consultancy helping organisations plan, build and modernise dependable digital services.",
  keywords: ["UK software development company", "software consultancy UK", "custom software development", "digital service consultancy", "legacy software modernisation"],
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "en_GB", siteName: "Careomat", title: "Careomat | Thoughtful software, responsibly delivered", description: "UK-wide software consultancy for custom development, modernisation and technical decision-making.", url: "/" },
  twitter: { card: "summary_large_image", title: "Careomat | UK Software Consultancy", description: "Thoughtful software, clear evidence and responsible delivery." },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = { themeColor: "#ffffff", colorScheme: "light", width: "device-width", initialScale: 1 }

const organisation = {
  "@context": "https://schema.org",
  "@type": ["Organization", "ProfessionalService"],
  name: "Careomat",
  url: "https://www.careomat.co.uk",
  email: "hello@careomat.co.uk",
  areaServed: { "@type": "Country", name: "United Kingdom" },
  description: "UK software development and technical consultancy specialising in custom digital services, modernisation and delivery assurance.",
  knowsAbout: ["Custom software development", "Technical consultancy", "Digital service design", "Legacy modernisation", "Software delivery assurance"],
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en-GB" className={`light bg-background ${geist.variable} ${geistMono.variable}`}><body><a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:rounded-md focus:bg-background focus:px-4 focus:py-2">Skip to content</a><JsonLd data={organisation} /><SiteHeader /><main id="main-content">{children}</main><SiteFooter />{process.env.NODE_ENV === "production" && <Analytics />}</body></html>
}
