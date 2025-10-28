import { Injectable, Logger } from '@nestjs/common';
import NodeCache from 'node-cache';
import { FlightData } from '../interfaces/flight.interface';

/**
 * Flight cache service to reduce API calls
 *
 * Cache strategy:
 * - Future flights (>= today): 1 hour TTL (flight status may change)
 * - Past flights (< today): 24 hours TTL (historical data is stable)
 * - Failed searches: 10 minutes TTL (retry later in case of API issues)
 */
@Injectable()
export class FlightCacheService {
  private readonly logger = new Logger(FlightCacheService.name);
  private cache: NodeCache;

  constructor() {
    // Create cache with default TTL of 1 hour
    this.cache = new NodeCache({
      stdTTL: 3600, // 1 hour in seconds
      checkperiod: 600, // Check for expired keys every 10 minutes
      useClones: false, // Don't clone objects (better performance)
    });

    this.logger.log('Flight cache initialized');
  }

  /**
   * Generate cache key from flight number and date
   */
  private getCacheKey(flightNumber: string, date: string): string {
    return `flight:${flightNumber.toUpperCase()}:${date}`;
  }

  /**
   * Calculate appropriate TTL based on flight date
   */
  private calculateTTL(flightDate: string): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const flight = new Date(flightDate);
    flight.setHours(0, 0, 0, 0);

    // Past flight: cache for 24 hours (historical data doesn't change)
    if (flight < today) {
      return 24 * 3600; // 24 hours
    }

    // Future flight: cache for 1 hour (status may change)
    return 3600; // 1 hour
  }

  /**
   * Get cached flight data
   */
  get(flightNumber: string, date: string): FlightData | null | undefined {
    const key = this.getCacheKey(flightNumber, date);
    const cached = this.cache.get<FlightData | null>(key);

    if (cached !== undefined) {
      this.logger.log(`Cache HIT for ${flightNumber} on ${date}`);
      return cached;
    }

    this.logger.log(`Cache MISS for ${flightNumber} on ${date}`);
    return undefined;
  }

  /**
   * Set flight data in cache
   */
  set(flightNumber: string, date: string, data: FlightData | null): void {
    const key = this.getCacheKey(flightNumber, date);
    const ttl = this.calculateTTL(date);

    this.cache.set(key, data, ttl);

    this.logger.log(
      `Cached ${flightNumber} on ${date} (TTL: ${ttl}s, found: ${data !== null})`,
    );
  }

  /**
   * Cache a failed search (null result) with shorter TTL
   */
  setNotFound(flightNumber: string, date: string): void {
    const key = this.getCacheKey(flightNumber, date);
    const ttl = 600; // 10 minutes for failed searches

    this.cache.set(key, null, ttl);

    this.logger.log(
      `Cached NOT FOUND for ${flightNumber} on ${date} (TTL: ${ttl}s)`,
    );
  }

  /**
   * Clear cache entry
   */
  delete(flightNumber: string, date: string): void {
    const key = this.getCacheKey(flightNumber, date);
    this.cache.del(key);
    this.logger.log(`Deleted cache entry for ${flightNumber} on ${date}`);
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.flushAll();
    this.logger.log('Cache cleared');
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const stats = this.cache.getStats();
    return {
      keys: this.cache.keys().length,
      hits: stats.hits,
      misses: stats.misses,
      ksize: stats.ksize,
      vsize: stats.vsize,
    };
  }
}
