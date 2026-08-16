@echo off
rem ================================================================
rem  Double-click this to import real OSM aircraft parking positions,
rem  10 airports at a time. Safe to double-click repeatedly — each run
rem  automatically continues with the next 10 unresolved airports; it
rem  never restarts from the beginning and never deletes data already
rem  saved from a previous run.
rem
rem  Other options in this folder:
rem    IMPORT_NEXT_10_PORT_POINTS.bat  — same as this one, explicitly
rem    IMPORT_NEXT_25_PORT_POINTS.bat  — a bigger batch per run
rem    RETRY_FAILED_PORT_POINTS.bat    — retry only airports that
rem                                      previously failed (rate limit /
rem                                      timeout / server / network error)
rem
rem  All the real logic lives in scripts\_run-importer.bat and
rem  scripts\import-real-port-points.js — this file just calls it with
rem  the default batch size. Any extra arguments you pass to this file
rem  are forwarded through as well.
rem ================================================================
call "%~dp0scripts\_run-importer.bat" --limit 10 %*
