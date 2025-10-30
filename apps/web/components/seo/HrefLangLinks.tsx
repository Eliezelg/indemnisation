'use client';

import { usePathname } from 'next/navigation';

interface HrefLangLinksProps {
  locales?: string[];
  baseUrl?: string;
}

/**
 * Component that generates hreflang tags for multilingual SEO
 * Helps search engines understand the language versions of a page
 */
export default function HrefLangLinks({
  locales = ['en', 'fr', 'he', 'es'],
  baseUrl = 'https://skylex.com',
}: HrefLangLinksProps) {
  const pathname = usePathname();

  // Extract the current path without the locale
  const getPathWithoutLocale = (path: string) => {
    const segments = path.split('/').filter(Boolean);
    if (segments.length === 0) return '';
    // Remove locale from path if it exists
    if (locales.includes(segments[0])) {
      return '/' + segments.slice(1).join('/');
    }
    return path;
  };

  const pathWithoutLocale = getPathWithoutLocale(pathname);

  return (
    <>
      {/* x-default for users whose language preferences don't match any of the available languages */}
      <link
        rel="alternate"
        hrefLang="x-default"
        href={`${baseUrl}/en${pathWithoutLocale}`}
      />

      {/* Generate hreflang for each locale */}
      {locales.map((locale) => (
        <link
          key={locale}
          rel="alternate"
          hrefLang={locale}
          href={`${baseUrl}/${locale}${pathWithoutLocale}`}
        />
      ))}
    </>
  );
}
