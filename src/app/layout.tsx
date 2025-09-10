import { DM_Sans } from "next/font/google";
import "./globals.css";
import { Metadata } from "next";

const dmSans = DM_Sans({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-dmSans",
});

export const metadata: Metadata = {
  title: "HITE EQ",
  description: "Measure the Immeasurable",
  manifest: "/manifest.webmanifest",
  themeColor: "#0f172a",
  icons: { icon: "/icons/icon-192.png", apple: "/icons/icon-192.png" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={`${dmSans.variable} antialiased`}>{children}</body>
    </html>
  );
}
