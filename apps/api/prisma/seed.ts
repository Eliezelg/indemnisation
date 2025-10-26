import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const airports = [
  // France
  { iata: 'CDG', name: 'Charles de Gaulle Airport', city: 'Paris', country: 'FR', latitude: 49.0097, longitude: 2.5479 },
  { iata: 'ORY', name: 'Orly Airport', city: 'Paris', country: 'FR', latitude: 48.7233, longitude: 2.3794 },
  { iata: 'NCE', name: 'Nice Côte d\'Azur Airport', city: 'Nice', country: 'FR', latitude: 43.6584, longitude: 7.2158 },
  { iata: 'LYS', name: 'Lyon-Saint Exupéry Airport', city: 'Lyon', country: 'FR', latitude: 45.7256, longitude: 5.0811 },
  { iata: 'MRS', name: 'Marseille Provence Airport', city: 'Marseille', country: 'FR', latitude: 43.4393, longitude: 5.2214 },
  { iata: 'TLS', name: 'Toulouse-Blagnac Airport', city: 'Toulouse', country: 'FR', latitude: 43.6351, longitude: 1.3673 },
  { iata: 'BOD', name: 'Bordeaux-Mérignac Airport', city: 'Bordeaux', country: 'FR', latitude: 44.8283, longitude: -0.7155 },
  { iata: 'NTE', name: 'Nantes Atlantique Airport', city: 'Nantes', country: 'FR', latitude: 47.1532, longitude: -1.6108 },

  // Israel
  { iata: 'TLV', name: 'Ben Gurion Airport', city: 'Tel Aviv', country: 'IL', latitude: 32.0114, longitude: 34.8867 },

  // Germany
  { iata: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'DE', latitude: 50.0379, longitude: 8.5622 },
  { iata: 'MUC', name: 'Munich Airport', city: 'Munich', country: 'DE', latitude: 48.3538, longitude: 11.7861 },
  { iata: 'BER', name: 'Berlin Brandenburg Airport', city: 'Berlin', country: 'DE', latitude: 52.3667, longitude: 13.5033 },

  // Spain
  { iata: 'MAD', name: 'Adolfo Suárez Madrid-Barajas Airport', city: 'Madrid', country: 'ES', latitude: 40.4983, longitude: -3.5676 },
  { iata: 'BCN', name: 'Barcelona-El Prat Airport', city: 'Barcelona', country: 'ES', latitude: 41.2974, longitude: 2.0833 },
  { iata: 'PMI', name: 'Palma de Mallorca Airport', city: 'Palma', country: 'ES', latitude: 39.5517, longitude: 2.7388 },

  // Italy
  { iata: 'FCO', name: 'Leonardo da Vinci-Fiumicino Airport', city: 'Rome', country: 'IT', latitude: 41.8003, longitude: 12.2389 },
  { iata: 'MXP', name: 'Milan Malpensa Airport', city: 'Milan', country: 'IT', latitude: 45.6306, longitude: 8.7281 },
  { iata: 'VCE', name: 'Venice Marco Polo Airport', city: 'Venice', country: 'IT', latitude: 45.5053, longitude: 12.3519 },

  // United Kingdom
  { iata: 'LHR', name: 'Heathrow Airport', city: 'London', country: 'GB', latitude: 51.4700, longitude: -0.4543 },
  { iata: 'LGW', name: 'Gatwick Airport', city: 'London', country: 'GB', latitude: 51.1537, longitude: -0.1821 },
  { iata: 'MAN', name: 'Manchester Airport', city: 'Manchester', country: 'GB', latitude: 53.3537, longitude: -2.2750 },

  // Netherlands
  { iata: 'AMS', name: 'Amsterdam Airport Schiphol', city: 'Amsterdam', country: 'NL', latitude: 52.3105, longitude: 4.7683 },

  // Switzerland
  { iata: 'ZRH', name: 'Zurich Airport', city: 'Zurich', country: 'CH', latitude: 47.4647, longitude: 8.5492 },
  { iata: 'GVA', name: 'Geneva Airport', city: 'Geneva', country: 'CH', latitude: 46.2381, longitude: 6.1090 },

  // Belgium
  { iata: 'BRU', name: 'Brussels Airport', city: 'Brussels', country: 'BE', latitude: 50.9014, longitude: 4.4844 },

  // Austria
  { iata: 'VIE', name: 'Vienna International Airport', city: 'Vienna', country: 'AT', latitude: 48.1103, longitude: 16.5697 },

  // Portugal
  { iata: 'LIS', name: 'Lisbon Portela Airport', city: 'Lisbon', country: 'PT', latitude: 38.7813, longitude: -9.1359 },
  { iata: 'OPO', name: 'Francisco Sá Carneiro Airport', city: 'Porto', country: 'PT', latitude: 41.2481, longitude: -8.6814 },

  // Denmark
  { iata: 'CPH', name: 'Copenhagen Airport', city: 'Copenhagen', country: 'DK', latitude: 55.6180, longitude: 12.6508 },

  // Sweden
  { iata: 'ARN', name: 'Stockholm Arlanda Airport', city: 'Stockholm', country: 'SE', latitude: 59.6519, longitude: 17.9186 },

  // Norway
  { iata: 'OSL', name: 'Oslo Airport, Gardermoen', city: 'Oslo', country: 'NO', latitude: 60.1939, longitude: 11.1004 },

  // Greece
  { iata: 'ATH', name: 'Athens International Airport', city: 'Athens', country: 'GR', latitude: 37.9364, longitude: 23.9445 },

  // Turkey
  { iata: 'IST', name: 'Istanbul Airport', city: 'Istanbul', country: 'TR', latitude: 41.2753, longitude: 28.7519 },

  // United States
  { iata: 'JFK', name: 'John F. Kennedy International Airport', city: 'New York', country: 'US', latitude: 40.6413, longitude: -73.7781 },
  { iata: 'EWR', name: 'Newark Liberty International Airport', city: 'New York', country: 'US', latitude: 40.6895, longitude: -74.1745 },
  { iata: 'LAX', name: 'Los Angeles International Airport', city: 'Los Angeles', country: 'US', latitude: 33.9416, longitude: -118.4085 },
  { iata: 'MIA', name: 'Miami International Airport', city: 'Miami', country: 'US', latitude: 25.7959, longitude: -80.2870 },

  // United Arab Emirates
  { iata: 'DXB', name: 'Dubai International Airport', city: 'Dubai', country: 'AE', latitude: 25.2532, longitude: 55.3657 },

  // Morocco
  { iata: 'CMN', name: 'Mohammed V International Airport', city: 'Casablanca', country: 'MA', latitude: 33.3676, longitude: -7.5898 },

  // Tunisia
  { iata: 'TUN', name: 'Tunis-Carthage International Airport', city: 'Tunis', country: 'TN', latitude: 36.8510, longitude: 10.2272 },

  // Egypt
  { iata: 'CAI', name: 'Cairo International Airport', city: 'Cairo', country: 'EG', latitude: 30.1219, longitude: 31.4056 },
];

async function main() {
  console.log('🌍 Seeding airports database...');

  let created = 0;
  let skipped = 0;

  for (const airport of airports) {
    try {
      await prisma.airport.create({
        data: airport,
      });
      console.log(`✅ ${airport.iata} - ${airport.name} (${airport.city}, ${airport.country})`);
      created++;
    } catch (error) {
      // Airport already exists, skip
      console.log(`⏭️  ${airport.iata} - Already exists`);
      skipped++;
    }
  }

  console.log('\n📊 Summary:');
  console.log(`   ✅ Created: ${created} airports`);
  console.log(`   ⏭️  Skipped: ${skipped} airports (already exist)`);
  console.log(`   📍 Total in database: ${await prisma.airport.count()} airports`);
  console.log('\n🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
