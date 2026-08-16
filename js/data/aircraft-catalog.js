/* ================================================================
   Aircraft catalog — every purchasable aircraft type.
   ================================================================ */
/* ---------------- Aircraft catalog ---------------- */
const AIRCRAFT_CATALOG = [
  {
    id: 'atr72500',
    name: 'ATR 72-500',
    price: 4500000,
    rangeMin: 160,
    rangeMax: 430,
    serviceCost: 300000,
    seats: 77,
    fuelCostPerNM: 4, // $ burned per nautical mile flown, charged at takeoff
    blurb: 'Twin-turboprop regional airliner. Reliable short-haul workhorse. Seats around 77 passengers.',
  },
  {
    id: 'e175lr',
    name: 'Embraer E175LR',
    price: 18000000,
    rangeMin: 54,    // ~100 km
    rangeMax: 1998,  // ~3,700 km
    serviceCost: 900000,
    seats: 76,
    fuelCostPerNM: 3.47, // $ burned per nautical mile flown, charged at takeoff
    blurb: 'Regional jet with legs for it — flies routes from 100 km up to 3,700 km. Seats 76 passengers.',
    /* Aircraft-specific "good fare" anchor table (km -> $), used instead of
       the generic short-haul table since this plane's routes run much longer.
       Interpolated piecewise-linearly; extrapolated below 500 km / above
       3,700 km using the nearest segment's slope. */
    fareTable: {
      km:    [500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 2400, 2500, 2600, 2700, 2800, 2900, 3000, 3100, 3200, 3300, 3400, 3500, 3600, 3700],
      adult: [80,  90,  100, 110, 120, 130,  140,  150,  160,  170,  180,  190,  200,  210,  220,  230,  240,  250,  260,  270,  280,  290,  300,  310,  320,  330,  340,  350,  360,  370,  380,  390,  400],
      child: [60,  68,  75,  83,  90,  98,   105,  113,  120,  128,  135,  143,  150,  158,  165,  173,  180,  188,  195,  203,  210,  218,  225,  233,  240,  248,  255,  263,  270,  278,  285,  293,  300],
    },
  },
  {
    id: 'b738',
    name: 'Boeing 737-800',
    price: 45000000,
    rangeMin: 54,    // ~100 km
    rangeMax: 2916,  // ~5,400 km
    serviceCost: 2500000,
    seats: 184,
    baggageFee: 30, // $ default checked-bag fee for this aircraft
    blurb: 'Narrow-body workhorse for short- and medium-haul flying. Flies routes from 100 km up to 5,400 km. Seats 184 passengers.',
    /* Aircraft-specific "good fare" anchor table (km -> $), interpolated the
       same way as the E175LR's — extrapolated below 500 km / above 5,400 km
       using the nearest segment's slope. */
    fareTable: {
      km:    [500, 600, 700, 800, 900, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 5400],
      adult: [60,  70,  80,  90,  100, 110,  150,  190,  230,  270,  310,  350,  390,  430,  460],
      child: [45,  52,  60,  68,  75,  82,   112,  142,  172,  202,  232,  262,  292,  322,  345],
    },
    /* Fuel burn (km -> $), interpolated piecewise-linearly and charged at
       takeoff based on the leg's distance — this plane's burn rate isn't a
       flat $/NM, so it uses this table instead of fuelCostPerNM. */
    fuelTable: {
      km:   [100,  200,  300,  400,  500,  600,  700,  800,  900,  1000, 1100, 1200, 1300, 1400, 1500, 2000, 2500,  3000,  3500,  4000,  4500,  5000,  5400],
      cost: [1000, 1400, 1800, 2200, 2600, 3000, 3400, 3800, 4200, 4600, 5000, 5400, 5800, 6200, 6600, 8500, 10400, 12300, 14200, 16100, 18000, 19900, 21500],
    },
  },
  {
    id: 'a220300',
    name: 'Airbus A220-300',
    price: 50000000,
    rangeMin: 54,    // ~100 km
    rangeMax: 2970,  // ~5,500 km
    serviceCost: 2800000,
    seats: 155,
    baggageFee: 30, // $ default checked-bag fee for this aircraft
    blurb: 'Modern narrow-body twinjet. Seats 155 passengers with legs out to 5,500 km. Fuel must be purchased and paid for before the flight departs.',
    /* Aircraft-specific "good fare" anchor table (km -> $). The published
       schedule is perfectly linear (adult = 25 + 0.05 * km, child = adult -
       10), so two anchor points reproduce it exactly via interpolation and
       extrapolate the same way beyond 100-5,500 km. */
    fareTable: {
      km:    [100, 5500],
      adult: [30,  300],
      child: [20,  290],
    },
    /* Fuel burn (km -> $): 350 L per 100 km at $0.75/L = $2.625/km, a flat
       rate, so two anchor points reproduce the published table exactly.
       Charged at takeoff -- fuel must be purchased and paid for before the
       flight departs. */
    fuelTable: {
      km:   [100, 5500],
      cost: [263, 14438],
    },
  },
  {
    id: 'a321211',
    name: 'Airbus A321-211',
    price: 30000000,
    rangeMin: 54,    // ~100 km
    rangeMax: 3187,  // ~5,900 km
    serviceCost: 1700000,
    seats: 210,
    baggageFee: 30, // $ default checked-bag fee for this aircraft
    blurb: 'Stretched single-aisle Airbus workhorse. Seats 210 passengers with legs out to 5,900 km.',
    /* Aircraft-specific "good fare" anchor table (km -> $), straight from
       the published schedule (100 km increments, so interpolation only
       ever fills in gaps this file's own increments won't hit) — child
       fares don't follow a clean formula off the adult ones, so every
       published point is included rather than reduced to a couple of
       anchors. Extrapolated below 100 km / above 5,900 km using the
       nearest segment's slope. */
    fareTable: {
      km: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 2400, 2500, 2600, 2700, 2800, 2900, 3000, 3100, 3200, 3300, 3400, 3500, 3600, 3700, 3800, 3900, 4000, 4100, 4200, 4300, 4400, 4500, 4600, 4700, 4800, 4900, 5000, 5100, 5200, 5300, 5400, 5500, 5600, 5700, 5800, 5900],
      adult: [30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150, 155, 160, 165, 170, 175, 180, 185, 190, 195, 200, 205, 210, 215, 220, 225, 230, 235, 240, 245, 250, 255, 260, 265, 270, 275, 280, 285, 290, 295, 300, 305, 310, 315, 320],
      child: [25, 30, 34, 38, 42, 47, 51, 55, 60, 64, 68, 72, 77, 81, 85, 89, 94, 98, 102, 106, 111, 115, 119, 123, 128, 132, 136, 140, 145, 149, 153, 157, 162, 166, 170, 174, 179, 183, 187, 191, 196, 200, 204, 208, 213, 217, 221, 225, 230, 234, 238, 242, 247, 251, 255, 259, 264, 268, 272],
    },
    /* Fuel burn (km -> $), straight from the published schedule — a flat
       18 €/km throughout, so these anchor points reproduce every
       intermediate value exactly via interpolation. Charged at takeoff. */
    fuelTable: {
      km:   [100,  200,  300,  400,  500,  600,   700,   800,   900,   1000,  1500,  2000,  2500,  3000,  3500,  4000,  4500,  5000,  5500,  5900],
      cost: [1800, 3600, 5400, 7200, 9000, 10800, 12600, 14400, 16200, 18000, 27000, 36000, 45000, 54000, 63000, 72000, 81000, 90000, 99000, 106200],
    },
  },
  {
    id: 'a350900',
    name: 'Airbus A350-900',
    price: 350000000,
    rangeMin: 54,    // ~100 km
    rangeMax: 8099,  // ~15,000 km
    serviceCost: 19000000,
    seats: 350,
    baggageFee: 30, // $ default checked-bag fee for this aircraft
    blurb: 'Long-haul wide-body twinjet. Seats 350 passengers with legs out to 15,000 km — flies pretty much anywhere on the map.',
    /* Aircraft-specific "good fare" anchor table (km -> $): uses the exact
       same per-km pricing system as the A321-211 (per spec), so the first
       59 points (100-5,900 km) are identical to that aircraft's own
       table. Beyond that — this plane's range goes much farther — the
       same underlying formula continues: adult = 25 + 0.05*km (exactly
       reproduces every published point, including the A321's), and child
       = round(0.85 * adult) (verified exactly against all four spot
       prices given: 1,000/5,000/10,000/15,000 km). Extended in 100 km
       increments the same way the rest of the table already was. */
    fareTable: {
      km: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 2400, 2500, 2600, 2700, 2800, 2900, 3000, 3100, 3200, 3300, 3400, 3500, 3600, 3700, 3800, 3900, 4000, 4100, 4200, 4300, 4400, 4500, 4600, 4700, 4800, 4900, 5000, 5100, 5200, 5300, 5400, 5500, 5600, 5700, 5800, 5900, 6000, 6100, 6200, 6300, 6400, 6500, 6600, 6700, 6800, 6900, 7000, 7100, 7200, 7300, 7400, 7500, 7600, 7700, 7800, 7900, 8000, 8100, 8200, 8300, 8400, 8500, 8600, 8700, 8800, 8900, 9000, 9100, 9200, 9300, 9400, 9500, 9600, 9700, 9800, 9900, 10000, 10100, 10200, 10300, 10400, 10500, 10600, 10700, 10800, 10900, 11000, 11100, 11200, 11300, 11400, 11500, 11600, 11700, 11800, 11900, 12000, 12100, 12200, 12300, 12400, 12500, 12600, 12700, 12800, 12900, 13000, 13100, 13200, 13300, 13400, 13500, 13600, 13700, 13800, 13900, 14000, 14100, 14200, 14300, 14400, 14500, 14600, 14700, 14800, 14900, 15000],
      adult: [30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150, 155, 160, 165, 170, 175, 180, 185, 190, 195, 200, 205, 210, 215, 220, 225, 230, 235, 240, 245, 250, 255, 260, 265, 270, 275, 280, 285, 290, 295, 300, 305, 310, 315, 320, 325, 330, 335, 340, 345, 350, 355, 360, 365, 370, 375, 380, 385, 390, 395, 400, 405, 410, 415, 420, 425, 430, 435, 440, 445, 450, 455, 460, 465, 470, 475, 480, 485, 490, 495, 500, 505, 510, 515, 520, 525, 530, 535, 540, 545, 550, 555, 560, 565, 570, 575, 580, 585, 590, 595, 600, 605, 610, 615, 620, 625, 630, 635, 640, 645, 650, 655, 660, 665, 670, 675, 680, 685, 690, 695, 700, 705, 710, 715, 720, 725, 730, 735, 740, 745, 750, 755, 760, 765, 770, 775],
      child: [25, 30, 34, 38, 42, 47, 51, 55, 60, 64, 68, 72, 77, 81, 85, 89, 94, 98, 102, 106, 111, 115, 119, 123, 128, 132, 136, 140, 145, 149, 153, 157, 162, 166, 170, 174, 179, 183, 187, 191, 196, 200, 204, 208, 213, 217, 221, 225, 230, 234, 238, 242, 247, 251, 255, 259, 264, 268, 272, 276, 281, 285, 289, 293, 298, 302, 306, 310, 315, 319, 323, 327, 332, 336, 340, 344, 349, 353, 357, 361, 366, 370, 374, 378, 383, 387, 391, 395, 400, 404, 408, 412, 417, 421, 425, 429, 434, 438, 442, 446, 451, 455, 459, 463, 468, 472, 476, 480, 485, 489, 493, 497, 502, 506, 510, 514, 519, 523, 527, 531, 536, 540, 544, 548, 553, 557, 561, 565, 570, 574, 578, 582, 587, 591, 595, 599, 604, 608, 612, 616, 621, 625, 629, 633, 638, 642, 646, 650, 655, 659],
    },
    /* Fuel burn (km -> $), straight from the published schedule — a flat
       36 €/km throughout, so two anchor points reproduce every published
       value exactly via interpolation. Charged at takeoff. */
    fuelTable: {
      km:   [100,  15000],
      cost: [3600, 540000],
    },
  },
  {
    id: 'b757200',
    name: 'Boeing 757-200',
    price: 30000000,
    rangeMin: 54,    // ~100 km
    rangeMax: 3889,
    serviceCost: 1650000,
    seats: 200,
    baggageFee: 30, // $ default checked-bag fee for this aircraft
    blurb: 'Boeing 757-200 — seats 200 passengers with legs out to 7,200 km.',
    /* Aircraft-specific "good fare" anchor table (km -> $): uses the exact
       same per-km pricing system as the A321-211 / A350-900 (per spec) —
       the 100-5,900 km range is byte-for-byte identical to those two
       aircraft's own tables, extended out to this plane's own range using
       the same formula (adult = 25 + 0.05*km, child = round(0.85*adult)),
       verified against every published spot-price for this aircraft. */
    fareTable: {
      km: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 2400, 2500, 2600, 2700, 2800, 2900, 3000, 3100, 3200, 3300, 3400, 3500, 3600, 3700, 3800, 3900, 4000, 4100, 4200, 4300, 4400, 4500, 4600, 4700, 4800, 4900, 5000, 5100, 5200, 5300, 5400, 5500, 5600, 5700, 5800, 5900, 6000, 6100, 6200, 6300, 6400, 6500, 6600, 6700, 6800, 6900, 7000, 7100, 7200],
      adult: [30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150, 155, 160, 165, 170, 175, 180, 185, 190, 195, 200, 205, 210, 215, 220, 225, 230, 235, 240, 245, 250, 255, 260, 265, 270, 275, 280, 285, 290, 295, 300, 305, 310, 315, 320, 325, 330, 335, 340, 345, 350, 355, 360, 365, 370, 375, 380, 385],
      child: [25, 30, 34, 38, 42, 47, 51, 55, 60, 64, 68, 72, 77, 81, 85, 89, 94, 98, 102, 106, 111, 115, 119, 123, 128, 132, 136, 140, 145, 149, 153, 157, 162, 166, 170, 174, 179, 183, 187, 191, 196, 200, 204, 208, 213, 217, 221, 225, 230, 234, 238, 242, 247, 251, 255, 259, 264, 268, 272, 276, 281, 285, 289, 293, 298, 302, 306, 310, 315, 319, 323, 327],
    },
    /* Fuel burn (km -> $), straight from the published schedule — a flat
       20 €/km throughout, so two anchor points reproduce every
       published value exactly via interpolation. Charged at takeoff. */
    fuelTable: {
      km:   [100, 7200],
      cost: [2000, 144000],
    },
  },
  {
    id: 'b777222',
    name: 'Boeing 777-222',
    price: 150000000,
    rangeMin: 54,    // ~100 km
    rangeMax: 5238,
    serviceCost: 8250000,
    seats: 305,
    baggageFee: 30, // $ default checked-bag fee for this aircraft
    blurb: 'Boeing 777-222 — seats 305 passengers with legs out to 9,700 km.',
    /* Aircraft-specific "good fare" anchor table (km -> $): uses the exact
       same per-km pricing system as the A321-211 / A350-900 (per spec) —
       the 100-5,900 km range is byte-for-byte identical to those two
       aircraft's own tables, extended out to this plane's own range using
       the same formula (adult = 25 + 0.05*km, child = round(0.85*adult)),
       verified against every published spot-price for this aircraft. */
    fareTable: {
      km: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 2400, 2500, 2600, 2700, 2800, 2900, 3000, 3100, 3200, 3300, 3400, 3500, 3600, 3700, 3800, 3900, 4000, 4100, 4200, 4300, 4400, 4500, 4600, 4700, 4800, 4900, 5000, 5100, 5200, 5300, 5400, 5500, 5600, 5700, 5800, 5900, 6000, 6100, 6200, 6300, 6400, 6500, 6600, 6700, 6800, 6900, 7000, 7100, 7200, 7300, 7400, 7500, 7600, 7700, 7800, 7900, 8000, 8100, 8200, 8300, 8400, 8500, 8600, 8700, 8800, 8900, 9000, 9100, 9200, 9300, 9400, 9500, 9600, 9700],
      adult: [30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150, 155, 160, 165, 170, 175, 180, 185, 190, 195, 200, 205, 210, 215, 220, 225, 230, 235, 240, 245, 250, 255, 260, 265, 270, 275, 280, 285, 290, 295, 300, 305, 310, 315, 320, 325, 330, 335, 340, 345, 350, 355, 360, 365, 370, 375, 380, 385, 390, 395, 400, 405, 410, 415, 420, 425, 430, 435, 440, 445, 450, 455, 460, 465, 470, 475, 480, 485, 490, 495, 500, 505, 510],
      child: [25, 30, 34, 38, 42, 47, 51, 55, 60, 64, 68, 72, 77, 81, 85, 89, 94, 98, 102, 106, 111, 115, 119, 123, 128, 132, 136, 140, 145, 149, 153, 157, 162, 166, 170, 174, 179, 183, 187, 191, 196, 200, 204, 208, 213, 217, 221, 225, 230, 234, 238, 242, 247, 251, 255, 259, 264, 268, 272, 276, 281, 285, 289, 293, 298, 302, 306, 310, 315, 319, 323, 327, 332, 336, 340, 344, 349, 353, 357, 361, 366, 370, 374, 378, 383, 387, 391, 395, 400, 404, 408, 412, 417, 421, 425, 429, 434],
    },
    /* Fuel burn (km -> $), straight from the published schedule — a flat
       40 €/km throughout, so two anchor points reproduce every
       published value exactly via interpolation. Charged at takeoff. */
    fuelTable: {
      km:   [100, 9700],
      cost: [4000, 388000],
    },
  },
  {
    id: 'b747400',
    name: 'Boeing 747-400',
    price: 100000000,
    rangeMin: 54,    // ~100 km
    rangeMax: 7289,
    serviceCost: 5500000,
    seats: 416,
    baggageFee: 30, // $ default checked-bag fee for this aircraft
    blurb: 'Boeing 747-400 — seats 416 passengers with legs out to 13,500 km.',
    /* Aircraft-specific "good fare" anchor table (km -> $): uses the exact
       same per-km pricing system as the A321-211 / A350-900 (per spec) —
       the 100-5,900 km range is byte-for-byte identical to those two
       aircraft's own tables, extended out to this plane's own range using
       the same formula (adult = 25 + 0.05*km, child = round(0.85*adult)),
       verified against every published spot-price for this aircraft. */
    fareTable: {
      km: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 2400, 2500, 2600, 2700, 2800, 2900, 3000, 3100, 3200, 3300, 3400, 3500, 3600, 3700, 3800, 3900, 4000, 4100, 4200, 4300, 4400, 4500, 4600, 4700, 4800, 4900, 5000, 5100, 5200, 5300, 5400, 5500, 5600, 5700, 5800, 5900, 6000, 6100, 6200, 6300, 6400, 6500, 6600, 6700, 6800, 6900, 7000, 7100, 7200, 7300, 7400, 7500, 7600, 7700, 7800, 7900, 8000, 8100, 8200, 8300, 8400, 8500, 8600, 8700, 8800, 8900, 9000, 9100, 9200, 9300, 9400, 9500, 9600, 9700, 9800, 9900, 10000, 10100, 10200, 10300, 10400, 10500, 10600, 10700, 10800, 10900, 11000, 11100, 11200, 11300, 11400, 11500, 11600, 11700, 11800, 11900, 12000, 12100, 12200, 12300, 12400, 12500, 12600, 12700, 12800, 12900, 13000, 13100, 13200, 13300, 13400, 13500],
      adult: [30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150, 155, 160, 165, 170, 175, 180, 185, 190, 195, 200, 205, 210, 215, 220, 225, 230, 235, 240, 245, 250, 255, 260, 265, 270, 275, 280, 285, 290, 295, 300, 305, 310, 315, 320, 325, 330, 335, 340, 345, 350, 355, 360, 365, 370, 375, 380, 385, 390, 395, 400, 405, 410, 415, 420, 425, 430, 435, 440, 445, 450, 455, 460, 465, 470, 475, 480, 485, 490, 495, 500, 505, 510, 515, 520, 525, 530, 535, 540, 545, 550, 555, 560, 565, 570, 575, 580, 585, 590, 595, 600, 605, 610, 615, 620, 625, 630, 635, 640, 645, 650, 655, 660, 665, 670, 675, 680, 685, 690, 695, 700],
      child: [25, 30, 34, 38, 42, 47, 51, 55, 60, 64, 68, 72, 77, 81, 85, 89, 94, 98, 102, 106, 111, 115, 119, 123, 128, 132, 136, 140, 145, 149, 153, 157, 162, 166, 170, 174, 179, 183, 187, 191, 196, 200, 204, 208, 213, 217, 221, 225, 230, 234, 238, 242, 247, 251, 255, 259, 264, 268, 272, 276, 281, 285, 289, 293, 298, 302, 306, 310, 315, 319, 323, 327, 332, 336, 340, 344, 349, 353, 357, 361, 366, 370, 374, 378, 383, 387, 391, 395, 400, 404, 408, 412, 417, 421, 425, 429, 434, 438, 442, 446, 451, 455, 459, 463, 468, 472, 476, 480, 485, 489, 493, 497, 502, 506, 510, 514, 519, 523, 527, 531, 536, 540, 544, 548, 553, 557, 561, 565, 570, 574, 578, 582, 587, 591, 595],
    },
    /* Fuel burn (km -> $), straight from the published schedule — a flat
       50 €/km throughout, so two anchor points reproduce every
       published value exactly via interpolation. Charged at takeoff. */
    fuelTable: {
      km:   [100, 13500],
      cost: [5000, 675000],
    },
  },
  {
    id: 'a340600',
    name: 'Airbus A340-600',
    price: 180000000,
    rangeMin: 54,    // ~100 km
    rangeMax: 7505,
    serviceCost: 9900000,
    seats: 380,
    baggageFee: 30, // $ default checked-bag fee for this aircraft
    blurb: 'Airbus A340-600 — seats 380 passengers with legs out to 13,900 km.',
    /* Aircraft-specific "good fare" anchor table (km -> $): uses the exact
       same per-km pricing system as the A321-211 / A350-900 (per spec) —
       the 100-5,900 km range is byte-for-byte identical to those two
       aircraft's own tables, extended out to this plane's own range using
       the same formula (adult = 25 + 0.05*km, child = round(0.85*adult)),
       verified against every published spot-price for this aircraft. */
    fareTable: {
      km: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 2400, 2500, 2600, 2700, 2800, 2900, 3000, 3100, 3200, 3300, 3400, 3500, 3600, 3700, 3800, 3900, 4000, 4100, 4200, 4300, 4400, 4500, 4600, 4700, 4800, 4900, 5000, 5100, 5200, 5300, 5400, 5500, 5600, 5700, 5800, 5900, 6000, 6100, 6200, 6300, 6400, 6500, 6600, 6700, 6800, 6900, 7000, 7100, 7200, 7300, 7400, 7500, 7600, 7700, 7800, 7900, 8000, 8100, 8200, 8300, 8400, 8500, 8600, 8700, 8800, 8900, 9000, 9100, 9200, 9300, 9400, 9500, 9600, 9700, 9800, 9900, 10000, 10100, 10200, 10300, 10400, 10500, 10600, 10700, 10800, 10900, 11000, 11100, 11200, 11300, 11400, 11500, 11600, 11700, 11800, 11900, 12000, 12100, 12200, 12300, 12400, 12500, 12600, 12700, 12800, 12900, 13000, 13100, 13200, 13300, 13400, 13500, 13600, 13700, 13800, 13900],
      adult: [30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150, 155, 160, 165, 170, 175, 180, 185, 190, 195, 200, 205, 210, 215, 220, 225, 230, 235, 240, 245, 250, 255, 260, 265, 270, 275, 280, 285, 290, 295, 300, 305, 310, 315, 320, 325, 330, 335, 340, 345, 350, 355, 360, 365, 370, 375, 380, 385, 390, 395, 400, 405, 410, 415, 420, 425, 430, 435, 440, 445, 450, 455, 460, 465, 470, 475, 480, 485, 490, 495, 500, 505, 510, 515, 520, 525, 530, 535, 540, 545, 550, 555, 560, 565, 570, 575, 580, 585, 590, 595, 600, 605, 610, 615, 620, 625, 630, 635, 640, 645, 650, 655, 660, 665, 670, 675, 680, 685, 690, 695, 700, 705, 710, 715, 720],
      child: [25, 30, 34, 38, 42, 47, 51, 55, 60, 64, 68, 72, 77, 81, 85, 89, 94, 98, 102, 106, 111, 115, 119, 123, 128, 132, 136, 140, 145, 149, 153, 157, 162, 166, 170, 174, 179, 183, 187, 191, 196, 200, 204, 208, 213, 217, 221, 225, 230, 234, 238, 242, 247, 251, 255, 259, 264, 268, 272, 276, 281, 285, 289, 293, 298, 302, 306, 310, 315, 319, 323, 327, 332, 336, 340, 344, 349, 353, 357, 361, 366, 370, 374, 378, 383, 387, 391, 395, 400, 404, 408, 412, 417, 421, 425, 429, 434, 438, 442, 446, 451, 455, 459, 463, 468, 472, 476, 480, 485, 489, 493, 497, 502, 506, 510, 514, 519, 523, 527, 531, 536, 540, 544, 548, 553, 557, 561, 565, 570, 574, 578, 582, 587, 591, 595, 599, 604, 608, 612],
    },
    /* Fuel burn (km -> $), straight from the published schedule — a flat
       48 €/km throughout, so two anchor points reproduce every
       published value exactly via interpolation. Charged at takeoff. */
    fuelTable: {
      km:   [100, 13900],
      cost: [4800, 667200],
    },
  },
  {
    id: 'a380800',
    name: 'Airbus A380-800',
    price: 250000000,
    rangeMin: 54,    // ~100 km
    rangeMax: 8207,
    serviceCost: 13750000,
    seats: 500,
    baggageFee: 30, // $ default checked-bag fee for this aircraft
    blurb: 'Airbus A380-800 — seats 500 passengers with legs out to 15,200 km.',
    /* Aircraft-specific "good fare" anchor table (km -> $): uses the exact
       same per-km pricing system as the A321-211 / A350-900 (per spec) —
       the 100-5,900 km range is byte-for-byte identical to those two
       aircraft's own tables, extended out to this plane's own range using
       the same formula (adult = 25 + 0.05*km, child = round(0.85*adult)),
       verified against every published spot-price for this aircraft. */
    fareTable: {
      km: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 2400, 2500, 2600, 2700, 2800, 2900, 3000, 3100, 3200, 3300, 3400, 3500, 3600, 3700, 3800, 3900, 4000, 4100, 4200, 4300, 4400, 4500, 4600, 4700, 4800, 4900, 5000, 5100, 5200, 5300, 5400, 5500, 5600, 5700, 5800, 5900, 6000, 6100, 6200, 6300, 6400, 6500, 6600, 6700, 6800, 6900, 7000, 7100, 7200, 7300, 7400, 7500, 7600, 7700, 7800, 7900, 8000, 8100, 8200, 8300, 8400, 8500, 8600, 8700, 8800, 8900, 9000, 9100, 9200, 9300, 9400, 9500, 9600, 9700, 9800, 9900, 10000, 10100, 10200, 10300, 10400, 10500, 10600, 10700, 10800, 10900, 11000, 11100, 11200, 11300, 11400, 11500, 11600, 11700, 11800, 11900, 12000, 12100, 12200, 12300, 12400, 12500, 12600, 12700, 12800, 12900, 13000, 13100, 13200, 13300, 13400, 13500, 13600, 13700, 13800, 13900, 14000, 14100, 14200, 14300, 14400, 14500, 14600, 14700, 14800, 14900, 15000, 15100, 15200],
      adult: [30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150, 155, 160, 165, 170, 175, 180, 185, 190, 195, 200, 205, 210, 215, 220, 225, 230, 235, 240, 245, 250, 255, 260, 265, 270, 275, 280, 285, 290, 295, 300, 305, 310, 315, 320, 325, 330, 335, 340, 345, 350, 355, 360, 365, 370, 375, 380, 385, 390, 395, 400, 405, 410, 415, 420, 425, 430, 435, 440, 445, 450, 455, 460, 465, 470, 475, 480, 485, 490, 495, 500, 505, 510, 515, 520, 525, 530, 535, 540, 545, 550, 555, 560, 565, 570, 575, 580, 585, 590, 595, 600, 605, 610, 615, 620, 625, 630, 635, 640, 645, 650, 655, 660, 665, 670, 675, 680, 685, 690, 695, 700, 705, 710, 715, 720, 725, 730, 735, 740, 745, 750, 755, 760, 765, 770, 775, 780, 785],
      child: [25, 30, 34, 38, 42, 47, 51, 55, 60, 64, 68, 72, 77, 81, 85, 89, 94, 98, 102, 106, 111, 115, 119, 123, 128, 132, 136, 140, 145, 149, 153, 157, 162, 166, 170, 174, 179, 183, 187, 191, 196, 200, 204, 208, 213, 217, 221, 225, 230, 234, 238, 242, 247, 251, 255, 259, 264, 268, 272, 276, 281, 285, 289, 293, 298, 302, 306, 310, 315, 319, 323, 327, 332, 336, 340, 344, 349, 353, 357, 361, 366, 370, 374, 378, 383, 387, 391, 395, 400, 404, 408, 412, 417, 421, 425, 429, 434, 438, 442, 446, 451, 455, 459, 463, 468, 472, 476, 480, 485, 489, 493, 497, 502, 506, 510, 514, 519, 523, 527, 531, 536, 540, 544, 548, 553, 557, 561, 565, 570, 574, 578, 582, 587, 591, 595, 599, 604, 608, 612, 616, 621, 625, 629, 633, 638, 642, 646, 650, 655, 659, 663, 667],
    },
    /* Fuel burn (km -> $), straight from the published schedule — a flat
       55 €/km throughout, so two anchor points reproduce every
       published value exactly via interpolation. Charged at takeoff. */
    fuelTable: {
      km:   [100, 15200],
      cost: [5500, 836000],
    },
  },
  {
    id: 'erj145',
    name: 'Embraer ERJ-145',
    price: 10000000,
    rangeMin: 54,    // ~100 km
    rangeMax: 1566,
    serviceCost: 550000,
    seats: 50,
    baggageFee: 30, // $ default checked-bag fee for this aircraft
    blurb: 'Embraer ERJ-145 — seats 50 passengers with legs out to 2,900 km.',
    /* Aircraft-specific "good fare" anchor table (km -> $): uses the exact
       same per-km pricing system as the A321-211 / A350-900 (per spec) —
       the overlapping range is byte-for-byte identical to those aircraft's
       own tables, extended (if this plane's range exceeds 5,900 km) using
       the same formula (adult = 25 + 0.05*km, child = round(0.85*adult)),
       verified against every published spot-price for this aircraft. */
    fareTable: {
      km: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 2400, 2500, 2600, 2700, 2800, 2900],
      adult: [30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150, 155, 160, 165, 170],
      child: [25, 30, 34, 38, 42, 47, 51, 55, 60, 64, 68, 72, 77, 81, 85, 89, 94, 98, 102, 106, 111, 115, 119, 123, 128, 132, 136, 140, 145],
    },
    /* Fuel burn (km -> $), straight from the published schedule — a flat
       9 €/km throughout, so two anchor points reproduce every
       published value exactly via interpolation. Charged at takeoff. */
    fuelTable: {
      km:   [100, 2900],
      cost: [900, 26100],
    },
  },
  {
    id: 'b789',
    name: 'Boeing 787-9 Dreamliner',
    price: 290000000,
    rangeMin: 54,    // ~100 km
    rangeMax: 7559,
    serviceCost: 16000000,
    seats: 296,
    baggageFee: 30, // $ default checked-bag fee for this aircraft
    blurb: 'Boeing 787-9 Dreamliner — seats 296 passengers with legs out to 14,000 km.',
    /* Aircraft-specific "good fare" anchor table (km -> $): uses the exact
       same per-km pricing system as the A321-211 / A350-900 (per spec) —
       the overlapping range is byte-for-byte identical to those aircraft's
       own tables, extended (if this plane's range exceeds 5,900 km) using
       the same formula (adult = 25 + 0.05*km, child = round(0.85*adult)),
       verified against every published spot-price for this aircraft. */
    fareTable: {
      km: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 2400, 2500, 2600, 2700, 2800, 2900, 3000, 3100, 3200, 3300, 3400, 3500, 3600, 3700, 3800, 3900, 4000, 4100, 4200, 4300, 4400, 4500, 4600, 4700, 4800, 4900, 5000, 5100, 5200, 5300, 5400, 5500, 5600, 5700, 5800, 5900, 6000, 6100, 6200, 6300, 6400, 6500, 6600, 6700, 6800, 6900, 7000, 7100, 7200, 7300, 7400, 7500, 7600, 7700, 7800, 7900, 8000, 8100, 8200, 8300, 8400, 8500, 8600, 8700, 8800, 8900, 9000, 9100, 9200, 9300, 9400, 9500, 9600, 9700, 9800, 9900, 10000, 10100, 10200, 10300, 10400, 10500, 10600, 10700, 10800, 10900, 11000, 11100, 11200, 11300, 11400, 11500, 11600, 11700, 11800, 11900, 12000, 12100, 12200, 12300, 12400, 12500, 12600, 12700, 12800, 12900, 13000, 13100, 13200, 13300, 13400, 13500, 13600, 13700, 13800, 13900, 14000],
      adult: [30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150, 155, 160, 165, 170, 175, 180, 185, 190, 195, 200, 205, 210, 215, 220, 225, 230, 235, 240, 245, 250, 255, 260, 265, 270, 275, 280, 285, 290, 295, 300, 305, 310, 315, 320, 325, 330, 335, 340, 345, 350, 355, 360, 365, 370, 375, 380, 385, 390, 395, 400, 405, 410, 415, 420, 425, 430, 435, 440, 445, 450, 455, 460, 465, 470, 475, 480, 485, 490, 495, 500, 505, 510, 515, 520, 525, 530, 535, 540, 545, 550, 555, 560, 565, 570, 575, 580, 585, 590, 595, 600, 605, 610, 615, 620, 625, 630, 635, 640, 645, 650, 655, 660, 665, 670, 675, 680, 685, 690, 695, 700, 705, 710, 715, 720, 725],
      child: [25, 30, 34, 38, 42, 47, 51, 55, 60, 64, 68, 72, 77, 81, 85, 89, 94, 98, 102, 106, 111, 115, 119, 123, 128, 132, 136, 140, 145, 149, 153, 157, 162, 166, 170, 174, 179, 183, 187, 191, 196, 200, 204, 208, 213, 217, 221, 225, 230, 234, 238, 242, 247, 251, 255, 259, 264, 268, 272, 276, 281, 285, 289, 293, 298, 302, 306, 310, 315, 319, 323, 327, 332, 336, 340, 344, 349, 353, 357, 361, 366, 370, 374, 378, 383, 387, 391, 395, 400, 404, 408, 412, 417, 421, 425, 429, 434, 438, 442, 446, 451, 455, 459, 463, 468, 472, 476, 480, 485, 489, 493, 497, 502, 506, 510, 514, 519, 523, 527, 531, 536, 540, 544, 548, 553, 557, 561, 565, 570, 574, 578, 582, 587, 591, 595, 599, 604, 608, 612, 616],
    },
    /* Fuel burn (km -> $), straight from the published schedule — a flat
       32 €/km throughout, so two anchor points reproduce every
       published value exactly via interpolation. Charged at takeoff. */
    fuelTable: {
      km:   [100, 14000],
      cost: [3200, 448000],
    },
  },
  {
    id: 'a319100',
    name: 'Airbus A319-100',
    price: 25000000,
    rangeMin: 54,    // ~100 km
    rangeMax: 3618,
    serviceCost: 1400000,
    seats: 156,
    baggageFee: 30, // $ default checked-bag fee for this aircraft
    blurb: 'Airbus A319-100 — seats 156 passengers with legs out to 6,700 km.',
    /* Aircraft-specific "good fare" anchor table (km -> $): uses the exact
       same per-km pricing system as the A321-211 / A350-900 (per spec) —
       the overlapping range is byte-for-byte identical to those aircraft's
       own tables, extended (if this plane's range exceeds 5,900 km) using
       the same formula (adult = 25 + 0.05*km, child = round(0.85*adult)),
       verified against every published spot-price for this aircraft. */
    fareTable: {
      km: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 2400, 2500, 2600, 2700, 2800, 2900, 3000, 3100, 3200, 3300, 3400, 3500, 3600, 3700, 3800, 3900, 4000, 4100, 4200, 4300, 4400, 4500, 4600, 4700, 4800, 4900, 5000, 5100, 5200, 5300, 5400, 5500, 5600, 5700, 5800, 5900, 6000, 6100, 6200, 6300, 6400, 6500, 6600, 6700],
      adult: [30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150, 155, 160, 165, 170, 175, 180, 185, 190, 195, 200, 205, 210, 215, 220, 225, 230, 235, 240, 245, 250, 255, 260, 265, 270, 275, 280, 285, 290, 295, 300, 305, 310, 315, 320, 325, 330, 335, 340, 345, 350, 355, 360],
      child: [25, 30, 34, 38, 42, 47, 51, 55, 60, 64, 68, 72, 77, 81, 85, 89, 94, 98, 102, 106, 111, 115, 119, 123, 128, 132, 136, 140, 145, 149, 153, 157, 162, 166, 170, 174, 179, 183, 187, 191, 196, 200, 204, 208, 213, 217, 221, 225, 230, 234, 238, 242, 247, 251, 255, 259, 264, 268, 272, 276, 281, 285, 289, 293, 298, 302, 306],
    },
    /* Fuel burn (km -> $), straight from the published schedule — a flat
       15 €/km throughout, so two anchor points reproduce every
       published value exactly via interpolation. Charged at takeoff. */
    fuelTable: {
      km:   [100, 6700],
      cost: [1500, 100500],
    },
  },
  {
    id: 'a321neo',
    name: 'Airbus A321neo',
    price: 50000000,
    rangeMin: 54,    // ~100 km
    rangeMax: 3996,
    serviceCost: 2800000,
    seats: 220,
    baggageFee: 30, // $ default checked-bag fee for this aircraft
    blurb: 'Airbus A321neo — seats 220 passengers with legs out to 7,400 km.',
    /* Aircraft-specific "good fare" anchor table (km -> $): uses the exact
       same per-km pricing system as the A321-211 / A350-900 (per spec) —
       the overlapping range is byte-for-byte identical to those aircraft's
       own tables, extended (if this plane's range exceeds 5,900 km) using
       the same formula (adult = 25 + 0.05*km, child = round(0.85*adult)),
       verified against every published spot-price for this aircraft. */
    fareTable: {
      km: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 2400, 2500, 2600, 2700, 2800, 2900, 3000, 3100, 3200, 3300, 3400, 3500, 3600, 3700, 3800, 3900, 4000, 4100, 4200, 4300, 4400, 4500, 4600, 4700, 4800, 4900, 5000, 5100, 5200, 5300, 5400, 5500, 5600, 5700, 5800, 5900, 6000, 6100, 6200, 6300, 6400, 6500, 6600, 6700, 6800, 6900, 7000, 7100, 7200, 7300, 7400],
      adult: [30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150, 155, 160, 165, 170, 175, 180, 185, 190, 195, 200, 205, 210, 215, 220, 225, 230, 235, 240, 245, 250, 255, 260, 265, 270, 275, 280, 285, 290, 295, 300, 305, 310, 315, 320, 325, 330, 335, 340, 345, 350, 355, 360, 365, 370, 375, 380, 385, 390, 395],
      child: [25, 30, 34, 38, 42, 47, 51, 55, 60, 64, 68, 72, 77, 81, 85, 89, 94, 98, 102, 106, 111, 115, 119, 123, 128, 132, 136, 140, 145, 149, 153, 157, 162, 166, 170, 174, 179, 183, 187, 191, 196, 200, 204, 208, 213, 217, 221, 225, 230, 234, 238, 242, 247, 251, 255, 259, 264, 268, 272, 276, 281, 285, 289, 293, 298, 302, 306, 310, 315, 319, 323, 327, 332, 336],
    },
    /* Fuel burn (km -> $), straight from the published schedule — a flat
       15 €/km throughout, so two anchor points reproduce every
       published value exactly via interpolation. Charged at takeoff. */
    fuelTable: {
      km:   [100, 7400],
      cost: [1500, 111000],
    },
  },
  {
    id: 'b739er',
    name: 'Boeing 737-900ER',
    price: 45000000,
    rangeMin: 54,    // ~100 km
    rangeMax: 3187,
    serviceCost: 2500000,
    seats: 220,
    baggageFee: 30, // $ default checked-bag fee for this aircraft
    blurb: 'Boeing 737-900ER — seats 220 passengers with legs out to 5,900 km.',
    /* Aircraft-specific "good fare" anchor table (km -> $): uses the exact
       same per-km pricing system as the A321-211 / A350-900 (per spec) —
       the overlapping range is byte-for-byte identical to those aircraft's
       own tables, extended (if this plane's range exceeds 5,900 km) using
       the same formula (adult = 25 + 0.05*km, child = round(0.85*adult)),
       verified against every published spot-price for this aircraft. */
    fareTable: {
      km: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 2400, 2500, 2600, 2700, 2800, 2900, 3000, 3100, 3200, 3300, 3400, 3500, 3600, 3700, 3800, 3900, 4000, 4100, 4200, 4300, 4400, 4500, 4600, 4700, 4800, 4900, 5000, 5100, 5200, 5300, 5400, 5500, 5600, 5700, 5800, 5900],
      adult: [30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150, 155, 160, 165, 170, 175, 180, 185, 190, 195, 200, 205, 210, 215, 220, 225, 230, 235, 240, 245, 250, 255, 260, 265, 270, 275, 280, 285, 290, 295, 300, 305, 310, 315, 320],
      child: [25, 30, 34, 38, 42, 47, 51, 55, 60, 64, 68, 72, 77, 81, 85, 89, 94, 98, 102, 106, 111, 115, 119, 123, 128, 132, 136, 140, 145, 149, 153, 157, 162, 166, 170, 174, 179, 183, 187, 191, 196, 200, 204, 208, 213, 217, 221, 225, 230, 234, 238, 242, 247, 251, 255, 259, 264, 268, 272],
    },
    /* Fuel burn (km -> $), straight from the published schedule — a flat
       16 €/km throughout, so two anchor points reproduce every
       published value exactly via interpolation. Charged at takeoff. */
    fuelTable: {
      km:   [100, 5900],
      cost: [1600, 94400],
    },
  },
];

function getAircraftType(id) {
  return AIRCRAFT_CATALOG.find(a => a.id === id);
}

