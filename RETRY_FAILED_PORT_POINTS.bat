@echo off
rem Retries ONLY airports whose last known status was a failure
rem (RATE_LIMITED / TIMEOUT / SERVER_ERROR / NETWORK_ERROR) — a real "no
rem OSM data" result is never touched by this, since that's not a
rem failure. No batch limit: it retries every currently-failed airport
rem in one run, since that's normally a much smaller set than all 254.
call "%~dp0scripts\_run-importer.bat" --retry-failed %*
