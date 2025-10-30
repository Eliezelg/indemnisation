import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { RegisterDto, LoginDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private emailService: EmailService,
  ) {}

  async register(dto: RegisterDto) {
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Un utilisateur avec cet email existe déjà');
    }

    // Hash password with 10 rounds
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
      },
    });

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours

    // Save verification token to database
    await this.prisma.verificationToken.create({
      data: {
        userId: user.id,
        token: verificationToken,
        expiresAt,
      },
    });

    // Send verification email (non-blocking)
    this.emailService.sendVerificationEmail(
      user.email,
      {
        firstName: user.firstName,
        lastName: user.lastName,
        verificationToken,
      },
      user.preferredLocale as 'fr' | 'he' | 'en',
    );

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.email, user.role);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role,
        preferredLocale: user.preferredLocale,
      },
      ...tokens,
    };
  }

  async login(dto: LoginDto) {
    // Find user by email
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    // Compare password with bcrypt
    const passwordMatches = await bcrypt.compare(dto.password, user.password);

    if (!passwordMatches) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    // Check if email is verified
    if (!user.emailVerified) {
      throw new UnauthorizedException(
        'Votre email n\'est pas vérifié. Veuillez vérifier votre boîte mail.',
      );
    }

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.email, user.role);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role,
        preferredLocale: user.preferredLocale,
      },
      ...tokens,
    };
  }

  async refresh(refreshToken: string) {
    try {
      // Verify refresh token
      const payload = await this.jwt.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      // Check if user still exists
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('Utilisateur introuvable');
      }

      // Generate new access token only
      const accessToken = await this.jwt.signAsync(
        { sub: user.id, email: user.email },
        { secret: process.env.JWT_SECRET, expiresIn: '1h' },
      );

      return {
        accessToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Refresh token invalide ou expiré');
    }
  }

  async validateUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        emailVerified: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Utilisateur introuvable');
    }

    return user;
  }

  async verifyEmail(token: string) {
    // Find verification token
    const verificationToken = await this.prisma.verificationToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!verificationToken) {
      throw new BadRequestException('Token de vérification invalide');
    }

    // Check if token has expired
    if (verificationToken.expiresAt < new Date()) {
      throw new BadRequestException('Token de vérification expiré');
    }

    // Update user email verification status
    await this.prisma.user.update({
      where: { id: verificationToken.userId },
      data: { emailVerified: true },
    });

    // Delete verification token
    await this.prisma.verificationToken.delete({
      where: { id: verificationToken.id },
    });

    return {
      message: 'Email vérifié avec succès',
      user: {
        id: verificationToken.user.id,
        email: verificationToken.user.email,
        firstName: verificationToken.user.firstName,
        lastName: verificationToken.user.lastName,
      },
    };
  }

  async resendVerificationEmail(email: string) {
    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('Utilisateur introuvable');
    }

    // Check if already verified
    if (user.emailVerified) {
      throw new BadRequestException('Email déjà vérifié');
    }

    // Delete any existing verification tokens for this user
    await this.prisma.verificationToken.deleteMany({
      where: { userId: user.id },
    });

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours

    // Save verification token to database
    await this.prisma.verificationToken.create({
      data: {
        userId: user.id,
        token: verificationToken,
        expiresAt,
      },
    });

    // Send verification email
    await this.emailService.sendVerificationEmail(
      user.email,
      {
        firstName: user.firstName,
        lastName: user.lastName,
        verificationToken,
      },
      user.preferredLocale as 'fr' | 'he' | 'en',
    );

    return {
      message: 'Email de vérification renvoyé avec succès',
    };
  }

  private async generateTokens(userId: string, email: string, role: string) {
    // Generate both access and refresh tokens in parallel
    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(
        { sub: userId, email, role },
        { secret: process.env.JWT_SECRET, expiresIn: '1h' },
      ),
      this.jwt.signAsync(
        { sub: userId, email, role, type: 'refresh' },
        { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
