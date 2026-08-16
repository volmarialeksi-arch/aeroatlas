/* ================================================================
   Bootstrap.

   Every other file in js/ only ever *declares* functions/consts, or
   wires up event listeners (which don't run until the user interacts
   with something) — so load order among them mostly doesn't matter.

   The two exceptions, which the original monolithic <script> got "for
   free" via whole-file function hoisting, are re-created explicitly
   here, in the same relative order the original file ran them in:

     1. restoreGameState() — reads localStorage and rebuilds
        `ownedAirports`, `playerMoney`, `fleet` (spawning a plane
        marker per in-flight aircraft via planes.js's
        spawnPlaneMarker), etc. Must run after every system it touches
        has finished loading — which, since this file is the very last
        <script> tag on the page, is guaranteed.

     2. initSettingsPanel() — restores the saved theme/marker-size/
        plane-size settings and immediately calls refreshAllMarkerIcons(),
        which walks the now-populated `fleet` array to resize any
        already-spawned plane markers. It must run AFTER
        restoreGameState() so that walk actually finds something.

     3. initMainMenu() — shows the main menu overlay and sets its
        Play/Shop buttons' enabled state from `gameStarted`, which
        restoreGameState() has by now restored from the save (or left
        false for a brand-new player). Must run after restoreGameState().

   A fourth call, initGlobalPortPoints() (js/systems/port-points-sync.js),
   loads this game's one piece of truly global (server-backed, not
   per-player) data — admin-placed port points — and doesn't need to be
   sequenced relative to the three above: it's async (a network request),
   doesn't block the map or menu from being usable, and everything that
   reads userPortPoints (taxi-graph.js, routes.js, the port editor) is
   already written to cope with it filling in after the fact, the same
   way it already coped with the player placing points live during a
   session. */
restoreGameState();
initSettingsPanel();
initMainMenu();
if (typeof initGlobalPortPoints === 'function') initGlobalPortPoints();
