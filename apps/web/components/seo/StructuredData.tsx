import Script from 'next/script';

interface OrganizationSchemaProps {
  locale: string;
}

export function OrganizationSchema({ locale }: OrganizationSchemaProps) {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    '@id': 'https://skylex.com/#organization',
    name: 'SkyLex',
    alternateName: 'SkyLex Flight Compensation',
    url: 'https://skylex.com',
    logo: 'https://skylex.com/images/logo.png',
    description:
      locale === 'fr'
        ? "Service professionnel d'indemnisation pour vols retardés, annulés ou surbookés. Expert en réglementation CE 261/2004 et loi israélienne."
        : locale === 'he'
        ? 'שירות מקצועי לפיצויי טיסות מעוכבות, מבוטלות או סירוב עלייה. מומחים בתקנה אירופאית 261/2004 וחוק ישראלי.'
        : 'Professional flight compensation service for delayed, cancelled or overbooked flights. Expert in EU Regulation 261/2004 and Israeli law.',
    sameAs: [
      'https://www.facebook.com/skylex',
      'https://www.twitter.com/skylex',
      'https://www.linkedin.com/company/skylex',
      'https://www.instagram.com/skylex',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+33-1-234-5678',
      contactType: 'customer service',
      availableLanguage: ['English', 'French', 'Hebrew', 'Spanish'],
      areaServed: ['EU', 'IL', 'Worldwide'],
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'FR',
      addressLocality: 'Paris',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '12487',
      bestRating: '5',
      worstRating: '1',
    },
    priceRange: '€€',
  };

  return (
    <Script
      id="organization-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
    />
  );
}

interface ServiceSchemaProps {
  locale: string;
}

export function ServiceSchema({ locale }: ServiceSchemaProps) {
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': 'https://skylex.com/#service',
    serviceType: 'Flight Compensation Service',
    provider: {
      '@id': 'https://skylex.com/#organization',
    },
    name:
      locale === 'fr'
        ? 'Service d\'Indemnisation de Vols'
        : locale === 'he'
        ? 'שירות פיצויי טיסות'
        : 'Flight Compensation Service',
    description:
      locale === 'fr'
        ? 'Réclamez jusqu\'à 600€ d\'indemnisation pour vos vols retardés, annulés ou en cas de refus d\'embarquement selon la réglementation CE 261/2004 et la loi israélienne.'
        : locale === 'he'
        ? 'תבעו עד 600€ פיצוי עבור טיסות מעוכבות, מבוטלות או סירוב עלייה למטוס לפי תקנה 261/2004 והחוק הישראלי.'
        : 'Claim up to €600 compensation for delayed, cancelled or denied boarding flights under EU Regulation 261/2004 and Israeli law.',
    areaServed: [
      {
        '@type': 'Place',
        name: 'European Union',
      },
      {
        '@type': 'Place',
        name: 'Israel',
      },
      {
        '@type': 'Place',
        name: 'Worldwide',
      },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Flight Compensation Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name:
              locale === 'fr'
                ? 'Indemnisation Vol Retardé'
                : locale === 'he'
                ? 'פיצוי טיסה מעוכבת'
                : 'Delayed Flight Compensation',
            description:
              locale === 'fr'
                ? 'Réclamation pour vol retardé de plus de 3 heures'
                : locale === 'he'
                ? 'תביעה עבור טיסה מעוכבת למעלה מ-3 שעות'
                : 'Claim for flights delayed more than 3 hours',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name:
              locale === 'fr'
                ? 'Indemnisation Vol Annulé'
                : locale === 'he'
                ? 'פיצוי טיסה מבוטלת'
                : 'Cancelled Flight Compensation',
            description:
              locale === 'fr'
                ? 'Réclamation pour vol annulé par la compagnie aérienne'
                : locale === 'he'
                ? 'תביעה עבור טיסה שבוטלה על ידי חברת התעופה'
                : 'Claim for flights cancelled by the airline',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name:
              locale === 'fr'
                ? 'Indemnisation Refus d\'Embarquement'
                : locale === 'he'
                ? 'פיצוי סירוב עלייה למטוס'
                : 'Denied Boarding Compensation',
            description:
              locale === 'fr'
                ? 'Réclamation pour refus d\'embarquement (surbooking)'
                : locale === 'he'
                ? 'תביעה עבור סירוב עלייה למטוס (הזמנת יתר)'
                : 'Claim for denied boarding (overbooking)',
          },
        },
      ],
    },
    termsOfService: 'https://skylex.com/terms',
    offers: {
      '@type': 'Offer',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: '0',
        priceCurrency: 'EUR',
        name:
          locale === 'fr'
            ? 'Sans frais en cas d\'échec'
            : locale === 'he'
            ? 'ללא עלות במקרה כשלון'
            : 'No win, no fee',
      },
    },
  };

  return (
    <Script
      id="service-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
    />
  );
}

interface BreadcrumbSchemaProps {
  items: Array<{
    name: string;
    url: string;
  }>;
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <Script
      id="breadcrumb-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
    />
  );
}

interface FAQSchemaProps {
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

export function FAQSchema({ faqs }: FAQSchemaProps) {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <Script
      id="faq-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
    />
  );
}

interface WebsiteSchemaProps {
  locale: string;
}

export function WebsiteSchema({ locale }: WebsiteSchemaProps) {
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://skylex.com/#website',
    url: 'https://skylex.com',
    name: 'SkyLex',
    description:
      locale === 'fr'
        ? 'Plateforme de réclamation d\'indemnisation pour vols perturbés'
        : locale === 'he'
        ? 'פלטפורמה לתביעות פיצויי טיסות מופרעות'
        : 'Flight compensation claim platform',
    publisher: {
      '@id': 'https://skylex.com/#organization',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://skylex.com/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
    inLanguage: ['en', 'fr', 'he', 'es'],
  };

  return (
    <Script
      id="website-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
    />
  );
}
