/* ================================================================
   REAL airport ground data (runways.js consumes this).
   ================================================================
   Sourced from OurAirports runways.csv (see groundDataStatus below),
   provided by the user as all_airports_ground_data.js/.json. This is a
   plain, non-module copy of that same data (the original used `export
   const`, which this project's plain <script> architecture doesn't
   support) — every value below is byte-for-byte the same as provided.

   runways[].thresholdA / thresholdB are real [lat, lon] runway endpoint
   coordinates. gate / taxiways / taxilanes / parkingPositions are
   intentionally empty for every airport — that data was never provided,
   and per instruction this file must NOT invent placeholder values for
   it. Consumers (runways.js, runway-debug.js, tickets.js) must treat an
   empty/null gate as "no gate data available", not fall back to a fake
   one. */
const AIRPORT_GROUND_DATA = {
  "version": 1,
  "generatedFromUserList": true,
  "airportCount": 254,
  "airportEntries": [
    {
      "iata": "ABJ",
      "icao": "DIAP",
      "airport": "F\u00e9lix-Houphou\u00ebt-Boigny International Airport",
      "city": "Abidjan",
      "country": "CI",
      "runways": [
        {
          "id": "237074",
          "runway": "03/21",
          "thresholdA": [
            5.24884987,
            -3.93144989
          ],
          "thresholdB": [
            5.27392006,
            -3.92113996
          ],
          "headingA": 23.0,
          "headingB": 203.0,
          "lengthM": 3000.1,
          "widthM": 50.0
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "ABQ",
      "icao": "KABQ",
      "airport": "Albuquerque International Sunport",
      "city": "Albuquerque",
      "country": "US",
      "runways": [
        {
          "id": "253207",
          "runway": "03/21",
          "thresholdA": [
            35.02220154,
            -106.6309967
          ],
          "thresholdB": [
            35.04169846,
            -106.60700226
          ],
          "headingA": 45.0,
          "headingB": 225.0,
          "lengthM": 3048.0,
          "widthM": 45.7
        },
        {
          "id": "253208",
          "runway": "08/26",
          "thresholdA": [
            35.04430008,
            -106.62200165
          ],
          "thresholdB": [
            35.04410172,
            -106.5759964
          ],
          "headingA": 90.0,
          "headingB": 270.0,
          "lengthM": 4204.1,
          "widthM": 45.7
        },
        {
          "id": "253209",
          "runway": "12/30",
          "thresholdA": [
            35.04349899,
            -106.6210022
          ],
          "thresholdB": [
            35.03319931,
            -106.60500336
          ],
          "headingA": 129.0,
          "headingB": 309.0,
          "lengthM": 1828.8,
          "widthM": 45.7
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "ABV",
      "icao": "DNAA",
      "airport": "Nnamdi Azikiwe International Airport",
      "city": "Abuja",
      "country": "NG",
      "runways": [
        {
          "id": "237894",
          "runway": "04/22",
          "thresholdA": [
            8.99343967,
            7.25373983
          ],
          "thresholdB": [
            9.02013969,
            7.27261019
          ],
          "headingA": 35.0,
          "headingB": 215.0,
          "lengthM": 3609.4,
          "widthM": 60.0
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "ACC",
      "icao": "DGAA",
      "airport": "Kotoka International Airport",
      "city": "Accra",
      "country": "GH",
      "runways": [
        {
          "id": "236092",
          "runway": "03/21",
          "thresholdA": [
            5.59096003,
            -0.172636
          ],
          "thresholdB": [
            5.61941004,
            -0.160936
          ],
          "headingA": 22.0,
          "headingB": 202.0,
          "lengthM": 3403.1,
          "widthM": 61.0
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "ADD",
      "icao": "HAAB",
      "airport": "Addis Ababa Bole International Airport",
      "city": "Addis Ababa",
      "country": "ET",
      "runways": [
        {
          "id": "235668",
          "runway": "07L/25R",
          "thresholdA": [
            8.97397995,
            38.78239822
          ],
          "thresholdB": [
            8.98338985,
            38.81470108
          ],
          "headingA": 73.7,
          "headingB": 253.7,
          "lengthM": 3700.0,
          "widthM": 45.1
        },
        {
          "id": "235667",
          "runway": "07R/25L",
          "thresholdA": [
            8.97226048,
            38.78350067
          ],
          "thresholdB": [
            8.98194027,
            38.81669998
          ],
          "headingA": 73.6,
          "headingB": 253.6,
          "lengthM": 3799.9,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "ADL",
      "icao": "YPAD",
      "airport": "Adelaide International Airport",
      "city": "Adelaide",
      "country": "AU",
      "runways": [
        {
          "id": "233332",
          "runway": "05/23",
          "thresholdA": [
            -34.9585,
            138.516998
          ],
          "thresholdB": [
            -34.940601,
            138.542999
          ],
          "headingA": 50.0,
          "headingB": 230.0,
          "lengthM": 3100.1,
          "widthM": 45.1
        },
        {
          "id": "233333",
          "runway": "12/30",
          "thresholdA": [
            -34.9412,
            138.522003
          ],
          "thresholdB": [
            -34.949402,
            138.537003
          ],
          "headingA": 123.0,
          "headingB": 303.0,
          "lengthM": 1652.0,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "AEP",
      "icao": "SABE",
      "airport": "Aeroparque Jorge Newbery",
      "city": "Buenos Aires",
      "country": "AR",
      "runways": [
        {
          "id": "233011",
          "runway": "13/31",
          "thresholdA": [
            -34.553902,
            -58.425098
          ],
          "thresholdB": [
            -34.564499,
            -58.406101
          ],
          "headingA": 124.0,
          "headingB": 304.0,
          "lengthM": 2350.0,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "AGA",
      "icao": "GMAD",
      "airport": "Al Massira Airport",
      "city": "Agadir (Temsia)",
      "country": "MA",
      "runways": [
        {
          "id": "237612",
          "runway": "09/27",
          "thresholdA": [
            30.32302856,
            -9.42816067
          ],
          "thresholdB": [
            30.32223511,
            -9.39489365
          ],
          "headingA": 91.0,
          "headingB": 271.0,
          "lengthM": 3200.1,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "AGP",
      "icao": "LEMG",
      "airport": "M\u00e1laga-Costa del Sol Airport",
      "city": "M\u00e1laga",
      "country": "ES",
      "runways": [
        {
          "id": "260340",
          "runway": "12/30",
          "thresholdA": [
            36.69100189,
            -4.5078001
          ],
          "thresholdB": [
            36.67959976,
            -4.48052979
          ],
          "headingA": 119.0,
          "headingB": 299.0,
          "lengthM": 2749.9,
          "widthM": 45.1
        },
        {
          "id": "238901",
          "runway": "13/31",
          "thresholdA": [
            36.68450165,
            -4.51258993
          ],
          "thresholdB": [
            36.66540146,
            -4.48581982
          ],
          "headingA": 133.0,
          "headingB": 313.0,
          "lengthM": 3200.4,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "AJU",
      "icao": "SBAR",
      "airport": "Aracaju - Santa Maria Airport",
      "city": "Aracaju",
      "country": "BR",
      "runways": [
        {
          "id": "234085",
          "runway": "12/30",
          "thresholdA": [
            -10.98368645,
            -37.08034897
          ],
          "thresholdB": [
            -10.98436642,
            -37.06030655
          ],
          "headingA": null,
          "headingB": null,
          "lengthM": 2200.0,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "AKL",
      "icao": "NZAA",
      "airport": "Auckland International Airport",
      "city": "Auckland",
      "country": "NZ",
      "runways": [
        {
          "id": "238096",
          "runway": "05R/23L",
          "thresholdA": [
            -37.017101,
            174.766998
          ],
          "thresholdB": [
            -37.006699,
            174.804993
          ],
          "headingA": 72.0,
          "headingB": 252.0,
          "lengthM": 3635.0,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "ALC",
      "icao": "LEAL",
      "airport": "Alicante-Elche Miguel Hern\u00e1ndez Airport",
      "city": "Alicante",
      "country": "ES",
      "runways": [
        {
          "id": "238942",
          "runway": "10/28",
          "thresholdA": [
            38.28450012,
            -0.57499701
          ],
          "thresholdB": [
            38.27980042,
            -0.54131699
          ],
          "headingA": 99.7,
          "headingB": 279.7,
          "lengthM": 2999.8,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "ALG",
      "icao": "DAAG",
      "airport": "Houari Boumediene Airport",
      "city": "Algiers",
      "country": "DZ",
      "runways": [
        {
          "id": "232826",
          "runway": "05/23",
          "thresholdA": [
            36.69390106,
            3.22017002
          ],
          "thresholdB": [
            36.71289825,
            3.25139999
          ],
          "headingA": 53.0,
          "headingB": 233.0,
          "lengthM": 3500.0,
          "widthM": 60.0
        },
        {
          "id": "232827",
          "runway": "09/27",
          "thresholdA": [
            36.69210052,
            3.17083001
          ],
          "thresholdB": [
            36.69120026,
            3.20991993
          ],
          "headingA": 92.0,
          "headingB": 272.0,
          "lengthM": 3500.0,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "AMS",
      "icao": "EHAM",
      "airport": "Amsterdam Airport Schiphol",
      "city": "Amsterdam",
      "country": "NL",
      "runways": [
        {
          "id": "237924",
          "runway": "04/22",
          "thresholdA": [
            52.30039978,
            4.78348017
          ],
          "thresholdB": [
            52.31399918,
            4.80302
          ],
          "headingA": 41.0,
          "headingB": 221.0,
          "lengthM": 2019.9,
          "widthM": 45.1
        },
        {
          "id": "237925",
          "runway": "06/24",
          "thresholdA": [
            52.28789902,
            4.73402023
          ],
          "thresholdB": [
            52.30459976,
            4.77752018
          ],
          "headingA": 58.0,
          "headingB": 238.0,
          "lengthM": 3439.1,
          "widthM": 45.1
        },
        {
          "id": "237926",
          "runway": "09/27",
          "thresholdA": [
            52.3166008,
            4.74634981
          ],
          "thresholdB": [
            52.31840134,
            4.79688978
          ],
          "headingA": 87.0,
          "headingB": 267.0,
          "lengthM": 3453.1,
          "widthM": 45.1
        },
        {
          "id": "237927",
          "runway": "18C/36C",
          "thresholdA": [
            52.33140182,
            4.74002981
          ],
          "thresholdB": [
            52.30179977,
            4.73750019
          ],
          "headingA": 183.0,
          "headingB": 3.0,
          "lengthM": 3299.8,
          "widthM": 45.1
        },
        {
          "id": "237929",
          "runway": "18L/36R",
          "thresholdA": [
            52.32130051,
            4.77996016
          ],
          "thresholdB": [
            52.29079819,
            4.77734995
          ],
          "headingA": 183.0,
          "headingB": 3.0,
          "lengthM": 3400.0,
          "widthM": 45.1
        },
        {
          "id": "237928",
          "runway": "18R/36L",
          "thresholdA": [
            52.36270142,
            4.7119298
          ],
          "thresholdB": [
            52.32860184,
            4.70883989
          ],
          "headingA": 183.0,
          "headingB": 3.0,
          "lengthM": 3799.9,
          "widthM": 60.4
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "ANC",
      "icao": "PANC",
      "airport": "Ted Stevens Anchorage International Airport",
      "city": "Anchorage",
      "country": "US",
      "runways": [
        {
          "id": "244713",
          "runway": "07L/25R",
          "thresholdA": [
            61.169765,
            -150.008333
          ],
          "thresholdB": [
            61.169811,
            -149.948301
          ],
          "headingA": 90.0,
          "headingB": 270.0,
          "lengthM": 3230.9,
          "widthM": 45.7
        },
        {
          "id": "244712",
          "runway": "07R/25L",
          "thresholdA": [
            61.167812,
            -150.042871
          ],
          "thresholdB": [
            61.167881,
            -149.972649
          ],
          "headingA": 90.0,
          "headingB": 270.0,
          "lengthM": 3779.5,
          "widthM": 61.0
        },
        {
          "id": "244714",
          "runway": "15/33",
          "thresholdA": [
            61.199731,
            -150.014531
          ],
          "thresholdB": [
            61.171042,
            -149.998469
          ],
          "headingA": 165.0,
          "headingB": 345.0,
          "lengthM": 3311.7,
          "widthM": 61.0
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "ANF",
      "icao": "SCFA",
      "airport": "Andr\u00e9s Sabella G\u00e1lvez International Airport",
      "city": "Antofagasta",
      "country": "CL",
      "runways": [
        {
          "id": "235233",
          "runway": "01/19",
          "thresholdA": [
            -23.457861,
            -70.446686
          ],
          "thresholdB": [
            -23.432716,
            -70.443611
          ],
          "headingA": 7.0,
          "headingB": 187.0,
          "lengthM": 2799.9,
          "widthM": 50.0
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "AQP",
      "icao": "SPQU",
      "airport": "Rodr\u00edguez Ball\u00f3n International Airport",
      "city": "Arequipa",
      "country": "PE",
      "runways": [
        {
          "id": "238129",
          "runway": "10/28",
          "thresholdA": [
            -16.3398,
            -71.584702
          ],
          "thresholdB": [
            -16.341299,
            -71.5569
          ],
          "headingA": 93.0,
          "headingB": 273.0,
          "lengthM": 2980.0,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "ARN",
      "icao": "ESSA",
      "airport": "Stockholm-Arlanda Airport",
      "city": "Stockholm",
      "country": "SE",
      "runways": [
        {
          "id": "239018",
          "runway": "01L/19R",
          "thresholdA": [
            59.63729858,
            17.91320038
          ],
          "thresholdB": [
            59.66640091,
            17.92379951
          ],
          "headingA": 10.0,
          "headingB": 190.0,
          "lengthM": 3301.0,
          "widthM": 45.1
        },
        {
          "id": "239017",
          "runway": "01R/19L",
          "thresholdA": [
            59.62639999,
            17.95070076
          ],
          "thresholdB": [
            59.64849854,
            17.95870018
          ],
          "headingA": 10.4,
          "headingB": 190.4,
          "lengthM": 2499.7,
          "widthM": 45.1
        },
        {
          "id": "239019",
          "runway": "08/26",
          "thresholdA": [
            59.65840149,
            17.93610001
          ],
          "thresholdB": [
            59.66389847,
            17.97920036
          ],
          "headingA": 75.9,
          "headingB": 255.9,
          "lengthM": 2500.0,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "ASU",
      "icao": "SGAS",
      "airport": "Silvio Pettirossi International Airport",
      "city": "Asunci\u00f3n",
      "country": "PY",
      "runways": [
        {
          "id": "238115",
          "runway": "02/20",
          "thresholdA": [
            -25.25460052,
            -57.52270126
          ],
          "thresholdB": [
            -25.22509956,
            -57.51549911
          ],
          "headingA": 10.0,
          "headingB": 190.0,
          "lengthM": 3351.9,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "ATH",
      "icao": "LGAV",
      "airport": "Athens Eleftherios Venizelos International Airport",
      "city": "Spata-Artemida",
      "country": "GR",
      "runways": [
        {
          "id": "236331",
          "runway": "03L/21R",
          "thresholdA": [
            37.92100143,
            23.9192009
          ],
          "thresholdB": [
            37.94850159,
            23.94499969
          ],
          "headingA": 36.6,
          "headingB": 216.6,
          "lengthM": 3799.9,
          "widthM": 45.1
        },
        {
          "id": "236330",
          "runway": "03R/21L",
          "thresholdA": [
            37.92350006,
            23.94330025
          ],
          "thresholdB": [
            37.95240021,
            23.97039986
          ],
          "headingA": 36.6,
          "headingB": 216.6,
          "lengthM": 3999.9,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "ATL",
      "icao": "KATL",
      "airport": "Hartsfield Jackson Atlanta International Airport",
      "city": "Atlanta",
      "country": "US",
      "runways": [
        {
          "id": "243551",
          "runway": "08L/26R",
          "thresholdA": [
            33.6495018,
            -84.43900299
          ],
          "thresholdB": [
            33.6495018,
            -84.40950012
          ],
          "headingA": 90.0,
          "headingB": 270.0,
          "lengthM": 2743.2,
          "widthM": 45.7
        },
        {
          "id": "243550",
          "runway": "08R/26L",
          "thresholdA": [
            33.64680099,
            -84.43840027
          ],
          "thresholdB": [
            33.64680099,
            -84.40550232
          ],
          "headingA": 90.0,
          "headingB": 270.0,
          "lengthM": 3047.7,
          "widthM": 45.7
        },
        {
          "id": "243553",
          "runway": "09L/27R",
          "thresholdA": [
            33.63470078,
            -84.44799805
          ],
          "thresholdB": [
            33.63470078,
            -84.4088974
          ],
          "headingA": 90.0,
          "headingB": 270.0,
          "lengthM": 3776.5,
          "widthM": 45.7
        },
        {
          "id": "243552",
          "runway": "09R/27L",
          "thresholdA": [
            33.63180161,
            -84.44799805
          ],
          "thresholdB": [
            33.63180161,
            -84.41840363
          ],
          "headingA": 90.0,
          "headingB": 270.0,
          "lengthM": 2743.2,
          "widthM": 45.7
        },
        {
          "id": "243554",
          "runway": "10/28",
          "thresholdA": [
            33.62030029,
            -84.44789886
          ],
          "thresholdB": [
            33.62030029,
            -84.41829681
          ],
          "headingA": 90.0,
          "headingB": 270.0,
          "lengthM": 2743.2,
          "widthM": 45.7
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "AUH",
      "icao": "OMAA",
      "airport": "Zayed International Airport",
      "city": "Abu Dhabi",
      "country": "AE",
      "runways": [
        {
          "id": "308419",
          "runway": "13L/31R",
          "thresholdA": [
            24.465,
            54.638329
          ],
          "thresholdB": [
            24.442329,
            54.67017
          ],
          "headingA": 128.0,
          "headingB": 308.0,
          "lengthM": 4099.9,
          "widthM": 60.0
        },
        {
          "id": "232764",
          "runway": "13R/31L",
          "thresholdA": [
            24.444401,
            54.635201
          ],
          "thresholdB": [
            24.4217,
            54.667198
          ],
          "headingA": 128.0,
          "headingB": 308.0,
          "lengthM": 4106.0,
          "widthM": 60.0
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "AUS",
      "icao": "KAUS",
      "airport": "Austin Bergstrom International Airport",
      "city": "Austin",
      "country": "US",
      "runways": [
        {
          "id": "243456",
          "runway": "18L/36R",
          "thresholdA": [
            30.2038,
            -97.657898
          ],
          "thresholdB": [
            30.1791,
            -97.657204
          ],
          "headingA": 179.0,
          "headingB": 359.0,
          "lengthM": 2743.2,
          "widthM": 45.7
        },
        {
          "id": "243455",
          "runway": "18R/36L",
          "thresholdA": [
            30.2136,
            -97.679398
          ],
          "thresholdB": [
            30.179899,
            -97.678497
          ],
          "headingA": 179.0,
          "headingB": 359.0,
          "lengthM": 3733.8,
          "widthM": 45.7
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "AVV",
      "icao": "YMAV",
      "airport": "Melbourne Avalon International Airport",
      "city": "Geelong/Melbourne",
      "country": "AU",
      "runways": [
        {
          "id": "233114",
          "runway": "18/36",
          "thresholdA": [
            -38.027237,
            144.469419
          ],
          "thresholdB": [
            -38.054413,
            144.464827
          ],
          "headingA": 187.0,
          "headingB": 7.0,
          "lengthM": 3048.0,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "BCN",
      "icao": "LEBL",
      "airport": "Josep Tarradellas Barcelona-El Prat Airport",
      "city": "Barcelona",
      "country": "ES",
      "runways": [
        {
          "id": "238920",
          "runway": "02/20",
          "thresholdA": [
            41.287737,
            2.08483
          ],
          "thresholdB": [
            41.309293,
            2.094668
          ],
          "headingA": 19.0,
          "headingB": 199.0,
          "lengthM": 2529.8,
          "widthM": 44.8
        },
        {
          "id": "238922",
          "runway": "06L/24R",
          "thresholdA": [
            41.293244,
            2.067251
          ],
          "thresholdB": [
            41.305735,
            2.103751
          ],
          "headingA": 66.0,
          "headingB": 246.0,
          "lengthM": 3352.8,
          "widthM": 59.7
        },
        {
          "id": "238921",
          "runway": "06R/24L",
          "thresholdA": [
            41.282311,
            2.074342
          ],
          "thresholdB": [
            41.292218,
            2.103282
          ],
          "headingA": 66.0,
          "headingB": 246.0,
          "lengthM": 2660.0,
          "widthM": 59.7
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "BEL",
      "icao": "SBBE",
      "airport": "Val de Cans/J\u00falio Cezar Ribeiro International Airport",
      "city": "Bel\u00e9m",
      "country": "BR",
      "runways": [
        {
          "id": "324528",
          "runway": "03/21",
          "thresholdA": [
            -1.39055,
            -48.47715
          ],
          "thresholdB": [
            -1.374064,
            -48.475746
          ],
          "headingA": 5.0,
          "headingB": 185.0,
          "lengthM": 1830.0,
          "widthM": 45.1
        },
        {
          "id": "233992",
          "runway": "07/25",
          "thresholdA": [
            -1.388017,
            -48.485008
          ],
          "thresholdB": [
            -1.37025,
            -48.467079
          ],
          "headingA": 46.0,
          "headingB": 226.0,
          "lengthM": 2799.9,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "BER",
      "icao": "EDDB",
      "airport": "Berlin Brandenburg Airport",
      "city": "Berlin",
      "country": "DE",
      "runways": [
        {
          "id": "337086",
          "runway": "06L/24R",
          "thresholdA": [
            52.366724,
            13.480928
          ],
          "thresholdB": [
            52.378409,
            13.530214
          ],
          "headingA": 69.0,
          "headingB": 249.0,
          "lengthM": 3600.0,
          "widthM": 45.1
        },
        {
          "id": "337087",
          "runway": "06R/24L",
          "thresholdA": [
            52.34544,
            13.468435
          ],
          "thresholdB": [
            52.358431,
            13.523175
          ],
          "headingA": 69.0,
          "headingB": 249.0,
          "lengthM": 3999.9,
          "widthM": 60.0
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "BGY",
      "icao": "LIME",
      "airport": "Il Caravaggio International Airport",
      "city": "Orio al Serio (BG)",
      "country": "IT",
      "runways": [
        {
          "id": "237060",
          "runway": "10/28",
          "thresholdA": [
            45.671036,
            9.689789
          ],
          "thresholdB": [
            45.66441,
            9.725433
          ],
          "headingA": 105.0,
          "headingB": 285.0,
          "lengthM": 2874.0,
          "widthM": 45.1
        },
        {
          "id": "237061",
          "runway": "12/30",
          "thresholdA": [
            45.677925,
            9.702228
          ],
          "thresholdB": [
            45.674576,
            9.710052
          ],
          "headingA": 121.0,
          "headingB": 301.0,
          "lengthM": 714.1,
          "widthM": 18.0
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "BHX",
      "icao": "EGBB",
      "airport": "Birmingham Airport",
      "city": "Birmingham, West Midlands",
      "country": "GB",
      "runways": [
        {
          "id": "239421",
          "runway": "15/33",
          "thresholdA": [
            52.465599,
            -1.76111
          ],
          "thresholdB": [
            52.442964,
            -1.735894
          ],
          "headingA": 148.0,
          "headingB": 328.0,
          "lengthM": 3052.0,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "BKK",
      "icao": "VTBS",
      "airport": "Suvarnabhumi Airport",
      "city": "Bangkok",
      "country": "TH",
      "runways": [
        {
          "id": "249241",
          "runway": "01/19",
          "thresholdA": [
            13.656697,
            100.751831
          ],
          "thresholdB": [
            13.691714,
            100.761032
          ],
          "headingA": 14.0,
          "headingB": 194.0,
          "lengthM": 3999.9,
          "widthM": 60.0
        },
        {
          "id": "554439",
          "runway": "02L/20R",
          "thresholdA": [
            13.66517,
            100.72924
          ],
          "thresholdB": [
            13.70016,
            100.73844
          ],
          "headingA": 14.0,
          "headingB": 194.0,
          "lengthM": 3999.9,
          "widthM": 60.0
        },
        {
          "id": "249240",
          "runway": "02R/20L",
          "thresholdA": [
            13.671278,
            100.734665
          ],
          "thresholdB": [
            13.703669,
            100.743179
          ],
          "headingA": 14.0,
          "headingB": 194.0,
          "lengthM": 3700.0,
          "widthM": 60.0
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "BLR",
      "icao": "VOBL",
      "airport": "Kempegowda International Airport Bengaluru",
      "city": "Bengaluru",
      "country": "IN",
      "runways": [
        {
          "id": "336915",
          "runway": "09L/27R",
          "thresholdA": [
            13.207164,
            77.686073
          ],
          "thresholdB": [
            13.206847,
            77.722969
          ],
          "headingA": null,
          "headingB": null,
          "lengthM": 3999.9,
          "widthM": 45.1
        },
        {
          "id": "298669",
          "runway": "09R/27L",
          "thresholdA": [
            13.189734,
            77.68998
          ],
          "thresholdB": [
            13.189414,
            77.726875
          ],
          "headingA": 92.0,
          "headingB": 272.0,
          "lengthM": 3999.9,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "BNA",
      "icao": "KBNA",
      "airport": "Nashville International Airport",
      "city": "Nashville",
      "country": "US",
      "runways": [
        {
          "id": "243616",
          "runway": "02C/20C",
          "thresholdA": [
            36.10329819,
            -86.68800354
          ],
          "thresholdB": [
            36.12419891,
            -86.67960358
          ],
          "headingA": 18.0,
          "headingB": 198.0,
          "lengthM": 2438.7,
          "widthM": 45.7
        },
        {
          "id": "243618",
          "runway": "02L/20R",
          "thresholdA": [
            36.11769867,
            -86.68650055
          ],
          "thresholdB": [
            36.13779831,
            -86.6785965
          ],
          "headingA": 17.6,
          "headingB": 197.6,
          "lengthM": 2348.2,
          "widthM": 45.7
        },
        {
          "id": "243617",
          "runway": "02R/20L",
          "thresholdA": [
            36.11270142,
            -86.66760254
          ],
          "thresholdB": [
            36.13359833,
            -86.65930176
          ],
          "headingA": 18.0,
          "headingB": 198.0,
          "lengthM": 2438.7,
          "widthM": 45.7
        },
        {
          "id": "243619",
          "runway": "13/31",
          "thresholdA": [
            36.1413002,
            -86.69539642
          ],
          "thresholdB": [
            36.12049866,
            -86.66819763
          ],
          "headingA": 133.3,
          "headingB": 313.3,
          "lengthM": 3361.9,
          "widthM": 45.7
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "BNE",
      "icao": "YBBN",
      "airport": "Brisbane International Airport",
      "city": "Brisbane",
      "country": "AU",
      "runways": [
        {
          "id": "335162",
          "runway": "01L/19R",
          "thresholdA": [
            -27.38310051,
            153.10699463
          ],
          "thresholdB": [
            -27.35659981,
            153.12199402
          ],
          "headingA": 27.0,
          "headingB": 207.0,
          "lengthM": 3300.1,
          "widthM": 60.0
        },
        {
          "id": "233169",
          "runway": "01R/19L",
          "thresholdA": [
            -27.40390015,
            153.11799622
          ],
          "thresholdB": [
            -27.37529945,
            153.13400269
          ],
          "headingA": 27.0,
          "headingB": 207.0,
          "lengthM": 3560.1,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "BOG",
      "icao": "SKBO",
      "airport": "El Dorado International Airport",
      "city": "Bogota",
      "country": "CO",
      "runways": [
        {
          "id": "235332",
          "runway": "14L/32R",
          "thresholdA": [
            4.71339,
            -74.1521
          ],
          "thresholdB": [
            4.6927,
            -74.124702
          ],
          "headingA": 127.0,
          "headingB": 307.0,
          "lengthM": 3799.9,
          "widthM": 45.1
        },
        {
          "id": "235331",
          "runway": "14R/32L",
          "thresholdA": [
            4.7105,
            -74.169197
          ],
          "thresholdB": [
            4.68979,
            -74.1418
          ],
          "headingA": 127.0,
          "headingB": 307.0,
          "lengthM": 3799.9,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "BOM",
      "icao": "VABB",
      "airport": "Chhatrapati Shivaji Maharaj International Airport",
      "city": "Mumbai",
      "country": "IN",
      "runways": [
        {
          "id": "236761",
          "runway": "09/27",
          "thresholdA": [
            19.0884,
            72.848
          ],
          "thresholdB": [
            19.0889,
            72.881104
          ],
          "headingA": 89.0,
          "headingB": 269.0,
          "lengthM": 3508.6,
          "widthM": 60.0
        },
        {
          "id": "236762",
          "runway": "14/32",
          "thresholdA": [
            19.0984993,
            72.8572998
          ],
          "thresholdB": [
            19.08009911,
            72.87719727
          ],
          "headingA": 134.2,
          "headingB": 314.2,
          "lengthM": 2870.9,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "BOS",
      "icao": "KBOS",
      "airport": "Boston Logan International Airport",
      "city": "Boston",
      "country": "US",
      "runways": [
        {
          "id": "240222",
          "runway": "04L/22R",
          "thresholdA": [
            42.357997,
            -71.014344
          ],
          "thresholdB": [
            42.378322,
            -71.004511
          ],
          "headingA": 20.0,
          "headingB": 200.0,
          "lengthM": 2396.9,
          "widthM": 45.7
        },
        {
          "id": "240221",
          "runway": "04R/22L",
          "thresholdA": [
            42.351064,
            -71.011801
          ],
          "thresholdB": [
            42.376923,
            -70.999288
          ],
          "headingA": 20.0,
          "headingB": 200.0,
          "lengthM": 3049.8,
          "widthM": 45.7
        },
        {
          "id": "240223",
          "runway": "09/27",
          "thresholdA": [
            42.35580063,
            -71.01290131
          ],
          "thresholdB": [
            42.36019897,
            -70.98770142
          ],
          "headingA": 77.0,
          "headingB": 257.0,
          "lengthM": 2133.9,
          "widthM": 45.7
        },
        {
          "id": "250377",
          "runway": "14/32",
          "thresholdA": [
            42.35660172,
            -71.02330017
          ],
          "thresholdB": [
            42.34859848,
            -71.0082016
          ],
          "headingA": 125.0,
          "headingB": 305.0,
          "lengthM": 1524.0,
          "widthM": 30.5
        },
        {
          "id": "240225",
          "runway": "15L/33R",
          "thresholdA": [
            42.37360001,
            -71.00910187
          ],
          "thresholdB": [
            42.36859894,
            -71.00250244
          ],
          "headingA": 135.0,
          "headingB": 315.0,
          "lengthM": 779.4,
          "widthM": 30.5
        },
        {
          "id": "240224",
          "runway": "15R/33L",
          "thresholdA": [
            42.3742981,
            -71.01789856
          ],
          "thresholdB": [
            42.354599,
            -70.99160004
          ],
          "headingA": 135.0,
          "headingB": 315.0,
          "lengthM": 3073.3,
          "widthM": 45.7
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "BPS",
      "icao": "SBPS",
      "airport": "Porto Seguro International Airport",
      "city": "Porto Seguro",
      "country": "BR",
      "runways": [
        {
          "id": "234148",
          "runway": "10/28",
          "thresholdA": [
            -16.440701,
            -39.088799
          ],
          "thresholdB": [
            -16.4363,
            -39.072601
          ],
          "headingA": 74.0,
          "headingB": 254.0,
          "lengthM": 2000.1,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "BRC",
      "icao": "SAZS",
      "airport": "Teniente Luis Candelaria International Airport",
      "city": "San Carlos de Bariloche",
      "country": "AR",
      "runways": [
        {
          "id": "233027",
          "runway": "11/29",
          "thresholdA": [
            -41.14680099,
            -71.17030334
          ],
          "thresholdB": [
            -41.1556015,
            -71.14479828
          ],
          "headingA": 115.0,
          "headingB": 295.0,
          "lengthM": 2347.9,
          "widthM": 47.9
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "BRU",
      "icao": "EBBR",
      "airport": "Brussels Airport",
      "city": "Zaventem",
      "country": "BE",
      "runways": [
        {
          "id": "233635",
          "runway": "01/19",
          "thresholdA": [
            50.886902,
            4.49142
          ],
          "thresholdB": [
            50.912899,
            4.50202
          ],
          "headingA": 14.0,
          "headingB": 194.0,
          "lengthM": 2987.0,
          "widthM": 50.0
        },
        {
          "id": "233637",
          "runway": "07L/25R",
          "thresholdA": [
            50.89889908,
            4.45565987
          ],
          "thresholdB": [
            50.91260147,
            4.50263023
          ],
          "headingA": 65.0,
          "headingB": 245.0,
          "lengthM": 3638.1,
          "widthM": 45.1
        },
        {
          "id": "233636",
          "runway": "07R/25L",
          "thresholdA": [
            50.88899994,
            4.48042011
          ],
          "thresholdB": [
            50.89889908,
            4.52330017
          ],
          "headingA": 70.0,
          "headingB": 250.0,
          "lengthM": 3211.1,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "BSB",
      "icao": "SBBR",
      "airport": "Presidente Juscelino Kubitschek International Airport",
      "city": "Bras\u00edlia",
      "country": "BR",
      "runways": [
        {
          "id": "234071",
          "runway": "11L/29R",
          "thresholdA": [
            -15.86359978,
            -47.92350006
          ],
          "thresholdB": [
            -15.86170006,
            -47.89770126
          ],
          "headingA": 86.0,
          "headingB": 266.0,
          "lengthM": 3200.1,
          "widthM": 45.1
        },
        {
          "id": "234070",
          "runway": "11R/29L",
          "thresholdA": [
            -15.88070011,
            -47.93999863
          ],
          "thresholdB": [
            -15.87870026,
            -47.90919876
          ],
          "headingA": 86.0,
          "headingB": 266.0,
          "lengthM": 3300.1,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "BUD",
      "icao": "LHBP",
      "airport": "Budapest Liszt Ferenc International Airport",
      "city": "Budapest",
      "country": "HU",
      "runways": [
        {
          "id": "236449",
          "runway": "13L/31R",
          "thresholdA": [
            47.4454,
            19.2575
          ],
          "thresholdB": [
            47.423,
            19.2939
          ],
          "headingA": 132.0,
          "headingB": 312.0,
          "lengthM": 3707.0,
          "widthM": 45.1
        },
        {
          "id": "236448",
          "runway": "13R/31L",
          "thresholdA": [
            47.4487,
            19.2208
          ],
          "thresholdB": [
            47.4305,
            19.2502
          ],
          "headingA": 132.0,
          "headingB": 312.0,
          "lengthM": 3009.9,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "BWI",
      "icao": "KBWI",
      "airport": "Baltimore/Washington International Thurgood Marshall Airport",
      "city": "Baltimore",
      "country": "US",
      "runways": [
        {
          "id": "245651",
          "runway": "10/28",
          "thresholdA": [
            39.17470169,
            -76.68959808
          ],
          "thresholdB": [
            39.17259979,
            -76.65270233
          ],
          "headingA": 94.2,
          "headingB": 274.2,
          "lengthM": 3201.3,
          "widthM": 45.7
        },
        {
          "id": "245653",
          "runway": "15L/33R",
          "thresholdA": [
            39.18740082,
            -76.66349792
          ],
          "thresholdB": [
            39.17620087,
            -76.65319824
          ],
          "headingA": 144.2,
          "headingB": 324.2,
          "lengthM": 1524.0,
          "widthM": 30.5
        },
        {
          "id": "245652",
          "runway": "15R/33L",
          "thresholdA": [
            39.1853981,
            -76.68199921
          ],
          "thresholdB": [
            39.16419983,
            -76.66239929
          ],
          "headingA": 144.2,
          "headingB": 324.2,
          "lengthM": 2895.9,
          "widthM": 45.7
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "CAI",
      "icao": "HECA",
      "airport": "Cairo International Airport",
      "city": "Cairo",
      "country": "EG",
      "runways": [
        {
          "id": "300957",
          "runway": "05C/23C",
          "thresholdA": [
            30.099701,
            31.398199
          ],
          "thresholdB": [
            30.123301,
            31.4296
          ],
          "headingA": 45.0,
          "headingB": 225.0,
          "lengthM": 3999.9,
          "widthM": 60.0
        },
        {
          "id": "235593",
          "runway": "05L/23R",
          "thresholdA": [
            30.119699,
            31.380199
          ],
          "thresholdB": [
            30.139099,
            31.4063
          ],
          "headingA": 49.0,
          "headingB": 229.0,
          "lengthM": 3300.1,
          "widthM": 60.0
        },
        {
          "id": "235592",
          "runway": "05R/23L",
          "thresholdA": [
            30.09716606,
            31.41900063
          ],
          "thresholdB": [
            30.1206665,
            31.45050049
          ],
          "headingA": 49.2,
          "headingB": 229.2,
          "lengthM": 4000.2,
          "widthM": 60.0
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "CAN",
      "icao": "ZGGG",
      "airport": "Guangzhou Baiyun International Airport",
      "city": "Guangzhou (Huadu)",
      "country": "CN",
      "runways": [
        {
          "id": "595240",
          "runway": "01L/19R",
          "thresholdA": [
            23.380692,
            113.275291
          ],
          "thresholdB": [
            23.41048,
            113.283333
          ],
          "headingA": null,
          "headingB": null,
          "lengthM": 3400.0,
          "widthM": 45.1
        },
        {
          "id": "235173",
          "runway": "01R/19L",
          "thresholdA": [
            23.376801,
            113.283997
          ],
          "thresholdB": [
            23.408413,
            113.291954
          ],
          "headingA": 14.0,
          "headingB": 194.0,
          "lengthM": 3600.0,
          "widthM": 45.1
        },
        {
          "id": "322334",
          "runway": "02L/20R",
          "thresholdA": [
            23.3757,
            113.30500031
          ],
          "thresholdB": [
            23.40889931,
            113.31400299
          ],
          "headingA": 14.0,
          "headingB": 194.0,
          "lengthM": 3799.9,
          "widthM": 60.0
        },
        {
          "id": "235172",
          "runway": "02R/20L",
          "thresholdA": [
            23.36949921,
            113.30799866
          ],
          "thresholdB": [
            23.40279961,
            113.31700134
          ],
          "headingA": 14.0,
          "headingB": 194.0,
          "lengthM": 3799.9,
          "widthM": 60.0
        },
        {
          "id": "602536",
          "runway": "03/21",
          "thresholdA": [
            23.354778,
            113.319145
          ],
          "thresholdB": [
            23.386316,
            113.327667
          ],
          "headingA": 14.0,
          "headingB": 193.0,
          "lengthM": 3600.0,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "CBR",
      "icao": "YSCB",
      "airport": "Canberra Airport",
      "city": "Canberra",
      "country": "AU",
      "runways": [
        {
          "id": "233509",
          "runway": "12/30",
          "thresholdA": [
            -35.300701,
            149.184998
          ],
          "thresholdB": [
            -35.310398,
            149.199005
          ],
          "headingA": 130.0,
          "headingB": 310.0,
          "lengthM": 1679.1,
          "widthM": 29.9
        },
        {
          "id": "233510",
          "runway": "17/35",
          "thresholdA": [
            -35.29062653,
            149.19444275
          ],
          "thresholdB": [
            -35.32019806,
            149.19444275
          ],
          "headingA": 180.0,
          "headingB": 360.0,
          "lengthM": 3283.0,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "CCP",
      "icao": "SCIE",
      "airport": "Carriel Sur International Airport",
      "city": "Concepcion",
      "country": "CL",
      "runways": [
        {
          "id": "235230",
          "runway": "02/20",
          "thresholdA": [
            -36.78203583,
            -73.06859589
          ],
          "thresholdB": [
            -36.76080704,
            -73.05621338
          ],
          "headingA": 25.0,
          "headingB": 205.0,
          "lengthM": 2599.9,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "CCS",
      "icao": "SVMI",
      "airport": "Maiquet\u00eda Sim\u00f3n Bol\u00edvar International Airport",
      "city": "Maiquet\u00eda",
      "country": "VE",
      "runways": [
        {
          "id": "246097",
          "runway": "09/27",
          "thresholdA": [
            10.59869957,
            -66.99770355
          ],
          "thresholdB": [
            10.60519981,
            -66.97109985
          ],
          "headingA": 76.0,
          "headingB": 256.0,
          "lengthM": 3026.7,
          "widthM": 45.1
        },
        {
          "id": "246098",
          "runway": "10/28",
          "thresholdA": [
            10.60379982,
            -67.01280212
          ],
          "thresholdB": [
            10.60480022,
            -66.98079681
          ],
          "headingA": 88.0,
          "headingB": 268.0,
          "lengthM": 3500.0,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "CDG",
      "icao": "LFPG",
      "airport": "Charles de Gaulle International Airport",
      "city": "Paris (Roissy-en-France, Val-d'Oise)",
      "country": "FR",
      "runways": [
        {
          "id": "608470",
          "runway": "08H/26H",
          "thresholdA": [
            49.015769,
            2.558572
          ],
          "thresholdB": [
            49.016089,
            2.564603
          ],
          "headingA": 85.0,
          "headingB": 265.0,
          "lengthM": 440.1,
          "widthM": 30.2
        },
        {
          "id": "235946",
          "runway": "08L/26R",
          "thresholdA": [
            48.99570084,
            2.5527401
          ],
          "thresholdB": [
            48.99879837,
            2.6101799
          ],
          "headingA": 85.0,
          "headingB": 265.0,
          "lengthM": 4215.1,
          "widthM": 45.1
        },
        {
          "id": "235945",
          "runway": "08R/26L",
          "thresholdA": [
            48.99290085,
            2.56566
          ],
          "thresholdB": [
            48.99489975,
            2.60243011
          ],
          "headingA": 85.1,
          "headingB": 265.1,
          "lengthM": 2699.9,
          "widthM": 60.0
        },
        {
          "id": "235948",
          "runway": "09L/27R",
          "thresholdA": [
            49.02470016,
            2.52488995
          ],
          "thresholdB": [
            49.02669907,
            2.56169009
          ],
          "headingA": 85.3,
          "headingB": 265.3,
          "lengthM": 2699.9,
          "widthM": 60.0
        },
        {
          "id": "235947",
          "runway": "09R/27L",
          "thresholdA": [
            49.02059937,
            2.51306009
          ],
          "thresholdB": [
            49.02370071,
            2.57029009
          ],
          "headingA": 86.0,
          "headingB": 266.0,
          "lengthM": 4200.1,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "CFS",
      "icao": "YCFS",
      "airport": "Coffs Harbour Airport",
      "city": "Coffs Harbour",
      "country": "AU",
      "runways": [
        {
          "id": "233495",
          "runway": "03/21",
          "thresholdA": [
            -30.3383522,
            153.10658264
          ],
          "thresholdB": [
            -30.32419968,
            153.1210022
          ],
          "headingA": 41.0,
          "headingB": 221.0,
          "lengthM": 2080.0,
          "widthM": 45.1
        },
        {
          "id": "233496",
          "runway": "10/28",
          "thresholdA": [
            -30.31649971,
            153.11399841
          ],
          "thresholdB": [
            -30.31870079,
            153.1230011
          ],
          "headingA": 107.0,
          "headingB": 287.0,
          "lengthM": 848.9,
          "widthM": 18.3
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "CGB",
      "icao": "SBCY",
      "airport": "V\u00e1rzea Grande\u2013Marechal Rondon International Airport",
      "city": "Cuiab\u00e1",
      "country": "BR",
      "runways": [
        {
          "id": "234047",
          "runway": "17/35",
          "thresholdA": [
            -15.64374733,
            -56.1215744
          ],
          "thresholdB": [
            -15.66222477,
            -56.11175156
          ],
          "headingA": 153.0,
          "headingB": 333.0,
          "lengthM": 2300.0,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "CGH",
      "icao": "SBSP",
      "airport": "Congonhas\u2013Deputado Freitas Nobre Airport",
      "city": "S\u00e3o Paulo",
      "country": "BR",
      "runways": [
        {
          "id": "234372",
          "runway": "17L/35R",
          "thresholdA": [
            -23.6208,
            -46.658001
          ],
          "thresholdB": [
            -23.631701,
            -46.650501
          ],
          "headingA": 147.0,
          "headingB": 327.0,
          "lengthM": 1495.0,
          "widthM": 45.1
        },
        {
          "id": "234371",
          "runway": "17R/35L",
          "thresholdA": [
            -23.62100029,
            -46.66040039
          ],
          "thresholdB": [
            -23.63430023,
            -46.65119934
          ],
          "headingA": 147.0,
          "headingB": 327.0,
          "lengthM": 1940.1,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "CGK",
      "icao": "WIII",
      "airport": "Soekarno-Hatta International Airport",
      "city": "Jakarta",
      "country": "ID",
      "runways": [
        {
          "id": "341268",
          "runway": "06/24",
          "thresholdA": [
            -6.11388588,
            106.64459229
          ],
          "thresholdB": [
            -6.10384178,
            106.66976929
          ],
          "headingA": null,
          "headingB": null,
          "lengthM": 3000.1,
          "widthM": 60.0
        },
        {
          "id": "236530",
          "runway": "07L/25R",
          "thresholdA": [
            -6.12105989,
            106.63899994
          ],
          "thresholdB": [
            -6.10899019,
            106.66899872
          ],
          "headingA": 68.3,
          "headingB": 248.3,
          "lengthM": 3600.3,
          "widthM": 60.0
        },
        {
          "id": "236529",
          "runway": "07R/25L",
          "thresholdA": [
            -6.14260006,
            106.64399719
          ],
          "thresholdB": [
            -6.13032007,
            106.6740036
          ],
          "headingA": 68.3,
          "headingB": 248.3,
          "lengthM": 3660.0,
          "widthM": 60.0
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "CGO",
      "icao": "ZHCC",
      "airport": "Zhengzhou Xinzheng International Airport",
      "city": "Zhengzhou",
      "country": "CN",
      "runways": [
        {
          "id": "347965",
          "runway": "12L/30R",
          "thresholdA": [
            34.53950119,
            113.84100342
          ],
          "thresholdB": [
            34.52719879,
            113.8769989
          ],
          "headingA": 116.0,
          "headingB": 296.0,
          "lengthM": 3600.0,
          "widthM": 60.0
        },
        {
          "id": "235171",
          "runway": "12R/30L",
          "thresholdA": [
            34.52550125,
            113.8239975
          ],
          "thresholdB": [
            34.51380157,
            113.85800171
          ],
          "headingA": 112.0,
          "headingB": 292.0,
          "lengthM": 3400.0,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "CHC",
      "icao": "NZCH",
      "airport": "Christchurch International Airport",
      "city": "Christchurch",
      "country": "NZ",
      "runways": [
        {
          "id": "238073",
          "runway": "01/19",
          "thresholdA": [
            -43.48659897,
            172.53100586
          ],
          "thresholdB": [
            -43.48270035,
            172.53500366
          ],
          "headingA": 37.7,
          "headingB": 217.7,
          "lengthM": 515.1,
          "widthM": 69.8
        },
        {
          "id": "238074",
          "runway": "02/20",
          "thresholdA": [
            -43.49760056,
            172.52200317
          ],
          "thresholdB": [
            -43.47499847,
            172.54800415
          ],
          "headingA": 41.0,
          "headingB": 221.0,
          "lengthM": 3287.9,
          "widthM": 45.1
        },
        {
          "id": "238075",
          "runway": "11/29",
          "thresholdA": [
            -43.48460007,
            172.5249939
          ],
          "thresholdB": [
            -43.49470139,
            172.54100037
          ],
          "headingA": 131.0,
          "headingB": 311.0,
          "lengthM": 1702.9,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "CJC",
      "icao": "SCCF",
      "airport": "El Loa Airport",
      "city": "Calama",
      "country": "CL",
      "runways": [
        {
          "id": "235238",
          "runway": "10/28",
          "thresholdA": [
            -22.49910927,
            -68.91782379
          ],
          "thresholdB": [
            -22.50112534,
            -68.88834381
          ],
          "headingA": 94.0,
          "headingB": 274.0,
          "lengthM": 3040.1,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "CJU",
      "icao": "RKPC",
      "airport": "Jeju International Airport",
      "city": "Jeju City",
      "country": "KR",
      "runways": [
        {
          "id": "237295",
          "runway": "07/25",
          "thresholdA": [
            33.50040054,
            126.46900177
          ],
          "thresholdB": [
            33.51449966,
            126.49700165
          ],
          "headingA": 58.5,
          "headingB": 238.5,
          "lengthM": 3180.0,
          "widthM": 45.1
        },
        {
          "id": "237296",
          "runway": "13/31",
          "thresholdA": [
            33.51549911,
            126.48699951
          ],
          "thresholdB": [
            33.50550079,
            126.5039978
          ],
          "headingA": 125.6,
          "headingB": 305.6,
          "lengthM": 1910.5,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "CKG",
      "icao": "ZUCK",
      "airport": "Chongqing Jiangbei International Airport",
      "city": "Chongqing",
      "country": "CN",
      "runways": [
        {
          "id": "235154",
          "runway": "02L/20R",
          "thresholdA": [
            29.705181,
            106.636749
          ],
          "thresholdB": [
            29.73283,
            106.646317
          ],
          "headingA": 17.0,
          "headingB": 197.0,
          "lengthM": 3200.1,
          "widthM": 45.1
        },
        {
          "id": "335144",
          "runway": "02R/20L",
          "thresholdA": [
            29.704762,
            106.640671
          ],
          "thresholdB": [
            29.735811,
            106.651443
          ],
          "headingA": 19.0,
          "headingB": 199.0,
          "lengthM": 3600.0,
          "widthM": 45.1
        },
        {
          "id": "344015",
          "runway": "03L/21R",
          "thresholdA": [
            29.714319,
            106.661469
          ],
          "thresholdB": [
            29.747126,
            106.672897
          ],
          "headingA": null,
          "headingB": null,
          "lengthM": 3799.9,
          "widthM": 60.0
        },
        {
          "id": "593483",
          "runway": "03R/21L",
          "thresholdA": [
            29.720997,
            106.6679
          ],
          "thresholdB": [
            29.750336,
            106.678131
          ],
          "headingA": 17.0,
          "headingB": 197.0,
          "lengthM": 3399.7,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "CLE",
      "icao": "KCLE",
      "airport": "Cleveland Hopkins International Airport",
      "city": "Cleveland",
      "country": "US",
      "runways": [
        {
          "id": "240932",
          "runway": "10/28",
          "thresholdA": [
            41.417024,
            -81.854233
          ],
          "thresholdB": [
            41.416071,
            -81.832369
          ],
          "headingA": 93.0,
          "headingB": 273.0,
          "lengthM": 1834.3,
          "widthM": 45.7
        },
        {
          "id": "240931",
          "runway": "6L/24R",
          "thresholdA": [
            41.399887,
            -81.873479
          ],
          "thresholdB": [
            41.415762,
            -81.848396
          ],
          "headingA": 50.0,
          "headingB": 230.0,
          "lengthM": 2743.2,
          "widthM": 45.7
        },
        {
          "id": "240930",
          "runway": "6R/24L",
          "thresholdA": [
            41.401156,
            -81.864447
          ],
          "thresholdB": [
            41.415312,
            -81.842067
          ],
          "headingA": 50.0,
          "headingB": 230.0,
          "lengthM": 3033.7,
          "widthM": 45.7
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "CLO",
      "icao": "SKCL",
      "airport": "Alfonso Bonilla Aragon International Airport",
      "city": "Cali",
      "country": "CO",
      "runways": [
        {
          "id": "235302",
          "runway": "02/20",
          "thresholdA": [
            3.52990007,
            -76.3839035
          ],
          "thresholdB": [
            3.55654001,
            -76.37930298
          ],
          "headingA": 10.0,
          "headingB": 190.0,
          "lengthM": 2999.8,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "CLT",
      "icao": "KCLT",
      "airport": "Charlotte Douglas International Airport",
      "city": "Charlotte",
      "country": "US",
      "runways": [
        {
          "id": "248058",
          "runway": "18C/36C",
          "thresholdA": [
            35.22710037,
            -80.95310211
          ],
          "thresholdB": [
            35.20029831,
            -80.95079803
          ],
          "headingA": 176.0,
          "headingB": 356.0,
          "lengthM": 3048.0,
          "widthM": 45.7
        },
        {
          "id": "245928",
          "runway": "18L/36R",
          "thresholdA": [
            35.22439957,
            -80.93609619
          ],
          "thresholdB": [
            35.20119858,
            -80.93409729
          ],
          "headingA": 176.0,
          "headingB": 356.0,
          "lengthM": 2644.4,
          "widthM": 45.7
        },
        {
          "id": "245927",
          "runway": "18R/36L",
          "thresholdA": [
            35.22499847,
            -80.9673996
          ],
          "thresholdB": [
            35.20090103,
            -80.96530151
          ],
          "headingA": 176.0,
          "headingB": 356.0,
          "lengthM": 2743.2,
          "widthM": 45.7
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "CMH",
      "icao": "KCMH",
      "airport": "John Glenn Columbus International Airport",
      "city": "Columbus",
      "country": "US",
      "runways": [
        {
          "id": "244547",
          "runway": "10L/28R",
          "thresholdA": [
            40.00320053,
            -82.9076004
          ],
          "thresholdB": [
            40.00159836,
            -82.8792038
          ],
          "headingA": 94.2,
          "headingB": 274.2,
          "lengthM": 2438.4,
          "widthM": 45.7
        },
        {
          "id": "244546",
          "runway": "10R/28L",
          "thresholdA": [
            39.99560165,
            -82.9088974
          ],
          "thresholdB": [
            39.99349976,
            -82.87290192
          ],
          "headingA": 94.2,
          "headingB": 274.2,
          "lengthM": 3082.7,
          "widthM": 45.7
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "CMN",
      "icao": "GMMN",
      "airport": "Mohammed V International Airport",
      "city": "Casablanca",
      "country": "MA",
      "runways": [
        {
          "id": "237596",
          "runway": "17L/35R",
          "thresholdA": [
            33.38399887,
            -7.59352016
          ],
          "thresholdB": [
            33.35179901,
            -7.58248997
          ],
          "headingA": 164.0,
          "headingB": 344.0,
          "lengthM": 3720.1,
          "widthM": 45.1
        },
        {
          "id": "237595",
          "runway": "17R/35L",
          "thresholdA": [
            33.3830986,
            -7.59743023
          ],
          "thresholdB": [
            33.35089874,
            -7.58642006
          ],
          "headingA": 164.0,
          "headingB": 344.0,
          "lengthM": 3720.1,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "CNF",
      "icao": "SBCF",
      "airport": "Tancredo Neves International Airport",
      "city": "Belo Horizonte",
      "country": "BR",
      "runways": [
        {
          "id": "234190",
          "runway": "16/34",
          "thresholdA": [
            -19.62350082,
            -43.97819901
          ],
          "thresholdB": [
            -19.64800072,
            -43.95560074
          ],
          "headingA": 139.0,
          "headingB": 319.0,
          "lengthM": 3600.0,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "CNS",
      "icao": "YBCS",
      "airport": "Cairns International Airport",
      "city": "Cairns",
      "country": "AU",
      "runways": [
        {
          "id": "233142",
          "runway": "15/33",
          "thresholdA": [
            -16.86580086,
            145.7440033
          ],
          "thresholdB": [
            -16.89229965,
            145.7559967
          ],
          "headingA": 156.0,
          "headingB": 336.0,
          "lengthM": 3197.0,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "COR",
      "icao": "SACO",
      "airport": "Ingeniero Aeron\u00e1utico Ambrosio L.V. Taravella International Airport",
      "city": "Cordoba",
      "country": "AR",
      "runways": [
        {
          "id": "232955",
          "runway": "01/19",
          "thresholdA": [
            -31.32439995,
            -64.20800018
          ],
          "thresholdB": [
            -31.29579926,
            -64.20809937
          ],
          "headingA": 358.0,
          "headingB": 178.0,
          "lengthM": 3200.1,
          "widthM": 45.1
        },
        {
          "id": "232954",
          "runway": "05/23",
          "thresholdA": [
            -31.32480049,
            -64.20929718
          ],
          "thresholdB": [
            -31.30890083,
            -64.19120026
          ],
          "headingA": 43.0,
          "headingB": 223.0,
          "lengthM": 2200.0,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "CPH",
      "icao": "EKCH",
      "airport": "Copenhagen Kastrup Airport",
      "city": "Copenhagen",
      "country": "DK",
      "runways": [
        {
          "id": "235449",
          "runway": "04L/22R",
          "thresholdA": [
            55.592201,
            12.603536
          ],
          "thresholdB": [
            55.616543,
            12.641174
          ],
          "headingA": 41.0,
          "headingB": 221.0,
          "lengthM": 3600.0,
          "widthM": 45.1
        },
        {
          "id": "235448",
          "runway": "04R/22L",
          "thresholdA": [
            55.60309982,
            12.63300037
          ],
          "thresholdB": [
            55.62540054,
            12.66759968
          ],
          "headingA": 41.0,
          "headingB": 221.0,
          "lengthM": 3300.1,
          "widthM": 45.1
        },
        {
          "id": "235450",
          "runway": "12/30",
          "thresholdA": [
            55.626293,
            12.633331
          ],
          "thresholdB": [
            55.612522,
            12.670532
          ],
          "headingA": 123.0,
          "headingB": 303.0,
          "lengthM": 2799.9,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "CPT",
      "icao": "FACT",
      "airport": "Cape Town International Airport",
      "city": "Cape Town",
      "country": "ZA",
      "runways": [
        {
          "id": "238798",
          "runway": "01/19",
          "thresholdA": [
            -33.98770142,
            18.60890007
          ],
          "thresholdB": [
            -33.95980072,
            18.60000038
          ],
          "headingA": 346.0,
          "headingB": 166.0,
          "lengthM": 3201.0,
          "widthM": 61.0
        },
        {
          "id": "238799",
          "runway": "16/34",
          "thresholdA": [
            -33.96139908,
            18.59749985
          ],
          "thresholdB": [
            -33.97230148,
            18.61039925
          ],
          "headingA": 136.0,
          "headingB": 316.0,
          "lengthM": 1701.1,
          "widthM": 46.0
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "CTA",
      "icao": "LICC",
      "airport": "Catania-Fontanarossa Airport",
      "city": "Catania",
      "country": "IT",
      "runways": [
        {
          "id": "237038",
          "runway": "08/26",
          "thresholdA": [
            37.46559906,
            15.05270004
          ],
          "thresholdB": [
            37.46789932,
            15.08010006
          ],
          "headingA": 84.0,
          "headingB": 264.0,
          "lengthM": 2435.0,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "CTG",
      "icao": "SKCG",
      "airport": "Rafael Nu\u00f1ez International Airport",
      "city": "Cartagena",
      "country": "CO",
      "runways": [
        {
          "id": "235328",
          "runway": "01/19",
          "thresholdA": [
            10.430861,
            -75.513378
          ],
          "thresholdB": [
            10.452475,
            -75.512492
          ],
          "headingA": 2.0,
          "headingB": 182.0,
          "lengthM": 2599.9,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "CTS",
      "icao": "RJCC",
      "airport": "New Chitose Airport",
      "city": "Sapporo",
      "country": "JP",
      "runways": [
        {
          "id": "237178",
          "runway": "01L/19R",
          "thresholdA": [
            42.7616,
            141.692993
          ],
          "thresholdB": [
            42.788399,
            141.688004
          ],
          "headingA": 353.0,
          "headingB": 173.0,
          "lengthM": 3000.1,
          "widthM": 61.0
        },
        {
          "id": "237177",
          "runway": "01R/19L",
          "thresholdA": [
            42.762001,
            141.695999
          ],
          "thresholdB": [
            42.788799,
            141.692001
          ],
          "headingA": 353.0,
          "headingB": 173.0,
          "lengthM": 3000.1,
          "widthM": 61.0
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "CTU",
      "icao": "ZUUU",
      "airport": "Chengdu Shuangliu International Airport",
      "city": "Chengdu (Shuangliu)",
      "country": "CN",
      "runways": [
        {
          "id": "235194",
          "runway": "02L/20R",
          "thresholdA": [
            30.56346321,
            103.93998718
          ],
          "thresholdB": [
            30.59359932,
            103.95400238
          ],
          "headingA": 24.0,
          "headingB": 204.0,
          "lengthM": 3600.0,
          "widthM": 45.1
        },
        {
          "id": "336872",
          "runway": "02R/20L",
          "thresholdA": [
            30.51950073,
            103.93699646
          ],
          "thresholdB": [
            30.5496006,
            103.95068359
          ],
          "headingA": 24.0,
          "headingB": 204.0,
          "lengthM": 3600.0,
          "widthM": 60.0
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "CUZ",
      "icao": "SPZO",
      "airport": "Alejandro Velasco Astete International Airport",
      "city": "Cusco",
      "country": "PE",
      "runways": [
        {
          "id": "238138",
          "runway": "10/28",
          "thresholdA": [
            -13.53409958,
            -71.95439911
          ],
          "thresholdB": [
            -13.53730011,
            -71.92320251
          ],
          "headingA": 95.9,
          "headingB": 275.9,
          "lengthM": 3397.3,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "CVG",
      "icao": "KCVG",
      "airport": "Cincinnati Northern Kentucky International Airport",
      "city": "Cincinnati / Covington",
      "country": "US",
      "runways": [
        {
          "id": "240940",
          "runway": "09/27",
          "thresholdA": [
            39.04639816,
            -84.69509888
          ],
          "thresholdB": [
            39.04629898,
            -84.65280151
          ],
          "headingA": 90.0,
          "headingB": 270.0,
          "lengthM": 3657.9,
          "widthM": 45.7
        },
        {
          "id": "240941",
          "runway": "18C/36C",
          "thresholdA": [
            39.06470108,
            -84.66860199
          ],
          "thresholdB": [
            39.03450012,
            -84.66870117
          ],
          "headingA": 180.0,
          "headingB": 360.0,
          "lengthM": 3352.8,
          "widthM": 45.7
        },
        {
          "id": "240943",
          "runway": "18L/36R",
          "thresholdA": [
            39.05590057,
            -84.646698
          ],
          "thresholdB": [
            39.02840042,
            -84.64679718
          ],
          "headingA": 180.0,
          "headingB": 360.0,
          "lengthM": 3048.0,
          "widthM": 45.7
        },
        {
          "id": "240942",
          "runway": "18R/36L",
          "thresholdA": [
            39.07089996,
            -84.68370056
          ],
          "thresholdB": [
            39.0489006,
            -84.68379974
          ],
          "headingA": 180.2,
          "headingB": 0.2,
          "lengthM": 2438.4,
          "widthM": 45.7
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "CWB",
      "icao": "SBCT",
      "airport": "Curitiba-Afonso Pena International Airport",
      "city": "Curitiba",
      "country": "BR",
      "runways": [
        {
          "id": "234163",
          "runway": "11/29",
          "thresholdA": [
            -25.5282917,
            -49.18016434
          ],
          "thresholdB": [
            -25.5287838,
            -49.16227341
          ],
          "headingA": null,
          "headingB": null,
          "lengthM": 1798.0,
          "widthM": 45.1
        },
        {
          "id": "234164",
          "runway": "15/33",
          "thresholdA": [
            -25.52209473,
            -49.1829071
          ],
          "thresholdB": [
            -25.53613853,
            -49.16717911
          ],
          "headingA": 136.0,
          "headingB": 314.0,
          "lengthM": 2218.0,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "DAC",
      "icao": "VGHS",
      "airport": "Hazrat Shahjalal International Airport",
      "city": "Dhaka",
      "country": "BD",
      "runways": [
        {
          "id": "233681",
          "runway": "14/32",
          "thresholdA": [
            23.85503,
            90.388496
          ],
          "thresholdB": [
            23.831699,
            90.406898
          ],
          "headingA": 144.0,
          "headingB": 324.0,
          "lengthM": 3505.2,
          "widthM": 45.7
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "DAL",
      "icao": "KDAL",
      "airport": "Dallas Love Field",
      "city": "Dallas",
      "country": "US",
      "runways": [
        {
          "id": "241143",
          "runway": "13L/31R",
          "thresholdA": [
            32.8572998,
            -96.85679626
          ],
          "thresholdB": [
            32.84199905,
            -96.8391037
          ],
          "headingA": 135.6,
          "headingB": 315.6,
          "lengthM": 2362.8,
          "widthM": 45.7
        },
        {
          "id": "241142",
          "runway": "13R/31L",
          "thresholdA": [
            32.85129929,
            -96.8635025
          ],
          "thresholdB": [
            32.83399963,
            -96.84339905
          ],
          "headingA": 135.6,
          "headingB": 315.6,
          "lengthM": 2682.2,
          "widthM": 45.7
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "DAR",
      "icao": "HTDA",
      "airport": "Julius Nyerere International Airport",
      "city": "Dar es Salaam",
      "country": "TZ",
      "runways": [
        {
          "id": "239367",
          "runway": "05/23",
          "thresholdA": [
            -6.88286018,
            39.19779968
          ],
          "thresholdB": [
            -6.86371994,
            39.21699905
          ],
          "headingA": 45.0,
          "headingB": 225.0,
          "lengthM": 3000.1,
          "widthM": 46.0
        },
        {
          "id": "239368",
          "runway": "14/32",
          "thresholdA": [
            -6.87358999,
            39.19789886
          ],
          "thresholdB": [
            -6.88001013,
            39.20429993
          ],
          "headingA": 135.0,
          "headingB": 315.0,
          "lengthM": 999.7,
          "widthM": 29.9
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "DCA",
      "icao": "KDCA",
      "airport": "Ronald Reagan Washington National Airport",
      "city": "Washington",
      "country": "US",
      "runways": [
        {
          "id": "241380",
          "runway": "01/19",
          "thresholdA": [
            38.8423996,
            -77.03679657
          ],
          "thresholdB": [
            38.86119843,
            -77.03869629
          ],
          "headingA": 356.0,
          "headingB": 176.0,
          "lengthM": 2185.1,
          "widthM": 45.7
        },
        {
          "id": "241381",
          "runway": "04/22",
          "thresholdA": [
            38.84230042,
            -77.040802
          ],
          "thresholdB": [
            38.85440063,
            -77.03330231
          ],
          "headingA": 26.0,
          "headingB": 206.0,
          "lengthM": 1524.0,
          "widthM": 45.7
        },
        {
          "id": "241382",
          "runway": "15/33",
          "thresholdA": [
            38.86169815,
            -77.04380035
          ],
          "thresholdB": [
            38.85029984,
            -77.03269958
          ],
          "headingA": 142.7,
          "headingB": 322.7,
          "lengthM": 1586.2,
          "widthM": 45.7
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "DEL",
      "icao": "VIDP",
      "airport": "Indira Gandhi International Airport",
      "city": "New Delhi",
      "country": "IN",
      "runways": [
        {
          "id": "236778",
          "runway": "09/27",
          "thresholdA": [
            28.570499,
            77.087997
          ],
          "thresholdB": [
            28.569799,
            77.116997
          ],
          "headingA": 92.0,
          "headingB": 272.0,
          "lengthM": 2813.0,
          "widthM": 45.1
        },
        {
          "id": "236779",
          "runway": "10/28",
          "thresholdA": [
            28.5672,
            77.084801
          ],
          "thresholdB": [
            28.5585,
            77.122498
          ],
          "headingA": 105.0,
          "headingB": 285.0,
          "lengthM": 3810.0,
          "widthM": 45.1
        },
        {
          "id": "510252",
          "runway": "11L/29R",
          "thresholdA": [
            28.550125,
            77.068176
          ],
          "thresholdB": [
            28.540747,
            77.111877
          ],
          "headingA": 103.0,
          "headingB": 283.0,
          "lengthM": 4400.1,
          "widthM": 45.1
        },
        {
          "id": "271000",
          "runway": "11R/29L",
          "thresholdA": [
            28.547171,
            77.065491
          ],
          "thresholdB": [
            28.537729,
            77.109528
          ],
          "headingA": 103.0,
          "headingB": 283.0,
          "lengthM": 4430.0,
          "widthM": 60.0
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "DEN",
      "icao": "KDEN",
      "airport": "Denver International Airport",
      "city": "Denver",
      "country": "US",
      "runways": [
        {
          "id": "244458",
          "runway": "07/25",
          "thresholdA": [
            39.84090042,
            -104.72699738
          ],
          "thresholdB": [
            39.84069824,
            -104.68399811
          ],
          "headingA": 90.5,
          "headingB": 270.5,
          "lengthM": 3657.6,
          "widthM": 45.7
        },
        {
          "id": "244459",
          "runway": "08/26",
          "thresholdA": [
            39.87760162,
            -104.66200256
          ],
          "thresholdB": [
            39.87720108,
            -104.6190033
          ],
          "headingA": 90.5,
          "headingB": 270.5,
          "lengthM": 3657.6,
          "widthM": 45.7
        },
        {
          "id": "244461",
          "runway": "16L/34R",
          "thresholdA": [
            39.89699936,
            -104.68699646
          ],
          "thresholdB": [
            39.86410141,
            -104.68699646
          ],
          "headingA": 180.5,
          "headingB": 0.5,
          "lengthM": 3657.6,
          "widthM": 45.7
        },
        {
          "id": "244460",
          "runway": "16R/34L",
          "thresholdA": [
            39.89580154,
            -104.69599915
          ],
          "thresholdB": [
            39.85189819,
            -104.6969986
          ],
          "headingA": 180.5,
          "headingB": 0.5,
          "lengthM": 4876.8,
          "widthM": 61.0
        },
        {
          "id": "244463",
          "runway": "17L/35R",
          "thresholdA": [
            39.86500168,
            -104.64099884
          ],
          "thresholdB": [
            39.83200073,
            -104.64199829
          ],
          "headingA": 180.5,
          "headingB": 0.5,
          "lengthM": 3657.6,
          "widthM": 45.7
        },
        {
          "id": "244462",
          "runway": "17R/35L",
          "thresholdA": [
            39.86119843,
            -104.66000366
          ],
          "thresholdB": [
            39.82830048,
            -104.66100311
          ],
          "headingA": 180.5,
          "headingB": 0.5,
          "lengthM": 3657.6,
          "widthM": 45.7
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "DFW",
      "icao": "KDFW",
      "airport": "Dallas Fort Worth International Airport",
      "city": "Dallas-Fort Worth",
      "country": "US",
      "runways": [
        {
          "id": "243410",
          "runway": "13L/31R",
          "thresholdA": [
            32.91260147,
            -97.02149963
          ],
          "thresholdB": [
            32.89500046,
            -97.00080109
          ],
          "headingA": 135.3,
          "headingB": 315.3,
          "lengthM": 2743.2,
          "widthM": 61.0
        },
        {
          "id": "243409",
          "runway": "13R/31L",
          "thresholdA": [
            32.9095993,
            -97.08309937
          ],
          "thresholdB": [
            32.89030075,
            -97.06330109
          ],
          "headingA": 139.0,
          "headingB": 319.0,
          "lengthM": 2834.6,
          "widthM": 45.7
        },
        {
          "id": "243411",
          "runway": "17C/35C",
          "thresholdA": [
            32.91569901,
            -97.02600098
          ],
          "thresholdB": [
            32.87889862,
            -97.02619934
          ],
          "headingA": 180.3,
          "headingB": 0.3,
          "lengthM": 4084.3,
          "widthM": 45.7
        },
        {
          "id": "243413",
          "runway": "17L/35R",
          "thresholdA": [
            32.89830017,
            -97.00980377
          ],
          "thresholdB": [
            32.875,
            -97.00990295
          ],
          "headingA": 180.3,
          "headingB": 0.3,
          "lengthM": 2590.8,
          "widthM": 45.7
        },
        {
          "id": "243412",
          "runway": "17R/35L",
          "thresholdA": [
            32.91569901,
            -97.0298996
          ],
          "thresholdB": [
            32.87889862,
            -97.03009796
          ],
          "headingA": 180.3,
          "headingB": 0.3,
          "lengthM": 4084.3,
          "widthM": 61.0
        },
        {
          "id": "243415",
          "runway": "18L/36R",
          "thresholdA": [
            32.91579819,
            -97.05069733
          ],
          "thresholdB": [
            32.87900162,
            -97.05090332
          ],
          "headingA": 180.2,
          "headingB": 0.2,
          "lengthM": 4084.6,
          "widthM": 61.0
        },
        {
          "id": "243414",
          "runway": "18R/36L",
          "thresholdA": [
            32.91579819,
            -97.05460358
          ],
          "thresholdB": [
            32.87900162,
            -97.05480194
          ],
          "headingA": 180.3,
          "headingB": 0.3,
          "lengthM": 4084.3,
          "widthM": 45.7
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "DJE",
      "icao": "DTTJ",
      "airport": "Djerba Zarzis International Airport",
      "city": "Mellita",
      "country": "TN",
      "runways": [
        {
          "id": "239226",
          "runway": "09/27",
          "thresholdA": [
            33.875,
            10.76039982
          ],
          "thresholdB": [
            33.87590027,
            10.79389954
          ],
          "headingA": 88.3,
          "headingB": 268.3,
          "lengthM": 3100.1,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "DME",
      "icao": "UUDD",
      "airport": "Domodedovo International Airport",
      "city": "Moscow",
      "country": "RU",
      "runways": [
        {
          "id": "238569",
          "runway": "13C/31C",
          "thresholdA": [
            55.416943,
            37.915359
          ],
          "thresholdB": [
            55.399368,
            37.936474
          ],
          "headingA": 146.0,
          "headingB": 326.0,
          "lengthM": 2370.1,
          "widthM": 53.0
        },
        {
          "id": "238570",
          "runway": "13R/31L",
          "thresholdA": [
            55.421062,
            37.872101
          ],
          "thresholdB": [
            55.395119,
            37.903351
          ],
          "headingA": 146.0,
          "headingB": 326.0,
          "lengthM": 3500.0,
          "widthM": 60.0
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "DMK",
      "icao": "VTBD",
      "airport": "Don Mueang International Airport",
      "city": "Bangkok",
      "country": "TH",
      "runways": [
        {
          "id": "239184",
          "runway": "03L/21R",
          "thresholdA": [
            13.89710045,
            100.59600067
          ],
          "thresholdB": [
            13.92640018,
            100.61199951
          ],
          "headingA": 29.0,
          "headingB": 209.0,
          "lengthM": 3700.0,
          "widthM": 60.0
        },
        {
          "id": "239183",
          "runway": "03R/21L",
          "thresholdA": [
            13.89949989,
            100.60199738
          ],
          "thresholdB": [
            13.92739964,
            100.61699677
          ],
          "headingA": 29.0,
          "headingB": 209.0,
          "lengthM": 3500.0,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "DOH",
      "icao": "OTHH",
      "airport": "Hamad International Airport",
      "city": "Doha",
      "country": "QA",
      "runways": [
        {
          "id": "312710",
          "runway": "16L/34R",
          "thresholdA": [
            25.29610062,
            51.60879898
          ],
          "thresholdB": [
            25.2553997,
            51.62680054
          ],
          "headingA": 156.0,
          "headingB": 336.0,
          "lengthM": 4850.0,
          "widthM": 60.0
        },
        {
          "id": "312712",
          "runway": "16R/34L",
          "thresholdA": [
            25.29100037,
            51.58969879
          ],
          "thresholdB": [
            25.25530052,
            51.60540009
          ],
          "headingA": 156.0,
          "headingB": 336.0,
          "lengthM": 4250.1,
          "widthM": 60.0
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "DPS",
      "icao": "WADD",
      "airport": "Denpasar I Gusti Ngurah Rai International Airport",
      "city": "Kuta, Badung",
      "country": "ID",
      "runways": [
        {
          "id": "236518",
          "runway": "09/27",
          "thresholdA": [
            -8.74870968,
            115.15399933
          ],
          "thresholdB": [
            -8.74763012,
            115.18099976
          ],
          "headingA": 88.0,
          "headingB": 268.0,
          "lengthM": 2984.0,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "DRW",
      "icao": "YPDN",
      "airport": "Darwin International Airport / RAAF Darwin",
      "city": "Darwin",
      "country": "AU",
      "runways": [
        {
          "id": "233105",
          "runway": "11/29",
          "thresholdA": [
            -12.40939999,
            130.86500549
          ],
          "thresholdB": [
            -12.41919994,
            130.89399719
          ],
          "headingA": 109.0,
          "headingB": 289.0,
          "lengthM": 3354.0,
          "widthM": 60.0
        },
        {
          "id": "233106",
          "runway": "18/36",
          "thresholdA": [
            -12.40880013,
            130.8710022
          ],
          "thresholdB": [
            -12.42259979,
            130.8710022
          ],
          "headingA": 180.0,
          "headingB": 360.0,
          "lengthM": 1524.0,
          "widthM": 29.9
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "DSS",
      "icao": "GOBD",
      "airport": "Blaise Diagne International Airport",
      "city": "Dakar",
      "country": "SN",
      "runways": [
        {
          "id": "325737",
          "runway": "01/19",
          "thresholdA": [
            14.6552,
            -17.0727005
          ],
          "thresholdB": [
            14.6868,
            -17.07296944
          ],
          "headingA": 359.0,
          "headingB": 179.0,
          "lengthM": 3500.0,
          "widthM": 60.0
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "DTW",
      "icao": "KDTW",
      "airport": "Detroit Metropolitan Wayne County Airport",
      "city": "Detroit",
      "country": "US",
      "runways": [
        {
          "id": "243014",
          "runway": "03L/21R",
          "thresholdA": [
            42.20780182,
            -83.35119629
          ],
          "thresholdB": [
            42.22829819,
            -83.33609772
          ],
          "headingA": 29.0,
          "headingB": 209.0,
          "lengthM": 2591.1,
          "widthM": 45.7
        },
        {
          "id": "243013",
          "runway": "03R/21L",
          "thresholdA": [
            42.1955986,
            -83.35179901
          ],
          "thresholdB": [
            42.21969986,
            -83.33409882
          ],
          "headingA": 29.0,
          "headingB": 209.0,
          "lengthM": 3048.3,
          "widthM": 45.7
        },
        {
          "id": "243016",
          "runway": "04L/22R",
          "thresholdA": [
            42.20220184,
            -83.38400269
          ],
          "thresholdB": [
            42.2262001,
            -83.36630249
          ],
          "headingA": 28.7,
          "headingB": 208.7,
          "lengthM": 3048.0,
          "widthM": 45.7
        },
        {
          "id": "243015",
          "runway": "04R/22L",
          "thresholdA": [
            42.20230103,
            -83.37129974
          ],
          "thresholdB": [
            42.23120117,
            -83.34999847
          ],
          "headingA": 29.0,
          "headingB": 209.0,
          "lengthM": 3658.5,
          "widthM": 61.0
        },
        {
          "id": "243018",
          "runway": "09L/27R",
          "thresholdA": [
            42.21699905,
            -83.36319733
          ],
          "thresholdB": [
            42.21749878,
            -83.33100128
          ],
          "headingA": 89.0,
          "headingB": 269.0,
          "lengthM": 2654.2,
          "widthM": 45.7
        },
        {
          "id": "243017",
          "runway": "09R/27L",
          "thresholdA": [
            42.19900131,
            -83.36170197
          ],
          "thresholdB": [
            42.19950104,
            -83.33039856
          ],
          "headingA": 89.0,
          "headingB": 269.0,
          "lengthM": 2590.8,
          "widthM": 45.7
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "DUB",
      "icao": "EIDW",
      "airport": "Dublin Airport",
      "city": "Dublin",
      "country": "IE",
      "runways": [
        {
          "id": "356512",
          "runway": "10L/28R",
          "thresholdA": [
            53.43716,
            -6.28062
          ],
          "thresholdB": [
            53.4352,
            -6.24496
          ],
          "headingA": 97.0,
          "headingB": 278.0,
          "lengthM": 3109.9,
          "widthM": 45.1
        },
        {
          "id": "235634",
          "runway": "10R/28L",
          "thresholdA": [
            53.42243,
            -6.29007
          ],
          "thresholdB": [
            53.4203,
            -6.25058
          ],
          "headingA": 95.0,
          "headingB": 275.0,
          "lengthM": 2637.1,
          "widthM": 45.1
        },
        {
          "id": "235636",
          "runway": "16/34",
          "thresholdA": [
            53.437,
            -6.26198
          ],
          "thresholdB": [
            53.419899,
            -6.24959
          ],
          "headingA": 157.0,
          "headingB": 337.0,
          "lengthM": 2072.0,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "DUD",
      "icao": "NZDN",
      "airport": "Dunedin International Airport",
      "city": "Dunedin",
      "country": "NZ",
      "runways": [
        {
          "id": "238041",
          "runway": "03/21",
          "thresholdA": [
            -45.93389893,
            170.18699646
          ],
          "thresholdB": [
            -45.92440033,
            170.20799255
          ],
          "headingA": 56.0,
          "headingB": 236.0,
          "lengthM": 1900.1,
          "widthM": 45.7
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "DUR",
      "icao": "FALE",
      "airport": "King Shaka International Airport",
      "city": "Durban",
      "country": "ZA",
      "runways": [],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "DUS",
      "icao": "EDDL",
      "airport": "D\u00fcsseldorf Airport",
      "city": "D\u00fcsseldorf",
      "country": "DE",
      "runways": [
        {
          "id": "236212",
          "runway": "05L/23R",
          "thresholdA": [
            51.28369904,
            6.74872017
          ],
          "thresholdB": [
            51.29840088,
            6.77965021
          ],
          "headingA": 53.0,
          "headingB": 233.0,
          "lengthM": 2699.9,
          "widthM": 45.1
        },
        {
          "id": "236211",
          "runway": "05R/23L",
          "thresholdA": [
            51.27959824,
            6.75198984
          ],
          "thresholdB": [
            51.29589844,
            6.78622007
          ],
          "headingA": 53.0,
          "headingB": 233.0,
          "lengthM": 2999.8,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "DXB",
      "icao": "OMDB",
      "airport": "Dubai International Airport",
      "city": "Dubai",
      "country": "AE",
      "runways": [
        {
          "id": "232769",
          "runway": "12L/30R",
          "thresholdA": [
            25.26462746,
            55.35042191
          ],
          "thresholdB": [
            25.24770927,
            55.38093185
          ],
          "headingA": 121.0,
          "headingB": 301.0,
          "lengthM": 4351.0,
          "widthM": 60.0
        },
        {
          "id": "232768",
          "runway": "12R/30L",
          "thresholdA": [
            25.25283623,
            55.36437607
          ],
          "thresholdB": [
            25.23591995,
            55.3948822
          ],
          "headingA": 121.0,
          "headingB": 301.0,
          "lengthM": 4447.0,
          "widthM": 60.0
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "EBB",
      "icao": "HUEN",
      "airport": "Entebbe International Airport",
      "city": "Entebbe",
      "country": "UG",
      "runways": [
        {
          "id": "239374",
          "runway": "12/30",
          "thresholdA": [
            0.051228,
            32.43909836
          ],
          "thresholdB": [
            0.039806,
            32.457901
          ],
          "headingA": 121.0,
          "headingB": 301.0,
          "lengthM": 2407.9,
          "widthM": 45.7
        },
        {
          "id": "239375",
          "runway": "17/35",
          "thresholdA": [
            0.055597,
            32.43590164
          ],
          "thresholdB": [
            0.022914,
            32.44110107
          ],
          "headingA": 171.0,
          "headingB": 351.0,
          "lengthM": 3657.6,
          "widthM": 45.7
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "EDI",
      "icao": "EGPH",
      "airport": "Edinburgh Airport",
      "city": "Ingliston, Edinburgh",
      "country": "GB",
      "runways": [
        {
          "id": "239588",
          "runway": "06/24",
          "thresholdA": [
            55.944,
            -3.39014
          ],
          "thresholdB": [
            55.955898,
            -3.35506
          ],
          "headingA": 59.0,
          "headingB": 239.0,
          "lengthM": 2557.9,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "EWR",
      "icao": "KEWR",
      "airport": "Newark Liberty International Airport",
      "city": "Newark",
      "country": "US",
      "runways": [
        {
          "id": "240989",
          "runway": "11/29",
          "thresholdA": [
            40.702815,
            -74.180748
          ],
          "thresholdB": [
            40.701203,
            -74.156502
          ],
          "headingA": 95.0,
          "headingB": 275.0,
          "lengthM": 2049.8,
          "widthM": 45.7
        },
        {
          "id": "240988",
          "runway": "4L/22R",
          "thresholdA": [
            40.675392,
            -74.179456
          ],
          "thresholdB": [
            40.70257,
            -74.16217
          ],
          "headingA": 26.0,
          "headingB": 206.0,
          "lengthM": 3352.8,
          "widthM": 45.7
        },
        {
          "id": "240987",
          "runway": "4R/22L",
          "thresholdA": [
            40.677588,
            -74.174253
          ],
          "thresholdB": [
            40.702299,
            -74.158539
          ],
          "headingA": 26.0,
          "headingB": 206.0,
          "lengthM": 3047.7,
          "widthM": 45.7
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "EZE",
      "icao": "SAEZ",
      "airport": "Ezeiza International Airport - Ministro Pistarini",
      "city": "Buenos Aires (Ezeiza)",
      "country": "AR",
      "runways": [
        {
          "id": "233039",
          "runway": "11/29",
          "thresholdA": [
            -34.81909943,
            -58.55350113
          ],
          "thresholdB": [
            -34.82540131,
            -58.51819992
          ],
          "headingA": 102.3,
          "headingB": 282.3,
          "lengthM": 3300.1,
          "widthM": 60.0
        },
        {
          "id": "233040",
          "runway": "17/35",
          "thresholdA": [
            -34.80830002,
            -58.53390121
          ],
          "thresholdB": [
            -34.83520126,
            -58.52460098
          ],
          "headingA": 164.0,
          "headingB": 344.0,
          "lengthM": 3105.0,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "FCO",
      "icao": "LIRF",
      "airport": "Rome\u2013Fiumicino Leonardo da Vinci International Airport",
      "city": "Rome",
      "country": "IT",
      "runways": [
        {
          "id": "236972",
          "runway": "07/25",
          "thresholdA": [
            41.799332,
            12.232144
          ],
          "thresholdB": [
            41.809631,
            12.269483
          ],
          "headingA": 70.0,
          "headingB": 250.0,
          "lengthM": 3299.8,
          "widthM": 44.8
        },
        {
          "id": "236974",
          "runway": "16L/34R",
          "thresholdA": [
            41.84600067,
            12.26150036
          ],
          "thresholdB": [
            41.81240082,
            12.2755003
          ],
          "headingA": 163.0,
          "headingB": 343.0,
          "lengthM": 3901.7,
          "widthM": 59.7
        },
        {
          "id": "236973",
          "runway": "16R/34L",
          "thresholdA": [
            41.815498,
            12.2264
          ],
          "thresholdB": [
            41.782001,
            12.2404
          ],
          "headingA": 163.0,
          "headingB": 343.0,
          "lengthM": 3901.7,
          "widthM": 59.7
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "FLL",
      "icao": "KFLL",
      "airport": "Fort Lauderdale Hollywood International Airport",
      "city": "Fort Lauderdale",
      "country": "US",
      "runways": [
        {
          "id": "241503",
          "runway": "10L/28R",
          "thresholdA": [
            26.07690048,
            -80.16649628
          ],
          "thresholdB": [
            26.07679939,
            -80.13909912
          ],
          "headingA": 90.0,
          "headingB": 270.0,
          "lengthM": 2743.2,
          "widthM": 45.7
        },
        {
          "id": "241502",
          "runway": "10R/28L",
          "thresholdA": [
            26.06588554,
            -80.15834808
          ],
          "thresholdB": [
            26.06574249,
            -80.13398743
          ],
          "headingA": 90.0,
          "headingB": 270.0,
          "lengthM": 2438.4,
          "widthM": 45.7
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "FLN",
      "icao": "SBFL",
      "airport": "Herc\u00edlio Luz International Airport",
      "city": "Florian\u00f3polis",
      "country": "BR",
      "runways": [
        {
          "id": "234239",
          "runway": "03/21",
          "thresholdA": [
            -27.675278,
            -48.554167
          ],
          "thresholdB": [
            -27.664722,
            -48.551667
          ],
          "headingA": 12.0,
          "headingB": 192.0,
          "lengthM": 1320.1,
          "widthM": 45.1
        },
        {
          "id": "234240",
          "runway": "14/32",
          "thresholdA": [
            -27.66572,
            -48.551208
          ],
          "thresholdB": [
            -27.676939,
            -48.530399
          ],
          "headingA": 159.0,
          "headingB": 339.0,
          "lengthM": 2400.0,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "FOR",
      "icao": "SBFZ",
      "airport": "Pinto Martins International Airport",
      "city": "Fortaleza",
      "country": "BR",
      "runways": [
        {
          "id": "234350",
          "runway": "13/31",
          "thresholdA": [
            -3.773011,
            -38.544922
          ],
          "thresholdB": [
            -3.779428,
            -38.520954
          ],
          "headingA": 105.0,
          "headingB": 285.0,
          "lengthM": 2755.1,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "FRA",
      "icao": "EDDF",
      "airport": "Frankfurt Main Airport",
      "city": "Frankfurt am Main",
      "country": "DE",
      "runways": [
        {
          "id": "236134",
          "runway": "07C/25C",
          "thresholdA": [
            50.0326004,
            8.53462982
          ],
          "thresholdB": [
            50.04510117,
            8.58697987
          ],
          "headingA": 69.6,
          "headingB": 249.6,
          "lengthM": 3999.9,
          "widthM": 60.0
        },
        {
          "id": "308341",
          "runway": "07L/25R",
          "thresholdA": [
            50.03710175,
            8.49707985
          ],
          "thresholdB": [
            50.04579926,
            8.53372002
          ],
          "headingA": 69.6,
          "headingB": 249.6,
          "lengthM": 2799.9,
          "widthM": 45.1
        },
        {
          "id": "236133",
          "runway": "07R/25L",
          "thresholdA": [
            50.02750015,
            8.53417015
          ],
          "thresholdB": [
            50.0401001,
            8.58652973
          ],
          "headingA": 69.6,
          "headingB": 249.6,
          "lengthM": 3999.9,
          "widthM": 45.1
        },
        {
          "id": "236135",
          "runway": "18/36",
          "thresholdA": [
            50.034154,
            8.525944
          ],
          "thresholdB": [
            49.998493,
            8.526297
          ],
          "headingA": 180.0,
          "headingB": 360.0,
          "lengthM": 3999.9,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "FUK",
      "icao": "RJFF",
      "airport": "Fukuoka Airport",
      "city": "Fukuoka",
      "country": "JP",
      "runways": [
        {
          "id": "237205",
          "runway": "16L/34R",
          "thresholdA": [
            33.596901,
            130.442993
          ],
          "thresholdB": [
            33.575001,
            130.457993
          ],
          "headingA": 150.0,
          "headingB": 330.0,
          "lengthM": 2799.9,
          "widthM": 60.0
        },
        {
          "id": "596486",
          "runway": "16R/34L",
          "thresholdA": [
            33.59597,
            130.441223
          ],
          "thresholdB": [
            33.576405,
            130.45459
          ],
          "headingA": null,
          "headingB": null,
          "lengthM": 2500.0,
          "widthM": 60.0
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "GIG",
      "icao": "SBGL",
      "airport": "Rio Gale\u00e3o \u2013 Tom Jobim International Airport",
      "city": "Rio De Janeiro",
      "country": "BR",
      "runways": [
        {
          "id": "234161",
          "runway": "10/28",
          "thresholdA": [
            -22.8018,
            -43.255199
          ],
          "thresholdB": [
            -22.7922,
            -43.217701
          ],
          "headingA": 74.0,
          "headingB": 254.0,
          "lengthM": 3999.9,
          "widthM": 45.1
        },
        {
          "id": "234162",
          "runway": "15/33",
          "thresholdA": [
            -22.812401,
            -43.263699
          ],
          "thresholdB": [
            -22.8291,
            -43.238499
          ],
          "headingA": 125.0,
          "headingB": 305.0,
          "lengthM": 3180.0,
          "widthM": 46.9
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "GMP",
      "icao": "RKSS",
      "airport": "Seoul Gimpo International Airport",
      "city": "Seoul",
      "country": "KR",
      "runways": [
        {
          "id": "237323",
          "runway": "14L/32R",
          "thresholdA": [
            37.57030106,
            126.77799988
          ],
          "thresholdB": [
            37.54740143,
            126.80699921
          ],
          "headingA": 135.0,
          "headingB": 315.0,
          "lengthM": 3600.0,
          "widthM": 45.1
        },
        {
          "id": "237322",
          "runway": "14R/32L",
          "thresholdA": [
            37.56800079,
            126.77600098
          ],
          "thresholdB": [
            37.54759979,
            126.8010025
          ],
          "headingA": 135.0,
          "headingB": 315.0,
          "lengthM": 3200.1,
          "widthM": 60.0
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "GRU",
      "icao": "SBGR",
      "airport": "S\u00e3o Paulo/Guarulhos\u2013Governor Andr\u00e9 Franco Montoro International Airport",
      "city": "S\u00e3o Paulo",
      "country": "BR",
      "runways": [
        {
          "id": "234133",
          "runway": "10L/28R",
          "thresholdA": [
            -23.434059,
            -46.482548
          ],
          "thresholdB": [
            -23.425043,
            -46.449203
          ],
          "headingA": 74.0,
          "headingB": 254.0,
          "lengthM": 3700.0,
          "widthM": 45.1
        },
        {
          "id": "234132",
          "runway": "10R/28L",
          "thresholdA": [
            -23.438801,
            -46.487
          ],
          "thresholdB": [
            -23.4312,
            -46.4589
          ],
          "headingA": 74.0,
          "headingB": 254.0,
          "lengthM": 3000.1,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "GVA",
      "icao": "LSGG",
      "airport": "Geneva International Airport",
      "city": "Geneva",
      "country": "CH",
      "runways": [
        {
          "id": "239116",
          "runway": "04/22",
          "thresholdA": [
            46.2258,
            6.09092
          ],
          "thresholdB": [
            46.250401,
            6.12699
          ],
          "headingA": 46.0,
          "headingB": 226.0,
          "lengthM": 3899.9,
          "widthM": 50.0
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "GYE",
      "icao": "SEGU",
      "airport": "Jos\u00e9 Joaqu\u00edn de Olmedo International Airport",
      "city": "Guayaquil",
      "country": "EC",
      "runways": [
        {
          "id": "235519",
          "runway": "03/21",
          "thresholdA": [
            -2.16827011,
            -79.88990021
          ],
          "thresholdB": [
            -2.14656997,
            -79.87719727
          ],
          "headingA": 30.6,
          "headingB": 210.6,
          "lengthM": 2790.1,
          "widthM": 46.0
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "GYN",
      "icao": "SBGO",
      "airport": "Santa Genoveva International Airport",
      "city": "Goi\u00e2nia",
      "country": "BR",
      "runways": [
        {
          "id": "234115",
          "runway": "14/32",
          "thresholdA": [
            -16.62630081,
            -49.23120117
          ],
          "thresholdB": [
            -16.63759995,
            -49.21099854
          ],
          "headingA": 120.0,
          "headingB": 300.0,
          "lengthM": 2286.0,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "HAM",
      "icao": "EDDH",
      "airport": "Hamburg Helmut Schmidt Airport",
      "city": "Hamburg",
      "country": "DE",
      "runways": [
        {
          "id": "236258",
          "runway": "05/23",
          "thresholdA": [
            53.61830139,
            9.96370983
          ],
          "thresholdB": [
            53.63710022,
            10.00179958
          ],
          "headingA": 50.3,
          "headingB": 230.3,
          "lengthM": 3250.1,
          "widthM": 45.7
        },
        {
          "id": "236259",
          "runway": "15/33",
          "thresholdA": [
            53.65439987,
            9.97521019
          ],
          "thresholdB": [
            53.62509918,
            10.00049973
          ],
          "headingA": 152.8,
          "headingB": 332.8,
          "lengthM": 3666.1,
          "widthM": 45.7
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "HAN",
      "icao": "VVNB",
      "airport": "Noi Bai International Airport",
      "city": "Hanoi (Soc Son)",
      "country": "VN",
      "runways": [
        {
          "id": "246160",
          "runway": "11L/29R",
          "thresholdA": [
            21.2255,
            105.792
          ],
          "thresholdB": [
            21.216499,
            105.822998
          ],
          "headingA": 107.0,
          "headingB": 287.0,
          "lengthM": 3200.1,
          "widthM": 45.1
        },
        {
          "id": "246159",
          "runway": "11R/29L",
          "thresholdA": [
            21.224957,
            105.785431
          ],
          "thresholdB": [
            21.214323,
            105.82222
          ],
          "headingA": 107.0,
          "headingB": 287.0,
          "lengthM": 3799.6,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "HBA",
      "icao": "YMHB",
      "airport": "Hobart International Airport",
      "city": "Hobart (Cambridge)",
      "country": "AU",
      "runways": [
        {
          "id": "233439",
          "runway": "12/30",
          "thresholdA": [
            -42.828223,
            147.501024
          ],
          "thresholdB": [
            -42.845586,
            147.5246
          ],
          "headingA": 135.0,
          "headingB": 315.0,
          "lengthM": 2727.0,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "HEL",
      "icao": "EFHK",
      "airport": "Helsinki Vantaa Airport",
      "city": "Helsinki (Vantaa)",
      "country": "FI",
      "runways": [
        {
          "id": "235756",
          "runway": "04L/22R",
          "thresholdA": [
            60.31290054,
            24.90390015
          ],
          "thresholdB": [
            60.33150101,
            24.94470024
          ],
          "headingA": 48.0,
          "headingB": 228.0,
          "lengthM": 3059.9,
          "widthM": 60.0
        },
        {
          "id": "235755",
          "runway": "04R/22L",
          "thresholdA": [
            60.309467,
            24.932343
          ],
          "thresholdB": [
            60.330692,
            24.979092
          ],
          "headingA": 48.0,
          "headingB": 228.0,
          "lengthM": 3500.0,
          "widthM": 60.0
        },
        {
          "id": "235757",
          "runway": "15/33",
          "thresholdA": [
            60.33029938,
            24.96450043
          ],
          "thresholdB": [
            60.30709839,
            24.98830032
          ],
          "headingA": 154.1,
          "headingB": 334.1,
          "lengthM": 2901.1,
          "widthM": 60.0
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "HGH",
      "icao": "ZSHC",
      "airport": "Hangzhou Xiaoshan International Airport",
      "city": "Hangzhou",
      "country": "CN",
      "runways": [
        {
          "id": "314967",
          "runway": "06/24",
          "thresholdA": [
            30.2381897,
            120.40829468
          ],
          "thresholdB": [
            30.25214195,
            120.4397583
          ],
          "headingA": 63.0,
          "headingB": 243.0,
          "lengthM": 3400.0,
          "widthM": 60.0
        },
        {
          "id": "235175",
          "runway": "07/25",
          "thresholdA": [
            30.22212219,
            120.41775513
          ],
          "thresholdB": [
            30.23689461,
            120.45105743
          ],
          "headingA": 63.0,
          "headingB": 243.0,
          "lengthM": 3600.0,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "HKG",
      "icao": "VHHH",
      "airport": "Hong Kong International Airport",
      "city": "Hong Kong",
      "country": "HK",
      "runways": [
        {
          "id": "236412",
          "runway": "07C/25C",
          "thresholdA": [
            22.31040001,
            113.89600372
          ],
          "thresholdB": [
            22.32159996,
            113.93099976
          ],
          "headingA": 71.0,
          "headingB": 251.0,
          "lengthM": 3799.9,
          "widthM": 60.0
        },
        {
          "id": "355813",
          "runway": "07L/25R",
          "thresholdA": [
            22.321074,
            113.880692
          ],
          "thresholdB": [
            22.332306,
            113.915558
          ],
          "headingA": 74.0,
          "headingB": 254.0,
          "lengthM": 3799.9,
          "widthM": 60.0
        },
        {
          "id": "236411",
          "runway": "07R/25L",
          "thresholdA": [
            22.2962,
            113.898003
          ],
          "thresholdB": [
            22.307431,
            113.932819
          ],
          "headingA": 71.0,
          "headingB": 251.0,
          "lengthM": 3799.9,
          "widthM": 60.0
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "HND",
      "icao": "RJTT",
      "airport": "Tokyo Haneda International Airport",
      "city": "Tokyo",
      "country": "JP",
      "runways": [
        {
          "id": "237196",
          "runway": "04/22",
          "thresholdA": [
            35.549015,
            139.761274
          ],
          "thresholdB": [
            35.567459,
            139.777114
          ],
          "headingA": 35.0,
          "headingB": 215.0,
          "lengthM": 2500.0,
          "widthM": 61.0
        },
        {
          "id": "308751",
          "runway": "05/23",
          "thresholdA": [
            35.524001,
            139.803469
          ],
          "thresholdB": [
            35.540598,
            139.822125
          ],
          "headingA": 57.0,
          "headingB": 223.0,
          "lengthM": 2500.0,
          "widthM": 61.0
        },
        {
          "id": "237198",
          "runway": "16L/34R",
          "thresholdA": [
            35.565897,
            139.78655
          ],
          "thresholdB": [
            35.53969,
            139.805142
          ],
          "headingA": 150.0,
          "headingB": 330.0,
          "lengthM": 3360.1,
          "widthM": 61.0
        },
        {
          "id": "237197",
          "runway": "16R/34L",
          "thresholdA": [
            35.560452,
            139.768734
          ],
          "thresholdB": [
            35.536591,
            139.785672
          ],
          "headingA": 150.0,
          "headingB": 330.0,
          "lengthM": 3000.1,
          "widthM": 61.0
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "HNL",
      "icao": "PHNL",
      "airport": "Daniel K. Inouye International Airport",
      "city": "Honolulu, Oahu",
      "country": "US",
      "runways": [
        {
          "id": "253727",
          "runway": "04L/22R",
          "thresholdA": [
            21.31830025,
            -157.9230042
          ],
          "thresholdB": [
            21.32979965,
            -157.9069977
          ],
          "headingA": 53.0,
          "headingB": 233.0,
          "lengthM": 2119.9,
          "widthM": 45.7
        },
        {
          "id": "253728",
          "runway": "04R/22L",
          "thresholdA": [
            21.31389999,
            -157.927002
          ],
          "thresholdB": [
            21.3288002,
            -157.9060059
          ],
          "headingA": 53.0,
          "headingB": 233.0,
          "lengthM": 2743.8,
          "widthM": 45.7
        },
        {
          "id": "253729",
          "runway": "04W/22W",
          "thresholdA": [
            21.31469917,
            -157.91299438
          ],
          "thresholdB": [
            21.31990051,
            -157.90600586
          ],
          "headingA": 51.0,
          "headingB": 231.0,
          "lengthM": 914.4,
          "widthM": 45.7
        },
        {
          "id": "253730",
          "runway": "08L/26R",
          "thresholdA": [
            21.32519913,
            -157.9429932
          ],
          "thresholdB": [
            21.32519913,
            -157.9069977
          ],
          "headingA": 90.0,
          "headingB": 270.0,
          "lengthM": 3767.3,
          "widthM": 61.0
        },
        {
          "id": "253731",
          "runway": "08R/26L",
          "thresholdA": [
            21.30680084,
            -157.94599915
          ],
          "thresholdB": [
            21.30680084,
            -157.91099548
          ],
          "headingA": 90.0,
          "headingB": 270.0,
          "lengthM": 3657.6,
          "widthM": 61.0
        },
        {
          "id": "253732",
          "runway": "08W/26W",
          "thresholdA": [
            21.31130028,
            -157.9170074
          ],
          "thresholdB": [
            21.31110001,
            -157.9019928
          ],
          "headingA": 91.0,
          "headingB": 271.0,
          "lengthM": 1551.4,
          "widthM": 91.4
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "HRG",
      "icao": "HEGN",
      "airport": "Hurghada International Airport",
      "city": "Hurghada",
      "country": "EG",
      "runways": [
        {
          "id": "235546",
          "runway": "16L/34R",
          "thresholdA": [
            27.19610023,
            33.79579926
          ],
          "thresholdB": [
            27.16110039,
            33.80609894
          ],
          "headingA": 165.0,
          "headingB": 345.0,
          "lengthM": 4014.5,
          "widthM": 45.1
        },
        {
          "id": "349785",
          "runway": "16R/34L",
          "thresholdA": [
            27.19389915,
            33.78649902
          ],
          "thresholdB": [
            27.1590004,
            33.7969017
          ],
          "headingA": 165.0,
          "headingB": 345.0,
          "lengthM": 4013.6,
          "widthM": 60.0
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "HYD",
      "icao": "VOHS",
      "airport": "Rajiv Gandhi International Airport",
      "city": "Hyderabad",
      "country": "IN",
      "runways": [
        {
          "id": "298675",
          "runway": "09L/27R",
          "thresholdA": [
            17.230587,
            78.412323
          ],
          "thresholdB": [
            17.231141,
            78.453304
          ],
          "headingA": 90.0,
          "headingB": 270.0,
          "lengthM": 3707.0,
          "widthM": 45.1
        },
        {
          "id": "322333",
          "runway": "09R/27L",
          "thresholdA": [
            17.228572,
            78.412823
          ],
          "thresholdB": [
            17.229103,
            78.452866
          ],
          "headingA": 90.0,
          "headingB": 270.0,
          "lengthM": 4259.9,
          "widthM": 60.0
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "IAD",
      "icao": "KIAD",
      "airport": "Washington Dulles International Airport",
      "city": "Dulles",
      "country": "US",
      "runways": [
        {
          "id": "250849",
          "runway": "01C/19C",
          "thresholdA": [
            38.93909836,
            -77.45980072
          ],
          "thresholdB": [
            38.97060013,
            -77.45929718
          ],
          "headingA": 1.0,
          "headingB": 181.0,
          "lengthM": 3505.2,
          "widthM": 45.7
        },
        {
          "id": "243968",
          "runway": "01L/19R",
          "thresholdA": [
            38.945,
            -77.47482
          ],
          "thresholdB": [
            38.97078,
            -77.47445
          ],
          "headingA": 1.0,
          "headingB": 181.0,
          "lengthM": 2865.1,
          "widthM": 45.7
        },
        {
          "id": "243967",
          "runway": "01R/19L",
          "thresholdA": [
            38.92380142,
            -77.43640137
          ],
          "thresholdB": [
            38.95529938,
            -77.43599701
          ],
          "headingA": 0.7,
          "headingB": 180.7,
          "lengthM": 3505.2,
          "widthM": 45.7
        },
        {
          "id": "243969",
          "runway": "12/30",
          "thresholdA": [
            38.94380188,
            -77.49040222
          ],
          "thresholdB": [
            38.93360138,
            -77.4559021
          ],
          "headingA": 110.6,
          "headingB": 290.6,
          "lengthM": 3200.7,
          "widthM": 45.7
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "IAH",
      "icao": "KIAH",
      "airport": "George Bush Intercontinental Airport",
      "city": "Houston",
      "country": "US",
      "runways": [
        {
          "id": "241822",
          "runway": "08L/26R",
          "thresholdA": [
            30.00720024,
            -95.3588028
          ],
          "thresholdB": [
            30.00720024,
            -95.33039856
          ],
          "headingA": 89.9,
          "headingB": 269.9,
          "lengthM": 2743.2,
          "widthM": 45.7
        },
        {
          "id": "241821",
          "runway": "08R/26L",
          "thresholdA": [
            29.99340057,
            -95.35500336
          ],
          "thresholdB": [
            29.99340057,
            -95.32530212
          ],
          "headingA": 89.9,
          "headingB": 269.9,
          "lengthM": 2865.7,
          "widthM": 45.7
        },
        {
          "id": "241823",
          "runway": "09/27",
          "thresholdA": [
            29.9776001,
            -95.33409882
          ],
          "thresholdB": [
            29.9776001,
            -95.30249786
          ],
          "headingA": 90.0,
          "headingB": 270.0,
          "lengthM": 3048.0,
          "widthM": 45.7
        },
        {
          "id": "241825",
          "runway": "15L/33R",
          "thresholdA": [
            29.98789978,
            -95.35790253
          ],
          "thresholdB": [
            29.95879936,
            -95.33999634
          ],
          "headingA": 152.0,
          "headingB": 332.0,
          "lengthM": 3657.9,
          "widthM": 45.7
        },
        {
          "id": "241824",
          "runway": "15R/33L",
          "thresholdA": [
            29.9878006,
            -95.36139679
          ],
          "thresholdB": [
            29.96349907,
            -95.34649658
          ],
          "headingA": 152.0,
          "headingB": 332.0,
          "lengthM": 3048.0,
          "widthM": 45.7
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "ICN",
      "icao": "RKSI",
      "airport": "Incheon International Airport",
      "city": "Seoul",
      "country": "KR",
      "runways": [
        {
          "id": "237289",
          "runway": "15L/33R",
          "thresholdA": [
            37.48389816,
            126.44000244
          ],
          "thresholdB": [
            37.45640182,
            126.46499634
          ],
          "headingA": 145.0,
          "headingB": 325.0,
          "lengthM": 3750.0,
          "widthM": 60.0
        },
        {
          "id": "237288",
          "runway": "15R/33L",
          "thresholdA": [
            37.48180008,
            126.43599701
          ],
          "thresholdB": [
            37.45420074,
            126.46099854
          ],
          "headingA": 145.0,
          "headingB": 325.0,
          "lengthM": 3750.0,
          "widthM": 60.0
        },
        {
          "id": "313766",
          "runway": "16L/34R",
          "thresholdA": [
            37.47274,
            126.415631
          ],
          "thresholdB": [
            37.443432,
            126.441697
          ],
          "headingA": 145.0,
          "headingB": 325.0,
          "lengthM": 3999.9,
          "widthM": 60.0
        },
        {
          "id": "346105",
          "runway": "16R/34L",
          "thresholdA": [
            37.468746,
            126.413446
          ],
          "thresholdB": [
            37.441272,
            126.437882
          ],
          "headingA": 145.0,
          "headingB": 325.0,
          "lengthM": 3750.0,
          "widthM": 60.0
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "IGU",
      "icao": "SBFI",
      "airport": "Cataratas International Airport",
      "city": "Foz do Igua\u00e7u",
      "country": "BR",
      "runways": [
        {
          "id": "234159",
          "runway": "15/33",
          "thresholdA": [
            -25.585848,
            -54.500118
          ],
          "thresholdB": [
            -25.601755,
            -54.47971
          ],
          "headingA": 130.0,
          "headingB": 311.0,
          "lengthM": 2705.1,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "IND",
      "icao": "KIND",
      "airport": "Indianapolis International Airport",
      "city": "Indianapolis",
      "country": "US",
      "runways": [
        {
          "id": "242275",
          "runway": "05L/23R",
          "thresholdA": [
            39.70640182,
            -86.32080078
          ],
          "thresholdB": [
            39.72829819,
            -86.29290009
          ],
          "headingA": 44.5,
          "headingB": 224.5,
          "lengthM": 3413.8,
          "widthM": 45.7
        },
        {
          "id": "242274",
          "runway": "05R/23L",
          "thresholdA": [
            39.70019913,
            -86.30439758
          ],
          "thresholdB": [
            39.71979904,
            -86.27950287
          ],
          "headingA": 44.6,
          "headingB": 224.6,
          "lengthM": 3048.0,
          "widthM": 45.7
        },
        {
          "id": "242276",
          "runway": "14/32",
          "thresholdA": [
            39.73419952,
            -86.2888031
          ],
          "thresholdB": [
            39.71960068,
            -86.26959991
          ],
          "headingA": 134.6,
          "headingB": 314.6,
          "lengthM": 2218.3,
          "widthM": 45.7
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "IST",
      "icao": "LTFM",
      "airport": "\u0130stanbul Airport",
      "city": "Istanbul",
      "country": "TR",
      "runways": [
        {
          "id": "329986",
          "runway": "16L/34R",
          "thresholdA": [
            41.29859924,
            28.70919991
          ],
          "thresholdB": [
            41.26490021,
            28.7098999
          ],
          "headingA": 174.0,
          "headingB": 354.0,
          "lengthM": 3750.0,
          "widthM": 44.8
        },
        {
          "id": "329985",
          "runway": "16R/34L",
          "thresholdA": [
            41.29859924,
            28.70675087
          ],
          "thresholdB": [
            41.26483917,
            28.70741081
          ],
          "headingA": 174.0,
          "headingB": 354.0,
          "lengthM": 3750.0,
          "widthM": 59.7
        },
        {
          "id": "329988",
          "runway": "17L/35R",
          "thresholdA": [
            41.29882812,
            28.72703934
          ],
          "thresholdB": [
            41.26192093,
            28.72776031
          ],
          "headingA": 174.0,
          "headingB": 354.0,
          "lengthM": 4099.9,
          "widthM": 59.7
        },
        {
          "id": "329987",
          "runway": "17R/35L",
          "thresholdA": [
            41.29880142,
            28.72450066
          ],
          "thresholdB": [
            41.26190186,
            28.72529984
          ],
          "headingA": 174.0,
          "headingB": 354.0,
          "lengthM": 4099.9,
          "widthM": 44.8
        },
        {
          "id": "336568",
          "runway": "18/36",
          "thresholdA": [
            41.28979874,
            28.75620079
          ],
          "thresholdB": [
            41.2621994,
            28.75670052
          ],
          "headingA": 179.0,
          "headingB": 354.0,
          "lengthM": 3059.9,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "JAX",
      "icao": "KJAX",
      "airport": "Jacksonville International Airport",
      "city": "Jacksonville",
      "country": "US",
      "runways": [
        {
          "id": "243903",
          "runway": "08/26",
          "thresholdA": [
            30.49620056,
            -81.69999695
          ],
          "thresholdB": [
            30.5053997,
            -81.66999817
          ],
          "headingA": 71.0,
          "headingB": 251.0,
          "lengthM": 3048.0,
          "widthM": 45.7
        },
        {
          "id": "243904",
          "runway": "14/32",
          "thresholdA": [
            30.49220085,
            -81.70079803
          ],
          "thresholdB": [
            30.47839928,
            -81.68229675
          ],
          "headingA": 131.0,
          "headingB": 311.0,
          "lengthM": 2347.3,
          "widthM": 45.7
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "JED",
      "icao": "OEJN",
      "airport": "King Abdulaziz International Airport",
      "city": "Jeddah",
      "country": "SA",
      "runways": [
        {
          "id": "238622",
          "runway": "16C/34C",
          "thresholdA": [
            21.69507,
            39.151543
          ],
          "thresholdB": [
            21.661179,
            39.164917
          ],
          "headingA": 160.0,
          "headingB": 340.0,
          "lengthM": 3999.9,
          "widthM": 60.0
        },
        {
          "id": "238624",
          "runway": "16L/34R",
          "thresholdA": [
            21.700436,
            39.167131
          ],
          "thresholdB": [
            21.6665,
            39.1805
          ],
          "headingA": 160.0,
          "headingB": 340.0,
          "lengthM": 3999.9,
          "widthM": 60.0
        },
        {
          "id": "238623",
          "runway": "16R/34L",
          "thresholdA": [
            21.7027,
            39.1269
          ],
          "thresholdB": [
            21.6705,
            39.139599
          ],
          "headingA": 160.0,
          "headingB": 340.0,
          "lengthM": 3799.9,
          "widthM": 60.0
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "JFK",
      "icao": "KJFK",
      "airport": "John F. Kennedy International Airport",
      "city": "New York",
      "country": "US",
      "runways": [
        {
          "id": "244968",
          "runway": "04L/22R",
          "thresholdA": [
            40.622002,
            -73.785599
          ],
          "thresholdB": [
            40.6488,
            -73.764702
          ],
          "headingA": 31.0,
          "headingB": 211.0,
          "lengthM": 3681.7,
          "widthM": 61.0
        },
        {
          "id": "244967",
          "runway": "04R/22L",
          "thresholdA": [
            40.62540054,
            -73.77030182
          ],
          "thresholdB": [
            40.64519882,
            -73.75489807
          ],
          "headingA": 30.6,
          "headingB": 210.6,
          "lengthM": 2560.3,
          "widthM": 61.0
        },
        {
          "id": "244970",
          "runway": "13L/31R",
          "thresholdA": [
            40.657799,
            -73.790199
          ],
          "thresholdB": [
            40.6437,
            -73.7593
          ],
          "headingA": 121.0,
          "headingB": 301.0,
          "lengthM": 3048.0,
          "widthM": 61.0
        },
        {
          "id": "244969",
          "runway": "13R/31L",
          "thresholdA": [
            40.648399,
            -73.816704
          ],
          "thresholdB": [
            40.627899,
            -73.771599
          ],
          "headingA": 121.0,
          "headingB": 301.0,
          "lengthM": 4423.0,
          "widthM": 61.0
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "JNB",
      "icao": "FAOR",
      "airport": "O.R. Tambo International Airport",
      "city": "Johannesburg",
      "country": "ZA",
      "runways": [
        {
          "id": "238744",
          "runway": "03L/21R",
          "thresholdA": [
            -26.14629936,
            28.23430061
          ],
          "thresholdB": [
            -26.1079998,
            28.24629974
          ],
          "headingA": 14.0,
          "headingB": 194.0,
          "lengthM": 4418.1,
          "widthM": 61.0
        },
        {
          "id": "238743",
          "runway": "03R/21L",
          "thresholdA": [
            -26.16469955,
            28.24819946
          ],
          "thresholdB": [
            -26.1352005,
            28.25729942
          ],
          "headingA": 14.0,
          "headingB": 194.0,
          "lengthM": 3400.0,
          "widthM": 60.0
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "JPA",
      "icao": "SBJP",
      "airport": "Presidente Castro Pinto International Airport",
      "city": "Jo\u00e3o Pessoa",
      "country": "BR",
      "runways": [],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "KIX",
      "icao": "RJBB",
      "airport": "Kansai International Airport",
      "city": "Osaka",
      "country": "JP",
      "runways": [
        {
          "id": "308417",
          "runway": "06L/24R",
          "thresholdA": [
            34.42850113,
            135.2061615
          ],
          "thresholdB": [
            34.45133209,
            135.24000549
          ],
          "headingA": 51.0,
          "headingB": 231.0,
          "lengthM": 3999.9,
          "widthM": 59.7
        },
        {
          "id": "237239",
          "runway": "06R/24L",
          "thresholdA": [
            34.41740036,
            135.22900391
          ],
          "thresholdB": [
            34.43719864,
            135.25900269
          ],
          "headingA": 51.0,
          "headingB": 231.0,
          "lengthM": 3500.0,
          "widthM": 59.7
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "KMG",
      "icao": "ZPPP",
      "airport": "Kunming Changshui International Airport",
      "city": "Kunming",
      "country": "CN",
      "runways": [
        {
          "id": "235195",
          "runway": "03/21",
          "thresholdA": [
            25.10224915,
            102.91701508
          ],
          "thresholdB": [
            25.13048172,
            102.94158936
          ],
          "headingA": 39.3,
          "headingB": 219.3,
          "lengthM": 3999.9,
          "widthM": 45.1
        },
        {
          "id": "314904",
          "runway": "04/22",
          "thresholdA": [
            25.08968735,
            102.93074799
          ],
          "thresholdB": [
            25.12148857,
            102.95840454
          ],
          "headingA": 39.0,
          "headingB": 219.0,
          "lengthM": 4500.1,
          "widthM": 60.0
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "KRK",
      "icao": "EPKK",
      "airport": "Krak\u00f3w John Paul II International Airport",
      "city": "Balice",
      "country": "PL",
      "runways": [
        {
          "id": "238291",
          "runway": "07/25",
          "thresholdA": [
            50.07540131,
            19.76810074
          ],
          "thresholdB": [
            50.0802002,
            19.80290031
          ],
          "headingA": 78.0,
          "headingB": 258.0,
          "lengthM": 2550.0,
          "widthM": 59.7
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "KTM",
      "icao": "VNKT",
      "airport": "Tribhuvan International Airport",
      "city": "Kathmandu",
      "country": "NP",
      "runways": [
        {
          "id": "237990",
          "runway": "02/20",
          "thresholdA": [
            27.6838,
            85.353401
          ],
          "thresholdB": [
            27.7094,
            85.364799
          ],
          "headingA": 22.0,
          "headingB": 202.0,
          "lengthM": 3350.1,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "KUL",
      "icao": "WMKK",
      "airport": "Kuala Lumpur International Airport",
      "city": "Sepang",
      "country": "MY",
      "runways": [
        {
          "id": "237836",
          "runway": "14L/32R",
          "thresholdA": [
            2.77828,
            101.702003
          ],
          "thresholdB": [
            2.74739,
            101.722
          ],
          "headingA": 146.0,
          "headingB": 326.0,
          "lengthM": 4123.9,
          "widthM": 60.0
        },
        {
          "id": "237835",
          "runway": "14R/32L",
          "thresholdA": [
            2.74351,
            101.697998
          ],
          "thresholdB": [
            2.71313,
            101.718002
          ],
          "headingA": 146.0,
          "headingB": 326.0,
          "lengthM": 4050.2,
          "widthM": 60.0
        },
        {
          "id": "313641",
          "runway": "15/33",
          "thresholdA": [
            2.73817,
            101.6775
          ],
          "thresholdB": [
            2.7085,
            101.69733
          ],
          "headingA": 146.0,
          "headingB": 326.0,
          "lengthM": 3960.3,
          "widthM": 60.0
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "LAS",
      "icao": "KLAS",
      "airport": "Harry Reid International Airport",
      "city": "Las Vegas",
      "country": "US",
      "runways": [
        {
          "id": "245934",
          "runway": "01L/19R",
          "thresholdA": [
            36.07529831,
            -115.1699982
          ],
          "thresholdB": [
            36.09769821,
            -115.1579971
          ],
          "headingA": 25.0,
          "headingB": 205.0,
          "lengthM": 2977.9,
          "widthM": 45.7
        },
        {
          "id": "245933",
          "runway": "01R/19L",
          "thresholdA": [
            36.074167,
            -115.1675
          ],
          "thresholdB": [
            36.0985,
            -115.1535
          ],
          "headingA": 25.0,
          "headingB": 205.0,
          "lengthM": 2977.6,
          "widthM": 45.7
        },
        {
          "id": "245936",
          "runway": "08L/26R",
          "thresholdA": [
            36.076333,
            -115.171333
          ],
          "thresholdB": [
            36.076333,
            -115.121
          ],
          "headingA": 90.0,
          "headingB": 270.0,
          "lengthM": 4521.7,
          "widthM": 45.7
        },
        {
          "id": "245935",
          "runway": "08R/26L",
          "thresholdA": [
            36.07360077,
            -115.16100311
          ],
          "thresholdB": [
            36.07369995,
            -115.12599945
          ],
          "headingA": 90.0,
          "headingB": 270.0,
          "lengthM": 3208.3,
          "widthM": 45.7
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "LAX",
      "icao": "KLAX",
      "airport": "Los Angeles International Airport",
      "city": "Los Angeles",
      "country": "US",
      "runways": [
        {
          "id": "240920",
          "runway": "6L/24R",
          "thresholdA": [
            33.949119,
            -118.431187
          ],
          "thresholdB": [
            33.952112,
            -118.401954
          ],
          "headingA": 83.0,
          "headingB": 263.0,
          "lengthM": 2720.6,
          "widthM": 45.7
        },
        {
          "id": "240919",
          "runway": "6R/24L",
          "thresholdA": [
            33.94682,
            -118.434693
          ],
          "thresholdB": [
            33.95047,
            -118.399063
          ],
          "headingA": 83.0,
          "headingB": 263.0,
          "lengthM": 3309.8,
          "widthM": 45.7
        },
        {
          "id": "240922",
          "runway": "7L/25R",
          "thresholdA": [
            33.935556,
            -118.422089
          ],
          "thresholdB": [
            33.939881,
            -118.379794
          ],
          "headingA": 83.0,
          "headingB": 263.0,
          "lengthM": 3930.1,
          "widthM": 45.7
        },
        {
          "id": "240921",
          "runway": "7R/25L",
          "thresholdA": [
            33.933659,
            -118.419074
          ],
          "thresholdB": [
            33.937371,
            -118.3827
          ],
          "headingA": 83.0,
          "headingB": 263.0,
          "lengthM": 3381.8,
          "widthM": 61.0
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "LED",
      "icao": "ULLI",
      "airport": "Pulkovo Airport",
      "city": "St. Petersburg",
      "country": "RU",
      "runways": [
        {
          "id": "238554",
          "runway": "10L/28R",
          "thresholdA": [
            59.80970001,
            30.24539948
          ],
          "thresholdB": [
            59.80110168,
            30.30349922
          ],
          "headingA": 106.4,
          "headingB": 286.4,
          "lengthM": 3397.3,
          "widthM": 60.0
        },
        {
          "id": "238553",
          "runway": "10R/28L",
          "thresholdA": [
            59.79990005,
            30.21829987
          ],
          "thresholdB": [
            59.79040146,
            30.28289986
          ],
          "headingA": 106.4,
          "headingB": 286.4,
          "lengthM": 3780.1,
          "widthM": 60.0
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "LGW",
      "icao": "EGKK",
      "airport": "London Gatwick Airport",
      "city": "London",
      "country": "GB",
      "runways": [
        {
          "id": "239574",
          "runway": "08L/26R",
          "thresholdA": [
            51.146893,
            -0.212599
          ],
          "thresholdB": [
            51.151825,
            -0.176795
          ],
          "headingA": 78.0,
          "headingB": 258.0,
          "lengthM": 2560.9,
          "widthM": 45.1
        },
        {
          "id": "239573",
          "runway": "08R/26L",
          "thresholdA": [
            51.145103,
            -0.212345
          ],
          "thresholdB": [
            51.151493,
            -0.165992
          ],
          "headingA": 78.0,
          "headingB": 258.0,
          "lengthM": 3317.1,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "LHR",
      "icao": "EGLL",
      "airport": "London Heathrow Airport",
      "city": "London",
      "country": "GB",
      "runways": [
        {
          "id": "239399",
          "runway": "09L/27R",
          "thresholdA": [
            51.47749,
            -0.489439
          ],
          "thresholdB": [
            51.477681,
            -0.433227
          ],
          "headingA": 90.0,
          "headingB": 270.0,
          "lengthM": 3901.1,
          "widthM": 50.0
        },
        {
          "id": "239398",
          "runway": "09R/27L",
          "thresholdA": [
            51.46478,
            -0.486808
          ],
          "thresholdB": [
            51.464957,
            -0.434048
          ],
          "headingA": 90.0,
          "headingB": 270.0,
          "lengthM": 3657.9,
          "widthM": 50.0
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "LIM",
      "icao": "SPIM",
      "airport": "Jorge Ch\u00e1vez International Airport",
      "city": "Lima",
      "country": "PE",
      "runways": [
        {
          "id": "238150",
          "runway": "16L/34R",
          "thresholdA": [
            -12.00761,
            -77.12136
          ],
          "thresholdB": [
            -12.03127,
            -77.10968
          ],
          "headingA": 154.0,
          "headingB": 333.0,
          "lengthM": 3507.0,
          "widthM": 45.1
        },
        {
          "id": "510595",
          "runway": "16R/34L",
          "thresholdA": [
            -12.01205,
            -77.1311
          ],
          "thresholdB": [
            -12.03505,
            -77.11977
          ],
          "headingA": 154.0,
          "headingB": null,
          "lengthM": 3479.9,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "LIS",
      "icao": "LPPT",
      "airport": "Lisbon Humberto Delgado Airport",
      "city": "Lisbon",
      "country": "PT",
      "runways": [
        {
          "id": "238344",
          "runway": "02/20",
          "thresholdA": [
            38.765678,
            -9.144302
          ],
          "thresholdB": [
            38.797313,
            -9.127376
          ],
          "headingA": 22.0,
          "headingB": 202.0,
          "lengthM": 3810.0,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "LOS",
      "icao": "DNMM",
      "airport": "Murtala Muhammed International Airport",
      "city": "Lagos",
      "country": "NG",
      "runways": [
        {
          "id": "237903",
          "runway": "18L/36R",
          "thresholdA": [
            6.59701014,
            3.32913995
          ],
          "thresholdB": [
            6.57220984,
            3.32913995
          ],
          "headingA": 180.0,
          "headingB": 360.0,
          "lengthM": 2742.3,
          "widthM": 45.1
        },
        {
          "id": "237902",
          "runway": "18R/36L",
          "thresholdA": [
            6.58778,
            3.31356001
          ],
          "thresholdB": [
            6.5525198,
            3.31356001
          ],
          "headingA": 180.0,
          "headingB": 360.0,
          "lengthM": 3899.6,
          "widthM": 60.0
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "LPB",
      "icao": "SLLP",
      "airport": "El Alto International Airport",
      "city": "La Paz / El Alto",
      "country": "BO",
      "runways": [
        {
          "id": "233698",
          "runway": "10/28",
          "thresholdA": [
            -16.51269913,
            -68.21099854
          ],
          "thresholdB": [
            -16.51390076,
            -68.17350006
          ],
          "headingA": 91.9,
          "headingB": 271.9,
          "lengthM": 3999.9,
          "widthM": 46.0
        },
        {
          "id": "233699",
          "runway": "10L/28R",
          "thresholdA": [
            -16.5041008,
            -68.1984024
          ],
          "thresholdB": [
            -16.50659943,
            -68.1792984
          ],
          "headingA": 98.0,
          "headingB": 278.0,
          "lengthM": 2049.8,
          "widthM": 91.4
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "LTN",
      "icao": "EGGW",
      "airport": "London Luton Airport",
      "city": "Luton, Luton",
      "country": "GB",
      "runways": [
        {
          "id": "239402",
          "runway": "07/25",
          "thresholdA": [
            51.872002,
            -0.38355
          ],
          "thresholdB": [
            51.877201,
            -0.353333
          ],
          "headingA": 74.0,
          "headingB": 254.0,
          "lengthM": 2161.9,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "MAD",
      "icao": "LEMD",
      "airport": "Adolfo Su\u00e1rez Madrid\u2013Barajas Airport",
      "city": "Madrid",
      "country": "ES",
      "runways": [
        {
          "id": "238903",
          "runway": "14L/32R",
          "thresholdA": [
            40.49489975,
            -3.55786991
          ],
          "thresholdB": [
            40.47000122,
            -3.5325799
          ],
          "headingA": 144.2,
          "headingB": 324.2,
          "lengthM": 3500.0,
          "widthM": 60.0
        },
        {
          "id": "238902",
          "runway": "14R/32L",
          "thresholdA": [
            40.48490143,
            -3.57600999
          ],
          "thresholdB": [
            40.45569992,
            -3.54638004
          ],
          "headingA": 144.2,
          "headingB": 324.2,
          "lengthM": 3988.0,
          "widthM": 60.0
        },
        {
          "id": "238905",
          "runway": "18L/36R",
          "thresholdA": [
            40.5326004,
            -3.55938005
          ],
          "thresholdB": [
            40.50109863,
            -3.55921006
          ],
          "headingA": 181.0,
          "headingB": 1.0,
          "lengthM": 3500.0,
          "widthM": 60.0
        },
        {
          "id": "238904",
          "runway": "18R/36L",
          "thresholdA": [
            40.531799,
            -3.57485
          ],
          "thresholdB": [
            40.492599,
            -3.57463
          ],
          "headingA": 181.0,
          "headingB": 2.0,
          "lengthM": 4349.8,
          "widthM": 60.0
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "MAN",
      "icao": "EGCC",
      "airport": "Manchester Airport",
      "city": "Manchester, Greater Manchester",
      "country": "GB",
      "runways": [
        {
          "id": "239540",
          "runway": "05L/23R",
          "thresholdA": [
            53.3451004,
            -2.29274011
          ],
          "thresholdB": [
            53.36240005,
            -2.25713992
          ],
          "headingA": 51.0,
          "headingB": 231.0,
          "lengthM": 3048.0,
          "widthM": 45.1
        },
        {
          "id": "239539",
          "runway": "05R/23L",
          "thresholdA": [
            53.332001,
            -2.31066
          ],
          "thresholdB": [
            53.349098,
            -2.27499
          ],
          "headingA": 51.0,
          "headingB": 231.0,
          "lengthM": 3050.1,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "MAO",
      "icao": "SBEG",
      "airport": "Eduardo Gomes International Airport",
      "city": "Manaus",
      "country": "BR",
      "runways": [
        {
          "id": "234094",
          "runway": "11/29",
          "thresholdA": [
            -3.03856397,
            -60.0618515
          ],
          "thresholdB": [
            -3.0386169,
            -60.03755188
          ],
          "headingA": 106.0,
          "headingB": 286.0,
          "lengthM": 2699.9,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "MCI",
      "icao": "KMCI",
      "airport": "Kansas City International Airport",
      "city": "Kansas City",
      "country": "US",
      "runways": [
        {
          "id": "240448",
          "runway": "01L/19R",
          "thresholdA": [
            39.29330063,
            -94.72930145
          ],
          "thresholdB": [
            39.32220078,
            -94.72080231
          ],
          "headingA": 12.9,
          "headingB": 192.9,
          "lengthM": 3292.1,
          "widthM": 45.7
        },
        {
          "id": "240447",
          "runway": "01R/19L",
          "thresholdA": [
            39.28150177,
            -94.70899963
          ],
          "thresholdB": [
            39.30690002,
            -94.70149994
          ],
          "headingA": 12.9,
          "headingB": 192.9,
          "lengthM": 2895.6,
          "widthM": 45.7
        },
        {
          "id": "240449",
          "runway": "09/27",
          "thresholdA": [
            39.29090118,
            -94.72660065
          ],
          "thresholdB": [
            39.2881012,
            -94.69319916
          ],
          "headingA": 96.1,
          "headingB": 276.1,
          "lengthM": 2895.9,
          "widthM": 45.7
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "MCO",
      "icao": "KMCO",
      "airport": "Orlando International Airport",
      "city": "Orlando",
      "country": "US",
      "runways": [
        {
          "id": "245952",
          "runway": "17L/35R",
          "thresholdA": [
            28.44370079,
            -81.2826004
          ],
          "thresholdB": [
            28.41889954,
            -81.28230286
          ],
          "headingA": 179.5,
          "headingB": 359.5,
          "lengthM": 2743.5,
          "widthM": 45.7
        },
        {
          "id": "245951",
          "runway": "17R/35L",
          "thresholdA": [
            28.43560028,
            -81.29589844
          ],
          "thresholdB": [
            28.40810013,
            -81.29560089
          ],
          "headingA": 179.0,
          "headingB": 359.0,
          "lengthM": 3048.0,
          "widthM": 45.7
        },
        {
          "id": "245954",
          "runway": "18L/36R",
          "thresholdA": [
            28.44829941,
            -81.32230377
          ],
          "thresholdB": [
            28.41530037,
            -81.3219986
          ],
          "headingA": 179.0,
          "headingB": 359.0,
          "lengthM": 3659.1,
          "widthM": 61.0
        },
        {
          "id": "245953",
          "runway": "18R/36L",
          "thresholdA": [
            28.44829941,
            -81.32700348
          ],
          "thresholdB": [
            28.41530037,
            -81.32659912
          ],
          "headingA": 179.0,
          "headingB": 359.0,
          "lengthM": 3658.8,
          "widthM": 61.0
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "MCT",
      "icao": "OOMS",
      "airport": "Muscat International Airport",
      "city": "Muscat/Seeb",
      "country": "OM",
      "runways": [
        {
          "id": "237631",
          "runway": "08L/26R",
          "thresholdA": [
            23.60590744,
            58.2579689
          ],
          "thresholdB": [
            23.60891914,
            58.29545975
          ],
          "headingA": 85.0,
          "headingB": 265.0,
          "lengthM": 3999.9,
          "widthM": 60.0
        },
        {
          "id": "237632",
          "runway": "08R/26L",
          "thresholdA": [
            23.5917,
            58.266899
          ],
          "thresholdB": [
            23.5945,
            58.301899
          ],
          "headingA": 85.0,
          "headingB": 265.0,
          "lengthM": 4080.1,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "MCY",
      "icao": "YBSU",
      "airport": "Sunshine Coast Airport",
      "city": "Maroochydore",
      "country": "AU",
      "runways": [
        {
          "id": "233385",
          "runway": "13/31",
          "thresholdA": [
            -26.583214,
            153.074524
          ],
          "thresholdB": [
            -26.603226,
            153.09169
          ],
          "headingA": 142.0,
          "headingB": 322.0,
          "lengthM": 2799.9,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "MCZ",
      "icao": "SBMO",
      "airport": "Zumbi dos Palmares International Airport",
      "city": "Macei\u00f3",
      "country": "BR",
      "runways": [],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "MDE",
      "icao": "SKRG",
      "airport": "Jose Maria C\u00f3rdova International Airport",
      "city": "Medell\u00edn",
      "country": "CO",
      "runways": [
        {
          "id": "235296",
          "runway": "01/19",
          "thresholdA": [
            6.14927,
            -75.423019
          ],
          "thresholdB": [
            6.180367,
            -75.423225
          ],
          "headingA": 360.0,
          "headingB": 180.0,
          "lengthM": 3440.0,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "MDZ",
      "icao": "SAME",
      "airport": "Governor Francisco Gabrielli International Airport",
      "city": "Mendoza",
      "country": "AR",
      "runways": [
        {
          "id": "232947",
          "runway": "18/36",
          "thresholdA": [
            -32.81919861,
            -68.79270172
          ],
          "thresholdB": [
            -32.84429932,
            -68.79309845
          ],
          "headingA": 181.0,
          "headingB": 1.0,
          "lengthM": 2834.9,
          "widthM": 53.9
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "MEL",
      "icao": "YMML",
      "airport": "Melbourne Airport",
      "city": "Melbourne",
      "country": "AU",
      "runways": [
        {
          "id": "233383",
          "runway": "09/27",
          "thresholdA": [
            -37.66080093,
            144.82200623
          ],
          "thresholdB": [
            -37.66230011,
            144.8480072
          ],
          "headingA": 94.0,
          "headingB": 274.0,
          "lengthM": 2286.0,
          "widthM": 45.1
        },
        {
          "id": "233384",
          "runway": "16/34",
          "thresholdA": [
            -37.65319824,
            144.83500671
          ],
          "thresholdB": [
            -37.68579865,
            144.84100342
          ],
          "headingA": 171.0,
          "headingB": 351.0,
          "lengthM": 3657.0,
          "widthM": 60.0
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "MEM",
      "icao": "KMEM",
      "airport": "Frederick W. Smith International Airport",
      "city": "Memphis",
      "country": "US",
      "runways": [
        {
          "id": "240800",
          "runway": "09/27",
          "thresholdA": [
            35.05860138,
            -89.98570251
          ],
          "thresholdB": [
            35.05780029,
            -89.9559021
          ],
          "headingA": 92.0,
          "headingB": 272.0,
          "lengthM": 2726.7,
          "widthM": 45.7
        },
        {
          "id": "240801",
          "runway": "18C/36C",
          "thresholdA": [
            35.05459976,
            -89.97619629
          ],
          "thresholdB": [
            35.02410126,
            -89.97550201
          ],
          "headingA": 179.0,
          "headingB": 359.0,
          "lengthM": 3389.4,
          "widthM": 45.7
        },
        {
          "id": "240803",
          "runway": "18L/36R",
          "thresholdA": [
            35.04880142,
            -89.97299957
          ],
          "thresholdB": [
            35.02410126,
            -89.97239685
          ],
          "headingA": 179.0,
          "headingB": 359.0,
          "lengthM": 2743.2,
          "widthM": 45.7
        },
        {
          "id": "240802",
          "runway": "18R/36L",
          "thresholdA": [
            35.04949951,
            -89.98739624
          ],
          "thresholdB": [
            35.02389908,
            -89.98690033
          ],
          "headingA": 179.0,
          "headingB": 359.0,
          "lengthM": 2840.7,
          "widthM": 45.7
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "MEX",
      "icao": "MMMX",
      "airport": "Mexico City Benito Ju\u00e1rez International Airport",
      "city": "Mexico City",
      "country": "MX",
      "runways": [
        {
          "id": "237742",
          "runway": "05L/23R",
          "thresholdA": [
            19.42760086,
            -99.09049988
          ],
          "thresholdB": [
            19.44569969,
            -99.05819702
          ],
          "headingA": 59.4,
          "headingB": 239.4,
          "lengthM": 3952.0,
          "widthM": 45.1
        },
        {
          "id": "237741",
          "runway": "05R/23L",
          "thresholdA": [
            19.42700005,
            -99.08580017
          ],
          "thresholdB": [
            19.44490051,
            -99.05390167
          ],
          "headingA": 59.4,
          "headingB": 239.4,
          "lengthM": 3899.9,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "MIA",
      "icao": "KMIA",
      "airport": "Miami International Airport",
      "city": "Miami",
      "country": "US",
      "runways": [
        {
          "id": "242150",
          "runway": "08L/26R",
          "thresholdA": [
            25.80290031,
            -80.30149841
          ],
          "thresholdB": [
            25.80400085,
            -80.27539825
          ],
          "headingA": 87.4,
          "headingB": 267.4,
          "lengthM": 2621.3,
          "widthM": 45.7
        },
        {
          "id": "242149",
          "runway": "08R/26L",
          "thresholdA": [
            25.80069923,
            -80.30139923
          ],
          "thresholdB": [
            25.80200005,
            -80.26950073
          ],
          "headingA": 87.0,
          "headingB": 267.0,
          "lengthM": 3202.2,
          "widthM": 61.0
        },
        {
          "id": "242151",
          "runway": "09/27",
          "thresholdA": [
            25.7861,
            -80.314796
          ],
          "thresholdB": [
            25.787701,
            -80.275398
          ],
          "headingA": 87.0,
          "headingB": 267.0,
          "lengthM": 3967.3,
          "widthM": 45.7
        },
        {
          "id": "242152",
          "runway": "12/30",
          "thresholdA": [
            25.799299,
            -80.3023
          ],
          "thresholdB": [
            25.7866,
            -80.277496
          ],
          "headingA": 119.0,
          "headingB": 299.0,
          "lengthM": 2852.9,
          "widthM": 45.7
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "MKY",
      "icao": "YBMK",
      "airport": "Mackay Airport",
      "city": "Mackay",
      "country": "AU",
      "runways": [
        {
          "id": "233228",
          "runway": "14/32",
          "thresholdA": [
            -21.16320038,
            149.17700195
          ],
          "thresholdB": [
            -21.17830086,
            149.18800354
          ],
          "headingA": 148.0,
          "headingB": 328.0,
          "lengthM": 1980.9,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "MNL",
      "icao": "RPLL",
      "airport": "Ninoy Aquino International Airport",
      "city": "Manila (Pasay)",
      "country": "PH",
      "runways": [
        {
          "id": "238414",
          "runway": "06/24",
          "thresholdA": [
            14.49779987,
            121.0
          ],
          "thresholdB": [
            14.51449966,
            121.02999878
          ],
          "headingA": 60.3,
          "headingB": 240.3,
          "lengthM": 3737.2,
          "widthM": 60.0
        },
        {
          "id": "238415",
          "runway": "13/31",
          "thresholdA": [
            14.52420044,
            121.00299835
          ],
          "thresholdB": [
            14.50979996,
            121.01799774
          ],
          "headingA": 134.8,
          "headingB": 314.8,
          "lengthM": 2258.0,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "MSP",
      "icao": "KMSP",
      "airport": "Minneapolis\u2013Saint Paul International Airport / Wold\u2013Chamberlain Field",
      "city": "Minneapolis",
      "country": "US",
      "runways": [
        {
          "id": "245737",
          "runway": "04/22",
          "thresholdA": [
            44.87229919,
            -93.23829651
          ],
          "thresholdB": [
            44.89360046,
            -93.20829773
          ],
          "headingA": 45.0,
          "headingB": 225.0,
          "lengthM": 3354.6,
          "widthM": 45.7
        },
        {
          "id": "245739",
          "runway": "12L/30R",
          "thresholdA": [
            44.89289856,
            -93.22100067
          ],
          "thresholdB": [
            44.88130188,
            -93.19400024
          ],
          "headingA": 121.3,
          "headingB": 301.3,
          "lengthM": 2499.4,
          "widthM": 45.7
        },
        {
          "id": "245738",
          "runway": "12R/30L",
          "thresholdA": [
            44.88779831,
            -93.23410034
          ],
          "thresholdB": [
            44.87350082,
            -93.20120239
          ],
          "headingA": 121.3,
          "headingB": 301.3,
          "lengthM": 3048.0,
          "widthM": 61.0
        },
        {
          "id": "245740",
          "runway": "17/35",
          "thresholdA": [
            44.88779831,
            -93.24220276
          ],
          "thresholdB": [
            44.86619949,
            -93.23660278
          ],
          "headingA": 169.5,
          "headingB": 349.5,
          "lengthM": 2438.4,
          "widthM": 45.7
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "MSY",
      "icao": "KMSY",
      "airport": "Louis Armstrong New Orleans International Airport",
      "city": "New Orleans",
      "country": "US",
      "runways": [
        {
          "id": "245800",
          "runway": "02/20",
          "thresholdA": [
            29.98450089,
            -90.25140381
          ],
          "thresholdB": [
            30.00309944,
            -90.24549866
          ],
          "headingA": 15.0,
          "headingB": 195.0,
          "lengthM": 2134.2,
          "widthM": 45.7
        },
        {
          "id": "245802",
          "runway": "11/29",
          "thresholdA": [
            29.9965992,
            -90.28170013
          ],
          "thresholdB": [
            29.98920059,
            -90.25099945
          ],
          "headingA": 106.0,
          "headingB": 286.0,
          "lengthM": 3079.7,
          "widthM": 45.7
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "MUC",
      "icao": "EDDM",
      "airport": "Munich Airport",
      "city": "Munich",
      "country": "DE",
      "runways": [
        {
          "id": "236229",
          "runway": "08L/26R",
          "thresholdA": [
            48.3628006,
            11.76760006
          ],
          "thresholdB": [
            48.3669014,
            11.82120037
          ],
          "headingA": 83.4,
          "headingB": 263.4,
          "lengthM": 3999.9,
          "widthM": 60.0
        },
        {
          "id": "236228",
          "runway": "08R/26L",
          "thresholdA": [
            48.34069824,
            11.7510004
          ],
          "thresholdB": [
            48.34479904,
            11.80459976
          ],
          "headingA": 83.4,
          "headingB": 263.4,
          "lengthM": 3999.9,
          "widthM": 60.0
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "MVD",
      "icao": "SUMU",
      "airport": "Carrasco General Ces\u00e1reo L. Berisso International Airport",
      "city": "Ciudad de la Costa",
      "country": "UY",
      "runways": [
        {
          "id": "246025",
          "runway": "01/19",
          "thresholdA": [
            -34.84191895,
            -56.0307312
          ],
          "thresholdB": [
            -34.82170105,
            -56.03095245
          ],
          "headingA": 359.0,
          "headingB": 179.0,
          "lengthM": 2250.0,
          "widthM": 45.1
        },
        {
          "id": "246026",
          "runway": "07/25",
          "thresholdA": [
            -34.844002,
            -56.040001
          ],
          "thresholdB": [
            -34.826801,
            -56.011902
          ],
          "headingA": 53.0,
          "headingB": 233.0,
          "lengthM": 3200.1,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "MXP",
      "icao": "LIMC",
      "airport": "Milan Malpensa International Airport",
      "city": "Ferno (VA)",
      "country": "IT",
      "runways": [
        {
          "id": "237001",
          "runway": "17L/35R",
          "thresholdA": [
            45.650385,
            8.727939
          ],
          "thresholdB": [
            45.615741,
            8.737507
          ],
          "headingA": 170.0,
          "headingB": 350.0,
          "lengthM": 3920.0,
          "widthM": 60.0
        },
        {
          "id": "237000",
          "runway": "17R/35L",
          "thresholdA": [
            45.645449,
            8.718736
          ],
          "thresholdB": [
            45.610824,
            8.728302
          ],
          "headingA": 170.0,
          "headingB": 350.0,
          "lengthM": 3920.0,
          "widthM": 60.0
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "NAP",
      "icao": "LIRN",
      "airport": "Naples International Airport",
      "city": "Napoli",
      "country": "IT",
      "runways": [
        {
          "id": "237034",
          "runway": "06/24",
          "thresholdA": [
            40.87979889,
            14.27750015
          ],
          "thresholdB": [
            40.89229965,
            14.3039999
          ],
          "headingA": 58.1,
          "headingB": 238.1,
          "lengthM": 2628.0,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "NAT",
      "icao": "SBSG",
      "airport": "Rio Grande do Norte/S\u00e3o Gon\u00e7alo do Amarante\u2013Governador Alu\u00edzio Alves International Airport",
      "city": "Natal",
      "country": "BR",
      "runways": [
        {
          "id": "313263",
          "runway": "12/30",
          "thresholdA": [
            -5.76764011,
            -35.37988281
          ],
          "thresholdB": [
            -5.77198315,
            -35.35323715
          ],
          "headingA": 99.0,
          "headingB": 279.0,
          "lengthM": 3000.1,
          "widthM": 60.0
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "NBO",
      "icao": "HKJK",
      "airport": "Jomo Kenyatta International Airport",
      "city": "Nairobi",
      "country": "KE",
      "runways": [
        {
          "id": "237261",
          "runway": "06/24",
          "thresholdA": [
            -1.32758999,
            36.91640091
          ],
          "thresholdB": [
            -1.30570996,
            36.94630051
          ],
          "headingA": 54.0,
          "headingB": 234.0,
          "lengthM": 4116.9,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "NCE",
      "icao": "LFMN",
      "airport": "Nice-C\u00f4te d'Azur Airport",
      "city": "Nice, Alpes-Maritimes",
      "country": "FR",
      "runways": [
        {
          "id": "235852",
          "runway": "04L/22R",
          "thresholdA": [
            43.651798,
            7.20404
          ],
          "thresholdB": [
            43.669498,
            7.22851
          ],
          "headingA": 45.0,
          "headingB": 225.0,
          "lengthM": 2628.0,
          "widthM": 45.1
        },
        {
          "id": "235851",
          "runway": "04R/22L",
          "thresholdA": [
            43.64670181,
            7.20248985
          ],
          "thresholdB": [
            43.66559982,
            7.22843981
          ],
          "headingA": 45.0,
          "headingB": 225.0,
          "lengthM": 2963.0,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "NKG",
      "icao": "ZSNJ",
      "airport": "Nanjing Lukou International Airport",
      "city": "Nanjing",
      "country": "CN",
      "runways": [
        {
          "id": "235158",
          "runway": "06/24",
          "thresholdA": [
            31.73340034,
            118.84600067
          ],
          "thresholdB": [
            31.75060081,
            118.87799835
          ],
          "headingA": 58.0,
          "headingB": 238.0,
          "lengthM": 3600.0,
          "widthM": 45.1
        },
        {
          "id": "314968",
          "runway": "07/25",
          "thresholdA": [
            31.71351051,
            118.84811401
          ],
          "thresholdB": [
            31.73071098,
            118.88032532
          ],
          "headingA": 58.0,
          "headingB": 238.0,
          "lengthM": 3599.7,
          "widthM": 60.0
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "NPE",
      "icao": "NZNR",
      "airport": "Hawke's Bay Airport",
      "city": "Napier",
      "country": "NZ",
      "runways": [
        {
          "id": "238009",
          "runway": "07/25",
          "thresholdA": [
            -39.46459961,
            176.85699463
          ],
          "thresholdB": [
            -39.46429825,
            176.87199402
          ],
          "headingA": 88.5,
          "headingB": 268.5,
          "lengthM": 1219.2,
          "widthM": 29.9
        },
        {
          "id": "260393",
          "runway": "16/34",
          "thresholdA": [
            -39.46199,
            176.868042
          ],
          "thresholdB": [
            -39.477695,
            176.866318
          ],
          "headingA": null,
          "headingB": null,
          "lengthM": 1749.9,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "NRT",
      "icao": "RJAA",
      "airport": "Narita International Airport",
      "city": "Narita",
      "country": "JP",
      "runways": [
        {
          "id": "237143",
          "runway": "16L/34R",
          "thresholdA": [
            35.80270004,
            140.38000488
          ],
          "thresholdB": [
            35.78580093,
            140.39199829
          ],
          "headingA": 150.0,
          "headingB": 330.0,
          "lengthM": 2500.0,
          "widthM": 59.7
        },
        {
          "id": "237142",
          "runway": "16R/34L",
          "thresholdA": [
            35.7743988,
            140.36799622
          ],
          "thresholdB": [
            35.74330139,
            140.39100647
          ],
          "headingA": 150.0,
          "headingB": 330.0,
          "lengthM": 3999.9,
          "widthM": 59.7
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "NSN",
      "icao": "NZNS",
      "airport": "Nelson Airport",
      "city": "Nelson",
      "country": "NZ",
      "runways": [
        {
          "id": "238037",
          "runway": "02/20",
          "thresholdA": [
            -41.3027,
            173.220001
          ],
          "thresholdB": [
            -41.293598,
            173.229996
          ],
          "headingA": 42.0,
          "headingB": 222.0,
          "lengthM": 1347.2,
          "widthM": 45.1
        },
        {
          "id": "238039",
          "runway": "06/24",
          "thresholdA": [
            -41.296131,
            173.216995
          ],
          "thresholdB": [
            -41.295452,
            173.224167
          ],
          "headingA": 83.0,
          "headingB": 263.0,
          "lengthM": 526.1,
          "widthM": 24.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "NTL",
      "icao": "YWLM",
      "airport": "Newcastle Airport",
      "city": "Williamtown",
      "country": "AU",
      "runways": [
        {
          "id": "233282",
          "runway": "12/30",
          "thresholdA": [
            -32.7871,
            151.8226
          ],
          "thresholdB": [
            -32.8049,
            151.8475
          ],
          "headingA": 130.0,
          "headingB": 310.0,
          "lengthM": 3058.1,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "OKC",
      "icao": "KOKC",
      "airport": "OKC Will Rogers World Airport",
      "city": "Oklahoma City",
      "country": "US",
      "runways": [
        {
          "id": "245813",
          "runway": "13/31",
          "thresholdA": [
            35.40459824,
            -97.61589813
          ],
          "thresholdB": [
            35.38940048,
            -97.59739685
          ],
          "headingA": 135.1,
          "headingB": 315.1,
          "lengthM": 2377.4,
          "widthM": 45.7
        },
        {
          "id": "245815",
          "runway": "17L/35R",
          "thresholdA": [
            35.40520096,
            -97.58889771
          ],
          "thresholdB": [
            35.37820053,
            -97.58889771
          ],
          "headingA": 180.0,
          "headingB": 360.0,
          "lengthM": 2987.6,
          "widthM": 45.7
        },
        {
          "id": "245814",
          "runway": "17R/35L",
          "thresholdA": [
            35.40589905,
            -97.60569763
          ],
          "thresholdB": [
            35.37900162,
            -97.60569763
          ],
          "headingA": 180.0,
          "headingB": 360.0,
          "lengthM": 2987.3,
          "widthM": 45.7
        },
        {
          "id": "245816",
          "runway": "18/36",
          "thresholdA": [
            35.39350128,
            -97.60769653
          ],
          "thresholdB": [
            35.38539886,
            -97.60769653
          ],
          "headingA": 180.0,
          "headingB": 360.0,
          "lengthM": 938.5,
          "widthM": 22.9
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "OOL",
      "icao": "YBCG",
      "airport": "Gold Coast Airport",
      "city": "Gold Coast",
      "country": "AU",
      "runways": [
        {
          "id": "233197",
          "runway": "14/32",
          "thresholdA": [
            -28.1565,
            153.501007
          ],
          "thresholdB": [
            -28.17609,
            153.513184
          ],
          "headingA": 150.0,
          "headingB": 330.0,
          "lengthM": 2492.0,
          "widthM": 45.1
        },
        {
          "id": "233198",
          "runway": "17/35",
          "thresholdA": [
            -28.1644001,
            153.50700378
          ],
          "thresholdB": [
            -28.16959953,
            153.5059967
          ],
          "headingA": 184.0,
          "headingB": 4.0,
          "lengthM": 581.9,
          "widthM": 18.0
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "OPO",
      "icao": "LPPR",
      "airport": "Francisco de S\u00e1 Carneiro Airport",
      "city": "Porto",
      "country": "PT",
      "runways": [
        {
          "id": "238322",
          "runway": "17/35",
          "thresholdA": [
            41.26330185,
            -8.68523979
          ],
          "thresholdB": [
            41.23249817,
            -8.67720032
          ],
          "headingA": 172.8,
          "headingB": 352.8,
          "lengthM": 3479.9,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "ORD",
      "icao": "KORD",
      "airport": "Chicago O'Hare International Airport",
      "city": "Chicago",
      "country": "US",
      "runways": [
        {
          "id": "245379",
          "runway": "04L/22R",
          "thresholdA": [
            41.9817009,
            -87.91390228
          ],
          "thresholdB": [
            41.99750137,
            -87.89640045
          ],
          "headingA": 39.0,
          "headingB": 219.0,
          "lengthM": 2286.0,
          "widthM": 45.7
        },
        {
          "id": "245378",
          "runway": "04R/22L",
          "thresholdA": [
            41.95330048,
            -87.8993988
          ],
          "thresholdB": [
            41.96989822,
            -87.87979889
          ],
          "headingA": 42.0,
          "headingB": 222.0,
          "lengthM": 2461.3,
          "widthM": 45.7
        },
        {
          "id": "341154",
          "runway": "09C/27C",
          "thresholdA": [
            41.98831,
            -87.931584
          ],
          "thresholdB": [
            41.988326,
            -87.890211
          ],
          "headingA": 90.0,
          "headingB": 270.0,
          "lengthM": 3427.5,
          "widthM": 61.0
        },
        {
          "id": "245381",
          "runway": "09L/27R",
          "thresholdA": [
            42.00283051,
            -87.92667389
          ],
          "thresholdB": [
            42.00283051,
            -87.899086
          ],
          "headingA": 90.0,
          "headingB": 270.0,
          "lengthM": 2286.0,
          "widthM": 45.7
        },
        {
          "id": "245380",
          "runway": "09R/27L",
          "thresholdA": [
            41.98389816,
            -87.91835022
          ],
          "thresholdB": [
            41.98389816,
            -87.88905334
          ],
          "headingA": 90.0,
          "headingB": 270.0,
          "lengthM": 3432.0,
          "widthM": 45.7
        },
        {
          "id": "313229",
          "runway": "10C/28C",
          "thresholdA": [
            41.96569824,
            -87.9315033
          ],
          "thresholdB": [
            41.96569824,
            -87.89179993
          ],
          "headingA": 90.0,
          "headingB": 270.0,
          "lengthM": 3291.8,
          "widthM": 61.0
        },
        {
          "id": "250468",
          "runway": "10L/28R",
          "thresholdA": [
            41.96900177,
            -87.9315033
          ],
          "thresholdB": [
            41.96910095,
            -87.88369751
          ],
          "headingA": 90.0,
          "headingB": 270.0,
          "lengthM": 3962.4,
          "widthM": 45.7
        },
        {
          "id": "351832",
          "runway": "10R/28L",
          "thresholdA": [
            41.9571991,
            -87.92790222
          ],
          "thresholdB": [
            41.95724487,
            -87.90029144
          ],
          "headingA": 90.0,
          "headingB": 270.0,
          "lengthM": 2286.0,
          "widthM": 45.7
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "ORN",
      "icao": "DAOO",
      "airport": "Oran Es-S\u00e9nia (Ahmed Ben Bella) International Airport",
      "city": "Es-S\u00e9nia",
      "country": "DZ",
      "runways": [
        {
          "id": "232841",
          "runway": "07L/25R",
          "thresholdA": [
            35.616642,
            -0.64213902
          ],
          "thresholdB": [
            35.6289444,
            -0.60608101
          ],
          "headingA": 67.0,
          "headingB": 247.0,
          "lengthM": 3600.0,
          "widthM": 45.1
        },
        {
          "id": "349210",
          "runway": "07R/25L",
          "thresholdA": [
            35.61420059,
            -0.64086097
          ],
          "thresholdB": [
            35.62459946,
            -0.61028898
          ],
          "headingA": null,
          "headingB": null,
          "lengthM": 3000.1,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "ORY",
      "icao": "LFPO",
      "airport": "Paris-Orly Airport",
      "city": "Paris (Orly, Val-de-Marne)",
      "country": "FR",
      "runways": [
        {
          "id": "236054",
          "runway": "02/20",
          "thresholdA": [
            48.71749878,
            2.37669992
          ],
          "thresholdB": [
            48.73799896,
            2.38697004
          ],
          "headingA": 18.0,
          "headingB": 198.0,
          "lengthM": 2400.0,
          "widthM": 60.0
        },
        {
          "id": "236055",
          "runway": "06/24",
          "thresholdA": [
            48.72000122,
            2.31692004
          ],
          "thresholdB": [
            48.73550034,
            2.3606801
          ],
          "headingA": 62.0,
          "headingB": 242.0,
          "lengthM": 3650.0,
          "widthM": 45.1
        },
        {
          "id": "236056",
          "runway": "07/25",
          "thresholdA": [
            48.7193985,
            2.35858989
          ],
          "thresholdB": [
            48.72740173,
            2.40207005
          ],
          "headingA": 74.0,
          "headingB": 254.0,
          "lengthM": 3319.9,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "OSL",
      "icao": "ENGM",
      "airport": "Oslo-Gardermoen International Airport",
      "city": "Oslo (Gardermoen)",
      "country": "NO",
      "runways": [
        {
          "id": "237959",
          "runway": "01L/19R",
          "thresholdA": [
            60.18500137,
            11.07369995
          ],
          "thresholdB": [
            60.21609879,
            11.0916996
          ],
          "headingA": 16.0,
          "headingB": 196.0,
          "lengthM": 3600.0,
          "widthM": 45.1
        },
        {
          "id": "237958",
          "runway": "01R/19L",
          "thresholdA": [
            60.17580032,
            11.10779953
          ],
          "thresholdB": [
            60.20119858,
            11.12250042
          ],
          "headingA": 16.0,
          "headingB": 196.0,
          "lengthM": 2949.9,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "OTP",
      "icao": "LROP",
      "airport": "Bucharest Henri Coand\u0103 International Airport",
      "city": "Otopeni",
      "country": "RO",
      "runways": [
        {
          "id": "238404",
          "runway": "08L/26R",
          "thresholdA": [
            44.57649994,
            26.08390045
          ],
          "thresholdB": [
            44.57979965,
            26.12779999
          ],
          "headingA": 84.0,
          "headingB": 264.0,
          "lengthM": 3500.3,
          "widthM": 45.1
        },
        {
          "id": "238403",
          "runway": "08R/26L",
          "thresholdA": [
            44.5644989,
            26.07659912
          ],
          "thresholdB": [
            44.56779861,
            26.12039948
          ],
          "headingA": 84.0,
          "headingB": 264.0,
          "lengthM": 3500.3,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "PDX",
      "icao": "KPDX",
      "airport": "Portland International Airport",
      "city": "Portland",
      "country": "US",
      "runways": [
        {
          "id": "244054",
          "runway": "10L/28R",
          "thresholdA": [
            45.596537,
            -122.600062
          ],
          "thresholdB": [
            45.583428,
            -122.566444
          ],
          "headingA": 119.0,
          "headingB": 299.0,
          "lengthM": 2994.7,
          "widthM": 45.7
        },
        {
          "id": "244053",
          "runway": "10R/28L",
          "thresholdA": [
            45.595155,
            -122.62151
          ],
          "thresholdB": [
            45.580515,
            -122.583901
          ],
          "headingA": 119.0,
          "headingB": 299.0,
          "lengthM": 3352.8,
          "widthM": 45.7
        },
        {
          "id": "244052",
          "runway": "3/21",
          "thresholdA": [
            45.582405,
            -122.616856
          ],
          "thresholdB": [
            45.594064,
            -122.600255
          ],
          "headingA": 45.0,
          "headingB": 225.0,
          "lengthM": 1828.8,
          "widthM": 45.7
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "PEK",
      "icao": "ZBAA",
      "airport": "Beijing Capital International Airport",
      "city": "Beijing",
      "country": "CN",
      "runways": [
        {
          "id": "269343",
          "runway": "01/19",
          "thresholdA": [
            40.058914,
            116.617599
          ],
          "thresholdB": [
            40.092834,
            116.612297
          ],
          "headingA": 353.0,
          "headingB": 173.0,
          "lengthM": 3799.9,
          "widthM": 60.0
        },
        {
          "id": "235180",
          "runway": "18L/36R",
          "thresholdA": [
            40.089359,
            116.594833
          ],
          "thresholdB": [
            40.055527,
            116.600166
          ],
          "headingA": 173.0,
          "headingB": 353.0,
          "lengthM": 3799.9,
          "widthM": 60.0
        },
        {
          "id": "235179",
          "runway": "18R/36L",
          "thresholdA": [
            40.102112,
            116.569695
          ],
          "thresholdB": [
            40.073479,
            116.574165
          ],
          "headingA": 173.0,
          "headingB": 353.0,
          "lengthM": 3200.1,
          "widthM": 50.0
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "PER",
      "icao": "YPPH",
      "airport": "Perth International Airport",
      "city": "Perth",
      "country": "AU",
      "runways": [
        {
          "id": "233339",
          "runway": "03/21",
          "thresholdA": [
            -31.95870018,
            115.95999908
          ],
          "thresholdB": [
            -31.92860031,
            115.96800232
          ],
          "headingA": 14.0,
          "headingB": 194.0,
          "lengthM": 3443.9,
          "widthM": 45.1
        },
        {
          "id": "233340",
          "runway": "06/24",
          "thresholdA": [
            -31.94099998,
            115.95899963
          ],
          "thresholdB": [
            -31.93090057,
            115.97899628
          ],
          "headingA": 59.0,
          "headingB": 239.0,
          "lengthM": 2162.9,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "PHL",
      "icao": "KPHL",
      "airport": "Philadelphia International Airport",
      "city": "Philadelphia",
      "country": "US",
      "runways": [
        {
          "id": "244467",
          "runway": "08/26",
          "thresholdA": [
            39.87829971,
            -75.23000336
          ],
          "thresholdB": [
            39.88180161,
            -75.21279907
          ],
          "headingA": 75.6,
          "headingB": 255.6,
          "lengthM": 1524.3,
          "widthM": 45.7
        },
        {
          "id": "244469",
          "runway": "09L/27R",
          "thresholdA": [
            39.86869812,
            -75.25569916
          ],
          "thresholdB": [
            39.87519836,
            -75.22290039
          ],
          "headingA": 75.5,
          "headingB": 255.5,
          "lengthM": 2895.6,
          "widthM": 45.7
        },
        {
          "id": "244468",
          "runway": "09R/27L",
          "thresholdA": [
            39.860802,
            -75.2752
          ],
          "thresholdB": [
            39.868,
            -75.238998
          ],
          "headingA": 76.0,
          "headingB": 256.0,
          "lengthM": 3657.6,
          "widthM": 61.0
        },
        {
          "id": "244470",
          "runway": "17/35",
          "thresholdA": [
            39.88600159,
            -75.23529816
          ],
          "thresholdB": [
            39.87200165,
            -75.228302
          ],
          "headingA": 159.1,
          "headingB": 339.1,
          "lengthM": 1981.2,
          "widthM": 45.7
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "PHX",
      "icao": "KPHX",
      "airport": "Phoenix Sky Harbor International Airport",
      "city": "Phoenix",
      "country": "US",
      "runways": [
        {
          "id": "240569",
          "runway": "07L/25R",
          "thresholdA": [
            33.43109894,
            -112.02700043
          ],
          "thresholdB": [
            33.43099976,
            -111.99299622
          ],
          "headingA": 90.0,
          "headingB": 270.0,
          "lengthM": 3139.4,
          "widthM": 45.7
        },
        {
          "id": "240568",
          "runway": "07R/25L",
          "thresholdA": [
            33.42890167,
            -112.02700043
          ],
          "thresholdB": [
            33.42879868,
            -112.0019989
          ],
          "headingA": 90.0,
          "headingB": 270.0,
          "lengthM": 2377.4,
          "widthM": 45.7
        },
        {
          "id": "240570",
          "runway": "08/26",
          "thresholdA": [
            33.4408989,
            -112.02999878
          ],
          "thresholdB": [
            33.44079971,
            -111.99199677
          ],
          "headingA": 90.1,
          "headingB": 270.1,
          "lengthM": 3501.8,
          "widthM": 45.7
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "PIT",
      "icao": "KPIT",
      "airport": "Pittsburgh International Airport",
      "city": "Pittsburgh",
      "country": "US",
      "runways": [
        {
          "id": "242074",
          "runway": "10C/28C",
          "thresholdA": [
            40.48989868,
            -80.24629974
          ],
          "thresholdB": [
            40.48899841,
            -80.21140289
          ],
          "headingA": 92.0,
          "headingB": 272.0,
          "lengthM": 3284.2,
          "widthM": 45.7
        },
        {
          "id": "242076",
          "runway": "10L/28R",
          "thresholdA": [
            40.50230026,
            -80.27120209
          ],
          "thresholdB": [
            40.50139999,
            -80.23339844
          ],
          "headingA": 91.9,
          "headingB": 271.9,
          "lengthM": 3201.0,
          "widthM": 45.7
        },
        {
          "id": "242075",
          "runway": "10R/28L",
          "thresholdA": [
            40.48669815,
            -80.25189972
          ],
          "thresholdB": [
            40.48559952,
            -80.21060181
          ],
          "headingA": 92.0,
          "headingB": 272.0,
          "lengthM": 3505.2,
          "widthM": 61.0
        },
        {
          "id": "242077",
          "runway": "14/32",
          "thresholdA": [
            40.49599838,
            -80.22489929
          ],
          "thresholdB": [
            40.47990036,
            -80.20480347
          ],
          "headingA": 136.4,
          "headingB": 316.4,
          "lengthM": 2469.2,
          "widthM": 45.7
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "PKX",
      "icao": "ZBAD",
      "airport": "Beijing Daxing International Airport",
      "city": "Beijing",
      "country": "CN",
      "runways": [
        {
          "id": "330821",
          "runway": "01L/19R",
          "thresholdA": [
            39.47129822,
            116.43099976
          ],
          "thresholdB": [
            39.50170135,
            116.42700195
          ],
          "headingA": 353.0,
          "headingB": 173.0,
          "lengthM": 3400.0,
          "widthM": 60.0
        },
        {
          "id": "330824",
          "runway": "11L/29R",
          "thresholdA": [
            39.516701,
            116.431
          ],
          "thresholdB": [
            39.5089,
            116.473999
          ],
          "headingA": 103.0,
          "headingB": 283.0,
          "lengthM": 3799.9,
          "widthM": 60.0
        },
        {
          "id": "330822",
          "runway": "17L/35R",
          "thresholdA": [
            39.517906,
            116.396111
          ],
          "thresholdB": [
            39.483929,
            116.401474
          ],
          "headingA": 173.0,
          "headingB": 353.0,
          "lengthM": 3799.9,
          "widthM": 60.0
        },
        {
          "id": "330823",
          "runway": "17R/35L",
          "thresholdA": [
            39.517075,
            116.387337
          ],
          "thresholdB": [
            39.483101,
            116.3927
          ],
          "headingA": 173.0,
          "headingB": 353.0,
          "lengthM": 3799.9,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "PMC",
      "icao": "SCTE",
      "airport": "El Tepual International Airport",
      "city": "Puerto Montt",
      "country": "CL",
      "runways": [
        {
          "id": "235245",
          "runway": "17/35",
          "thresholdA": [
            -41.42699814,
            -73.09349823
          ],
          "thresholdB": [
            -41.45080185,
            -73.0943985
          ],
          "headingA": 182.0,
          "headingB": 2.0,
          "lengthM": 2649.9,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "PMI",
      "icao": "LEPA",
      "airport": "Palma de Mallorca Airport",
      "city": "Palma de Mallorca",
      "country": "ES",
      "runways": [
        {
          "id": "238931",
          "runway": "06L/24R",
          "thresholdA": [
            39.54710007,
            2.71073008
          ],
          "thresholdB": [
            39.5625,
            2.74319005
          ],
          "headingA": 58.6,
          "headingB": 238.6,
          "lengthM": 3269.9,
          "widthM": 45.1
        },
        {
          "id": "238930",
          "runway": "06R/24L",
          "thresholdA": [
            39.54130173,
            2.73174
          ],
          "thresholdB": [
            39.55530167,
            2.76152992
          ],
          "headingA": 58.6,
          "headingB": 238.6,
          "lengthM": 2999.8,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "PMR",
      "icao": "NZPM",
      "airport": "Palmerston North Airport",
      "city": "Palmerston North",
      "country": "NZ",
      "runways": [
        {
          "id": "238020",
          "runway": "07L/25R",
          "thresholdA": [
            -40.32139969,
            175.60299683
          ],
          "thresholdB": [
            -40.32139969,
            175.62600708
          ],
          "headingA": 90.4,
          "headingB": 270.4,
          "lengthM": 1902.0,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "POA",
      "icao": "SBPA",
      "airport": "Porto Alegre-Salgado Filho International Airport",
      "city": "Porto Alegre",
      "country": "BR",
      "runways": [
        {
          "id": "234351",
          "runway": "11/29",
          "thresholdA": [
            -29.994381,
            -51.18301
          ],
          "thresholdB": [
            -29.99485,
            -51.159389
          ],
          "headingA": 91.0,
          "headingB": 271.0,
          "lengthM": 3200.1,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "PRG",
      "icao": "LKPR",
      "airport": "V\u00e1clav Havel Airport Prague",
      "city": "Prague",
      "country": "CZ",
      "runways": [
        {
          "id": "235690",
          "runway": "06/24",
          "thresholdA": [
            50.10179901,
            14.22630024
          ],
          "thresholdB": [
            50.11600113,
            14.27340031
          ],
          "headingA": 65.0,
          "headingB": 245.0,
          "lengthM": 3715.2,
          "widthM": 45.1
        },
        {
          "id": "235691",
          "runway": "12/30",
          "thresholdA": [
            50.10800171,
            14.24540043
          ],
          "thresholdB": [
            50.09049988,
            14.28170013
          ],
          "headingA": 127.0,
          "headingB": 307.0,
          "lengthM": 3250.1,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "PUS",
      "icao": "RKPK",
      "airport": "Gimhae International Airport",
      "city": "Busan",
      "country": "KR",
      "runways": [
        {
          "id": "237331",
          "runway": "18L/36R",
          "thresholdA": [
            35.19409943,
            128.93699646
          ],
          "thresholdB": [
            35.16949844,
            128.94099426
          ],
          "headingA": 174.0,
          "headingB": 354.0,
          "lengthM": 2745.3,
          "widthM": 45.7
        },
        {
          "id": "237330",
          "runway": "18R/36L",
          "thresholdA": [
            35.19390106,
            128.93499756
          ],
          "thresholdB": [
            35.16519928,
            128.93899536
          ],
          "headingA": 173.9,
          "headingB": 353.9,
          "lengthM": 3200.1,
          "widthM": 60.0
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "PVG",
      "icao": "ZSPD",
      "airport": "Shanghai Pudong International Airport",
      "city": "Shanghai (Pudong)",
      "country": "CN",
      "runways": [
        {
          "id": "314961",
          "runway": "16L/34R",
          "thresholdA": [
            31.16017532,
            121.81616211
          ],
          "thresholdB": [
            31.12757492,
            121.82846069
          ],
          "headingA": 162.0,
          "headingB": 342.0,
          "lengthM": 3799.9,
          "widthM": 60.0
        },
        {
          "id": "235163",
          "runway": "16R/34L",
          "thresholdA": [
            31.1590004,
            121.81199646
          ],
          "thresholdB": [
            31.12639999,
            121.8239975
          ],
          "headingA": 162.0,
          "headingB": 342.0,
          "lengthM": 3799.9,
          "widthM": 60.0
        },
        {
          "id": "235164",
          "runway": "17L/35R",
          "thresholdA": [
            31.16130066,
            121.78600311
          ],
          "thresholdB": [
            31.12700081,
            121.7990036
          ],
          "headingA": 162.0,
          "headingB": 342.0,
          "lengthM": 3999.9,
          "widthM": 60.0
        },
        {
          "id": "314962",
          "runway": "17R/35L",
          "thresholdA": [
            31.15483284,
            121.78316498
          ],
          "thresholdB": [
            31.12566566,
            121.79416656
          ],
          "headingA": 162.0,
          "headingB": 342.0,
          "lengthM": 3399.7,
          "widthM": 60.0
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "RAK",
      "icao": "GMMX",
      "airport": "Marrakesh Menara Airport",
      "city": "Marrakesh",
      "country": "MA",
      "runways": [
        {
          "id": "237602",
          "runway": "10/28",
          "thresholdA": [
            31.60840034,
            -8.05253983
          ],
          "thresholdB": [
            31.60549927,
            -8.01998997
          ],
          "headingA": 96.0,
          "headingB": 276.0,
          "lengthM": 3099.8,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "RBA",
      "icao": "GMME",
      "airport": "Rabat-Sal\u00e9 Airport",
      "city": "Rabat",
      "country": "MA",
      "runways": [
        {
          "id": "237593",
          "runway": "03/21",
          "thresholdA": [
            34.0379982,
            -6.76139021
          ],
          "thresholdB": [
            34.06489944,
            -6.7416501
          ],
          "headingA": 33.0,
          "headingB": 213.0,
          "lengthM": 3500.0,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "RDU",
      "icao": "KRDU",
      "airport": "Raleigh-Durham International Airport",
      "city": "Raleigh/Durham",
      "country": "US",
      "runways": [
        {
          "id": "242724",
          "runway": "05L/23R",
          "thresholdA": [
            35.87450027,
            -78.80200195
          ],
          "thresholdB": [
            35.89379883,
            -78.77799988
          ],
          "headingA": 45.0,
          "headingB": 225.0,
          "lengthM": 3048.0,
          "widthM": 45.7
        },
        {
          "id": "242723",
          "runway": "05R/23L",
          "thresholdA": [
            35.86460114,
            -78.79730225
          ],
          "thresholdB": [
            35.87919998,
            -78.77940369
          ],
          "headingA": 45.0,
          "headingB": 225.0,
          "lengthM": 2286.0,
          "widthM": 45.7
        },
        {
          "id": "242725",
          "runway": "14/32",
          "thresholdA": [
            35.875,
            -78.78269958
          ],
          "thresholdB": [
            35.86809921,
            -78.77420044
          ],
          "headingA": 135.0,
          "headingB": 315.0,
          "lengthM": 1088.1,
          "widthM": 30.5
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "REC",
      "icao": "SBRF",
      "airport": "Recife/Guararapes - Gilberto Freyre International Airport",
      "city": "Recife",
      "country": "BR",
      "runways": [],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "RMF",
      "icao": "HEMA",
      "airport": "Marsa Alam International Airport",
      "city": "Marsa Alam",
      "country": "EG",
      "runways": [
        {
          "id": "235544",
          "runway": "15/33",
          "thresholdA": [
            25.5688,
            34.576199
          ],
          "thresholdB": [
            25.545401,
            34.591202
          ],
          "headingA": 150.0,
          "headingB": 330.0,
          "lengthM": 3429.9,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "ROK",
      "icao": "YBRK",
      "airport": "Rockhampton Airport",
      "city": "Rockhampton",
      "country": "AU",
      "runways": [
        {
          "id": "233278",
          "runway": "04/22",
          "thresholdA": [
            -23.3825,
            150.464996
          ],
          "thresholdB": [
            -23.375847,
            150.47471
          ],
          "headingA": 53.0,
          "headingB": 233.0,
          "lengthM": 1645.0,
          "widthM": 29.9
        },
        {
          "id": "233279",
          "runway": "15/33",
          "thresholdA": [
            -23.36870003,
            150.47000122
          ],
          "thresholdB": [
            -23.39069939,
            150.47999573
          ],
          "headingA": 159.0,
          "headingB": 339.0,
          "lengthM": 2628.0,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "RSW",
      "icao": "KRSW",
      "airport": "Southwest Florida International Airport",
      "city": "Fort Myers",
      "country": "US",
      "runways": [
        {
          "id": "244927",
          "runway": "06/24",
          "thresholdA": [
            26.5265007,
            -81.76999664
          ],
          "thresholdB": [
            26.54579926,
            -81.74030304
          ],
          "headingA": 54.0,
          "headingB": 234.0,
          "lengthM": 3657.6,
          "widthM": 45.7
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "RUH",
      "icao": "OERK",
      "airport": "King Khalid International Airport",
      "city": "Riyadh",
      "country": "SA",
      "runways": [
        {
          "id": "238654",
          "runway": "15L/33R",
          "thresholdA": [
            24.9769001,
            46.70199966
          ],
          "thresholdB": [
            24.94400024,
            46.72280121
          ],
          "headingA": 150.0,
          "headingB": 330.0,
          "lengthM": 4205.0,
          "widthM": 60.0
        },
        {
          "id": "238653",
          "runway": "15R/33L",
          "thresholdA": [
            24.97089958,
            46.67490005
          ],
          "thresholdB": [
            24.93799973,
            46.6957016
          ],
          "headingA": 150.0,
          "headingB": 330.0,
          "lengthM": 4205.0,
          "widthM": 60.0
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "SAT",
      "icao": "KSAT",
      "airport": "San Antonio International Airport",
      "city": "San Antonio",
      "country": "US",
      "runways": [
        {
          "id": "242646",
          "runway": "04/22",
          "thresholdA": [
            29.52319908,
            -98.46990204
          ],
          "thresholdB": [
            29.53890038,
            -98.45449829
          ],
          "headingA": 41.0,
          "headingB": 221.0,
          "lengthM": 2592.3,
          "widthM": 45.7
        },
        {
          "id": "242648",
          "runway": "13L/31R",
          "thresholdA": [
            29.54030037,
            -98.47769928
          ],
          "thresholdB": [
            29.53019905,
            -98.46469879
          ],
          "headingA": 132.0,
          "headingB": 312.0,
          "lengthM": 1682.2,
          "widthM": 30.5
        },
        {
          "id": "242647",
          "runway": "13R/31L",
          "thresholdA": [
            29.54269981,
            -98.48549652
          ],
          "thresholdB": [
            29.5272007,
            -98.46559906
          ],
          "headingA": 132.0,
          "headingB": 312.0,
          "lengthM": 2591.4,
          "widthM": 45.7
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "SCL",
      "icao": "SCEL",
      "airport": "Comodoro Arturo Merino Ben\u00edtez International Airport",
      "city": "Santiago",
      "country": "CL",
      "runways": [
        {
          "id": "235228",
          "runway": "17L/35R",
          "thresholdA": [
            -33.376099,
            -70.786697
          ],
          "thresholdB": [
            -33.409901,
            -70.785202
          ],
          "headingA": 178.0,
          "headingB": 358.0,
          "lengthM": 3750.0,
          "widthM": 54.9
        },
        {
          "id": "235227",
          "runway": "17R/35L",
          "thresholdA": [
            -33.37189865,
            -70.80370331
          ],
          "thresholdB": [
            -33.4068985,
            -70.80190277
          ],
          "headingA": 177.0,
          "headingB": 357.0,
          "lengthM": 3750.0,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "SDF",
      "icao": "KSDF",
      "airport": "Louisville Muhammad Ali International Airport",
      "city": "Louisville",
      "country": "US",
      "runways": [
        {
          "id": "245244",
          "runway": "11/29",
          "thresholdA": [
            38.18019867,
            -85.74739838
          ],
          "thresholdB": [
            38.17309952,
            -85.72380066
          ],
          "headingA": 111.0,
          "headingB": 291.0,
          "lengthM": 2210.1,
          "widthM": 45.7
        },
        {
          "id": "245246",
          "runway": "17L/35R",
          "thresholdA": [
            38.18730164,
            -85.73130035
          ],
          "thresholdB": [
            38.16460037,
            -85.72360229
          ],
          "headingA": 165.0,
          "headingB": 345.0,
          "lengthM": 2614.6,
          "widthM": 45.7
        },
        {
          "id": "245245",
          "runway": "17R/35L",
          "thresholdA": [
            38.18700027,
            -85.74880219
          ],
          "thresholdB": [
            38.15819931,
            -85.73930359
          ],
          "headingA": 165.4,
          "headingB": 345.4,
          "lengthM": 3623.2,
          "widthM": 45.7
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "SEA",
      "icao": "KSEA",
      "airport": "Seattle\u2013Tacoma International Airport",
      "city": "Seattle",
      "country": "US",
      "runways": [
        {
          "id": "254330",
          "runway": "16C/34C",
          "thresholdA": [
            47.463799,
            -122.310997
          ],
          "thresholdB": [
            47.438,
            -122.310997
          ],
          "headingA": 180.0,
          "headingB": 360.0,
          "lengthM": 2873.0,
          "widthM": 45.7
        },
        {
          "id": "242182",
          "runway": "16L/34R",
          "thresholdA": [
            47.463799,
            -122.307999
          ],
          "thresholdB": [
            47.431198,
            -122.307999
          ],
          "headingA": 180.0,
          "headingB": 360.0,
          "lengthM": 3627.4,
          "widthM": 45.7
        },
        {
          "id": "242181",
          "runway": "16R/34L",
          "thresholdA": [
            47.463799,
            -122.318001
          ],
          "thresholdB": [
            47.440498,
            -122.318001
          ],
          "headingA": 180.0,
          "headingB": 360.0,
          "lengthM": 2590.8,
          "widthM": 45.7
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "SFO",
      "icao": "KSFO",
      "airport": "San Francisco International Airport",
      "city": "San Francisco",
      "country": "US",
      "runways": [
        {
          "id": "240772",
          "runway": "10L/28R",
          "thresholdA": [
            37.628742,
            -122.39341
          ],
          "thresholdB": [
            37.613538,
            -122.35716
          ],
          "headingA": 118.0,
          "headingB": 298.0,
          "lengthM": 3618.0,
          "widthM": 61.0
        },
        {
          "id": "240771",
          "runway": "10R/28L",
          "thresholdA": [
            37.626298,
            -122.393124
          ],
          "thresholdB": [
            37.61172,
            -122.358367
          ],
          "headingA": 118.0,
          "headingB": 298.0,
          "lengthM": 3468.9,
          "widthM": 61.0
        },
        {
          "id": "240770",
          "runway": "1L/19R",
          "thresholdA": [
            37.607898,
            -122.38295
          ],
          "thresholdB": [
            37.626476,
            -122.37063
          ],
          "headingA": 28.0,
          "headingB": 208.0,
          "lengthM": 2331.7,
          "widthM": 61.0
        },
        {
          "id": "240769",
          "runway": "1R/19L",
          "thresholdA": [
            37.606333,
            -122.381061
          ],
          "thresholdB": [
            37.627346,
            -122.367124
          ],
          "headingA": 28.0,
          "headingB": 208.0,
          "lengthM": 2639.6,
          "widthM": 61.0
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "SGN",
      "icao": "VVTS",
      "airport": "Tan Son Nhat International Airport",
      "city": "Ho Chi Minh City",
      "country": "VN",
      "runways": [
        {
          "id": "246162",
          "runway": "07L/25R",
          "thresholdA": [
            10.815,
            106.637001
          ],
          "thresholdB": [
            10.8249,
            106.663002
          ],
          "headingA": 69.0,
          "headingB": 249.0,
          "lengthM": 3050.1,
          "widthM": 45.1
        },
        {
          "id": "246161",
          "runway": "07R/25L",
          "thresholdA": [
            10.8114996,
            106.63700104
          ],
          "thresholdB": [
            10.82369995,
            106.66999817
          ],
          "headingA": 69.0,
          "headingB": 249.0,
          "lengthM": 3800.2,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "SHA",
      "icao": "ZSSS",
      "airport": "Shanghai Hongqiao International Airport",
      "city": "Shanghai (Minhang)",
      "country": "CN",
      "runways": [
        {
          "id": "235181",
          "runway": "18L/36R",
          "thresholdA": [
            31.21319962,
            121.33499908
          ],
          "thresholdB": [
            31.18250084,
            121.33699799
          ],
          "headingA": 176.0,
          "headingB": 356.0,
          "lengthM": 3399.7,
          "widthM": 45.1
        },
        {
          "id": "314966",
          "runway": "18R/36L",
          "thresholdA": [
            31.21,
            121.332
          ],
          "thresholdB": [
            31.186,
            121.333
          ],
          "headingA": 176.0,
          "headingB": 356.0,
          "lengthM": 3299.8,
          "widthM": 60.0
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "SIN",
      "icao": "WSSS",
      "airport": "Singapore Changi Airport",
      "city": "Singapore",
      "country": "SG",
      "runways": [
        {
          "id": "238866",
          "runway": "02C/20C",
          "thresholdA": [
            1.3288,
            103.985001
          ],
          "thresholdB": [
            1.36213,
            103.999001
          ],
          "headingA": 23.0,
          "headingB": 203.0,
          "lengthM": 3999.9,
          "widthM": 60.0
        },
        {
          "id": "238868",
          "runway": "02L/20R",
          "thresholdA": [
            1.34897,
            103.977997
          ],
          "thresholdB": [
            1.38241,
            103.991997
          ],
          "headingA": 23.0,
          "headingB": 203.0,
          "lengthM": 3999.9,
          "widthM": 60.0
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "SLA",
      "icao": "SASA",
      "airport": "Mart\u00edn Miguel de G\u00fcemes International Airport",
      "city": "Salta",
      "country": "AR",
      "runways": [
        {
          "id": "233003",
          "runway": "02/20",
          "thresholdA": [
            -24.872801,
            -65.489899
          ],
          "thresholdB": [
            -24.846399,
            -65.4841
          ],
          "headingA": 11.0,
          "headingB": 191.0,
          "lengthM": 2999.8,
          "widthM": 45.1
        },
        {
          "id": "233004",
          "runway": "06/24",
          "thresholdA": [
            -24.858101,
            -65.489601
          ],
          "thresholdB": [
            -24.844801,
            -65.470802
          ],
          "headingA": 52.0,
          "headingB": 232.0,
          "lengthM": 2400.0,
          "widthM": 29.9
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "SLC",
      "icao": "KSLC",
      "airport": "Salt Lake City International Airport",
      "city": "Salt Lake City",
      "country": "US",
      "runways": [
        {
          "id": "241552",
          "runway": "14/32",
          "thresholdA": [
            40.785719,
            -111.971255
          ],
          "thresholdB": [
            40.773758,
            -111.963238
          ],
          "headingA": 153.0,
          "headingB": 333.0,
          "lengthM": 1491.4,
          "widthM": 45.7
        },
        {
          "id": "241554",
          "runway": "16L/34R",
          "thresholdA": [
            40.807456,
            -111.976947
          ],
          "thresholdB": [
            40.774646,
            -111.973146
          ],
          "headingA": 175.0,
          "headingB": 355.0,
          "lengthM": 3658.2,
          "widthM": 45.7
        },
        {
          "id": "241553",
          "runway": "16R/34L",
          "thresholdA": [
            40.807783,
            -111.999303
          ],
          "thresholdB": [
            40.774977,
            -111.995488
          ],
          "headingA": 175.0,
          "headingB": 355.0,
          "lengthM": 3657.6,
          "widthM": 45.7
        },
        {
          "id": "241555",
          "runway": "17/35",
          "thresholdA": [
            40.79892,
            -111.96209
          ],
          "thresholdB": [
            40.772588,
            -111.962089
          ],
          "headingA": 180.0,
          "headingB": 360.0,
          "lengthM": 2924.9,
          "widthM": 45.7
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "SLZ",
      "icao": "SBSL",
      "airport": "Marechal Cunha Machado International Airport",
      "city": "S\u00e3o Lu\u00eds",
      "country": "BR",
      "runways": [],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "SMF",
      "icao": "KSMF",
      "airport": "Sacramento International Airport",
      "city": "Sacramento",
      "country": "US",
      "runways": [
        {
          "id": "245194",
          "runway": "17L/35R",
          "thresholdA": [
            38.707141,
            -121.580077
          ],
          "thresholdB": [
            38.683518,
            -121.580474
          ],
          "headingA": 181.0,
          "headingB": 1.0,
          "lengthM": 2622.8,
          "widthM": 45.7
        },
        {
          "id": "245193",
          "runway": "17R/35L",
          "thresholdA": [
            38.707355,
            -121.601101
          ],
          "thresholdB": [
            38.683723,
            -121.601493
          ],
          "headingA": 181.0,
          "headingB": 1.0,
          "lengthM": 2620.7,
          "widthM": 45.7
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "SSA",
      "icao": "SBSV",
      "airport": "Deputado Luiz Eduardo Magalh\u00e3es International Airport",
      "city": "Salvador",
      "country": "BR",
      "runways": [],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "SSH",
      "icao": "HESH",
      "airport": "Sharm El Sheikh International Airport",
      "city": "Sharm El Sheikh",
      "country": "EG",
      "runways": [
        {
          "id": "235573",
          "runway": "04L/22R",
          "thresholdA": [
            27.96850014,
            34.38259888
          ],
          "thresholdB": [
            27.98889923,
            34.40390015
          ],
          "headingA": 42.8,
          "headingB": 222.8,
          "lengthM": 3080.9,
          "widthM": 45.1
        },
        {
          "id": "235572",
          "runway": "04R/22L",
          "thresholdA": [
            27.96570015,
            34.38600159
          ],
          "thresholdB": [
            27.98609924,
            34.40729904
          ],
          "headingA": 42.8,
          "headingB": 222.8,
          "lengthM": 3080.9,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "STL",
      "icao": "KSTL",
      "airport": "St. Louis Lambert International Airport",
      "city": "St Louis",
      "country": "US",
      "runways": [
        {
          "id": "243530",
          "runway": "06/24",
          "thresholdA": [
            38.746684,
            -90.381218
          ],
          "thresholdB": [
            38.756217,
            -90.357504
          ],
          "headingA": 63.0,
          "headingB": 243.0,
          "lengthM": 2317.4,
          "widthM": 45.7
        },
        {
          "id": "243531",
          "runway": "11/29",
          "thresholdA": [
            38.759952,
            -90.409872
          ],
          "thresholdB": [
            38.746792,
            -90.383163
          ],
          "headingA": 122.0,
          "headingB": 302.0,
          "lengthM": 2743.2,
          "widthM": 45.7
        },
        {
          "id": "243533",
          "runway": "12L/30R",
          "thresholdA": [
            38.751793,
            -90.366322
          ],
          "thresholdB": [
            38.738607,
            -90.339585
          ],
          "headingA": 122.0,
          "headingB": 302.0,
          "lengthM": 2747.2,
          "widthM": 45.7
        },
        {
          "id": "243532",
          "runway": "12R/30L",
          "thresholdA": [
            38.753904,
            -90.379159
          ],
          "thresholdB": [
            38.737782,
            -90.346464
          ],
          "headingA": 122.0,
          "headingB": 302.0,
          "lengthM": 3358.9,
          "widthM": 61.0
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "STN",
      "icao": "EGSS",
      "airport": "London Stansted Airport",
      "city": "London, Essex",
      "country": "GB",
      "runways": [
        {
          "id": "239531",
          "runway": "04/22",
          "thresholdA": [
            51.875081,
            0.219933
          ],
          "thresholdB": [
            51.895166,
            0.25005
          ],
          "headingA": 44.0,
          "headingB": 224.0,
          "lengthM": 3048.9,
          "widthM": 46.0
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "SVO",
      "icao": "UUEE",
      "airport": "Sheremetyevo International Airport",
      "city": "Moscow",
      "country": "RU",
      "runways": [
        {
          "id": "238544",
          "runway": "06C/24C",
          "thresholdA": [
            55.969799,
            37.3867
          ],
          "thresholdB": [
            55.978001,
            37.4417
          ],
          "headingA": 64.0,
          "headingB": 244.0,
          "lengthM": 3550.0,
          "widthM": 60.0
        },
        {
          "id": "332323",
          "runway": "06L/24R",
          "thresholdA": [
            55.980999,
            37.328899
          ],
          "thresholdB": [
            55.9884,
            37.378502
          ],
          "headingA": 64.0,
          "headingB": 244.0,
          "lengthM": 3200.1,
          "widthM": 60.0
        },
        {
          "id": "238543",
          "runway": "06R/24L",
          "thresholdA": [
            55.96709824,
            37.38629913
          ],
          "thresholdB": [
            55.97570038,
            37.44369888
          ],
          "headingA": 64.0,
          "headingB": 244.0,
          "lengthM": 3700.0,
          "widthM": 60.0
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "SYD",
      "icao": "YSSY",
      "airport": "Sydney Kingsford Smith International Airport",
      "city": "Sydney (Mascot)",
      "country": "AU",
      "runways": [
        {
          "id": "233266",
          "runway": "07/25",
          "thresholdA": [
            -33.94369888,
            151.16400146
          ],
          "thresholdB": [
            -33.9375,
            151.19000244
          ],
          "headingA": 74.0,
          "headingB": 254.0,
          "lengthM": 2529.8,
          "widthM": 45.1
        },
        {
          "id": "233268",
          "runway": "16L/34R",
          "thresholdA": [
            -33.94960022,
            151.18800354
          ],
          "thresholdB": [
            -33.97109985,
            151.19400024
          ],
          "headingA": 168.0,
          "headingB": 348.0,
          "lengthM": 2438.1,
          "widthM": 45.1
        },
        {
          "id": "233267",
          "runway": "16R/34L",
          "thresholdA": [
            -33.9294014,
            151.17199707
          ],
          "thresholdB": [
            -33.96429825,
            151.18099976
          ],
          "headingA": 168.0,
          "headingB": 348.0,
          "lengthM": 3962.1,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "SZX",
      "icao": "ZGSZ",
      "airport": "Shenzhen Bao'an International Airport",
      "city": "Shenzhen",
      "country": "CN",
      "runways": [
        {
          "id": "235199",
          "runway": "15/33",
          "thresholdA": [
            22.65299988,
            113.8030014
          ],
          "thresholdB": [
            22.62560081,
            113.81800079
          ],
          "headingA": 155.0,
          "headingB": 335.0,
          "lengthM": 3400.0,
          "widthM": 45.1
        },
        {
          "id": "329873",
          "runway": "16L/34R",
          "thresholdA": [
            22.654461,
            113.784851
          ],
          "thresholdB": [
            22.62388,
            113.80162
          ],
          "headingA": 155.0,
          "headingB": 335.0,
          "lengthM": 3799.9,
          "widthM": 60.0
        },
        {
          "id": "602535",
          "runway": "16R/34L",
          "thresholdA": [
            22.659056,
            113.776337
          ],
          "thresholdB": [
            22.630083,
            113.792221
          ],
          "headingA": 153.0,
          "headingB": 333.0,
          "lengthM": 3600.0,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "TAO",
      "icao": "ZSQD",
      "airport": "Qingdao Jiaodong International Airport",
      "city": "Qingdao (Jiaozhou)",
      "country": "CN",
      "runways": [
        {
          "id": "349624",
          "runway": "16/34",
          "thresholdA": [
            36.38127899,
            120.0932312
          ],
          "thresholdB": [
            36.35035706,
            120.1053772
          ],
          "headingA": null,
          "headingB": null,
          "lengthM": 3600.0,
          "widthM": 60.0
        },
        {
          "id": "349625",
          "runway": "17/35",
          "thresholdA": [
            36.37101746,
            120.07172394
          ],
          "thresholdB": [
            36.34009552,
            120.08386993
          ],
          "headingA": null,
          "headingB": null,
          "lengthM": 3600.0,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "TFU",
      "icao": "ZUTF",
      "airport": "Chengdu Tianfu International Airport",
      "city": "Chengdu (Jianyang)",
      "country": "CN",
      "runways": [
        {
          "id": "351155",
          "runway": "01/19",
          "thresholdA": [
            30.290417,
            104.417526
          ],
          "thresholdB": [
            30.323833,
            104.43322
          ],
          "headingA": null,
          "headingB": null,
          "lengthM": 3999.9,
          "widthM": 60.0
        },
        {
          "id": "351156",
          "runway": "02/20",
          "thresholdA": [
            30.277639,
            104.438446
          ],
          "thresholdB": [
            30.304361,
            104.451027
          ],
          "headingA": null,
          "headingB": null,
          "lengthM": 3200.1,
          "widthM": 45.1
        },
        {
          "id": "351157",
          "runway": "11/29",
          "thresholdA": [
            30.3151,
            104.4599
          ],
          "thresholdB": [
            30.3022,
            104.4965
          ],
          "headingA": null,
          "headingB": null,
          "lengthM": 3799.9,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "TNG",
      "icao": "GMTT",
      "airport": "Tangier Ibn Battuta Airport",
      "city": "Tangier",
      "country": "MA",
      "runways": [
        {
          "id": "237609",
          "runway": "10/28",
          "thresholdA": [
            35.73329926,
            -5.94031
          ],
          "thresholdB": [
            35.72999954,
            -5.90182018
          ],
          "headingA": 96.0,
          "headingB": 276.0,
          "lengthM": 3500.0,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "TPA",
      "icao": "KTPA",
      "airport": "Tampa International Airport",
      "city": "Tampa",
      "country": "US",
      "runways": [
        {
          "id": "243029",
          "runway": "10/28",
          "thresholdA": [
            27.9708004,
            -82.53610229
          ],
          "thresholdB": [
            27.97019958,
            -82.51439667
          ],
          "headingA": 92.0,
          "headingB": 272.0,
          "lengthM": 2133.3,
          "widthM": 45.7
        },
        {
          "id": "243031",
          "runway": "19L/01R",
          "thresholdA": [
            27.9871006,
            -82.52819824
          ],
          "thresholdB": [
            27.96430016,
            -82.52899933
          ],
          "headingA": 182.0,
          "headingB": 2.0,
          "lengthM": 2529.8,
          "widthM": 45.7
        },
        {
          "id": "243030",
          "runway": "19R/01L",
          "thresholdA": [
            27.99349976,
            -82.54129791
          ],
          "thresholdB": [
            27.9633007,
            -82.54239655
          ],
          "headingA": 182.0,
          "headingB": 2.0,
          "lengthM": 3353.4,
          "widthM": 45.7
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "TPE",
      "icao": "RCTP",
      "airport": "Taiwan Taoyuan International Airport",
      "city": "Taoyuan",
      "country": "TW",
      "runways": [
        {
          "id": "239327",
          "runway": "05L/23R",
          "thresholdA": [
            25.07290077,
            121.21600342
          ],
          "thresholdB": [
            25.09447479,
            121.24337769
          ],
          "headingA": 49.3,
          "headingB": 229.3,
          "lengthM": 3660.0,
          "widthM": 60.0
        },
        {
          "id": "239328",
          "runway": "05R/23L",
          "thresholdA": [
            25.06084251,
            121.22348785
          ],
          "thresholdB": [
            25.08329964,
            121.2519989
          ],
          "headingA": 49.3,
          "headingB": 229.3,
          "lengthM": 3350.1,
          "widthM": 60.0
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "TSV",
      "icao": "YBTL",
      "airport": "Townsville Airport / RAAF Base Townsville",
      "city": "Townsville",
      "country": "AU",
      "runways": [
        {
          "id": "233317",
          "runway": "01/19",
          "thresholdA": [
            -19.25830078,
            146.76499939
          ],
          "thresholdB": [
            -19.23819923,
            146.77400208
          ],
          "headingA": 24.0,
          "headingB": 204.0,
          "lengthM": 2438.1,
          "widthM": 45.1
        },
        {
          "id": "233318",
          "runway": "07/25",
          "thresholdA": [
            -19.25580025,
            146.7559967
          ],
          "thresholdB": [
            -19.25309944,
            146.76600647
          ],
          "headingA": 74.0,
          "headingB": 254.0,
          "lengthM": 1100.0,
          "widthM": 29.9
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "TUN",
      "icao": "DTTA",
      "airport": "Tunis Carthage International Airport",
      "city": "Tunis",
      "country": "TN",
      "runways": [
        {
          "id": "239215",
          "runway": "01/19",
          "thresholdA": [
            36.83909988,
            10.22379971
          ],
          "thresholdB": [
            36.86719894,
            10.23139954
          ],
          "headingA": 12.3,
          "headingB": 192.3,
          "lengthM": 3200.1,
          "widthM": 45.1
        },
        {
          "id": "239216",
          "runway": "11/29",
          "thresholdA": [
            36.85430145,
            10.2177
          ],
          "thresholdB": [
            36.8443985,
            10.24720001
          ],
          "headingA": 112.5,
          "headingB": 292.5,
          "lengthM": 2840.1,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "TUS",
      "icao": "KTUS",
      "airport": "Tucson International Airport",
      "city": "Tucson",
      "country": "US",
      "runways": [
        {
          "id": "242912",
          "runway": "04/22",
          "thresholdA": [
            32.117199,
            -110.959
          ],
          "thresholdB": [
            32.130798,
            -110.943001
          ],
          "headingA": 45.0,
          "headingB": 225.0,
          "lengthM": 2133.6,
          "widthM": 45.7
        },
        {
          "id": "242913",
          "runway": "12/30",
          "thresholdA": [
            32.1234,
            -110.9479
          ],
          "thresholdB": [
            32.102,
            -110.9228
          ],
          "headingA": 135.0,
          "headingB": 315.0,
          "lengthM": 3351.6,
          "widthM": 45.7
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "UIO",
      "icao": "SEQM",
      "airport": "Mariscal Sucre International Airport",
      "city": "Quito",
      "country": "EC",
      "runways": [
        {
          "id": "308279",
          "runway": "18/36",
          "thresholdA": [
            -0.105617,
            -78.35520935
          ],
          "thresholdB": [
            -0.14264999,
            -78.35362244
          ],
          "headingA": 180.0,
          "headingB": 360.0,
          "lengthM": 4098.0,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "USH",
      "icao": "SAWH",
      "airport": "Ushuaia - Malvinas Argentinas International Airport",
      "city": "Ushuaia",
      "country": "AR",
      "runways": [
        {
          "id": "232913",
          "runway": "7/25",
          "thresholdA": [
            -54.84420013,
            -68.31749725
          ],
          "thresholdB": [
            -54.8423996,
            -68.27400208
          ],
          "headingA": 86.2,
          "headingB": 266.2,
          "lengthM": 2799.9,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "VCE",
      "icao": "LIPZ",
      "airport": "Venice Marco Polo Airport",
      "city": "Venezia (VE)",
      "country": "IT",
      "runways": [
        {
          "id": "237024",
          "runway": "04L/22R",
          "thresholdA": [
            45.49520111,
            12.3355999
          ],
          "thresholdB": [
            45.51369858,
            12.3593998
          ],
          "headingA": 42.0,
          "headingB": 222.0,
          "lengthM": 2780.1,
          "widthM": 45.1
        },
        {
          "id": "237023",
          "runway": "04R/22L",
          "thresholdA": [
            45.49409866,
            12.33769989
          ],
          "thresholdB": [
            45.51620102,
            12.36600018
          ],
          "headingA": 42.0,
          "headingB": 222.0,
          "lengthM": 3300.1,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "VCP",
      "icao": "SBKP",
      "airport": "Viracopos International Airport",
      "city": "Campinas",
      "country": "BR",
      "runways": [
        {
          "id": "234355",
          "runway": "15/33",
          "thresholdA": [
            -22.99850082,
            -47.14699936
          ],
          "thresholdB": [
            -23.01639938,
            -47.12200165
          ],
          "headingA": 128.0,
          "headingB": 308.0,
          "lengthM": 3240.0,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "VIE",
      "icao": "LOWW",
      "airport": "Vienna International Airport",
      "city": "Vienna",
      "country": "AT",
      "runways": [
        {
          "id": "233577",
          "runway": "11/29",
          "thresholdA": [
            48.12279892,
            16.53339958
          ],
          "thresholdB": [
            48.10900116,
            16.57559967
          ],
          "headingA": 116.0,
          "headingB": 296.1,
          "lengthM": 3500.0,
          "widthM": 45.1
        },
        {
          "id": "233578",
          "runway": "16/34",
          "thresholdA": [
            48.11980057,
            16.57819939
          ],
          "thresholdB": [
            48.08860016,
            16.59129906
          ],
          "headingA": 164.0,
          "headingB": 344.0,
          "lengthM": 3600.0,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "VIX",
      "icao": "SBVT",
      "airport": "Eurico de Aguiar Salles International Airport",
      "city": "Vit\u00f3ria",
      "country": "BR",
      "runways": [
        {
          "id": "330846",
          "runway": "02/20",
          "thresholdA": [
            -20.265829,
            -40.278332
          ],
          "thresholdB": [
            -20.247499,
            -40.281109
          ],
          "headingA": null,
          "headingB": null,
          "lengthM": 2058.0,
          "widthM": 45.1
        },
        {
          "id": "234357",
          "runway": "06/24",
          "thresholdA": [
            -20.2644,
            -40.2911
          ],
          "thresholdB": [
            -20.250799,
            -40.2822
          ],
          "headingA": null,
          "headingB": null,
          "lengthM": 1750.2,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "VKO",
      "icao": "UUWW",
      "airport": "Vnukovo International Airport",
      "city": "Moscow",
      "country": "RU",
      "runways": [
        {
          "id": "238555",
          "runway": "01/19",
          "thresholdA": [
            55.58660126,
            37.25759888
          ],
          "thresholdB": [
            55.61180115,
            37.27690125
          ],
          "headingA": 12.0,
          "headingB": 192.0,
          "lengthM": 3059.9,
          "widthM": 45.1
        },
        {
          "id": "238556",
          "runway": "06/24",
          "thresholdA": [
            55.58649826,
            37.23870087
          ],
          "thresholdB": [
            55.59799957,
            37.29029846
          ],
          "headingA": 57.0,
          "headingB": 237.0,
          "lengthM": 3500.0,
          "widthM": 60.0
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "VLC",
      "icao": "LEVC",
      "airport": "Valencia Airport",
      "city": "Valencia",
      "country": "ES",
      "runways": [
        {
          "id": "238886",
          "runway": "12/30",
          "thresholdA": [
            39.496359,
            -0.500113
          ],
          "thresholdB": [
            39.483623,
            -0.466657
          ],
          "headingA": 116.0,
          "headingB": 296.0,
          "lengthM": 2699.9,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "VVI",
      "icao": "SLVR",
      "airport": "Viru Viru International Airport",
      "city": "Santa Cruz",
      "country": "BO",
      "runways": [
        {
          "id": "233696",
          "runway": "16/34",
          "thresholdA": [
            -17.63150024,
            -63.14429855
          ],
          "thresholdB": [
            -17.65800095,
            -63.12639999
          ],
          "headingA": 147.0,
          "headingB": 327.0,
          "lengthM": 3500.0,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "WAW",
      "icao": "EPWA",
      "airport": "Warsaw Chopin Airport",
      "city": "Warsaw",
      "country": "PL",
      "runways": [
        {
          "id": "238288",
          "runway": "11/29",
          "thresholdA": [
            52.171501,
            20.946699
          ],
          "thresholdB": [
            52.160999,
            20.9839
          ],
          "headingA": 115.0,
          "headingB": 295.0,
          "lengthM": 2799.9,
          "widthM": 50.0
        },
        {
          "id": "238289",
          "runway": "15/33",
          "thresholdA": [
            52.1786,
            20.9559
          ],
          "thresholdB": [
            52.149399,
            20.9814
          ],
          "headingA": 152.0,
          "headingB": 332.0,
          "lengthM": 3689.9,
          "widthM": 59.7
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "WLG",
      "icao": "NZWN",
      "airport": "Wellington International Airport",
      "city": "Wellington",
      "country": "NZ",
      "runways": [
        {
          "id": "238043",
          "runway": "16/34",
          "thresholdA": [
            -41.31740189,
            174.80700684
          ],
          "thresholdB": [
            -41.33480072,
            174.80599976
          ],
          "headingA": 183.0,
          "headingB": 3.0,
          "lengthM": 1936.1,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "WUH",
      "icao": "ZHHH",
      "airport": "Wuhan Tianhe International Airport",
      "city": "Wuhan (Huangpi)",
      "country": "CN",
      "runways": [
        {
          "id": "235203",
          "runway": "04/22",
          "thresholdA": [
            30.772301,
            114.195999
          ],
          "thresholdB": [
            30.7952,
            114.220001
          ],
          "headingA": 42.0,
          "headingB": 222.0,
          "lengthM": 3400.0,
          "widthM": 45.1
        },
        {
          "id": "330239",
          "runway": "05L/23R",
          "thresholdA": [
            30.757639,
            114.210793
          ],
          "thresholdB": [
            30.781969,
            114.235695
          ],
          "headingA": 46.0,
          "headingB": 226.0,
          "lengthM": 3600.0,
          "widthM": 60.0
        },
        {
          "id": "596489",
          "runway": "05R/23L",
          "thresholdA": [
            30.758211,
            114.216393
          ],
          "thresholdB": [
            30.779839,
            114.238533
          ],
          "headingA": null,
          "headingB": null,
          "lengthM": 3199.8,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "XIY",
      "icao": "ZLXY",
      "airport": "Xi'an Xianyang International Airport",
      "city": "Xi'an",
      "country": "CN",
      "runways": [
        {
          "id": "235201",
          "runway": "05L/23R",
          "thresholdA": [
            34.442154,
            108.735619
          ],
          "thresholdB": [
            34.464703,
            108.766754
          ],
          "headingA": 49.0,
          "headingB": 229.0,
          "lengthM": 3799.9,
          "widthM": 45.1
        },
        {
          "id": "333739",
          "runway": "06L/24R",
          "thresholdA": [
            34.420982,
            108.751053
          ],
          "thresholdB": [
            34.443531,
            108.782173
          ],
          "headingA": 49.0,
          "headingB": 229.0,
          "lengthM": 3799.9,
          "widthM": 60.0
        },
        {
          "id": "603831",
          "runway": "06R/24L",
          "thresholdA": [
            34.423126,
            108.76033
          ],
          "thresholdB": [
            34.440865,
            108.784966
          ],
          "headingA": null,
          "headingB": 229.0,
          "lengthM": 3000.1,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "YUL",
      "icao": "CYUL",
      "airport": "Montreal / Pierre Elliott Trudeau International Airport",
      "city": "Montr\u00e9al",
      "country": "CA",
      "runways": [
        {
          "id": "235037",
          "runway": "06L/24R",
          "thresholdA": [
            45.46106339,
            -73.76501465
          ],
          "thresholdB": [
            45.48327637,
            -73.73592377
          ],
          "headingA": 42.7,
          "headingB": 222.7,
          "lengthM": 3352.8,
          "widthM": 61.0
        },
        {
          "id": "235036",
          "runway": "06R/24L",
          "thresholdA": [
            45.45766068,
            -73.74138641
          ],
          "thresholdB": [
            45.47702026,
            -73.71601105
          ],
          "headingA": 41.3,
          "headingB": 221.3,
          "lengthM": 2926.1,
          "widthM": 61.0
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "YVR",
      "icao": "CYVR",
      "airport": "Vancouver International Airport",
      "city": "Vancouver",
      "country": "CA",
      "runways": [
        {
          "id": "234512",
          "runway": "08L/26R",
          "thresholdA": [
            49.20500183,
            -123.2009964
          ],
          "thresholdB": [
            49.20059967,
            -123.16000366
          ],
          "headingA": 100.0,
          "headingB": 280.0,
          "lengthM": 3029.7,
          "widthM": 61.0
        },
        {
          "id": "234511",
          "runway": "08R/26L",
          "thresholdA": [
            49.19010162,
            -123.20800018
          ],
          "thresholdB": [
            49.18439865,
            -123.16100311
          ],
          "headingA": 100.3,
          "headingB": 280.3,
          "lengthM": 3505.2,
          "widthM": 61.0
        },
        {
          "id": "234513",
          "runway": "13/31",
          "thresholdA": [
            49.19990158,
            -123.2009964
          ],
          "thresholdB": [
            49.18420029,
            -123.18199921
          ],
          "headingA": 142.0,
          "headingB": 322.0,
          "lengthM": 2225.0,
          "widthM": 61.0
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "YYC",
      "icao": "CYYC",
      "airport": "Calgary International Airport",
      "city": "Calgary",
      "country": "CA",
      "runways": [
        {
          "id": "234694",
          "runway": "11/29",
          "thresholdA": [
            51.12639999,
            -114.03700256
          ],
          "thresholdB": [
            51.11560059,
            -114.0059967
          ],
          "headingA": 119.5,
          "headingB": 299.5,
          "lengthM": 2438.4,
          "widthM": 61.0
        },
        {
          "id": "319574",
          "runway": "17L/35R",
          "thresholdA": [
            51.1483,
            -113.989998
          ],
          "thresholdB": [
            51.110001,
            -113.989998
          ],
          "headingA": 180.0,
          "headingB": null,
          "lengthM": 4267.2,
          "widthM": 61.0
        },
        {
          "id": "234695",
          "runway": "17R/35L",
          "thresholdA": [
            51.13140106,
            -114.02100372
          ],
          "thresholdB": [
            51.09659958,
            -114.02100372
          ],
          "headingA": 180.0,
          "headingB": 360.0,
          "lengthM": 3863.3,
          "widthM": 61.0
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "YYZ",
      "icao": "CYYZ",
      "airport": "Toronto Pearson International Airport",
      "city": "Toronto",
      "country": "CA",
      "runways": [
        {
          "id": "234792",
          "runway": "05/23",
          "thresholdA": [
            43.6739006,
            -79.66390228
          ],
          "thresholdB": [
            43.69469833,
            -79.63330078
          ],
          "headingA": 47.0,
          "headingB": 227.0,
          "lengthM": 3389.4,
          "widthM": 61.0
        },
        {
          "id": "234794",
          "runway": "06L/24R",
          "thresholdA": [
            43.66104889,
            -79.62342834
          ],
          "thresholdB": [
            43.67897797,
            -79.59736633
          ],
          "headingA": 47.0,
          "headingB": 227.0,
          "lengthM": 2955.6,
          "widthM": 61.0
        },
        {
          "id": "234793",
          "runway": "06R/24L",
          "thresholdA": [
            43.65829849,
            -79.62192535
          ],
          "thresholdB": [
            43.67528915,
            -79.59723663
          ],
          "headingA": 47.0,
          "headingB": 227.0,
          "lengthM": 2743.2,
          "widthM": 61.0
        },
        {
          "id": "234796",
          "runway": "15L/33R",
          "thresholdA": [
            43.69189835,
            -79.64219666
          ],
          "thresholdB": [
            43.66999817,
            -79.61389923
          ],
          "headingA": 137.0,
          "headingB": 317.0,
          "lengthM": 3368.0,
          "widthM": 61.0
        },
        {
          "id": "234795",
          "runway": "15R/33L",
          "thresholdA": [
            43.68579865,
            -79.65170288
          ],
          "thresholdB": [
            43.66749954,
            -79.62830353
          ],
          "headingA": 137.0,
          "headingB": 317.0,
          "lengthM": 2770.0,
          "widthM": 61.0
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "ZNZ",
      "icao": "HTZA",
      "airport": "Abeid Amani Karume International Airport",
      "city": "Zanzibar",
      "country": "TZ",
      "runways": [
        {
          "id": "239362",
          "runway": "18/36",
          "thresholdA": [
            -6.21097994,
            39.22380066
          ],
          "thresholdB": [
            -6.2330699,
            39.22600174
          ],
          "headingA": 174.0,
          "headingB": 354.0,
          "lengthM": 3022.1,
          "widthM": 45.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "ZQN",
      "icao": "NZQN",
      "airport": "Queenstown Airport",
      "city": "Queenstown",
      "country": "NZ",
      "runways": [
        {
          "id": "238105",
          "runway": "05/23",
          "thresholdA": [
            -45.020123,
            168.734924
          ],
          "thresholdB": [
            -45.016441,
            168.758362
          ],
          "headingA": 76.0,
          "headingB": 256.0,
          "lengthM": 1891.0,
          "widthM": 45.1
        },
        {
          "id": "238107",
          "runway": "14/32",
          "thresholdA": [
            -45.017185,
            168.740906
          ],
          "thresholdB": [
            -45.024769,
            168.744568
          ],
          "headingA": 165.0,
          "headingB": 345.0,
          "lengthM": 890.0,
          "widthM": 10.1
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "ZRH",
      "icao": "LSZH",
      "airport": "Z\u00fcrich Airport",
      "city": "Zurich",
      "country": "CH",
      "runways": [
        {
          "id": "608308",
          "runway": "01H/19H",
          "thresholdA": [
            47.449333,
            8.54772
          ],
          "thresholdB": [
            47.451965,
            8.548985
          ],
          "headingA": null,
          "headingB": null,
          "lengthM": 307.8,
          "widthM": 27.7
        },
        {
          "id": "239120",
          "runway": "10/28",
          "thresholdA": [
            47.45890045,
            8.53746986
          ],
          "thresholdB": [
            47.45660019,
            8.57044983
          ],
          "headingA": 96.0,
          "headingB": 276.0,
          "lengthM": 2500.0,
          "widthM": 60.0
        },
        {
          "id": "239121",
          "runway": "14/32",
          "thresholdA": [
            47.483101,
            8.53473
          ],
          "thresholdB": [
            47.4613,
            8.56446
          ],
          "headingA": 137.0,
          "headingB": 317.0,
          "lengthM": 3300.1,
          "widthM": 60.0
        },
        {
          "id": "239122",
          "runway": "16/34",
          "thresholdA": [
            47.475601,
            8.53595
          ],
          "thresholdB": [
            47.4454,
            8.55673
          ],
          "headingA": 155.0,
          "headingB": 335.0,
          "lengthM": 3700.0,
          "widthM": 60.0
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": []
    },
    {
      "iata": "REK",
      "currentIata": "KEF",
      "icao": "BIKF",
      "airport": "Keflavik International Airport",
      "city": "Reykjavik",
      "country": "IS",
      "runways": [
        {
          "id": "236460",
          "runway": "01/19",
          "thresholdA": [
            63.964487,
            -22.605428
          ],
          "thresholdB": [
            63.99186,
            -22.605407
          ],
          "headingA": 14.0,
          "headingB": 194.0,
          "lengthM": 3054.1,
          "widthM": 60.0
        },
        {
          "id": "236461",
          "runway": "10/28",
          "thresholdA": [
            63.985026,
            -22.654977
          ],
          "thresholdB": [
            63.985031,
            -22.592365
          ],
          "headingA": 104.0,
          "headingB": 284.0,
          "lengthM": 3065.1,
          "widthM": 60.0
        }
      ],
      "gate": null,
      "taxiways": [],
      "taxilanes": [],
      "parkingPositions": [],
      "note": "REK is retained as the game's requested code; current IATA is KEF."
    }
  ],
  "missingIata": [],
  "groundDataStatus": {
    "runways": "real endpoint data from OurAirports runways.csv",
    "gates": "NOT populated; do not invent coordinates",
    "taxiways": "NOT populated; do not invent coordinates",
    "taxilanes": "NOT populated; do not invent coordinates",
    "parkingPositions": "NOT populated; do not invent coordinates"
  }
};
