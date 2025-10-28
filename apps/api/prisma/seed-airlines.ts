import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Top 100 airlines by passenger traffic, revenue, and global coverage
 * Includes major airlines from all continents
 */
const AIRLINES_DATA = [
  // ===== STAR ALLIANCE =====
  { iata: 'UA', icao: 'UAL', name: 'United Airlines', country: 'US', alliance: 'Star Alliance' },
  { iata: 'LH', icao: 'DLH', name: 'Lufthansa', country: 'DE', alliance: 'Star Alliance' },
  { iata: 'AC', icao: 'ACA', name: 'Air Canada', country: 'CA', alliance: 'Star Alliance' },
  { iata: 'LX', icao: 'SWR', name: 'Swiss International Air Lines', country: 'CH', alliance: 'Star Alliance' },
  { iata: 'OS', icao: 'AUA', name: 'Austrian Airlines', country: 'AT', alliance: 'Star Alliance' },
  { iata: 'SN', icao: 'BEL', name: 'Brussels Airlines', country: 'BE', alliance: 'Star Alliance' },
  { iata: 'TP', icao: 'TAP', name: 'TAP Air Portugal', country: 'PT', alliance: 'Star Alliance' },
  { iata: 'LO', icao: 'LOT', name: 'LOT Polish Airlines', country: 'PL', alliance: 'Star Alliance' },
  { iata: 'SK', icao: 'SAS', name: 'Scandinavian Airlines (SAS)', country: 'SE', alliance: 'Star Alliance' },
  { iata: 'AY', icao: 'FIN', name: 'Finnair', country: 'FI', alliance: 'Oneworld' },
  { iata: 'TK', icao: 'THY', name: 'Turkish Airlines', country: 'TR', alliance: 'Star Alliance' },
  { iata: 'TG', icao: 'THA', name: 'Thai Airways', country: 'TH', alliance: 'Star Alliance' },
  { iata: 'SQ', icao: 'SIA', name: 'Singapore Airlines', country: 'SG', alliance: 'Star Alliance' },
  { iata: 'NH', icao: 'ANA', name: 'All Nippon Airways (ANA)', country: 'JP', alliance: 'Star Alliance' },
  { iata: 'NZ', icao: 'ANZ', name: 'Air New Zealand', country: 'NZ', alliance: 'Star Alliance' },
  { iata: 'SA', icao: 'SAA', name: 'South African Airways', country: 'ZA', alliance: 'Star Alliance' },
  { iata: 'ET', icao: 'ETH', name: 'Ethiopian Airlines', country: 'ET', alliance: 'Star Alliance' },
  { iata: 'EK', icao: 'UAE', name: 'Emirates', country: 'AE', alliance: null },
  { iata: 'EY', icao: 'ETD', name: 'Etihad Airways', country: 'AE', alliance: null },

  // ===== ONEWORLD =====
  { iata: 'AA', icao: 'AAL', name: 'American Airlines', country: 'US', alliance: 'Oneworld' },
  { iata: 'BA', icao: 'BAW', name: 'British Airways', country: 'GB', alliance: 'Oneworld' },
  { iata: 'IB', icao: 'IBE', name: 'Iberia', country: 'ES', alliance: 'Oneworld' },
  { iata: 'EI', icao: 'EIN', name: 'Aer Lingus', country: 'IE', alliance: 'Oneworld' },
  { iata: 'QF', icao: 'QFA', name: 'Qantas', country: 'AU', alliance: 'Oneworld' },
  { iata: 'JL', icao: 'JAL', name: 'Japan Airlines (JAL)', country: 'JP', alliance: 'Oneworld' },
  { iata: 'CX', icao: 'CPA', name: 'Cathay Pacific', country: 'HK', alliance: 'Oneworld' },
  { iata: 'QR', icao: 'QTR', name: 'Qatar Airways', country: 'QA', alliance: 'Oneworld' },
  { iata: 'RJ', icao: 'RJA', name: 'Royal Jordanian', country: 'JO', alliance: 'Oneworld' },
  { iata: 'LA', icao: 'LAN', name: 'LATAM Airlines', country: 'CL', alliance: 'Oneworld' },
  { iata: 'MA', icao: 'MAH', name: 'Malév Hungarian Airlines', country: 'HU', alliance: null },

  // ===== SKYTEAM =====
  { iata: 'DL', icao: 'DAL', name: 'Delta Air Lines', country: 'US', alliance: 'SkyTeam' },
  { iata: 'AF', icao: 'AFR', name: 'Air France', country: 'FR', alliance: 'SkyTeam' },
  { iata: 'KL', icao: 'KLM', name: 'KLM Royal Dutch Airlines', country: 'NL', alliance: 'SkyTeam' },
  { iata: 'AZ', icao: 'AZA', name: 'ITA Airways', country: 'IT', alliance: 'SkyTeam' },
  { iata: 'SU', icao: 'AFL', name: 'Aeroflot', country: 'RU', alliance: 'SkyTeam' },
  { iata: 'OK', icao: 'CSA', name: 'Czech Airlines', country: 'CZ', alliance: 'SkyTeam' },
  { iata: 'RO', icao: 'ROT', name: 'Tarom', country: 'RO', alliance: 'SkyTeam' },
  { iata: 'KE', icao: 'KAL', name: 'Korean Air', country: 'KR', alliance: 'SkyTeam' },
  { iata: 'CI', icao: 'CAL', name: 'China Airlines', country: 'TW', alliance: 'SkyTeam' },
  { iata: 'MU', icao: 'CES', name: 'China Eastern Airlines', country: 'CN', alliance: 'SkyTeam' },
  { iata: 'CZ', icao: 'CSN', name: 'China Southern Airlines', country: 'CN', alliance: 'SkyTeam' },
  { iata: 'VN', icao: 'HVN', name: 'Vietnam Airlines', country: 'VN', alliance: 'SkyTeam' },
  { iata: 'GA', icao: 'GIA', name: 'Garuda Indonesia', country: 'ID', alliance: 'SkyTeam' },
  { iata: 'AR', icao: 'ARG', name: 'Aerolíneas Argentinas', country: 'AR', alliance: 'SkyTeam' },
  { iata: 'AM', icao: 'AMX', name: 'Aeroméxico', country: 'MX', alliance: 'SkyTeam' },
  { iata: 'UX', icao: 'AEA', name: 'Air Europa', country: 'ES', alliance: 'SkyTeam' },

  // ===== LOW-COST CARRIERS (No alliance) =====
  { iata: 'FR', icao: 'RYR', name: 'Ryanair', country: 'IE', alliance: null },
  { iata: 'U2', icao: 'EZY', name: 'easyJet', country: 'GB', alliance: null },
  { iata: 'W6', icao: 'WZZ', name: 'Wizz Air', country: 'HU', alliance: null },
  { iata: 'VY', icao: 'VLG', name: 'Vueling', country: 'ES', alliance: null },
  { iata: 'TO', icao: 'TVF', name: 'Transavia', country: 'NL', alliance: null },
  { iata: 'PC', icao: 'PGT', name: 'Pegasus Airlines', country: 'TR', alliance: null },
  { iata: 'WN', icao: 'SWA', name: 'Southwest Airlines', country: 'US', alliance: null },
  { iata: 'B6', icao: 'JBU', name: 'JetBlue Airways', country: 'US', alliance: null },
  { iata: 'NK', icao: 'NKS', name: 'Spirit Airlines', country: 'US', alliance: null },
  { iata: 'F9', icao: 'FFT', name: 'Frontier Airlines', country: 'US', alliance: null },
  { iata: 'G4', icao: 'AAY', name: 'Allegiant Air', country: 'US', alliance: null },
  { iata: 'AS', icao: 'ASA', name: 'Alaska Airlines', country: 'US', alliance: null },
  { iata: 'HA', icao: 'HAL', name: 'Hawaiian Airlines', country: 'US', alliance: null },

  // ===== MIDDLE EAST & ASIA =====
  { iata: 'LY', icao: 'ELY', name: 'El Al Israel Airlines', country: 'IL', alliance: null },
  { iata: '6H', icao: 'ISR', name: 'Israir', country: 'IL', alliance: null },
  { iata: 'IZ', icao: 'AIZ', name: 'Arkia', country: 'IL', alliance: null },
  { iata: 'SV', icao: 'SVA', name: 'Saudi Arabian Airlines (Saudia)', country: 'SA', alliance: 'SkyTeam' },
  { iata: 'MS', icao: 'MSR', name: 'EgyptAir', country: 'EG', alliance: 'Star Alliance' },
  { iata: 'ME', icao: 'MEA', name: 'Middle East Airlines', country: 'LB', alliance: 'SkyTeam' },
  { iata: 'GF', icao: 'GFA', name: 'Gulf Air', country: 'BH', alliance: null },
  { iata: 'WY', icao: 'OMA', name: 'Oman Air', country: 'OM', alliance: null },
  { iata: 'FZ', icao: 'FDB', name: 'flydubai', country: 'AE', alliance: null },
  { iata: 'XY', icao: 'KNE', name: 'flynas', country: 'SA', alliance: null },
  { iata: 'AI', icao: 'AIC', name: 'Air India', country: 'IN', alliance: 'Star Alliance' },
  { iata: '6E', icao: 'IGO', name: 'IndiGo', country: 'IN', alliance: null },
  { iata: 'SG', icao: 'SEJ', name: 'SpiceJet', country: 'IN', alliance: null },
  { iata: 'AK', icao: 'AXM', name: 'AirAsia', country: 'MY', alliance: null },
  { iata: 'D7', icao: 'XAX', name: 'AirAsia X', country: 'MY', alliance: null },
  { iata: 'TR', icao: 'TGW', name: 'Scoot', country: 'SG', alliance: null },
  { iata: 'VJ', icao: 'VJC', name: 'VietJet Air', country: 'VN', alliance: null },
  { iata: 'PK', icao: 'PIA', name: 'Pakistan International Airlines', country: 'PK', alliance: null },

  // ===== OCEANIA =====
  { iata: 'JQ', icao: 'JST', name: 'Jetstar Airways', country: 'AU', alliance: null },
  { iata: 'VA', icao: 'VOZ', name: 'Virgin Australia', country: 'AU', alliance: null },
  { iata: 'TT', icao: 'TGG', name: 'Tiger Airways Australia', country: 'AU', alliance: null },

  // ===== AFRICA =====
  { iata: 'AT', icao: 'RAM', name: 'Royal Air Maroc', country: 'MA', alliance: 'Oneworld' },
  { iata: 'KQ', icao: 'KQA', name: 'Kenya Airways', country: 'KE', alliance: 'SkyTeam' },
  { iata: 'DT', icao: 'DAT', name: 'TAAG Angola Airlines', country: 'AO', alliance: null },

  // ===== ADDITIONAL EUROPEAN CARRIERS =====
  { iata: 'EN', icao: 'DLA', name: 'Air Dolomiti', country: 'IT', alliance: 'Star Alliance' },
  { iata: 'A3', icao: 'AEE', name: 'Aegean Airlines', country: 'GR', alliance: 'Star Alliance' },
  { iata: 'JU', icao: 'JAT', name: 'Air Serbia', country: 'RS', alliance: null },
  { iata: 'OU', icao: 'CTN', name: 'Croatia Airlines', country: 'HR', alliance: 'Star Alliance' },
  { iata: 'BT', icao: 'BTI', name: 'airBaltic', country: 'LV', alliance: null },
  { iata: 'AY', icao: 'FIN', name: 'Finnair', country: 'FI', alliance: 'Oneworld' },
  { iata: 'DY', icao: 'NAX', name: 'Norwegian Air Shuttle', country: 'NO', alliance: null },
  { iata: 'AZ', icao: 'AZA', name: 'Alitalia', country: 'IT', alliance: 'SkyTeam' },
  { iata: 'HV', icao: 'TRA', name: 'Transavia', country: 'NL', alliance: null },
  { iata: 'BE', icao: 'BEE', name: 'Flybe', country: 'GB', alliance: null },
  { iata: 'LS', icao: 'EXS', name: 'Jet2.com', country: 'GB', alliance: null },

  // ===== CARGO & REGIONAL =====
  { iata: 'FX', icao: 'FDX', name: 'FedEx Express', country: 'US', alliance: null },
  { iata: '5X', icao: 'UPS', name: 'UPS Airlines', country: 'US', alliance: null },

  // ===== ADDITIONAL MAJOR CARRIERS =====
  { iata: 'VS', icao: 'VIR', name: 'Virgin Atlantic', country: 'GB', alliance: 'SkyTeam' },
  { iata: 'WS', icao: 'WJA', name: 'WestJet', country: 'CA', alliance: null },
  { iata: 'TS', icao: 'TSC', name: 'Air Transat', country: 'CA', alliance: null },
  { iata: 'CM', icao: 'CMP', name: 'Copa Airlines', country: 'PA', alliance: 'Star Alliance' },
  { iata: 'AV', icao: 'AVA', name: 'Avianca', country: 'CO', alliance: 'Star Alliance' },
  { iata: 'G3', icao: 'GLO', name: 'Gol Transportes Aéreos', country: 'BR', alliance: null },
  { iata: 'JJ', icao: 'TAM', name: 'LATAM Brasil', country: 'BR', alliance: 'Oneworld' },
  { iata: 'AD', icao: 'AZU', name: 'Azul Brazilian Airlines', country: 'BR', alliance: null },
];

async function seedAirlines() {
  console.log('✈️  Starting airline seed...');
  console.log(`📊 Total airlines to add: ${AIRLINES_DATA.length}`);

  let addedCount = 0;
  let skippedCount = 0;

  for (const airline of AIRLINES_DATA) {
    try {
      // Check if airline already exists
      const existing = await prisma.airline.findUnique({
        where: { iata: airline.iata },
      });

      if (existing) {
        console.log(`⏭️  Skipped ${airline.iata} - ${airline.name} (already exists)`);
        skippedCount++;
        continue;
      }

      // Create airline
      await prisma.airline.create({
        data: {
          iata: airline.iata,
          icao: airline.icao,
          name: airline.name,
          country: airline.country,
          alliance: airline.alliance,
        },
      });

      const allianceInfo = airline.alliance ? ` [${airline.alliance}]` : '';
      console.log(`✅ Added ${airline.iata} - ${airline.name} (${airline.country})${allianceInfo}`);
      addedCount++;
    } catch (error) {
      console.error(`❌ Error adding ${airline.iata}:`, error);
    }
  }

  console.log('\n📈 Seed Summary:');
  console.log(`✅ Added: ${addedCount} airlines`);
  console.log(`⏭️  Skipped: ${skippedCount} airlines (already existed)`);
  console.log(`📊 Total in database: ${addedCount + skippedCount} airlines`);

  // Statistics by alliance
  const alliances = await prisma.airline.groupBy({
    by: ['alliance'],
    _count: true,
  });

  console.log('\n📊 Airlines by Alliance:');
  alliances.forEach((group) => {
    const allianceName = group.alliance || 'Independent';
    console.log(`   ${allianceName}: ${group._count} airlines`);
  });

  // Verify total count
  const totalAirlines = await prisma.airline.count();
  console.log(`\n🎯 Final database count: ${totalAirlines} airlines`);
}

// Execute seed
seedAirlines()
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
