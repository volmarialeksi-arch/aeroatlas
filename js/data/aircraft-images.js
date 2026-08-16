/* ================================================================
   Aircraft artwork paths.

   These used to be three enormous inline base64 data-URI constants
   (several MB of text) sitting directly in the game script. They have
   been decoded to real PNG files under assets/images/aircraft/ so the
   JS payload stays small and the images are cacheable by the browser.
   ================================================================ */
const AIRCRAFT_IMAGES = {
  jet: 'assets/images/aircraft/jet.png',        // default / generic jet artwork
  atr72500: 'assets/images/aircraft/atr72500.png',
  b738: 'assets/images/aircraft/b738.png',
  a220300: 'assets/images/aircraft/a220300.png',
  a321211: 'assets/images/aircraft/a321211.png',
  a350900: 'assets/images/aircraft/a350900.png',
  b757200: 'assets/images/aircraft/b757200.png',
  b777222: 'assets/images/aircraft/b777222.png',
  b747400: 'assets/images/aircraft/b747400.png',
  a340600: 'assets/images/aircraft/a340600.png',
  a380800: 'assets/images/aircraft/a380800.png',
  erj145: 'assets/images/aircraft/erj145.png',
  b789: 'assets/images/aircraft/b789.png',
  a319100: 'assets/images/aircraft/a319100.png',
  a321neo: 'assets/images/aircraft/a321neo.png',
  b739er: 'assets/images/aircraft/b739er.png',
};
