# Airline & Airport code API

API endpoint for this API is: **`https://api.flightapi.io/iata`**

## Guide

Your API requests are authenticated using API keys. Any request that doesn't include an API key will return an error.

You can generate an API key from your Dashboard at any time.

Here is the list of default parameters you have to use with this API:

| Parameters                                                      | Description                                                                                                                                                    | Type     |
| --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| <p>api\_key<br><br><mark style="color:red;">required</mark></p> | This is your personal API key. You can find this on your Dashboard.                                                                                            | `String` |
| <p>name<br><br><mark style="color:red;">required</mark></p>     | This could be any string matching an airline or an airport.                                                                                                    | `String` |
| <p>type<br><br><mark style="color:red;">required</mark></p>     | <p>type could be either an <strong><code>airline</code></strong> or <strong><code>airport</code></strong>.<br><br><mark style="color:red;">required</mark></p> | `String` |

## Usage

You have to send a GET request to  `https://api.flightapi.io/trackbyroute` along with all the parameters.&#x20;

Take a look at how you might call this API using various different coding languages.

{% tabs %}
{% tab title="curl" %}

```bash
curl "https://api.flightapi.io/iata/api-key?name=american&type=airline"
```

{% endtab %}

{% tab title="Node" %}

```javascript
// require the Unirest or any other module to make an HTTP GET request
const unirest = require('unirest')

unirest.get('https://api.flightapi.io/iata/api-key?name=american&type=airline')
  .then(response => {
    console.log(response.body);
  })
  .catch(error => {
    console.log(error);
  });


```

{% endtab %}

{% tab title="Python" %}

```python
// Set your API key before making the request
import requests

resp = requests.get('https://api.flightapi.io/iata/api-key?name=american&type=airline')
print (resp.json())
```

{% endtab %}
{% endtabs %}

### Response

The sample response of the API will look somewhat like this.

{% code overflow="wrap" fullWidth="false" %}

```json
// Sample Response
{
  "data": [
    {
      "fs": "AA",
      "name": "American Airlines"
    },
    {
      "fs": "SCM",
      "name": "American Jet International"
    },
    {
      "fs": "NA",
      "name": "North American Airlines"
    },
    {
      "fs": "GTW",
      "name": "American Air Charter"
    }
  ]
}
  
```

{% endcode %}

{% hint style="info" %}
It is just a sample API response. Some objects will have more attributes. A new array might also be there.
{% endhint %}



# Airport Schedule API

API endpoint for this API is: **`https://api.flightapi.io/schedule`**

## Guide

Your API requests are authenticated using API keys. Any request that doesn't include an API key will return an error.

You can generate an API key from your Dashboard at any time.

Here is the list of default parameters you have to use with this API:

| Parameters                                                      | Description                                                                                                                                                                                                                | Type     |
| --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| <p>api\_key<br><br><mark style="color:red;">required</mark></p> | This is your personal API key. You can find this on your Dashboard.                                                                                                                                                        | `String` |
| <p>mode<br><br><mark style="color:red;">required</mark></p>     | <p>The value of mode could be either <strong><code>arrivals</code></strong> or <strong><code>departures</code></strong>.<br><br><mark style="color:red;">required</mark></p>                                               | `String` |
| <p>day<br><br><mark style="color:red;">required</mark></p>      | <p>The value of day could be as follows:<br><br><strong>-1(yesterday), -2(day before yesterday), 1(today), or 2(tomorrow)</strong><br><br><mark style="color:red;">Not</mark> <mark style="color:red;">required</mark></p> | `String` |
| <p>iata<br><br><mark style="color:red;">required</mark></p>     | <p>This is the IATA code of the airport.<br><br><mark style="color:red;">required</mark></p>                                                                                                                               | `String` |
| page                                                            | To change the page number and get more data                                                                                                                                                                                | `String` |

{% hint style="info" %}
If you don't pass the day parameter then our API will respond with the complete schedule of the airport from the last 5 days to the next 5 days. Credit cost also depends on the number of days you receive.
{% endhint %}

## Usage

You have to send a GET request to  `https://api.flightapi.io/schedule` along with all the parameters.&#x20;

Take a look at how you might call this API using various different coding languages.

{% tabs %}
{% tab title="curl" %}

```bash
curl "https://api.flightapi.io/schedule/api_key?mode=departures&iata=DOH&day=1"
```

{% endtab %}

{% tab title="Node" %}

```javascript
// require the Unirest or any other module to make an HTTP GET request
const unirest = require('unirest')

unirest.get('https://api.flightapi.io/schedule/api_key?mode=departures&iata=DOH&day=1')
  .then(response => {
    console.log(response.body);
  })
  .catch(error => {
    console.log(error);
  });


```

{% endtab %}

{% tab title="Python" %}

```python
// Set your API key before making the request
import requests

resp = requests.get('https://api.flightapi.io/schedule/api_key?mode=departures&iata=DOH&day=1')
print (resp.json())
```

{% endtab %}
{% endtabs %}

### Response

The sample response of the API will look somewhat like this.

{% code overflow="wrap" fullWidth="false" %}

```json
// Sample Response
{
  "airport": {
    "pluginData": {
      "details": {
        "name": "Doha Hamad International Airport",
        "code": {
          "iata": "DOH",
          "icao": "OTHH"
        },
        "delayIndex": {
          "arrivals": null,
          "departures": null
        },
        "stats": null,
        "position": {
          "latitude": 25.273056,
          "longitude": 51.608055,
          "elevation": 13,
          "country": {
            "name": "Qatar",
            "code": "QA",
            "id": 179
          },
          "region": {
            "city": "Doha"
          }
        },
        "timezone": {
          "name": "Asia/Qatar",
          "offset": 10800,
          "abbr": "+03",
          "abbrName": null,
          "isDst": false
        },
        "url": {
          "homepage": "http://www.dohaairport.com/",
          "webcam": null,
          "wikipedia": "https://en.wikipedia.org/wiki/Hamad_International_Airport"
        },
        "airportImages": {
          "thumbnails": [
            {
              "src": "https://cdn.jetphotos.com/200/6/90049_1422800586_tb.jpg",
              "link": "https://www.jetphotos.com/photo/7976131",
              "copyright": "Sebastian Thiel",
              "source": "Jetphotos.com"
            }
          ],
          "medium": [
            {
              "src": "https://cdn.jetphotos.com/400/6/90049_1422800586.jpg",
              "link": "https://www.jetphotos.com/photo/7976131",
              "copyright": "Sebastian Thiel",
              "source": "Jetphotos.com"
            }
          ],
          "large": [
            {
              "src": "https://cdn.jetphotos.com/640cb/6/90049_1422800586.jpg",
              "link": "https://www.jetphotos.com/photo/7976131",
              "copyright": "Sebastian Thiel",
              "source": "Jetphotos.com"
            }
          ]
        },
        "visible": true
      },
      "flightdiary": {
        "url": "/data/airports/doh/reviews",
        "ratings": {
          "avg": 4.33,
          "total": 4244
        },
        "comment": [
          {
            "content": "This airport is very very very big so when we arrived it took ages riding on the bus. The lounge was nice and it's food was good. The bathroom was very high in technology and the airport is quite close to the city. They had Wi-Fi but in Immigration they were very cautious so it took a long time to get to our gate. And the airport was covered in decorations everywhere!",
            "author": {
              "facebookId": null,
              "name": "WMCP"
            },
            "timestamp": 1594547417
          }
        ],
        "reviews": 121,
        "evaluation": 87
      },
      "schedule": {
        "departures": {
          "item": {
            "current": 100,
            "total": 206,
            "limit": 100
          },
          "page": {
            "current": 1,
            "total": 3
          },
          "timestamp": 1594550280,
          "data": [
            {
              "flight": {
                "identification": {
                  "id": null,
                  "row": 5019209141,
                  "number": {
                    "default": "QR8221",
                    "alternative": null
                  },
                  "callsign": null,
                  "codeshare": null
                },
                "status": {
                  "live": false,
                  "text": "Scheduled",
                  "icon": null,
                  "estimated": null,
                  "ambiguous": false,
                  "generic": {
                    "status": {
                      "text": "scheduled",
                      "type": "departure",
                      "color": "gray",
                      "diverted": null
                    },
                    "eventTime": {
                      "utc": null,
                      "local": null
                    }
                  }
                },
                "aircraft": {
                  "model": {
                    "code": "74N",
                    "text": ""
                  },
                  "hex": "",
                  "registration": "",
                  "serialNo": "",
                  "images": null
                },
                "owner": null,
                "airline": {
                  "name": "Qatar Airways",
                  "code": {
                    "iata": "QR",
                    "icao": "QTR"
                  },
                  "short": "Qatar Airways"
                },
                "airport": {
                  "origin": {
                    "timezone": {
                      "name": "Asia/Qatar",
                      "offset": 10800,
                      "abbr": "+03",
                      "abbrName": null,
                      "isDst": false
                    },
                    "info": {
                      "terminal": null,
                      "baggage": null,
                      "gate": null
                    }
                  },
                  "destination": {
                    "code": {
                      "iata": "FRA",
                      "icao": "EDDF"
                    },
                    "timezone": {
                      "name": "Europe/Berlin",
                      "offset": 7200,
                      "abbr": "CEST",
                      "abbrName": "Central European Summer Time",
                      "isDst": true
                    },
                    "info": {
                      "terminal": null,
                      "baggage": null,
                      "gate": null
                    },
                    "name": "Frankfurt Airport",
                    "position": {
                      "latitude": 50.037796,
                      "longitude": 8.555783,
                      "country": {
                        "name": "Germany",
                        "code": "DE",
                        "id": 83
                      },
                      "region": {
                        "city": "Frankfurt"
                      }
                    },
                    "visible": true
                  },
                  "real": null
                },
                "time": {
                  "scheduled": {
                    "departure": 1594550400,
                    "arrival": 1594572900
                  },
                  "real": {
                    "departure": null,
                    "arrival": null
                  },
                  "estimated": {
                    "departure": null,
                    "arrival": null
                  },
                  "other": {
                    "eta": null,
                    "duration": null
                  }
                }
              }
            },
            {
              "flight": {
                "identification": {
                  "id": null,
                  "row": 5019209199,
                  "number": {
                    "default": "QR8860",
                    "alternative": null
                  },
                  "callsign": null,
                  "codeshare": null
                },
                "status": {
                  "live": false,
                  "text": "Scheduled",
                  "icon": null,
                  "estimated": null,
                  "ambiguous": false,
                  "generic": {
                    "status": {
                      "text": "scheduled",
                      "type": "departure",
                      "color": "gray",
                      "diverted": null
                    },
                    "eventTime": {
                      "utc": null,
                      "local": null
                    }
                  }
                },
                "aircraft": {
                  "model": {
                    "code": "77W",
                    "text": ""
                  },
                  "hex": "",
                  "registration": "",
                  "serialNo": "",
                  "images": null
                },
                "owner": null,
                "airline": {
                  "name": "Qatar Airways",
                  "code": {
                    "iata": "QR",
                    "icao": "QTR"
                  },
                  "short": "Qatar Airways"
                },
                ...
                
              }
      }
  
```

{% endcode %}

{% hint style="info" %}
It is just a sample API response. Some objects will have more attributes. A new array might also be there.
{% endhint %}


# Track Flights between Airports

API endpoint for this API is: **`https://api.flightapi.io/trackbyroute`**

## Guide

Your API requests are authenticated using API keys. Any request that doesn't include an API key will return an error.

You can generate an API key from your Dashboard at any time.

Here is the list of default parameters you have to use with this API:

| Parameters                                                      | Description                                                                                            | Type     |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | -------- |
| <p>api\_key<br><br><mark style="color:red;">required</mark></p> | This is your personal API key. You can find this on your Dashboard.                                    | `String` |
| <p>date<br><br><mark style="color:red;">required</mark></p>     | <p>This is the date of departure<br><br>Format - YYYYMMDD</p>                                          | `String` |
| <p>airport1<br><br><mark style="color:red;">required</mark></p> | <p>This is the IATA code of the departure airport.<br><br><mark style="color:red;">required</mark></p> | `String` |
| <p>airport2<br><br><mark style="color:red;">required</mark></p> | <p>This is the IATA code of the arrival airport.<br><br><mark style="color:red;">required</mark></p>   | `String` |

## Usage

You have to send a GET request to  `https://api.flightapi.io/trackbyroute` along with all the parameters.&#x20;

Take a look at how you might call this API using various different coding languages.

{% tabs %}
{% tab title="curl" %}

```bash
curl "https://api.flightapi.io/trackbyroute/api_key?date=20230724&airport1=AMS&airport2=LIS"
```

{% endtab %}

{% tab title="Node" %}

```javascript
// require the Unirest or any other module to make an HTTP GET request
const unirest = require('unirest')

unirest.get('https://api.flightapi.io/trackbyroute/api_key?date=20230724&airport1=AMS&airport2=LIS')
  .then(response => {
    console.log(response.body);
  })
  .catch(error => {
    console.log(error);
  });


```

{% endtab %}

{% tab title="Python" %}

```python
// Set your API key before making the request
import requests

resp = requests.get('https://api.flightapi.io/trackbyroute/api_key?date=20230724&airport1=AMS&airport2=LIS')
print (resp.json())
```

{% endtab %}
{% endtabs %}

### Response

The sample response of the API will look somewhat like this.

{% code overflow="wrap" fullWidth="false" %}

```json
// Sample Response
     [
       {
          "Airline": "AeroMexico",
          "FlightNumber": "6552",
          "Status": "In Air",
          "Operated By": "KLM Royal Dutch Airlines1697",
          "DepartureTime": "9:08 PM, Apr 24",
          "ArrivalTime": "10:54 PM, Apr 24"
        },
        {
          "Airline": "Air Baltic Corp",
          "FlightNumber": "5296",
          "Status": "Arrived",
          "Operated By": "TAP Portugal673",
          "DepartureTime": "3:09 PM, Apr 24",
          "ArrivalTime": "4:59 PM, Apr 24"
         },
         {
           ...
         }
       ]
  
```

{% endcode %}

{% hint style="info" %}
It is just a sample API response. Some objects will have more attributes. A new array might also be there.
{% endhint %}


# Flight Tracking API

API endpoint for this API is: **`https://api.flightapi.io/airline`**

## Guide

Your API requests are authenticated using API keys. Any request that doesn't include an API key will return an error.

You can generate an API key from your Dashboard at any time.

Here is the list of default parameters you have to use with this API:

| Parameters                                                      | Description                                                                                                                                  | Type     |
| --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| <p>api\_key<br><br><mark style="color:red;">required</mark></p> | This is your personal API key. You can find this on your Dashboard.                                                                          | `String` |
| <p>num<br><br><mark style="color:red;">required</mark></p>      | This is the official flight number. You should know this in advance.                                                                         | `String` |
| <p>name<br><br><mark style="color:red;">required</mark></p>     | This is the airline code.                                                                                                                    | `String` |
| <p>date<br><br><mark style="color:red;">required</mark></p>     | <p>This is the date for which you wan to track this plane.<br><br>Format - YYYYMMDD</p>                                                      | `String` |
| <p>depap<br><br></p>                                            | This represents the target departure airport. It’s only required when two flights with the same name are departing from different locations. | `String` |

## Usage

You have to send a GET request to  `https://api.flightapi.io/airline` along with all the parameters.&#x20;

Take a look at how you might call this API using various different coding languages.

{% tabs %}
{% tab title="curl" %}

```bash
curl "https://api.flightapi.io/airline/6537facc0175698b26894ef8d67bc?num=33&name=DL&date=20231024"
```

{% endtab %}

{% tab title="Node" %}

```javascript
// require the Unirest or any other module to make an HTTP GET request
const unirest = require('unirest')

unirest.get('https://api.flightapi.io/airline/6537facc0175698b26894ef8d67bc?num=33&name=DL&date=20231024')
  .then(response => {
    console.log(response.body);
  })
  .catch(error => {
    console.log(error);
  });


```

{% endtab %}

{% tab title="Python" %}

```python
// Set your API key before making the request
import requests

resp = requests.get('https://api.flightapi.io/airline/6537facc0175698b26894ef8d67bc?num=33&name=DL&date=20231024')
print (resp.json())
```

{% endtab %}
{% endtabs %}

### Response

The sample response of the API will look somewhat like this.

{% code overflow="wrap" fullWidth="false" %}

```json
// Sample Response

[
  {
    "departure": {
    "offGroundTime": "15:27, Jul 16",
    "outGateTime": null,
    "gate": null,
    "departureDateTime": "2025-07-16T15:27:00+02:00",
    "airport": "Barcelona",
    "airportCity": "Barcelona",
    "airportCode": "BCN",
    "airportCountryCode": "ES",
    "airportSlug": "BCN-Barcelona-Spain",
    "scheduledTime": "14:55, Jul 16",
    "estimatedTime": null,
    "terminal": "1"
    }
  },
  {
    "arrival": {
    "timeRemaining": "1 hr 12 min",
    "onGroundTime": null,
    "inGateTime": null,
    "gate": null,
    "baggage": null,
    "arrivalDateTime": "2025-07-16T16:21:00+01:00",
    "airport": "Heathrow",
    "airportCity": "London",
    "airportCode": "LHR",
    "airportCountryCode": "GB",
    "airportSlug": "LHR-London-UK-(Heathrow)",
    "scheduledTime": "16:15, Jul 16",
    "estimatedTime": "16:21, Jul 16",
    "terminal": "5"
    }
  }
]
  
```

{% endcode %}

{% hint style="info" %}
It is just a sample API response. Some objects will have more attributes. A new array might also be there.
{% endhint %}
