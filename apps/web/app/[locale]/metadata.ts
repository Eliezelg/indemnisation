import { Metadata } from 'next';

export interface LocaleMetadata {
  title: string;
  description: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  twitterTitle: string;
  twitterDescription: string;
}

export const localeMetadata: Record<string, LocaleMetadata> = {
  en: {
    title: 'SkyLex - Claim Up To €600 for Delayed, Cancelled or Overbooked Flights',
    description:
      'Get flight compensation up to €600 for delayed, cancelled or denied boarding flights. Expert legal team. EU Regulation 261/2004 & Israeli law. 98% success rate. No win, no fee.',
    keywords: [
      'flight compensation',
      'delayed flight compensation',
      'cancelled flight compensation',
      'EU 261/2004',
      'flight delay claim',
      'airline compensation',
      'denied boarding compensation',
      'flight refund',
      'passenger rights',
      'air passenger compensation',
      'flight claim',
      'compensation claim',
      'Israeli aviation law',
      'flight disruption compensation',
      'missed connection compensation',
    ],
    ogTitle: 'SkyLex - Claim Up To €600 for Your Disrupted Flight',
    ogDescription:
      'Professional flight compensation service. Get up to €600 for delayed, cancelled or overbooked flights. No win, no fee guarantee. 98% success rate.',
    twitterTitle: 'SkyLex - Flight Compensation Experts',
    twitterDescription:
      'Claim up to €600 for your disrupted flight. Expert legal team, 98% success rate, no win no fee.',
  },
  fr: {
    title: 'SkyLex - Réclamez Jusqu\'à 600€ d\'Indemnisation pour Vol Retardé, Annulé ou Surbooké',
    description:
      'Obtenez jusqu\'à 600€ d\'indemnisation pour vos vols retardés, annulés ou en cas de refus d\'embarquement. Expertise juridique CE 261/2004 et loi israélienne. 98% de réussite. Pas de frais si échec.',
    keywords: [
      'indemnisation vol',
      'vol retardé indemnisation',
      'vol annulé indemnisation',
      'règlement CE 261/2004',
      'réclamation vol retardé',
      'compensation aérienne',
      'refus embarquement indemnisation',
      'remboursement vol',
      'droits des passagers aériens',
      'indemnisation passagers',
      'réclamation compagnie aérienne',
      'loi aviation israélienne',
      'perturbation vol indemnisation',
      'correspondance manquée indemnisation',
    ],
    ogTitle: 'SkyLex - Réclamez Jusqu\'à 600€ pour Votre Vol Perturbé',
    ogDescription:
      'Service professionnel d\'indemnisation de vols. Obtenez jusqu\'à 600€ pour vols retardés, annulés ou surbookés. Garantie sans frais si échec. 98% de réussite.',
    twitterTitle: 'SkyLex - Experts en Indemnisation de Vols',
    twitterDescription:
      'Réclamez jusqu\'à 600€ pour votre vol perturbé. Équipe juridique experte, 98% de réussite, sans frais si échec.',
  },
  he: {
    title: 'SkyLex - תבעו עד 600€ על טיסה מעוכבת, מבוטלת או סירוב עלייה למטוס',
    description:
      'קבלו עד 600€ פיצוי עבור טיסה מעוכבת, מבוטלת או סירוב עלייה למטוס. צוות משפטי מומחה. תקנה אירופאית 261/2004 וחוק ישראלי. 98% הצלחה. ללא עלות במקרה כשלון.',
    keywords: [
      'פיצוי טיסה',
      'פיצוי טיסה מעוכבת',
      'פיצוי טיסה מבוטלת',
      'תקנה 261/2004',
      'תביעת עיכוב טיסה',
      'פיצוי חברת תעופה',
      'פיצוי סירוב עלייה למטוס',
      'החזר טיסה',
      'זכויות נוסעים',
      'פיצוי נוסעי אוויר',
      'תביעת טיסה',
      'תביעת פיצוי',
      'חוק תעופה ישראלי',
      'פיצוי הפרעה בטיסה',
      'פיצוי החמצת טיסת המשך',
    ],
    ogTitle: 'SkyLex - תבעו עד 600€ עבור הטיסה המופרעת שלכם',
    ogDescription:
      'שירות מקצועי לפיצוי טיסות. קבלו עד 600€ עבור טיסות מעוכבות, מבוטלות או סירוב עלייה. ערבות ללא תשלום במקרה כשלון. 98% הצלחה.',
    twitterTitle: 'SkyLex - מומחים לפיצויי טיסות',
    twitterDescription:
      'תבעו עד 600€ עבור הטיסה המופרעת שלכם. צוות משפטי מומחה, 98% הצלחה, ללא עלות במקרה כשלון.',
  },
};

export function generateMetadata(locale: string): Metadata {
  const meta = localeMetadata[locale] || localeMetadata.en;
  const canonicalUrl = `https://skylex.com/${locale}`;
  const siteUrl = 'https://skylex.com';

  return {
    title: {
      default: meta.title,
      template: `%s | SkyLex`,
    },
    description: meta.description,
    keywords: meta.keywords,
    authors: [{ name: 'SkyLex', url: siteUrl }],
    creator: 'SkyLex',
    publisher: 'SkyLex',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: '/en',
        fr: '/fr',
        he: '/he',
        es: '/es',
      },
    },
    openGraph: {
      type: 'website',
      locale: locale,
      url: canonicalUrl,
      siteName: 'SkyLex',
      title: meta.ogTitle,
      description: meta.ogDescription,
      images: [
        {
          url: '/images/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'SkyLex - Flight Compensation Experts',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.twitterTitle,
      description: meta.twitterDescription,
      images: ['/images/twitter-image.jpg'],
      creator: '@skylex',
      site: '@skylex',
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: 'your-google-verification-code',
      yandex: 'your-yandex-verification-code',
      bing: 'your-bing-verification-code',
    },
    category: 'Travel',
  };
}
