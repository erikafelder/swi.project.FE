# SWI projekt – Frontend

Frontendová část semestrálního projektu do předmětu SWI.

Projekt představuje uživatelské rozhraní pro jednoduchý knihovní systém. Frontend komunikuje s backendem pomocí API požadavků a zobrazuje data z databáze uživateli.

Backendová část projektu je v samostatnem repozitáři:

- https://github.com/erikafelder/swi1.project

## Popis projektu

Frontend slouží jako webové rozhraní knihovního systému.

Uživatel v aplikaci může pracovat s knihami, zobrazovat informace o knihách a používat funkce napojené na backend. Data se nenačítají přímo z frontendu, ale přes backend, který komunikuje s databází.

Zjednodušeně aplikace funguje takto:

1. Uživatel provede akci ve webové aplikaci.
2. Frontend pošle požadavek na backend.
3. Backend požadavek zpracuje.
4. Backend vrátí odpověď.
5. Frontend výsledek zobrazí uživateli.

## Použité technologie

- React
- TypeScript
- Vite
- React Router
- Material UI
- CSS
- ESLint

## Struktura projektu

Základní struktura projektu:

```text
public/
src/
package.json
vite.config.ts
tsconfig.json

Složka src obsahuje hlavní zdrojové soubory aplikace.

Nachází se zde například:

komponenty,
stránky aplikace,
routování,
volání API,
stylování.
public

Složka public obsahuje veřejné soubory, které se mohou používat přímo ve frontendové aplikaci.

Komunikace s backendem

Frontend komunikuje s backendem pomocí HTTP požadavků.

Backend repo:

https://github.com/erikafelder/swi1.project

Aby frontend správne fungoval, musí být zároveň spuštěný backend. Pokud backend běží na jiné adrese nebo portu, je potřeba upravit URL u API požadavků ve frontendové části.

Spuštění projektu
1. Instalace závislostí

Po naklonování repozitáře je potřeba nainstalovat balíčky:

npm install
2. Spuštění vývojového serveru

Projekt se spustí příkazem:

npm run dev

Aplikace se potom otevře v prohlížeči na lokální adrese, kterou vypíše Vite v terminálu.

Přihlášení

Pro testování aplikace je možné použít předpřipravené uživatele z backendu:

administrátor: admin / admin123
běžný uživatel: emil / emil123

Uživatel Emil má v testovacích datech aktivní výpůjčku knihy Hobit, která je po termínu vrácení.

Hlavní funkce frontendu
zobrazení knih,
práce s detailem knihy,
komunikace s backendem,
jednoduchá navigace mezi stránkami,
uživatelské rozhraní pro knihovní systém,
práce s daty získanými z API,
možnost testování aplikace pomocí předpřipravených uživatelů.
Poznámka k projektu

Projekt je vytvořený jako školní semestrální práce.

Frontend má ukázat práci s Reactem, komponentami, routováním a napojením na backend přes API. Cílem bylo vytvořit přehledné rozhraní, které spolupracuje s backendovou a databázovou částí projektu.
