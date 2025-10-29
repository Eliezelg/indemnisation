import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { getDirection, type Locale } from '@/i18n.config';
import ToastProvider from '@/components/toast/ToastProvider';
import "../globals.css";

// Premium fonts configuration
const inter = Inter({
  subsets: ["latin"],
  variable: '--font-body',
  display: 'swap',
});

const sora = Inter({
  subsets: ["latin"],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Indemnisation Vols - Réclamez jusqu'à 600€",
  description: "Plateforme de réclamation d'indemnisation pour vols retardés, annulés ou surbookés. Réglementations CE 261/2004 et loi israélienne.",
};

export default async function LocaleLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  // Await params in Next.js 15+
  const { locale } = await params;

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();
  const direction = getDirection(locale as Locale);

  return (
    <html lang={locale} dir={direction}>
      <body className={`${inter.variable} ${sora.variable} ${jetbrainsMono.variable} font-body antialiased`}>
        <NextIntlClientProvider messages={messages}>
          {children}
          <ToastProvider />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
