/* ================================================================
   Aircraft-specific flight performance data — feeds the physics-based
   speed model in js/core/speed-model.js. Every number below is the
   midpoint of the published range for that aircraft (or, for max cruise
   speed, the exact published figure), keyed by AIRCRAFT_CATALOG id.

   takeoffSpeedKmh    — speed reached at the end of the takeoff roll /
                         the speed held for the first 30 km after liftoff.
   maxSpeedKmh         — cruise speed used once >100 km from the departure
                         airport, held until descent begins near the
                         destination.
   descentTableKmh     — speed (km/h) at 100, 90, 80, 70, 60, 50, 40, 30,
                         20, 10 nautical miles from the destination,
                         interpolated linearly (by distance) in between.
   touchdownSpeedKmh   — speed when the wheels touch down, ~100 m into
                         the landing runway; the descent profile ramps
                         linearly from the 10 NM checkpoint down to this.
   ================================================================ */
const AIRCRAFT_PERFORMANCE = {
  atr72500: {
    takeoffSpeedKmh: 207.5,
    maxSpeedKmh: 510,
    touchdownSpeedKmh: 190,
    descentTableKmh: [500, 480, 460, 440, 420, 390, 350, 300, 260, 220],
  },
  e175lr: {
    takeoffSpeedKmh: 235,
    maxSpeedKmh: 871,
    touchdownSpeedKmh: 220,
    descentTableKmh: [810, 770, 730, 690, 630, 560, 495, 425, 345, 275],
  },
  b738: {
    takeoffSpeedKmh: 265,
    maxSpeedKmh: 842,
    touchdownSpeedKmh: 240,
    descentTableKmh: [800, 760, 720, 680, 620, 550, 485, 415, 335, 270],
  },
  a220300: {
    takeoffSpeedKmh: 245,
    maxSpeedKmh: 871,
    touchdownSpeedKmh: 240,
    descentTableKmh: [810, 770, 730, 690, 630, 560, 495, 425, 345, 275],
  },
  a321211: {
    takeoffSpeedKmh: 267.5,
    maxSpeedKmh: 871,
    touchdownSpeedKmh: 240,
    descentTableKmh: [810, 770, 730, 690, 630, 560, 495, 425, 345, 275],
  },
  a350900: {
    takeoffSpeedKmh: 280,
    maxSpeedKmh: 945,
    touchdownSpeedKmh: 255,
    descentTableKmh: [895, 855, 815, 755, 685, 615, 535, 445, 365, 295],
  },
  b757200: {
    takeoffSpeedKmh: 267.5,
    maxSpeedKmh: 850,
    touchdownSpeedKmh: 245,
    descentTableKmh: [800, 765, 725, 685, 625, 555, 490, 420, 340, 275],
  },
  b777222: {
    takeoffSpeedKmh: 280,
    maxSpeedKmh: 905,
    touchdownSpeedKmh: 255,
    descentTableKmh: [875, 835, 795, 735, 665, 595, 520, 440, 360, 290],
  },
  b747400: {
    takeoffSpeedKmh: 285,
    maxSpeedKmh: 907,
    touchdownSpeedKmh: 260,
    descentTableKmh: [865, 825, 785, 725, 655, 585, 510, 430, 350, 285],
  },
  a340600: {
    takeoffSpeedKmh: 285,
    maxSpeedKmh: 913,
    touchdownSpeedKmh: 260,
    descentTableKmh: [870, 830, 790, 730, 660, 590, 515, 435, 355, 290],
  },
  a380800: {
    takeoffSpeedKmh: 270,
    maxSpeedKmh: 903,
    touchdownSpeedKmh: 255,
    descentTableKmh: [870, 830, 790, 730, 660, 590, 515, 435, 355, 290],
  },
  erj145: {
    takeoffSpeedKmh: 225,
    maxSpeedKmh: 833,
    touchdownSpeedKmh: 210,
    descentTableKmh: [700, 665, 630, 590, 540, 490, 430, 360, 300, 240],
  },
  b789: {
    takeoffSpeedKmh: 280,
    maxSpeedKmh: 956,
    touchdownSpeedKmh: 260,
    descentTableKmh: [900, 860, 820, 760, 690, 620, 540, 450, 370, 300],
  },
  a319100: {
    takeoffSpeedKmh: 250,
    maxSpeedKmh: 871,
    touchdownSpeedKmh: 240,
    descentTableKmh: [810, 770, 730, 690, 630, 560, 495, 425, 345, 275],
  },
  a321neo: {
    takeoffSpeedKmh: 267.5,
    maxSpeedKmh: 876,
    touchdownSpeedKmh: 245,
    descentTableKmh: [820, 780, 740, 700, 640, 570, 500, 430, 350, 280],
  },
  b739er: {
    takeoffSpeedKmh: 267.5,
    maxSpeedKmh: 842,
    touchdownSpeedKmh: 240,
    descentTableKmh: [800, 760, 720, 680, 620, 550, 485, 415, 335, 270],
  },
};

/* Generic fallback profile (roughly the A320-family numbers) used if a
   fleet aircraft's type/id can't be resolved for some reason — keeps the
   speed model from ever throwing on unexpected/missing data. */
const AIRCRAFT_PERFORMANCE_DEFAULT = {
  takeoffSpeedKmh: 260,
  maxSpeedKmh: 860,
  touchdownSpeedKmh: 240,
  descentTableKmh: [810, 770, 730, 690, 630, 560, 495, 425, 345, 275],
};

function getAircraftPerformance(type) {
  return (type && AIRCRAFT_PERFORMANCE[type.id]) || AIRCRAFT_PERFORMANCE_DEFAULT;
}
