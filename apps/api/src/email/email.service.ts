import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { WelcomeEmail } from './templates/WelcomeEmail';
import { ClaimCreatedEmail } from './templates/ClaimCreatedEmail';
import { ClaimStatusEmail } from './templates/ClaimStatusEmail';
import { VerifyEmail } from './templates/VerifyEmail';
import { render } from '@react-email/render';

type SupportedLocale = 'fr' | 'he' | 'en';
type ClaimStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'IN_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'PAID'
  | 'CANCELLED';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private resend: Resend;
  private from: string;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    if (!apiKey) {
      this.logger.warn(
        'RESEND_API_KEY not configured. Email sending will be disabled.',
      );
    }
    this.resend = new Resend(apiKey);
    this.from =
      this.configService.get<string>('EMAIL_FROM') ||
      'Indemnisation Vols <onboarding@resend.dev>';
  }

  /**
   * Send welcome email after user registration
   */
  async sendWelcomeEmail(
    to: string,
    context: { firstName: string; lastName: string },
    locale: SupportedLocale = 'fr',
  ): Promise<void> {
    const subjects = {
      fr: 'Bienvenue sur Indemnisation Vols',
      he: 'ברוכים הבאים לפיצויי טיסות',
      en: 'Welcome to Flight Compensation',
    };

    try {
      const html = await render(
        WelcomeEmail({ ...context, locale } as any),
      );

      await this.resend.emails.send({
        from: this.from,
        to,
        subject: subjects[locale],
        html,
      });

      this.logger.log(`Welcome email sent to ${to} in ${locale}`);
    } catch (error) {
      this.logger.error(`Failed to send welcome email to ${to}:`, error);
      // Don't throw - email failures shouldn't block user registration
    }
  }

  /**
   * Send email verification link
   */
  async sendVerificationEmail(
    to: string,
    context: { firstName: string; lastName: string; verificationToken: string },
    locale: SupportedLocale = 'fr',
  ): Promise<void> {
    const subjects = {
      fr: 'Vérifiez votre adresse email',
      he: 'אמת את כתובת האימייל שלך',
      en: 'Verify your email address',
    };

    try {
      const html = await render(
        VerifyEmail({ ...context, locale } as any),
      );

      await this.resend.emails.send({
        from: this.from,
        to,
        subject: subjects[locale],
        html,
      });

      this.logger.log(`Verification email sent to ${to} in ${locale}`);
    } catch (error) {
      this.logger.error(`Failed to send verification email to ${to}:`, error);
    }
  }

  /**
   * Send claim created confirmation email
   */
  async sendClaimCreatedEmail(
    to: string,
    context: {
      firstName: string;
      lastName: string;
      claimNumber: string;
      flightNumber: string;
      departureAirport: string;
      arrivalAirport: string;
      recommendedAmount: number;
      currency: string;
    },
    locale: SupportedLocale = 'fr',
  ): Promise<void> {
    const subjects = {
      fr: `Réclamation ${context.claimNumber} créée`,
      he: `תביעה ${context.claimNumber} נוצרה`,
      en: `Claim ${context.claimNumber} created`,
    };

    try {
      const html = await render(
        ClaimCreatedEmail({ ...context, locale } as any),
      );

      await this.resend.emails.send({
        from: this.from,
        to,
        subject: subjects[locale],
        html,
      });

      this.logger.log(`Claim created email sent to ${to} in ${locale}`);
    } catch (error) {
      this.logger.error(`Failed to send claim created email to ${to}:`, error);
    }
  }

  /**
   * Send claim status change notification
   */
  async sendClaimStatusEmail(
    to: string,
    context: {
      firstName: string;
      lastName: string;
      claimNumber: string;
      flightNumber: string;
      status: ClaimStatus;
      statusMessage?: string;
    },
    locale: SupportedLocale = 'fr',
  ): Promise<void> {
    const subjects = {
      fr: `Mise à jour de votre réclamation ${context.claimNumber}`,
      he: `עדכון בתביעה ${context.claimNumber}`,
      en: `Update on your claim ${context.claimNumber}`,
    };

    try {
      const html = await render(
        ClaimStatusEmail({ ...context, locale } as any),
      );

      await this.resend.emails.send({
        from: this.from,
        to,
        subject: subjects[locale],
        html,
      });

      this.logger.log(`Claim status email sent to ${to} in ${locale}`);
    } catch (error) {
      this.logger.error(`Failed to send claim status email to ${to}:`, error);
    }
  }
}
