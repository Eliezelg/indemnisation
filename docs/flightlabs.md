API de retard de vol
Ce point de terminaison vous permettra de récupérer le retard d'un vol.
Il vous fournira également les heures d'embarquement, de départ, d'atterrissage et d'arrivée prévues . Vous recevrez également les heures réelles d'embarquement, de départ, d'atterrissage et d'arrivée.

Exemple de requête API :
https://www.goflightlabs.com/flight_delays?
clé d'accès
=VOTRE_CLE_D'ACCES&
retard
=60&
taper
=départs


Paramètres de la requête HTTP GET :
Paramètre		Description
access_key	requis	Votre clé d'accès API, qui se trouve dans le tableau de bord de votre compte
delay	requis	Temps de retard minimum requis (en minutes)
type	requis	Type de vols - départs ou arrivées
arr_iata	facultatif	Filtre de code IATA de l'aéroport d'arrivée
arr_icao	facultatif	Filtre de code OACI de l'aéroport d'arrivée
dep_iata	facultatif	Filtre de code IATA de l'aéroport de départ
dep_icao	facultatif	Filtre de code OACI de l'aéroport de départ
airline_iata	facultatif	Filtre de code IATA de compagnie aérienne
airline_icao	facultatif	Filtre de code OACI de compagnie aérienne
flight_iata	facultatif	Filtre de numéro de code IATA de vol
flight_icao	facultatif	Filtre de numéro de code OACI de vol
flight_number	facultatif	Filtre par numéro de vol
Exemple de réponse API :
                    
                    

        {
            "status": 200,
            "success": true,
            "data": [
                {
                    "airline_iata": "CZ",
                    "airline_icao": "CSN",
                    "flight_iata": "CZ6890",
                    "flight_icao": "CSN6890",
                    "flight_number": "6890",
                    "dep_iata": "CSX",
                    "dep_icao": "ZGHA",
                    "dep_terminal": "2",
                    "dep_gate": null,
                    "dep_time": "2024-03-15 19:10",
                    "dep_time_utc": "2024-03-15 11:10",
                    "dep_estimated": "2024-03-15 20:10",
                    "dep_estimated_utc": "2024-03-15 12:10",
                    "dep_actual": "2024-03-15 20:10",
                    "dep_actual_utc": "2024-03-15 12:10",
                    "arr_iata": "URC",
                    "arr_icao": "ZWWW",
                    "arr_terminal": "3",
                    "arr_gate": null,
                    "arr_baggage": null,
                    "arr_time": "2024-03-15 23:55",
                    "arr_time_utc": "2024-03-15 15:55",
                    "arr_estimated": "2024-03-16 01:08",
                    "arr_estimated_utc": "2024-03-15 17:08",
                    "cs_airline_iata": null,
                    "cs_flight_number": null,
                    "cs_flight_iata": null,
                    "status": "active",
                    "duration": 285,
                    "delayed": 73,
                    "dep_delayed": 60,
                    "arr_delayed": 73,
                    "aircraft_icao": null,
                    "arr_time_ts": 1710518100,
                    "dep_time_ts": 1710501000,
                    "arr_estimated_ts": 1710522480,
                    "dep_estimated_ts": 1710504600,
                    "dep_actual_ts": 1710504600
                },
                {..}
            ]
        }
                    

                
Objets de réponse API :
Objet de réponse	Description
airline_iata	Code IATA de la compagnie aérienne.
airline_icao	Code OACI de la compagnie aérienne.
flight_iata	Numéro de code IATA du vol.
flight_icao	Numéro de code OACI du vol.
flight_number	Numéro de vol uniquement.
dep_iata	Code IATA de l'aéroport de départ.
dep_icao	Code OACI de l'aéroport de départ.
arr_iata	Code IATA de l'aéroport d'arrivée.
arr_icao	Code OACI de l'aéroport d'arrivée.
duration	Durée de vol estimée (en minutes).
delayed	Temps de retard estimé du vol (en minutes).
status	Statut du vol - prévu, annulé, actif, atterri.
dep_terminal	Terminal de départ.
dep_gate	Porte d'embarquement.
dep_time	Heure de départ dans le fuseau horaire local.
dep_time_utc	Heure de départ en UTC.
dep_estimated	Heure de départ estimée dans le fuseau horaire local.
dep_estimated_utc	Heure de départ estimée en UTC.
dep_actual	Heure de départ réelle dans le fuseau horaire local.
dep_actual_utc	Heure de départ réelle en UTC.
arr_terminal	Terminal d'arrivée.
arr_gate	Porte d'arrivée.
arr_baggage	Zone de récupération des bagages.
arr_time	Heure d'arrivée dans le fuseau horaire local.
arr_time_utc	Heure d'arrivée en UTC.
arr_estimated	Heure d'arrivée estimée dans le fuseau horaire local
arr_estimated_utc	Heure d'arrivée estimée en UTC.
cs_airline_iata	Code IATA de la compagnie aérienne associée.
cs_flight_number	Numéro de vol associé.
cs_flight_iata	Code IATA du vol associé.
dep_delayed	Temps de retard au départ..
arr_delayed	Retard à l'arrivée.
aircraft_icao	Type d'aéronef au format OACI.
arr_time_ts	Horodatage d'arrivée
dep_time_ts	Horodatage du départ.
arr_estimated_ts	Horodatage de l'arrivée estimée.
dep_estimated_ts	Horodatage du départ estimé.
dep_actual_ts	Horodatage du départ réel.



Historical Flights API
Apart from providing data about real-time flight, the API's flights endpoint is also capable of looking up data about historical flights.

Example API Call:
https://www.goflightlabs.com/historical?
access_key
=YOUR_ACCESS_KEY&
code
=LGA&
date_to
=2025-02-04T20:00&
date_from
=2025-02-04T12:00&
type
=departure


HTTP GET Request Parameters:
Object		Description
access_key	required	Your API access key, which can be found in your account dashboard.
code	required	Airport IATA code. This field will filter the results based on the Departure or Arrival Airport IATA Code, depending on the selected "type".
type	required	Either "departure" or "arrival" as both within the same query is not possible.
date_from	required	Beginning of the search range (local time, format: YYYY-MM-DDTHH:MM). Note: You can query dates up to 210 days in the past from the current date.
date_to	required	End of the search range (local time, format:YYYY-MM-DDTHH:MM). Must be more than beggining of the search range by no more than 12 hours.
date	optional	Filter by a specific date (local time, format: YYYY-MM-DD). This field will override both the 'date_from' and 'date_to' fields, returning data for the entire 24-hour range of the specified date.
dep_iataCode	optional	Filter by departure airport if "arrival" for "&type=" was chosen, based on the airport IATA code.
arr_iataCode	optional	Filter your results by arrival airport if "departure" for "&type=" was chosen, based on the airport IATA code.
airline_iata	optional	Option to filter airline based on airline IATA code
flight_num	optional	Option to filter a specific flight based on its flight number. Example: 5703
Example API Response:
                    

                    {
                        "status": 200,
                        "success": true,
                        "data": [
                            {
                                "movement": {
                                  "airport": {
                                    "name": "Omaha"
                                  },
                                  "scheduledTime": {
                                    "utc": "2023-10-04 12:13Z",
                                    "local": "2023-10-04 08:13-04:00"
                                  },
                                  "terminal": "C",
                                  "quality": [
                                    "Basic"
                                  ]
                                },
                                "number": "DL 4094",
                                "status": "Unknown",
                                "codeshareStatus": "Unknown",
                                "isCargo": false,
                                "aircraft": {
                                  "model": "Bombardier CRJ900"
                                },
                                "airline": {
                                  "name": "Delta Air Lines",
                                  "iata": "DL",
                                  "icao": "DAL"
                                }
                            },
                            {...}
                        ]
                    }
                    

                
API Response Objects:
Response Object	Description
movement > airport > name	The name of the airport.
movement > scheduledTime > utc	The scheduled time in Coordinated Universal Time (UTC).
movement > scheduledTime > local	The scheduled time in the local time zone.
movement > terminal	The terminal of the flight.
movement > quality	An array of quality characteristics of the data.
number	The flight number.
status	The status of the flight.
codeshareStatus	The code-share status of the flight.
isCargo	Indicates whether the flight is a cargo flight.
aircraft > model	The model of the aircraft.
aircraft > name	The name of the airline.
aircraft > iata	The IATA code of the airline.
aircraft > icao	The ICAO code of the airline.

Flight Schedules API.
The API is capable of tracking flights and retrieving flight status information in real-time. In order to look up real-time information about one or multiple flights, you can use the API's flights endpoint together with optional parameters to filter your result set.

Example API Request For the departure schedule of a certain airport:
https://www.goflightlabs.com/advanced-flights-schedules?
access_key
=YOUR_ACCESS_KEY&
iataCode
=JFK&
type
=departure


HTTP GET Request Parameters:
Object		Description
access_key	required	Your API access key, which can be found in your account dashboard.
iataCode	required	Specify the Airport IATA code you would like to request, based on the selected "Type" (departure or arrival).
type	optional	Flight type, either "departure" or "arrival". If not specified, it will default to "arrival".
airline_iata	optional	IATA code of airline
airline_icao	optional	ICAO code of airline
flight_iata	optional	The flight iata number consisting of digits and letters, usually of the airline iata code. For example: AA171
flight_icao	optional	The flight icao number consisting of digits and letters, usually the airline icao code. For example: AAL171
arr_actual	optional	The actual arrival time in the local airport time zone.
arr_actual_utc	optional	The actual arrival time in the UTC time zone.
arr_actual_ts	optional	UNIX timestamp of the actual arrival time.
limit	optional	Limit the number of flights returned.
skip	optional	Number of records to skip before starting to return results.
Defaults to 0 if not set. Use together with limit to paginate through the data.
For example, if you use limit=10 and skip=0, it will return results 1 to 10.
If you use skip=1, it will return results 11 to 20. You can keep increasing skip until has_more is false.
Example API Response:
                        

                        {
                            "success": true,
                            "type": "departure",
                            "data": [
                                {
                                    "airline_iata": "BW",
                                    "airline_icao": "BWA",
                                    "flight_iata": "BW521",
                                    "flight_icao": "BWA521",
                                    "flight_number": "521",
                                    "dep_iata": "JFK",
                                    "dep_icao": "KJFK",
                                    "dep_terminal": "4",
                                    "dep_gate": null,
                                    "dep_time": "2024-03-12 07:30",
                                    "dep_time_utc": "2024-03-12 11:30",
                                    "dep_estimated": "2024-03-12 07:03",
                                    "dep_estimated_utc": "2024-03-12 11:03",
                                    "dep_actual": "2024-03-12 07:03",
                                    "dep_actual_utc": "2024-03-12 11:03",
                                    "arr_iata": "POS",
                                    "arr_icao": "TTPP",
                                    "arr_terminal": null,
                                    "arr_gate": null,
                                    "arr_baggage": null,
                                    "arr_time": "2024-03-12 12:30",
                                    "arr_time_utc": "2024-03-12 16:30",
                                    "arr_estimated": "2024-03-12 12:10",
                                    "arr_estimated_utc": "2024-03-12 16:10",
                                    "arr_actual": "2024-11-26 13:44",
                                    "arr_actual_utc": "2024-11-26 18:44",
                                    "cs_airline_iata": null,
                                    "cs_flight_number": null,
                                    "cs_flight_iata": null,
                                    "status": "active",
                                    "duration": 300,
                                    "delayed": null,
                                    "dep_delayed": null,
                                    "arr_delayed": null,
                                    "aircraft_icao": null,
                                    "arr_time_ts": 1710261000,
                                    "dep_time_ts": 1710243000,
                                    "arr_estimated_ts": 1710259800,
                                    "dep_estimated_ts": 1710241380,
                                    "arr_actual_ts": 1732646640,
                                    "dep_actual_ts": 1710241380
                                },
                                { ... },
                            ]
                        }
                        

                    
API Response Objects:
Response Object	Description
airline_iata	Airline IATA code.
airline_icao	Airline ICAO code.
flight_iata	Flight IATA code-number.
flight_icao	Flight ICAO code-number.
flight_number	Flight number only.
dep_iata	Departure airport IATA code.
dep_icao	Departure airport ICAO code.
dep_terminal	Estimated departure terminal.
dep_gate	Estimated departure gate
dep_time	Departure time in the airport time zone.
dep_time_utc	Departure time in UTC time zone
dep_estimated	Updated departure time in the airport time zone.
dep_estimated_utc	Updated departure time in UTC time zone.
dep_actual	Actual departure time in the airport time zone.
dep_actual_utc	Actual departure time in UTC time zone.
arr_actual	The actual arrival time in the local airport time zone.
arr_actual_utc	The actual arrival time in the UTC time zone.
arr_iata	Arrival airport IATA code.
arr_icao	Arrival airport ICAO code.
arr_terminal	Estimated arrival terminal.
arr_gate	Estimated arrival gate.
arr_baggage	Arrival baggage claim carousel number.
arr_time	Arrival time in the airport time zone.
arr_time_utc	Arrival time in UTC time zone.
arr_estimated	Updated arrival time in the airport time zone.
arr_estimated_utc	Updated arrival time in UTC time zone.
cs_airline_iata	Codeshared airline IATA code.
cs_flight_number	Codeshared flight number.
cs_flight_iata	Codeshared flight IATA code-number.
status	Flight status - scheduled, cancelled, active, landed.
duration	Estimated flight time (in minutes).
delayed	(Deprecated) Estimated flight delay time (in minutes).
dep_delayed	Estimated time of flight departure delay (in minutes).
arr_delayed	Estimated time of flight arrival delay (in minutes).
aircraft_icao	Aircraft ICAO code.
arr_time_ts	Arrival UNIX timestamp.
dep_time_ts	Departure UNIX timestamp.
arr_estimated_ts	Updated arrival UNIX timestamp.
dep_estimated_ts	Updated departure UNIX timestamp.
arr_actual_ts	UNIX timestamp of the actual arrival time.
dep_actual_ts	Actual departure UNIX timestamp.
limit	Number of items returned per request. Only present when limit is used.
skip	Number of items skipped from the beginning of the result set. Only present when limit is used.
total_items	Total number of items matching the query. Only present when limit is used.
has_more	Whether more results are available. Only present when limit is used.
