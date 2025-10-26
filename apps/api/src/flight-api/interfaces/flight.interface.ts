export interface FlightData {
  flightNumber: string;
  airline: string;
  airlineCode: string;
  departureAirport: string;
  arrivalAirport: string;
  departureTime?: string;
  arrivalTime?: string;
  flightDate: string;
  status?: string;
  actualDepartureTime?: string;
  actualArrivalTime?: string;
  delayMinutes?: number;
}

export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
}
