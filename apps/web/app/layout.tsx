import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Indemnisation Vols - Réclamez jusqu'à 600€",
  description: "Plateforme de réclamation d'indemnisation pour vols retardés, annulés ou surbookés. Réglementations CE 261/2004 et loi israélienne.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
