import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as readline from 'readline';

const prisma = new PrismaClient();

// Country name mapping
const countryNames: Record<string, string> = {
  'United States': 'United States',
  'Canada': 'Canada',
  'United Kingdom': 'United Kingdom',
  'France': 'France',
  'Germany': 'Germany',
  'Spain': 'Spain',
  'Italy': 'Italy',
  'Israel': 'Israel',
  'UAE': 'UAE',
  'United Arab Emirates': 'UAE',
  'Saudi Arabia': 'Saudi Arabia',
  'Qatar': 'Qatar',
  'Kuwait': 'Kuwait',
  'Bahrain': 'Bahrain',
  'Oman': 'Oman',
  'Jordan': 'Jordan',
  'Lebanon': 'Lebanon',
  'Egypt': 'Egypt',
  'Morocco': 'Morocco',
  'Tunisia': 'Tunisia',
  'Algeria': 'Algeria',
  'Turkey': 'Turkey',
  'Greece': 'Greece',
  'Netherlands': 'Netherlands',
  'Belgium': 'Belgium',
  'Switzerland': 'Switzerland',
  'Austria': 'Austria',
  'Portugal': 'Portugal',
  'Ireland': 'Ireland',
  'Sweden': 'Sweden',
  'Norway': 'Norway',
  'Denmark': 'Denmark',
  'Finland': 'Finland',
  'Poland': 'Poland',
  'Czech Republic': 'Czech Republic',
  'Czechia': 'Czech Republic',
  'Hungary': 'Hungary',
  'Romania': 'Romania',
  'Bulgaria': 'Bulgaria',
  'Croatia': 'Croatia',
  'Serbia': 'Serbia',
  'Slovenia': 'Slovenia',
  'Slovakia': 'Slovakia',
  'Lithuania': 'Lithuania',
  'Latvia': 'Latvia',
  'Estonia': 'Estonia',
  'Russia': 'Russia',
  'Russian Federation': 'Russia',
  'Ukraine': 'Ukraine',
  'Belarus': 'Belarus',
  'China': 'China',
  'Japan': 'Japan',
  'South Korea': 'South Korea',
  'Korea': 'South Korea',
  'India': 'India',
  'Pakistan': 'Pakistan',
  'Bangladesh': 'Bangladesh',
  'Thailand': 'Thailand',
  'Vietnam': 'Vietnam',
  'Malaysia': 'Malaysia',
  'Singapore': 'Singapore',
  'Indonesia': 'Indonesia',
  'Philippines': 'Philippines',
  'Australia': 'Australia',
  'New Zealand': 'New Zealand',
  'South Africa': 'South Africa',
  'Kenya': 'Kenya',
  'Nigeria': 'Nigeria',
  'Ethiopia': 'Ethiopia',
  'Tanzania': 'Tanzania',
  'Uganda': 'Uganda',
  'Ghana': 'Ghana',
  'Brazil': 'Brazil',
  'Mexico': 'Mexico',
  'Argentina': 'Argentina',
  'Chile': 'Chile',
  'Colombia': 'Colombia',
  'Peru': 'Peru',
  'Venezuela': 'Venezuela',
  'Ecuador': 'Ecuador',
  'Bolivia': 'Bolivia',
  'Paraguay': 'Paraguay',
  'Uruguay': 'Uruguay',
};

// Alliance detection based on airline name or known members
function detectAlliance(name: string, iata: string): string | null {
  const nameLower = name.toLowerCase();

  // Star Alliance members
  const starAlliance = ['united', 'lufthansa', 'air canada', 'ana', 'singapore airlines',
                        'thai', 'turkish', 'swiss', 'austrian', 'brussels', 'tap',
                        'scandinavian', 'sas', 'lot polish', 'egyptair', 'ethiopian',
                        'south african', 'avianca', 'copa'];

  // SkyTeam members
  const skyTeam = ['delta', 'air france', 'klm', 'alitalia', 'aeromexico', 'aeroflot',
                   'china eastern', 'china southern', 'korean air', 'vietnam airlines',
                   'saudi arabian', 'middle east', 'czech airlines', 'tarom'];

  // Oneworld members
  const oneworld = ['american airlines', 'british airways', 'cathay', 'qantas', 'iberia',
                    'japan airlines', 'jal', 'finnair', 'qatar airways', 'royal jordanian',
                    'malaysia airlines', 'latam', 'sri lankan'];

  for (const member of starAlliance) {
    if (nameLower.includes(member)) return 'Star Alliance';
  }

  for (const member of skyTeam) {
    if (nameLower.includes(member)) return 'SkyTeam';
  }

  for (const member of oneworld) {
    if (nameLower.includes(member)) return 'Oneworld';
  }

  return null;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

async function seedAirlines() {
  console.log('✈️  Starting to seed airlines from OpenFlights database...');

  const csvPath = '/tmp/airlines.csv';

  if (!fs.existsSync(csvPath)) {
    throw new Error('airlines.csv not found in /tmp. Please download it first.');
  }

  const fileStream = fs.createReadStream(csvPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let lineNumber = 0;
  let processedCount = 0;
  let importedCount = 0;
  const airlines: any[] = [];

  for await (const line of rl) {
    lineNumber++;

    const values = parseCSVLine(line);

    // Skip if no valid data
    if (values.length < 8) continue;

    const [id, name, alias, iata, icao, callsign, country, active] = values;

    // Only import airlines with IATA codes (2 letters) and that are active
    if (iata && iata.length === 2 && iata !== '-' && iata !== '\\N' && active === 'Y') {
      processedCount++;

      const countryName = countryNames[country] || country;
      const alliance = detectAlliance(name, iata);

      airlines.push({
        iata: iata.toUpperCase(),
        icao: icao && icao !== '\\N' && icao !== '-' ? icao.toUpperCase() : null,
        name: name.replace(/"/g, ''),
        country: countryName,
        alliance: alliance,
        active: true,
      });

      // Insert in batches of 100
      if (airlines.length >= 100) {
        try {
          await prisma.airline.createMany({
            data: airlines,
            skipDuplicates: true,
          });
          importedCount += airlines.length;
          console.log(`✅ Imported ${importedCount} airlines...`);
          airlines.length = 0;
        } catch (error) {
          console.error('Error inserting batch:', error);
        }
      }
    }
  }

  // Insert remaining airlines
  if (airlines.length > 0) {
    try {
      await prisma.airline.createMany({
        data: airlines,
        skipDuplicates: true,
      });
      importedCount += airlines.length;
    } catch (error) {
      console.error('Error inserting final batch:', error);
    }
  }

  console.log(`\n🎉 Import complete!`);
  console.log(`   Total airlines processed: ${processedCount}`);
  console.log(`   Total airlines imported: ${importedCount}`);
}

async function main() {
  try {
    // Clear existing airlines
    console.log('🗑️  Clearing existing airlines...');
    await prisma.airline.deleteMany({});

    await seedAirlines();
  } catch (error) {
    console.error('❌ Error seeding airlines:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
