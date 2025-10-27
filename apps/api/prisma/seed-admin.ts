import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Création d\'un utilisateur admin...');

  const adminEmail = 'admin@indemnisation.com';
  const adminPassword = 'Admin123!'; // Changez ce mot de passe en production

  // Vérifier si l'admin existe déjà
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log('✅ Utilisateur admin existe déjà:', adminEmail);
    console.log('   Pour vous connecter:');
    console.log('   Email:', adminEmail);
    console.log('   Mot de passe:', adminPassword);
    return;
  }

  // Hash du mot de passe
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  // Créer l'utilisateur admin
  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'System',
      role: 'ADMIN',
      emailVerified: true,
      preferredLocale: 'fr',
    },
  });

  console.log('✅ Utilisateur admin créé avec succès!');
  console.log('');
  console.log('📧 Email:', adminEmail);
  console.log('🔑 Mot de passe:', adminPassword);
  console.log('');
  console.log('⚠️  IMPORTANT: Changez ce mot de passe en production!');
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
