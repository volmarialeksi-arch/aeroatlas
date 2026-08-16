@echo off
setlocal EnableDelayedExpansion

rem ================================================================
rem  Shared helper — NOT meant to be double-clicked directly.
rem  Called by IMPORT_REAL_PORT_POINTS.bat, IMPORT_NEXT_10_PORT_POINTS.bat,
rem  IMPORT_NEXT_25_PORT_POINTS.bat, and RETRY_FAILED_PORT_POINTS.bat,
rem  each of which just does:
rem      call "%%~dp0scripts\_run-importer.bat" <some flags>
rem  All the actual Node/connectivity checks and importer invocation
rem  live here once, so the four launcher files stay tiny and in sync.
rem ================================================================

rem --- Always run from the project root (one level up from scripts\),
rem     regardless of what folder the caller's shortcut/cwd was.
cd /d "%~dp0.."

echo ========================================
echo  AeroAtlas Real Port Point Importer
echo ========================================
echo.

rem --- 1. Node.js present? ---
echo Checking Node.js...
where node >nul 2>nul
if errorlevel 1 (
    echo.
    echo ERROR: Node.js was not found on this computer.
    echo.
    echo Node.js is required.
    echo Please install Node.js 18 or newer from:
    echo   https://nodejs.org/
    echo.
    echo After installing, close this window and double-click
    echo IMPORT_REAL_PORT_POINTS.bat again.
    echo.
    pause
    exit /b 1
)

rem --- 2. Node.js new enough (need >= 18 for built-in fetch)? ---
for /f "tokens=1 delims=." %%v in ('node -e "console.log(process.versions.node)"') do set NODE_MAJOR=%%v
if !NODE_MAJOR! LSS 18 (
    echo.
    echo ERROR: Node.js is installed, but it's too old ^(major version !NODE_MAJOR!^).
    echo This importer needs Node.js 18 or newer ^(it uses the built-in
    echo fetch^(^) API to talk to OpenStreetMap^).
    echo.
    echo Please install a newer Node.js from:
    echo   https://nodejs.org/
    echo.
    pause
    exit /b 1
)
echo OK ^(Node.js !NODE_MAJOR!.x found^)
echo.

rem --- 3. Importer script actually present? ---
if not exist "scripts\import-real-port-points.js" (
    echo.
    echo ERROR: scripts\import-real-port-points.js was not found.
    echo Make sure this .bat file sits in the AeroAtlas project root,
    echo next to the "scripts" and "server" folders.
    echo.
    pause
    exit /b 1
)

rem --- 4. Basic internet reachability check ---
echo Checking internet connection...
ping -n 1 -w 3000 overpass-api.de >nul 2>nul
if errorlevel 1 (
    echo.
    echo ERROR: Internet connection is required to download OpenStreetMap data.
    echo Could not reach overpass-api.de. Check your network connection
    echo ^(or firewall/VPN settings^) and try again.
    echo.
    pause
    exit /b 1
)
echo OK
echo.

rem --- 5. Run the real importer, forwarding whatever flags this helper
rem        was called with (e.g. --limit 10, --retry-failed, ...) ---
echo Downloading real OpenStreetMap parking positions...
echo This deliberately goes slowly and one airport at a time, to avoid
echo being rate-limited by the free Overpass servers.
echo.
echo Progress is saved after every single airport, so if you close this
echo window or lose your connection partway through, nothing already
echo downloaded is lost — just run this same file again afterward and
echo it will automatically continue with the next unresolved airports.
echo.

node "scripts\import-real-port-points.js" %*
set IMPORT_EXIT_CODE=%ERRORLEVEL%

echo.
if %IMPORT_EXIT_CODE% NEQ 0 (
    echo ========================================
    echo  Import finished with errors.
    echo ========================================
    echo See the messages above for details. Nothing that already
    echo existed in server\data\port-points.json was deleted — a failed
    echo run never removes data, it only fails to add new data.
    echo.
    echo Just run this file again to continue ^(it resumes automatically^),
    echo or double-click RETRY_FAILED_PORT_POINTS.bat to retry only the
    echo airports that failed.
) else (
    echo ========================================
    echo  Batch complete!
    echo ========================================
    echo.
    echo Output report: server\data\port-point-import-report.json
    echo Updated data:  server\data\port-points.json
    echo.
    echo If your AeroAtlas server ^(server\server.js^) is already running,
    echo restart it ^(or use the "Import Real Airport Stands" button in
    echo the in-game editor to reload without a restart^) so it picks up
    echo the new data.
    echo.
    echo Still airports left to resolve? Just run this file again ^(or one
    echo of the other IMPORT_NEXT_*.bat files^) to continue with the next
    echo batch — it always picks up where the last run left off.
)

echo.
pause
endlocal
