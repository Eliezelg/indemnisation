import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

const prisma = new PrismaClient();

interface AirportRow {
  id: string;
  ident: string;
  type: string;
  name: string;
  latitude_deg: string;
  longitude_deg: string;
  elevation_ft: string;
  continent: string;
  iso_country: string;
  iso_region: string;
  municipality: string;
  scheduled_service: string;
  icao_code: string;
  iata_code: string;
  gps_code: string;
  local_code: string;
  home_link: string;
  wikipedia_link: string;
  keywords: string;
}

// Country code to name mapping
const countryNames: Record<string, string> = {
  US: 'United States',
  CA: 'Canada',
  GB: 'United Kingdom',
  FR: 'France',
  DE: 'Germany',
  ES: 'Spain',
  IT: 'Italy',
  IL: 'Israel',
  AE: 'UAE',
  SA: 'Saudi Arabia',
  QA: 'Qatar',
  KW: 'Kuwait',
  BH: 'Bahrain',
  OM: 'Oman',
  JO: 'Jordan',
  LB: 'Lebanon',
  EG: 'Egypt',
  MA: 'Morocco',
  TN: 'Tunisia',
  DZ: 'Algeria',
  TR: 'Turkey',
  GR: 'Greece',
  NL: 'Netherlands',
  BE: 'Belgium',
  CH: 'Switzerland',
  AT: 'Austria',
  PT: 'Portugal',
  IE: 'Ireland',
  SE: 'Sweden',
  NO: 'Norway',
  DK: 'Denmark',
  FI: 'Finland',
  PL: 'Poland',
  CZ: 'Czech Republic',
  HU: 'Hungary',
  RO: 'Romania',
  BG: 'Bulgaria',
  HR: 'Croatia',
  RS: 'Serbia',
  SI: 'Slovenia',
  SK: 'Slovakia',
  LT: 'Lithuania',
  LV: 'Latvia',
  EE: 'Estonia',
  RU: 'Russia',
  UA: 'Ukraine',
  BY: 'Belarus',
  CN: 'China',
  JP: 'Japan',
  KR: 'South Korea',
  IN: 'India',
  PK: 'Pakistan',
  BD: 'Bangladesh',
  TH: 'Thailand',
  VN: 'Vietnam',
  MY: 'Malaysia',
  SG: 'Singapore',
  ID: 'Indonesia',
  PH: 'Philippines',
  AU: 'Australia',
  NZ: 'New Zealand',
  ZA: 'South Africa',
  KE: 'Kenya',
  NG: 'Nigeria',
  ET: 'Ethiopia',
  TZ: 'Tanzania',
  UG: 'Uganda',
  GH: 'Ghana',
  BR: 'Brazil',
  MX: 'Mexico',
  AR: 'Argentina',
  CL: 'Chile',
  CO: 'Colombia',
  PE: 'Peru',
  VE: 'Venezuela',
  EC: 'Ecuador',
  BO: 'Bolivia',
  PY: 'Paraguay',
  UY: 'Uruguay',
};

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

async function seedAirports() {
  console.log('🌍 Starting to seed airports from OurAirports database...');

  const csvPath = '/tmp/airports.csv';

  if (!fs.existsSync(csvPath)) {
    throw new Error('airports.csv not found in /tmp. Please download it first.');
  }

  const fileStream = fs.createReadStream(csvPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let headers: string[] = [];
  let lineNumber = 0;
  let processedCount = 0;
  let importedCount = 0;
  const airports: any[] = [];

  for await (const line of rl) {
    lineNumber++;

    if (lineNumber === 1) {
      headers = parseCSVLine(line).map((h) => h.replace(/"/g, ''));
      continue;
    }

    const values = parseCSVLine(line);
    const row: any = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });

    // Only import airports with IATA codes (commercial airports)
    if (row.iata_code && row.iata_code.length === 3) {
      processedCount++;

      const countryName = countryNames[row.iso_country] || row.iso_country;

      airports.push({
        iata: row.iata_code.toUpperCase(),
        name: row.name,
        city: row.municipality || row.name,
        country: countryName,
        latitude: parseFloat(row.latitude_deg) || 0,
        longitude: parseFloat(row.longitude_deg) || 0,
      });

      // Insert in batches of 100
      if (airports.length >= 100) {
        try {
          await prisma.airport.createMany({
            data: airports,
            skipDuplicates: true,
          });
          importedCount += airports.length;
          console.log(`✅ Imported ${importedCount} airports...`);
          airports.length = 0;
        } catch (error) {
          console.error('Error inserting batch:', error);
        }
      }
    }
  }

  // Insert remaining airports
  if (airports.length > 0) {
    try {
      await prisma.airport.createMany({
        data: airports,
        skipDuplicates: true,
      });
      importedCount += airports.length;
    } catch (error) {
      console.error('Error inserting final batch:', error);
    }
  }

  console.log(`\n🎉 Import complete!`);
  console.log(`   Total airports processed: ${processedCount}`);
  console.log(`   Total airports imported: ${importedCount}`);
}

async function main() {
  try {
    // Clear existing airports
    console.log('🗑️  Clearing existing airports...');
    await prisma.airport.deleteMany({});

    await seedAirports();
  } catch (error) {
    console.error('❌ Error seeding airports:', error);
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
