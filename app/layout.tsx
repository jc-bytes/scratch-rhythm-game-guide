import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

const title = "Build a 4-Lane Rhythm Game in Scratch";
const description = "A complete step-by-step student guide for building a four-lane Scratch rhythm game with D, F, J, and K controls.";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = (requestHeaders.get("x-forwarded-host") || requestHeaders.get("host") || "localhost:3000").split(",")[0].trim();
  const protocol = (requestHeaders.get("x-forwarded-proto") || (host.startsWith("localhost") ? "http" : "https")).split(",")[0].trim();

  return {
    metadataBase: new URL(`${protocol}://${host}`),
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: "/og.png", width: 1536, height: 1024, alt: "Build a 4-lane rhythm game with D, F, J, and K controls" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og.png"],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
