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

interface VerifyEmailProps {
  firstName: string;
  lastName: string;
  verificationToken: string;
  locale: Locale;
}

const content = {
  fr: {
    preview: 'Vérifiez votre adresse email',
    greeting: (firstName: string) => `Bonjour ${firstName},`,
    title: 'Vérifiez votre adresse email',
    intro:
      'Merci de vous être inscrit sur Indemnisation Vols ! Pour terminer la création de votre compte, veuillez vérifier votre adresse email.',
    instructions:
      'Cliquez sur le bouton ci-dessous pour confirmer votre adresse email :',
    cta: 'Vérifier mon email',
    alternative: 'Ou copiez et collez ce lien dans votre navigateur :',
    expiry: 'Ce lien expirera dans 24 heures.',
    noRequest:
      'Si vous n\'avez pas créé de compte sur notre plateforme, vous pouvez ignorer cet email en toute sécurité.',
    help: 'Si vous rencontrez des difficultés, n\'hésitez pas à nous contacter.',
    thanks: 'Cordialement,',
    team: 'L\'équipe Indemnisation Vols',
  },
  he: {
    preview: 'אמת את כתובת הדוא"ל שלך',
    greeting: (firstName: string) => `שלום ${firstName},`,
    title: 'אמת את כתובת הדוא"ל שלך',
    intro:
      'תודה שנרשמת לפיצויי טיסות! כדי להשלים את יצירת החשבון שלך, אנא אמת את כתובת הדוא"ל שלך.',
    instructions: 'לחץ על הכפתור למטה כדי לאשר את כתובת הדוא"ל שלך:',
    cta: 'אמת את הדוא"ל שלי',
    alternative: 'או העתק והדבק את הקישור הזה בדפדפן שלך:',
    expiry: 'קישור זה יפוג בעוד 24 שעות.',
    noRequest:
      'אם לא יצרת חשבון בפלטפורמה שלנו, אתה יכול להתעלם מהמייל הזה בבטחה.',
    help: 'אם אתה נתקל בקשיים, אל תהסס לפנות אלינו.',
    thanks: 'בברכה,',
    team: 'צוות פיצויי טיסות',
  },
  en: {
    preview: 'Verify your email address',
    greeting: (firstName: string) => `Hello ${firstName},`,
    title: 'Verify your email address',
    intro:
      'Thank you for signing up for Flight Compensation! To complete the creation of your account, please verify your email address.',
    instructions: 'Click the button below to confirm your email address:',
    cta: 'Verify my email',
    alternative: 'Or copy and paste this link into your browser:',
    expiry: 'This link will expire in 24 hours.',
    noRequest:
      'If you did not create an account on our platform, you can safely ignore this email.',
    help: 'If you encounter any difficulties, don\'t hesitate to contact us.',
    thanks: 'Best regards,',
    team: 'The Flight Compensation Team',
  },
};

export const VerifyEmail = ({
  firstName = 'John',
  lastName = 'Doe',
  verificationToken = 'abc123xyz',
  locale = 'fr',
}: VerifyEmailProps) => {
  const t = content[locale];
  const isRTL = locale === 'he';
  const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/${locale}/verify-email?token=${verificationToken}`;

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

            <Hr style={hr} />

            <Text style={paragraph}>{t.instructions}</Text>

            <Button style={button} href={verificationUrl}>
              {t.cta}
            </Button>

            <Hr style={hr} />

            <Text style={alternativeLabel}>{t.alternative}</Text>
            <Text style={linkText}>{verificationUrl}</Text>

            <Section style={warningBox}>
              <Text style={warningText}>{t.expiry}</Text>
            </Section>

            <Text style={paragraph}>{t.noRequest}</Text>

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

export default VerifyEmail;

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

const alternativeLabel = {
  fontSize: '14px',
  color: '#6b7280',
  marginBottom: '8px',
};

const linkText = {
  fontSize: '12px',
  color: '#2563eb',
  wordBreak: 'break-all' as const,
  padding: '12px',
  backgroundColor: '#f3f4f6',
  borderRadius: '6px',
  marginBottom: '16px',
};

const warningBox = {
  backgroundColor: '#fef3c7',
  borderLeft: '4px solid #f59e0b',
  padding: '16px',
  marginTop: '20px',
  marginBottom: '20px',
};

const warningText = {
  fontSize: '14px',
  color: '#78350f',
  marginTop: '0',
  marginBottom: '0',
  lineHeight: '20px',
};
