import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DistanceService {
  constructor(private prisma: PrismaService) {}

  /**
   * Calculate distance between two airports using Haversine formula
   * @param iataFrom - IATA code of departure airport
   * @param iataTo - IATA code of arrival airport
   * @returns Distance in kilometers
   */
  async calculateDistance(iataFrom: string, iataTo: string): Promise<number> {
    // Fetch airports from database
    const [from, to] = await Promise.all([
      this.prisma.airport.findUnique({ where: { iata: iataFrom.toUpperCase() } }),
      this.prisma.airport.findUnique({ where: { iata: iataTo.toUpperCase() } }),
    ]);

    if (!from) {
      throw new NotFoundException(`Airport not found: ${iataFrom}`);
    }

    if (!to) {
      throw new NotFoundException(`Airport not found: ${iataTo}`);
    }

    return this.haversine(from.latitude, from.longitude, to.latitude, to.longitude);
  }

  /**
   * Haversine formula to calculate great-circle distance between two points
   * @param lat1 - Latitude of first point
   * @param lon1 - Longitude of first point
   * @param lat2 - Latitude of second point
   * @param lon2 - Longitude of second point
   * @returns Distance in kilometers
   */
  private haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of Earth in kilometers

    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return Math.round(distance); // Round to nearest km
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
