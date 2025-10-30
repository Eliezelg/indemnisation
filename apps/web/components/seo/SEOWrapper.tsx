import { OrganizationSchema, ServiceSchema, WebsiteSchema, FAQSchema } from './StructuredData';
import HrefLangLinks from './HrefLangLinks';

interface SEOWrapperProps {
  locale: string;
  children: React.ReactNode;
  includeFAQ?: boolean;
  faqItems?: Array<{
    question: string;
    answer: string;
  }>;
}

/**
 * SEO Wrapper component that adds all necessary structured data and hreflang tags
 * Use this component to wrap your pages for optimal SEO
 */
export default function SEOWrapper({
  locale,
  children,
  includeFAQ = false,
  faqItems = [],
}: SEOWrapperProps) {
  return (
    <>
      {/* Structured Data - JSON-LD */}
      <OrganizationSchema locale={locale} />
      <ServiceSchema locale={locale} />
      <WebsiteSchema locale={locale} />
      {includeFAQ && faqItems.length > 0 && <FAQSchema faqs={faqItems} />}

      {/* hreflang tags for multilingual SEO */}
      <HrefLangLinks />

      {/* Page content */}
      {children}
    </>
  );
}
