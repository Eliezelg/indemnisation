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
type ClaimStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'IN_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'PAID'
  | 'CANCELLED';

interface ClaimStatusEmailProps {
  firstName: string;
  lastName: string;
  claimId: string;
  claimNumber: string;
  flightNumber: string;
  status: ClaimStatus;
  statusMessage?: string;
  locale: Locale;
}

const content = {
  fr: {
    preview: (status: ClaimStatus) =>
      `Mise à jour de votre réclamation ${status}`,
    greeting: (firstName: string) => `Bonjour ${firstName},`,
    title: 'Mise à jour de votre réclamation',
    intro: (claimNumber: string) =>
      `Votre réclamation ${claimNumber} a été mise à jour.`,
    statusLabel: 'Nouveau statut',
    statuses: {
      DRAFT: 'Brouillon',
      SUBMITTED: 'Soumise',
      IN_REVIEW: 'En cours d\'examen',
      APPROVED: 'Approuvée',
      REJECTED: 'Rejetée',
      PAID: 'Payée',
      CANCELLED: 'Annulée',
    },
    messages: {
      SUBMITTED:
        'Nous avons bien reçu votre réclamation. Notre équipe va l\'examiner dans les prochaines 48-72 heures.',
      IN_REVIEW:
        'Votre réclamation est actuellement en cours d\'examen par notre équipe. Nous vous tiendrons informé de l\'avancement.',
      APPROVED:
        '🎉 Bonne nouvelle ! Votre réclamation a été approuvée. Le paiement sera effectué sous 7-10 jours ouvrables.',
      REJECTED:
        'Malheureusement, votre réclamation a été rejetée. Vous trouverez plus de détails dans votre espace personnel.',
      PAID:
        '✅ Le paiement de votre compensation a été effectué avec succès. Vous devriez le recevoir sous 3-5 jours ouvrables.',
      CANCELLED:
        'Votre réclamation a été annulée comme demandé.',
    },
    flight: 'Vol',
    cta: 'Voir ma réclamation',
    dashboard: 'Tableau de bord',
    help: 'Si vous avez des questions, n\'hésitez pas à nous contacter.',
    thanks: 'Cordialement,',
    team: 'L\'équipe Indemnisation Vols',
  },
  he: {
    preview: (status: ClaimStatus) => `עדכון התביעה שלך ${status}`,
    greeting: (firstName: string) => `שלום ${firstName},`,
    title: 'עדכון התביעה שלך',
    intro: (claimNumber: string) => `התביעה שלך ${claimNumber} עודכנה.`,
    statusLabel: 'סטטוס חדש',
    statuses: {
      DRAFT: 'טיוטה',
      SUBMITTED: 'הוגשה',
      IN_REVIEW: 'בבדיקה',
      APPROVED: 'אושרה',
      REJECTED: 'נדחתה',
      PAID: 'שולמה',
      CANCELLED: 'בוטלה',
    },
    messages: {
      SUBMITTED:
        'קיבלנו את התביעה שלך. הצוות שלנו יבדוק אותה ב-48-72 השעות הקרובות.',
      IN_REVIEW:
        'התביעה שלך נמצאת כעת בבדיקה על ידי הצוות שלנו. נעדכן אותך על ההתקדמות.',
      APPROVED:
        '🎉 חדשות טובות! התביעה שלך אושרה. התשלום יבוצע תוך 7-10 ימי עסקים.',
      REJECTED:
        'לצערנו, התביעה שלך נדחתה. תמצא פרטים נוספים באזור האישי שלך.',
      PAID:
        '✅ תשלום הפיצוי שלך בוצע בהצלחה. אתה אמור לקבל אותו תוך 3-5 ימי עסקים.',
      CANCELLED: 'התביעה שלך בוטלה לפי בקשתך.',
    },
    flight: 'טיסה',
    cta: 'צפה בתביעה שלי',
    dashboard: 'לוח בקרה',
    help: 'אם יש לך שאלות, אל תהסס לפנות אלינו.',
    thanks: 'בברכה,',
    team: 'צוות פיצויי טיסות',
  },
  en: {
    preview: (status: ClaimStatus) => `Your claim update ${status}`,
    greeting: (firstName: string) => `Hello ${firstName},`,
    title: 'Your claim has been updated',
    intro: (claimNumber: string) => `Your claim ${claimNumber} has been updated.`,
    statusLabel: 'New status',
    statuses: {
      DRAFT: 'Draft',
      SUBMITTED: 'Submitted',
      IN_REVIEW: 'Under review',
      APPROVED: 'Approved',
      REJECTED: 'Rejected',
      PAID: 'Paid',
      CANCELLED: 'Cancelled',
    },
    messages: {
      SUBMITTED:
        'We have received your claim. Our team will review it within the next 48-72 hours.',
      IN_REVIEW:
        'Your claim is currently under review by our team. We will keep you informed of the progress.',
      APPROVED:
        '🎉 Good news! Your claim has been approved. Payment will be made within 7-10 business days.',
      REJECTED:
        'Unfortunately, your claim has been rejected. You will find more details in your personal area.',
      PAID:
        '✅ Payment of your compensation has been made successfully. You should receive it within 3-5 business days.',
      CANCELLED: 'Your claim has been cancelled as requested.',
    },
    flight: 'Flight',
    cta: 'View my claim',
    dashboard: 'Dashboard',
    help: 'If you have any questions, don\'t hesitate to contact us.',
    thanks: 'Best regards,',
    team: 'The Flight Compensation Team',
  },
};

const statusColors: Record<ClaimStatus, string> = {
  DRAFT: '#6b7280',
  SUBMITTED: '#3b82f6',
  IN_REVIEW: '#f59e0b',
  APPROVED: '#10b981',
  REJECTED: '#ef4444',
  PAID: '#059669',
  CANCELLED: '#6b7280',
};

export const ClaimStatusEmail = ({
  firstName = 'John',
  lastName = 'Doe',
  claimId = 'clm_123',
  claimNumber = 'CLM-2025-000001',
  flightNumber = 'AF1234',
  status = 'SUBMITTED',
  statusMessage,
  locale = 'fr',
}: ClaimStatusEmailProps) => {
  const t = content[locale];
  const isRTL = locale === 'he';
  const statusColor = statusColors[status];

  return (
    <Html dir={isRTL ? 'rtl' : 'ltr'} lang={locale}>
      <Head />
      <Preview>{t.preview(status)}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={heading}>{t.title}</Text>
          </Section>
          <Section style={contentSection}>
            <Text style={paragraph}>{t.greeting(firstName)}</Text>
            <Text style={paragraph}>{t.intro(claimNumber)}</Text>

            <Section style={infoBox}>
              <Text style={infoLabel}>{t.statusLabel}</Text>
              <Text style={{ ...statusBadge, backgroundColor: statusColor }}>
                {t.statuses[status]}
              </Text>

              <Text style={infoLabel}>{t.flight}</Text>
              <Text style={infoValue}>{flightNumber}</Text>
            </Section>

            <Section
              style={{
                ...messageBox,
                borderLeftColor: statusColor,
              }}
            >
              <Text style={messageText}>
                {statusMessage || t.messages[status] || ''}
              </Text>
            </Section>

            <Button
              style={button}
              href={`${process.env.FRONTEND_URL || 'http://localhost:3000'}/${locale}/claims/${claimId}`}
            >
              {t.cta}
            </Button>

            <Hr style={hr} />

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

export default ClaimStatusEmail;

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

const statusBadge = {
  display: 'inline-block',
  padding: '6px 12px',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: 'bold',
  marginTop: '4px',
  marginBottom: '0',
};

const messageBox = {
  backgroundColor: '#f9fafb',
  borderLeft: '4px solid',
  padding: '16px',
  marginTop: '20px',
  marginBottom: '20px',
};

const messageText = {
  fontSize: '16px',
  color: '#1f2937',
  marginTop: '0',
  marginBottom: '0',
  lineHeight: '24px',
};
