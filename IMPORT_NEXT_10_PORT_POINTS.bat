@echo off
rem Processes the next 10 unresolved airports. Identical to double-clicking
rem IMPORT_REAL_PORT_POINTS.bat — this file exists as an explicit, clearly
rem named alternative. Safe to run repeatedly; always continues where the
rem last run left off.
call "%~dp0scripts\_run-importer.bat" --limit 10 %*
