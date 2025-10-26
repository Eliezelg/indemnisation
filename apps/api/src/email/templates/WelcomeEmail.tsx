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

interface WelcomeEmailProps {
  firstName: string;
  lastName: string;
  locale: Locale;
}

const content = {
  fr: {
    preview: 'Bienvenue sur notre plateforme',
    greeting: (firstName: string) => `Bonjour ${firstName},`,
    welcome: 'Bienvenue sur Indemnisation Vols !',
    intro:
      'Nous sommes ravis de vous compter parmi nous. Votre compte a été créé avec succès.',
    next: 'Que faire ensuite ?',
    step1: '📝 Créez votre première réclamation',
    step2: '⏱️ Nous traitons votre dossier',
    step3: '💰 Recevez votre compensation',
    cta: 'Créer une réclamation',
    dashboard: 'Accéder à mon tableau de bord',
    help: 'Si vous avez des questions, n\'hésitez pas à nous contacter.',
    thanks: 'À bientôt,',
    team: 'L\'équipe Indemnisation Vols',
  },
  he: {
    preview: 'ברוכים הבאים לפלטפורמה שלנו',
    greeting: (firstName: string) => `שלום ${firstName},`,
    welcome: 'ברוכים הבאים לפיצויי טיסות!',
    intro:
      'אנו שמחים שהצטרפת אלינו. החשבון שלך נוצר בהצלחה.',
    next: 'מה הלאה?',
    step1: '📝 צור את התביעה הראשונה שלך',
    step2: '⏱️ אנו מטפלים בתיק שלך',
    step3: '💰 קבל את הפיצוי שלך',
    cta: 'צור תביעה',
    dashboard: 'גש ללוח הבקרה שלי',
    help: 'אם יש לך שאלות, אל תהסס לפנות אלינו.',
    thanks: 'להתראות,',
    team: 'צוות פיצויי טיסות',
  },
  en: {
    preview: 'Welcome to our platform',
    greeting: (firstName: string) => `Hello ${firstName},`,
    welcome: 'Welcome to Flight Compensation!',
    intro:
      'We are delighted to have you with us. Your account has been created successfully.',
    next: 'What\'s next?',
    step1: '📝 Create your first claim',
    step2: '⏱️ We process your case',
    step3: '💰 Receive your compensation',
    cta: 'Create a claim',
    dashboard: 'Go to my dashboard',
    help: 'If you have any questions, don\'t hesitate to contact us.',
    thanks: 'See you soon,',
    team: 'The Flight Compensation Team',
  },
};

export const WelcomeEmail = ({
  firstName = 'John',
  lastName = 'Doe',
  locale = 'fr',
}: WelcomeEmailProps) => {
  const t = content[locale];
  const isRTL = locale === 'he';

  return (
    <Html dir={isRTL ? 'rtl' : 'ltr'} lang={locale}>
      <Head />
      <Preview>{t.preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={heading}>{t.welcome}</Text>
          </Section>
          <Section style={content}>
            <Text style={paragraph}>{t.greeting(firstName)}</Text>
            <Text style={paragraph}>{t.intro}</Text>

            <Hr style={hr} />

            <Text style={subheading}>{t.next}</Text>
            <Text style={paragraph}>{t.step1}</Text>
            <Text style={paragraph}>{t.step2}</Text>
            <Text style={paragraph}>{t.step3}</Text>

            <Button
              style={button}
              href={`${process.env.FRONTEND_URL || 'http://localhost:3000'}/fr/claims/new`}
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

export default WelcomeEmail;

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

const content = {
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
