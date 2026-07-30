import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { BasketProvider } from "@/components/basket/BasketProvider";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Shop Africana & Pride of Scotland | Dundee",
  description:
    "A combined Dundee website for Shop Africana Afro-Caribbean groceries and Pride of Scotland African and Asian restaurant.",
  applicationName: "Shop Africana and Pride of Scotland",
  keywords: [
    "Shop Africana",
    "Pride of Scotland",
    "Dundee grocery",
    "Afro-Caribbean grocery",
    "African restaurant Dundee",
    "Asian restaurant Dundee",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <BasketProvider>{children}</BasketProvider>
      </body>
    </html>
  );
}
