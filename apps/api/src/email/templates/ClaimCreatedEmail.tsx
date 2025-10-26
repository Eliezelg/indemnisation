import * as React from 'react';
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Button,
  Hr,
} from '@react-email/components';

type Locale = 'fr' | 'he' | 'en';

interface ClaimCreatedEmailProps {
  firstName: string;
  lastName: string;
  claimId: string;
  claimNumber: string;
  flightNumber: string;
  departureAirport: string;
  arrivalAirport: string;
  recommendedAmount: number;
  currency: string;
  locale: Locale;
}

const content = {
  fr: {
    preview: 'Votre réclamation a été créée avec succès',
    greeting: (firstName: string) => `Bonjour ${firstName},`,
    title: 'Réclamation créée avec succès !',
    intro: 'Votre réclamation a été enregistrée dans notre système. Voici un récapitulatif :',
    claimNumber: 'Numéro de réclamation',
    flight: 'Vol',
    route: (departure: string, arrival: string) => `${departure} → ${arrival}`,
    compensation: 'Compensation recommandée',
    nextSteps: 'Prochaines étapes',
    step1: '📋 Vérifiez les détails de votre réclamation',
    step2: '📎 Ajoutez les documents justificatifs (si disponibles)',
    step3: '✅ Soumettez votre réclamation pour examen',
    step4: '⏱️ Nous traitons votre dossier sous 48-72h',
    cta: 'Voir ma réclamation',
    dashboard: 'Tableau de bord',
    important: 'Important',
    importantText:
      'N\'oubliez pas de soumettre votre réclamation une fois tous les détails vérifiés. Les réclamations en brouillon ne sont pas traitées.',
    help: 'Si vous avez des questions, n\'hésitez pas à nous contacter.',
    thanks: 'À bientôt,',
    team: 'L\'équipe Indemnisation Vols',
  },
  he: {
    preview: 'התביעה שלך נוצרה בהצלחה',
    greeting: (firstName: string) => `שלום ${firstName},`,
    title: 'התביעה נוצרה בהצלחה!',
    intro: 'התביעה שלך נרשמה במערכת שלנו. הנה סיכום:',
    claimNumber: 'מספר תביעה',
    flight: 'טיסה',
    route: (departure: string, arrival: string) => `${departure} ← ${arrival}`,
    compensation: 'פיצוי מומלץ',
    nextSteps: 'השלבים הבאים',
    step1: '📋 בדוק את פרטי התביעה שלך',
    step2: '📎 הוסף מסמכים תומכים (אם זמינים)',
    step3: '✅ הגש את התביעה שלך לבדיקה',
    step4: '⏱️ אנו מעבדים את התיק שלך תוך 48-72 שעות',
    cta: 'צפה בתביעה שלי',
    dashboard: 'לוח בקרה',
    important: 'חשוב',
    importantText:
      'אל תשכח להגיש את התביעה שלך לאחר אימות כל הפרטים. תביעות טיוטה אינן מעובדות.',
    help: 'אם יש לך שאלות, אל תהסס לפנות אלינו.',
    thanks: 'להתראות,',
    team: 'צוות פיצויי טיסות',
  },
  en: {
    preview: 'Your claim has been created successfully',
    greeting: (firstName: string) => `Hello ${firstName},`,
    title: 'Claim created successfully!',
    intro: 'Your claim has been registered in our system. Here is a summary:',
    claimNumber: 'Claim number',
    flight: 'Flight',
    route: (departure: string, arrival: string) => `${departure} → ${arrival}`,
    compensation: 'Recommended compensation',
    nextSteps: 'Next steps',
    step1: '📋 Review your claim details',
    step2: '📎 Add supporting documents (if available)',
    step3: '✅ Submit your claim for review',
    step4: '⏱️ We process your case within 48-72h',
    cta: 'View my claim',
    dashboard: 'Dashboard',
    important: 'Important',
    importantText:
      'Don\'t forget to submit your claim once all details are verified. Draft claims are not processed.',
    help: 'If you have any questions, don\'t hesitate to contact us.',
    thanks: 'See you soon,',
    team: 'The Flight Compensation Team',
  },
};

export const ClaimCreatedEmail = ({
  firstName = 'John',
  lastName = 'Doe',
  claimId = 'clm_123',
  claimNumber = 'CLM-2025-000001',
  flightNumber = 'AF1234',
  departureAirport = 'CDG',
  arrivalAirport = 'TLV',
  recommendedAmount = 400,
  currency = '€',
  locale = 'fr',
}: ClaimCreatedEmailProps) => {
  const t = content[locale];
  const isRTL = locale === 'he';

  return (
    <Html dir={isRTL ? 'rtl' : 'ltr'} lang={locale}>
      <Head />
      <Preview>{t.preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={heading}>{t.title}</Text>
          </Section>
          <Section style={contentSection}>
            <Text style={paragraph}>{t.greeting(firstName)}</Text>
            <Text style={paragraph}>{t.intro}</Text>

            <Section style={infoBox}>
              <Text style={infoLabel}>{t.claimNumber}</Text>
              <Text style={infoValue}>{claimNumber}</Text>

              <Text style={infoLabel}>{t.flight}</Text>
              <Text style={infoValue}>
                {flightNumber} - {t.route(departureAirport, arrivalAirport)}
              </Text>

              <Text style={infoLabel}>{t.compensation}</Text>
              <Text style={compensationAmount}>
                {currency}{recommendedAmount}
              </Text>
            </Section>

            <Hr style={hr} />

            <Text style={subheading}>{t.nextSteps}</Text>
            <Text style={paragraph}>{t.step1}</Text>
            <Text style={paragraph}>{t.step2}</Text>
            <Text style={paragraph}>{t.step3}</Text>
            <Text style={paragraph}>{t.step4}</Text>

            <Button
              style={button}
              href={`${process.env.FRONTEND_URL || 'http://localhost:3000'}/${locale}/claims/${claimId}`}
            >
              {t.cta}
            </Button>

            <Hr style={hr} />

            <Section style={warningBox}>
              <Text style={warningTitle}>{t.important}</Text>
              <Text style={warningText}>{t.importantText}</Text>
            </Section>

            <Text style={paragraph}>{t.help}</Text>
            <Text style={paragraph}>
              {t.thanks}
              <br />
              {t.team}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default ClaimCreatedEmail;

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const header = {
  backgroundColor: '#2563eb',
  padding: '24px',
  textAlign: 'center' as const,
};

const heading = {
  fontSize: '28px',
  fontWeight: 'bold',
  color: '#ffffff',
  margin: '0',
};

const contentSection = {
  padding: '0 48px',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#374151',
  marginBottom: '12px',
};

const subheading = {
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#1f2937',
  marginTop: '24px',
  marginBottom: '16px',
};

const button = {
  backgroundColor: '#2563eb',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px 24px',
  margin: '24px 0',
};

const hr = {
  borderColor: '#e5e7eb',
  margin: '24px 0',
};

const infoBox = {
  backgroundColor: '#f3f4f6',
  borderRadius: '8px',
  padding: '20px',
  marginTop: '20px',
  marginBottom: '20px',
};

const infoLabel = {
  fontSize: '14px',
  color: '#6b7280',
  marginBottom: '4px',
  marginTop: '12px',
  fontWeight: '500',
};

const infoValue = {
  fontSize: '16px',
  color: '#1f2937',
  marginTop: '0',
  marginBottom: '0',
  fontWeight: '600',
};

const compensationAmount = {
  fontSize: '24px',
  color: '#059669',
  marginTop: '0',
  marginBottom: '0',
  fontWeight: 'bold',
};

const warningBox = {
  backgroundColor: '#fef3c7',
  borderLeft: '4px solid #f59e0b',
  padding: '16px',
  marginTop: '20px',
  marginBottom: '20px',
};

const warningTitle = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#92400e',
  marginTop: '0',
  marginBottom: '8px',
};

const warningText = {
  fontSize: '14px',
  color: '#78350f',
  marginTop: '0',
  marginBottom: '0',
  lineHeight: '20px',
};
