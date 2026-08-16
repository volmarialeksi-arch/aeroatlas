@echo off
rem Processes the next 25 unresolved airports (bigger batch than the
rem default 10 — takes proportionally longer, but fewer double-clicks
rem needed to get through all 254). Safe to run repeatedly; always
rem continues where the last run left off.
call "%~dp0scripts\_run-importer.bat" --limit 25 %*
