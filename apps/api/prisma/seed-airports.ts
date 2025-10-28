import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Top 100 European airports + Top 50 World airports by passenger traffic
 * Data compiled from latest aviation statistics
 */
const AIRPORTS_DATA = [
  // ===== TOP EUROPEAN AIRPORTS =====

  // United Kingdom
  { iata: 'LHR', name: 'London Heathrow Airport', city: 'London', country: 'GB', latitude: 51.4700, longitude: -0.4543 },
  { iata: 'LGW', name: 'London Gatwick Airport', city: 'London', country: 'GB', latitude: 51.1537, longitude: -0.1821 },
  { iata: 'MAN', name: 'Manchester Airport', city: 'Manchester', country: 'GB', latitude: 53.3537, longitude: -2.2750 },
  { iata: 'STN', name: 'London Stansted Airport', city: 'London', country: 'GB', latitude: 51.8860, longitude: 0.2389 },
  { iata: 'LTN', name: 'London Luton Airport', city: 'London', country: 'GB', latitude: 51.8747, longitude: -0.3683 },
  { iata: 'EDI', name: 'Edinburgh Airport', city: 'Edinburgh', country: 'GB', latitude: 55.9500, longitude: -3.3725 },
  { iata: 'BHX', name: 'Birmingham Airport', city: 'Birmingham', country: 'GB', latitude: 52.4539, longitude: -1.7480 },
  { iata: 'GLA', name: 'Glasgow Airport', city: 'Glasgow', country: 'GB', latitude: 55.8719, longitude: -4.4331 },
  { iata: 'BRS', name: 'Bristol Airport', city: 'Bristol', country: 'GB', latitude: 51.3827, longitude: -2.7191 },
  { iata: 'NCL', name: 'Newcastle Airport', city: 'Newcastle', country: 'GB', latitude: 55.0375, longitude: -1.6917 },
  { iata: 'LBA', name: 'Leeds Bradford Airport', city: 'Leeds', country: 'GB', latitude: 53.8659, longitude: -1.6606 },
  { iata: 'BFS', name: 'Belfast International Airport', city: 'Belfast', country: 'GB', latitude: 54.6575, longitude: -6.2158 },

  // France
  { iata: 'CDG', name: 'Paris Charles de Gaulle Airport', city: 'Paris', country: 'FR', latitude: 49.0097, longitude: 2.5479 },
  { iata: 'ORY', name: 'Paris Orly Airport', city: 'Paris', country: 'FR', latitude: 48.7233, longitude: 2.3794 },
  { iata: 'NCE', name: 'Nice Côte d\'Azur Airport', city: 'Nice', country: 'FR', latitude: 43.6584, longitude: 7.2159 },
  { iata: 'LYS', name: 'Lyon-Saint Exupéry Airport', city: 'Lyon', country: 'FR', latitude: 45.7256, longitude: 5.0811 },
  { iata: 'MRS', name: 'Marseille Provence Airport', city: 'Marseille', country: 'FR', latitude: 43.4393, longitude: 5.2214 },
  { iata: 'TLS', name: 'Toulouse-Blagnac Airport', city: 'Toulouse', country: 'FR', latitude: 43.6290, longitude: 1.3638 },
  { iata: 'BOD', name: 'Bordeaux-Mérignac Airport', city: 'Bordeaux', country: 'FR', latitude: 44.8283, longitude: -0.7155 },
  { iata: 'NTE', name: 'Nantes Atlantique Airport', city: 'Nantes', country: 'FR', latitude: 47.1532, longitude: -1.6107 },
  { iata: 'BSL', name: 'EuroAirport Basel-Mulhouse-Freiburg', city: 'Basel/Mulhouse', country: 'FR', latitude: 47.5896, longitude: 7.5299 },
  { iata: 'LIL', name: 'Lille Airport', city: 'Lille', country: 'FR', latitude: 50.5636, longitude: 3.0895 },
  { iata: 'MPL', name: 'Montpellier-Méditerranée Airport', city: 'Montpellier', country: 'FR', latitude: 43.5762, longitude: 3.9630 },
  { iata: 'SXB', name: 'Strasbourg Airport', city: 'Strasbourg', country: 'FR', latitude: 48.5383, longitude: 7.6283 },

  // Germany
  { iata: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'DE', latitude: 50.0379, longitude: 8.5622 },
  { iata: 'MUC', name: 'Munich Airport', city: 'Munich', country: 'DE', latitude: 48.3538, longitude: 11.7861 },
  { iata: 'DUS', name: 'Düsseldorf Airport', city: 'Düsseldorf', country: 'DE', latitude: 51.2895, longitude: 6.7668 },
  { iata: 'TXL', name: 'Berlin Tegel Airport', city: 'Berlin', country: 'DE', latitude: 52.5597, longitude: 13.2877 },
  { iata: 'BER', name: 'Berlin Brandenburg Airport', city: 'Berlin', country: 'DE', latitude: 52.3667, longitude: 13.5033 },
  { iata: 'HAM', name: 'Hamburg Airport', city: 'Hamburg', country: 'DE', latitude: 53.6304, longitude: 9.9882 },
  { iata: 'CGN', name: 'Cologne Bonn Airport', city: 'Cologne', country: 'DE', latitude: 50.8659, longitude: 7.1427 },
  { iata: 'STR', name: 'Stuttgart Airport', city: 'Stuttgart', country: 'DE', latitude: 48.6899, longitude: 9.2220 },
  { iata: 'HAJ', name: 'Hannover Airport', city: 'Hannover', country: 'DE', latitude: 52.4611, longitude: 9.6850 },
  { iata: 'NUE', name: 'Nuremberg Airport', city: 'Nuremberg', country: 'DE', latitude: 49.4987, longitude: 11.0669 },
  { iata: 'DOR', name: 'Dortmund Airport', city: 'Dortmund', country: 'DE', latitude: 51.5183, longitude: 7.6122 },
  { iata: 'LEJ', name: 'Leipzig/Halle Airport', city: 'Leipzig', country: 'DE', latitude: 51.4324, longitude: 12.2416 },
  { iata: 'DRS', name: 'Dresden Airport', city: 'Dresden', country: 'DE', latitude: 51.1328, longitude: 13.7672 },

  // Spain
  { iata: 'MAD', name: 'Adolfo Suárez Madrid-Barajas Airport', city: 'Madrid', country: 'ES', latitude: 40.4719, longitude: -3.5626 },
  { iata: 'BCN', name: 'Barcelona-El Prat Airport', city: 'Barcelona', country: 'ES', latitude: 41.2974, longitude: 2.0833 },
  { iata: 'PMI', name: 'Palma de Mallorca Airport', city: 'Palma de Mallorca', country: 'ES', latitude: 39.5517, longitude: 2.7388 },
  { iata: 'AGP', name: 'Málaga-Costa del Sol Airport', city: 'Málaga', country: 'ES', latitude: 36.6749, longitude: -4.4991 },
  { iata: 'SVQ', name: 'Seville Airport', city: 'Seville', country: 'ES', latitude: 37.4180, longitude: -5.8931 },
  { iata: 'ALC', name: 'Alicante-Elche Airport', city: 'Alicante', country: 'ES', latitude: 38.2822, longitude: -0.5581 },
  { iata: 'VLC', name: 'Valencia Airport', city: 'Valencia', country: 'ES', latitude: 39.4893, longitude: -0.4817 },
  { iata: 'BIO', name: 'Bilbao Airport', city: 'Bilbao', country: 'ES', latitude: 43.3011, longitude: -2.9106 },
  { iata: 'TFS', name: 'Tenerife South Airport', city: 'Tenerife', country: 'ES', latitude: 28.0445, longitude: -16.5725 },
  { iata: 'IBZ', name: 'Ibiza Airport', city: 'Ibiza', country: 'ES', latitude: 38.8729, longitude: 1.3731 },
  { iata: 'LPA', name: 'Gran Canaria Airport', city: 'Las Palmas', country: 'ES', latitude: 27.9319, longitude: -15.3866 },
  { iata: 'GRO', name: 'Girona-Costa Brava Airport', city: 'Girona', country: 'ES', latitude: 41.9009, longitude: 2.7605 },

  // Italy
  { iata: 'FCO', name: 'Leonardo da Vinci-Fiumicino Airport', city: 'Rome', country: 'IT', latitude: 41.8003, longitude: 12.2389 },
  { iata: 'MXP', name: 'Milan Malpensa Airport', city: 'Milan', country: 'IT', latitude: 45.6306, longitude: 8.7281 },
  { iata: 'LIN', name: 'Milan Linate Airport', city: 'Milan', country: 'IT', latitude: 45.4454, longitude: 9.2767 },
  { iata: 'BGY', name: 'Milan Bergamo Airport', city: 'Milan', country: 'IT', latitude: 45.6739, longitude: 9.7042 },
  { iata: 'VCE', name: 'Venice Marco Polo Airport', city: 'Venice', country: 'IT', latitude: 45.5053, longitude: 12.3519 },
  { iata: 'NAP', name: 'Naples International Airport', city: 'Naples', country: 'IT', latitude: 40.8860, longitude: 14.2908 },
  { iata: 'CIA', name: 'Rome Ciampino Airport', city: 'Rome', country: 'IT', latitude: 41.7994, longitude: 12.5949 },
  { iata: 'BLQ', name: 'Bologna Guglielmo Marconi Airport', city: 'Bologna', country: 'IT', latitude: 44.5354, longitude: 11.2887 },
  { iata: 'CTA', name: 'Catania-Fontanarossa Airport', city: 'Catania', country: 'IT', latitude: 37.4668, longitude: 15.0664 },
  { iata: 'PSA', name: 'Pisa International Airport', city: 'Pisa', country: 'IT', latitude: 43.6839, longitude: 10.3927 },
  { iata: 'TRN', name: 'Turin Airport', city: 'Turin', country: 'IT', latitude: 45.2008, longitude: 7.6496 },
  { iata: 'FLR', name: 'Florence Airport', city: 'Florence', country: 'IT', latitude: 43.8100, longitude: 11.2051 },

  // Netherlands
  { iata: 'AMS', name: 'Amsterdam Airport Schiphol', city: 'Amsterdam', country: 'NL', latitude: 52.3105, longitude: 4.7683 },
  { iata: 'EIN', name: 'Eindhoven Airport', city: 'Eindhoven', country: 'NL', latitude: 51.4500, longitude: 5.3750 },
  { iata: 'RTM', name: 'Rotterdam The Hague Airport', city: 'Rotterdam', country: 'NL', latitude: 51.9569, longitude: 4.4372 },

  // Switzerland
  { iata: 'ZRH', name: 'Zurich Airport', city: 'Zurich', country: 'CH', latitude: 47.4647, longitude: 8.5492 },
  { iata: 'GVA', name: 'Geneva Airport', city: 'Geneva', country: 'CH', latitude: 46.2381, longitude: 6.1090 },

  // Austria
  { iata: 'VIE', name: 'Vienna International Airport', city: 'Vienna', country: 'AT', latitude: 48.1103, longitude: 16.5697 },
  { iata: 'SZG', name: 'Salzburg Airport', city: 'Salzburg', country: 'AT', latitude: 47.7933, longitude: 13.0043 },
  { iata: 'INN', name: 'Innsbruck Airport', city: 'Innsbruck', country: 'AT', latitude: 47.2602, longitude: 11.3440 },

  // Belgium
  { iata: 'BRU', name: 'Brussels Airport', city: 'Brussels', country: 'BE', latitude: 50.9014, longitude: 4.4844 },
  { iata: 'CRL', name: 'Brussels South Charleroi Airport', city: 'Charleroi', country: 'BE', latitude: 50.4592, longitude: 4.4538 },

  // Denmark
  { iata: 'CPH', name: 'Copenhagen Airport', city: 'Copenhagen', country: 'DK', latitude: 55.6180, longitude: 12.6508 },
  { iata: 'BLL', name: 'Billund Airport', city: 'Billund', country: 'DK', latitude: 55.7403, longitude: 9.1518 },

  // Sweden
  { iata: 'ARN', name: 'Stockholm Arlanda Airport', city: 'Stockholm', country: 'SE', latitude: 59.6519, longitude: 17.9186 },
  { iata: 'GOT', name: 'Gothenburg Landvetter Airport', city: 'Gothenburg', country: 'SE', latitude: 57.6628, longitude: 12.2798 },
  { iata: 'MMX', name: 'Malmö Airport', city: 'Malmö', country: 'SE', latitude: 55.5363, longitude: 13.3762 },

  // Norway
  { iata: 'OSL', name: 'Oslo Airport', city: 'Oslo', country: 'NO', latitude: 60.1939, longitude: 11.1004 },
  { iata: 'BGO', name: 'Bergen Airport', city: 'Bergen', country: 'NO', latitude: 60.2934, longitude: 5.2181 },
  { iata: 'TRD', name: 'Trondheim Airport', city: 'Trondheim', country: 'NO', latitude: 63.4578, longitude: 10.9239 },

  // Finland
  { iata: 'HEL', name: 'Helsinki-Vantaa Airport', city: 'Helsinki', country: 'FI', latitude: 60.3172, longitude: 24.9633 },

  // Poland
  { iata: 'WAW', name: 'Warsaw Chopin Airport', city: 'Warsaw', country: 'PL', latitude: 52.1657, longitude: 20.9671 },
  { iata: 'KRK', name: 'Kraków John Paul II Airport', city: 'Kraków', country: 'PL', latitude: 50.0777, longitude: 19.7848 },
  { iata: 'GDN', name: 'Gdańsk Lech Wałęsa Airport', city: 'Gdańsk', country: 'PL', latitude: 54.3776, longitude: 18.4662 },
  { iata: 'WRO', name: 'Wrocław Copernicus Airport', city: 'Wrocław', country: 'PL', latitude: 51.1027, longitude: 16.8858 },

  // Czech Republic
  { iata: 'PRG', name: 'Václav Havel Airport Prague', city: 'Prague', country: 'CZ', latitude: 50.1008, longitude: 14.2600 },

  // Hungary
  { iata: 'BUD', name: 'Budapest Ferenc Liszt Airport', city: 'Budapest', country: 'HU', latitude: 47.4298, longitude: 19.2611 },

  // Romania
  { iata: 'OTP', name: 'Henri Coandă International Airport', city: 'Bucharest', country: 'RO', latitude: 44.5711, longitude: 26.0850 },

  // Greece
  { iata: 'ATH', name: 'Athens International Airport', city: 'Athens', country: 'GR', latitude: 37.9364, longitude: 23.9445 },
  { iata: 'HER', name: 'Heraklion International Airport', city: 'Heraklion', country: 'GR', latitude: 35.3397, longitude: 25.1803 },
  { iata: 'SKG', name: 'Thessaloniki Airport', city: 'Thessaloniki', country: 'GR', latitude: 40.5197, longitude: 22.9709 },
  { iata: 'RHO', name: 'Rhodes International Airport', city: 'Rhodes', country: 'GR', latitude: 36.4054, longitude: 28.0862 },

  // Portugal
  { iata: 'LIS', name: 'Lisbon Portela Airport', city: 'Lisbon', country: 'PT', latitude: 38.7813, longitude: -9.1359 },
  { iata: 'OPO', name: 'Porto Airport', city: 'Porto', country: 'PT', latitude: 41.2481, longitude: -8.6814 },
  { iata: 'FAO', name: 'Faro Airport', city: 'Faro', country: 'PT', latitude: 37.0144, longitude: -7.9659 },

  // Ireland
  { iata: 'DUB', name: 'Dublin Airport', city: 'Dublin', country: 'IE', latitude: 53.4213, longitude: -6.2701 },
  { iata: 'ORK', name: 'Cork Airport', city: 'Cork', country: 'IE', latitude: 51.8413, longitude: -8.4911 },

  // Turkey (European part)
  { iata: 'IST', name: 'Istanbul Airport', city: 'Istanbul', country: 'TR', latitude: 41.2753, longitude: 28.7519 },
  { iata: 'SAW', name: 'Sabiha Gökçen Airport', city: 'Istanbul', country: 'TR', latitude: 40.8986, longitude: 29.3092 },
  { iata: 'AYT', name: 'Antalya Airport', city: 'Antalya', country: 'TR', latitude: 36.8987, longitude: 30.8005 },
  { iata: 'ESB', name: 'Ankara Esenboğa Airport', city: 'Ankara', country: 'TR', latitude: 40.1281, longitude: 32.9951 },
  { iata: 'ADB', name: 'İzmir Adnan Menderes Airport', city: 'İzmir', country: 'TR', latitude: 38.2924, longitude: 27.1570 },

  // Russia (European part)
  { iata: 'SVO', name: 'Sheremetyevo International Airport', city: 'Moscow', country: 'RU', latitude: 55.9726, longitude: 37.4146 },
  { iata: 'DME', name: 'Domodedovo International Airport', city: 'Moscow', country: 'RU', latitude: 55.4088, longitude: 37.9063 },
  { iata: 'VKO', name: 'Vnukovo International Airport', city: 'Moscow', country: 'RU', latitude: 55.5914, longitude: 37.2615 },
  { iata: 'LED', name: 'Pulkovo Airport', city: 'St Petersburg', country: 'RU', latitude: 59.8003, longitude: 30.2625 },

  // Ukraine
  { iata: 'KBP', name: 'Boryspil International Airport', city: 'Kyiv', country: 'UA', latitude: 50.3450, longitude: 30.8947 },

  // Croatia
  { iata: 'ZAG', name: 'Zagreb Airport', city: 'Zagreb', country: 'HR', latitude: 45.7429, longitude: 16.0688 },
  { iata: 'SPU', name: 'Split Airport', city: 'Split', country: 'HR', latitude: 43.5389, longitude: 16.2980 },
  { iata: 'DBV', name: 'Dubrovnik Airport', city: 'Dubrovnik', country: 'HR', latitude: 42.5614, longitude: 18.2682 },

  // Bulgaria
  { iata: 'SOF', name: 'Sofia Airport', city: 'Sofia', country: 'BG', latitude: 42.6952, longitude: 23.4114 },

  // Serbia
  { iata: 'BEG', name: 'Belgrade Nikola Tesla Airport', city: 'Belgrade', country: 'RS', latitude: 44.8184, longitude: 20.3091 },

  // Slovakia
  { iata: 'BTS', name: 'Bratislava Airport', city: 'Bratislava', country: 'SK', latitude: 48.1702, longitude: 17.2127 },

  // Slovenia
  { iata: 'LJU', name: 'Ljubljana Jože Pučnik Airport', city: 'Ljubljana', country: 'SI', latitude: 46.2237, longitude: 14.4576 },

  // Estonia
  { iata: 'TLL', name: 'Tallinn Airport', city: 'Tallinn', country: 'EE', latitude: 59.4133, longitude: 24.8328 },

  // Latvia
  { iata: 'RIX', name: 'Riga International Airport', city: 'Riga', country: 'LV', latitude: 56.9236, longitude: 23.9711 },

  // Lithuania
  { iata: 'VNO', name: 'Vilnius Airport', city: 'Vilnius', country: 'LT', latitude: 54.6341, longitude: 25.2858 },

  // Luxembourg
  { iata: 'LUX', name: 'Luxembourg Airport', city: 'Luxembourg', country: 'LU', latitude: 49.6233, longitude: 6.2044 },

  // Malta
  { iata: 'MLA', name: 'Malta International Airport', city: 'Luqa', country: 'MT', latitude: 35.8575, longitude: 14.4775 },

  // Cyprus
  { iata: 'LCA', name: 'Larnaca International Airport', city: 'Larnaca', country: 'CY', latitude: 34.8751, longitude: 33.6249 },
  { iata: 'PFO', name: 'Paphos International Airport', city: 'Paphos', country: 'CY', latitude: 34.7179, longitude: 32.4857 },

  // Iceland
  { iata: 'KEF', name: 'Keflavík International Airport', city: 'Reykjavík', country: 'IS', latitude: 63.9850, longitude: -22.6056 },

  // ===== TOP WORLD AIRPORTS (Outside Europe) =====

  // United States
  { iata: 'ATL', name: 'Hartsfield-Jackson Atlanta International Airport', city: 'Atlanta', country: 'US', latitude: 33.6407, longitude: -84.4277 },
  { iata: 'LAX', name: 'Los Angeles International Airport', city: 'Los Angeles', country: 'US', latitude: 33.9416, longitude: -118.4085 },
  { iata: 'ORD', name: 'O\'Hare International Airport', city: 'Chicago', country: 'US', latitude: 41.9742, longitude: -87.9073 },
  { iata: 'DFW', name: 'Dallas/Fort Worth International Airport', city: 'Dallas', country: 'US', latitude: 32.8998, longitude: -97.0403 },
  { iata: 'DEN', name: 'Denver International Airport', city: 'Denver', country: 'US', latitude: 39.8561, longitude: -104.6737 },
  { iata: 'JFK', name: 'John F. Kennedy International Airport', city: 'New York', country: 'US', latitude: 40.6413, longitude: -73.7781 },
  { iata: 'SFO', name: 'San Francisco International Airport', city: 'San Francisco', country: 'US', latitude: 37.6213, longitude: -122.3790 },
  { iata: 'SEA', name: 'Seattle-Tacoma International Airport', city: 'Seattle', country: 'US', latitude: 47.4502, longitude: -122.3088 },
  { iata: 'LAS', name: 'Harry Reid International Airport', city: 'Las Vegas', country: 'US', latitude: 36.0840, longitude: -115.1537 },
  { iata: 'MCO', name: 'Orlando International Airport', city: 'Orlando', country: 'US', latitude: 28.4312, longitude: -81.3081 },
  { iata: 'MIA', name: 'Miami International Airport', city: 'Miami', country: 'US', latitude: 25.7959, longitude: -80.2870 },
  { iata: 'PHX', name: 'Phoenix Sky Harbor International Airport', city: 'Phoenix', country: 'US', latitude: 33.4352, longitude: -112.0101 },
  { iata: 'IAH', name: 'George Bush Intercontinental Airport', city: 'Houston', country: 'US', latitude: 29.9902, longitude: -95.3368 },
  { iata: 'BOS', name: 'Boston Logan International Airport', city: 'Boston', country: 'US', latitude: 42.3656, longitude: -71.0096 },
  { iata: 'MSP', name: 'Minneapolis-St Paul International Airport', city: 'Minneapolis', country: 'US', latitude: 44.8848, longitude: -93.2223 },
  { iata: 'EWR', name: 'Newark Liberty International Airport', city: 'Newark', country: 'US', latitude: 40.6895, longitude: -74.1745 },
  { iata: 'DTW', name: 'Detroit Metropolitan Wayne County Airport', city: 'Detroit', country: 'US', latitude: 42.2162, longitude: -83.3554 },
  { iata: 'PHL', name: 'Philadelphia International Airport', city: 'Philadelphia', country: 'US', latitude: 39.8744, longitude: -75.2424 },

  // Canada
  { iata: 'YYZ', name: 'Toronto Pearson International Airport', city: 'Toronto', country: 'CA', latitude: 43.6777, longitude: -79.6248 },
  { iata: 'YVR', name: 'Vancouver International Airport', city: 'Vancouver', country: 'CA', latitude: 49.1967, longitude: -123.1815 },
  { iata: 'YUL', name: 'Montréal-Pierre Elliott Trudeau Airport', city: 'Montreal', country: 'CA', latitude: 45.4707, longitude: -73.7408 },
  { iata: 'YYC', name: 'Calgary International Airport', city: 'Calgary', country: 'CA', latitude: 51.1315, longitude: -114.0106 },

  // Middle East
  { iata: 'DXB', name: 'Dubai International Airport', city: 'Dubai', country: 'AE', latitude: 25.2532, longitude: 55.3657 },
  { iata: 'DWC', name: 'Al Maktoum International Airport', city: 'Dubai', country: 'AE', latitude: 24.8968, longitude: 55.1613 },
  { iata: 'DOH', name: 'Hamad International Airport', city: 'Doha', country: 'QA', latitude: 25.2731, longitude: 51.6080 },
  { iata: 'AUH', name: 'Abu Dhabi International Airport', city: 'Abu Dhabi', country: 'AE', latitude: 24.4330, longitude: 54.6511 },
  { iata: 'TLV', name: 'Ben Gurion Airport', city: 'Tel Aviv', country: 'IL', latitude: 32.0114, longitude: 34.8867 },
  { iata: 'RUH', name: 'King Khalid International Airport', city: 'Riyadh', country: 'SA', latitude: 24.9576, longitude: 46.6988 },
  { iata: 'JED', name: 'King Abdulaziz International Airport', city: 'Jeddah', country: 'SA', latitude: 21.6796, longitude: 39.1565 },

  // Asia
  { iata: 'HND', name: 'Tokyo Haneda Airport', city: 'Tokyo', country: 'JP', latitude: 35.5494, longitude: 139.7798 },
  { iata: 'NRT', name: 'Narita International Airport', city: 'Tokyo', country: 'JP', latitude: 35.7647, longitude: 140.3863 },
  { iata: 'ICN', name: 'Incheon International Airport', city: 'Seoul', country: 'KR', latitude: 37.4602, longitude: 126.4407 },
  { iata: 'PEK', name: 'Beijing Capital International Airport', city: 'Beijing', country: 'CN', latitude: 40.0799, longitude: 116.6031 },
  { iata: 'PVG', name: 'Shanghai Pudong International Airport', city: 'Shanghai', country: 'CN', latitude: 31.1443, longitude: 121.8083 },
  { iata: 'HKG', name: 'Hong Kong International Airport', city: 'Hong Kong', country: 'HK', latitude: 22.3080, longitude: 113.9185 },
  { iata: 'SIN', name: 'Singapore Changi Airport', city: 'Singapore', country: 'SG', latitude: 1.3644, longitude: 103.9915 },
  { iata: 'BKK', name: 'Suvarnabhumi Airport', city: 'Bangkok', country: 'TH', latitude: 13.6900, longitude: 100.7501 },
  { iata: 'KUL', name: 'Kuala Lumpur International Airport', city: 'Kuala Lumpur', country: 'MY', latitude: 2.7456, longitude: 101.7099 },
  { iata: 'CGK', name: 'Soekarno-Hatta International Airport', city: 'Jakarta', country: 'ID', latitude: -6.1256, longitude: 106.6559 },
  { iata: 'DEL', name: 'Indira Gandhi International Airport', city: 'New Delhi', country: 'IN', latitude: 28.5665, longitude: 77.1031 },
  { iata: 'BOM', name: 'Chhatrapati Shivaji Maharaj International Airport', city: 'Mumbai', country: 'IN', latitude: 19.0896, longitude: 72.8656 },

  // Oceania
  { iata: 'SYD', name: 'Sydney Kingsford Smith Airport', city: 'Sydney', country: 'AU', latitude: -33.9399, longitude: 151.1753 },
  { iata: 'MEL', name: 'Melbourne Airport', city: 'Melbourne', country: 'AU', latitude: -37.6690, longitude: 144.8410 },
  { iata: 'BNE', name: 'Brisbane Airport', city: 'Brisbane', country: 'AU', latitude: -27.3942, longitude: 153.1218 },
  { iata: 'AKL', name: 'Auckland Airport', city: 'Auckland', country: 'NZ', latitude: -37.0081, longitude: 174.7850 },

  // South America
  { iata: 'GRU', name: 'São Paulo/Guarulhos International Airport', city: 'São Paulo', country: 'BR', latitude: -23.4356, longitude: -46.4731 },
  { iata: 'GIG', name: 'Rio de Janeiro/Galeão International Airport', city: 'Rio de Janeiro', country: 'BR', latitude: -22.8099, longitude: -43.2505 },
  { iata: 'BOG', name: 'El Dorado International Airport', city: 'Bogotá', country: 'CO', latitude: 4.7016, longitude: -74.1469 },
  { iata: 'EZE', name: 'Ministro Pistarini International Airport', city: 'Buenos Aires', country: 'AR', latitude: -34.8222, longitude: -58.5358 },
  { iata: 'MEX', name: 'Mexico City International Airport', city: 'Mexico City', country: 'MX', latitude: 19.4363, longitude: -99.0721 },
  { iata: 'CUN', name: 'Cancún International Airport', city: 'Cancún', country: 'MX', latitude: 21.0365, longitude: -86.8770 },

  // Africa
  { iata: 'CAI', name: 'Cairo International Airport', city: 'Cairo', country: 'EG', latitude: 30.1219, longitude: 31.4056 },
  { iata: 'JNB', name: 'O.R. Tambo International Airport', city: 'Johannesburg', country: 'ZA', latitude: -26.1392, longitude: 28.2460 },
  { iata: 'CPT', name: 'Cape Town International Airport', city: 'Cape Town', country: 'ZA', latitude: -33.9715, longitude: 18.6021 },
  { iata: 'CMN', name: 'Mohammed V International Airport', city: 'Casablanca', country: 'MA', latitude: 33.3675, longitude: -7.5898 },
];

async function seedAirports() {
  console.log('🛫 Starting airport seed...');
  console.log(`📊 Total airports to add: ${AIRPORTS_DATA.length}`);

  let addedCount = 0;
  let skippedCount = 0;

  for (const airport of AIRPORTS_DATA) {
    try {
      // Check if airport already exists
      const existing = await prisma.airport.findUnique({
        where: { iata: airport.iata },
      });

      if (existing) {
        console.log(`⏭️  Skipped ${airport.iata} - ${airport.name} (already exists)`);
        skippedCount++;
        continue;
      }

      // Create airport
      await prisma.airport.create({
        data: {
          iata: airport.iata,
          name: airport.name,
          city: airport.city,
          country: airport.country,
          latitude: airport.latitude,
          longitude: airport.longitude,
        },
      });

      console.log(`✅ Added ${airport.iata} - ${airport.name} (${airport.city}, ${airport.country})`);
      addedCount++;
    } catch (error) {
      console.error(`❌ Error adding ${airport.iata}:`, error);
    }
  }

  console.log('\n📈 Seed Summary:');
  console.log(`✅ Added: ${addedCount} airports`);
  console.log(`⏭️  Skipped: ${skippedCount} airports (already existed)`);
  console.log(`📊 Total in database: ${addedCount + skippedCount} airports`);

  // Verify total count
  const totalAirports = await prisma.airport.count();
  console.log(`\n🎯 Final database count: ${totalAirports} airports`);
}

// Execute seed
seedAirports()
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
