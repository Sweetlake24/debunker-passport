# Debunker Passport

Lokale, serverloze onderzoeksapp voor retourbrandstof en mogelijke afvalstatus. Alle invoer blijft in de `localStorage` van de browser; er worden geen gegevens verzonden.

## Starten

Open `index.html` rechtstreeks in een moderne browser, of start in deze map:

```powershell
python -m http.server 8080
```

Open daarna `http://localhost:8080`.

## Functies

- partij-, BDN-, monster-, massa-, status- en bestemmingsregistratie;
- parent-childafstamming voor nieuwe tank- en batchnummers;
- bronwaardering;
- transparante, regelgebaseerde signalen;
- risicoscore als prioritering voor menselijke beoordeling;
- export naar Markdown;
- JSON-import en -export voor overdracht tussen analisten;
- geanonimiseerde historische democasus;
- automatisch wijzigingslog zonder oude veldwaarden;
- SHA-256-integriteitsmanifest voor dossierbestanden;
- automatische gebeurtenissenlijn;
- geen externe afhankelijkheden of netwerkverzoeken.

De score stelt geen fraude, schuld of afvalstatus vast. Iedere regel toont de feitelijke combinatie die menselijke verificatie activeert.

## Privacy

De app heeft geen backend, analytics of externe API-koppelingen. Casusgegevens blijven in de lokale browseropslag totdat de gebruiker ze wist of exporteert. Publiceer nooit echte persoonsgegevens of operationeel gevoelige informatie in de broncode of demobestanden.

## Vercel

Dit is een statische site zonder buildstap. Importeer de GitHub-repository in Vercel en stel **Root Directory** in op `debunker-passport`. `vercel.json` voegt enkele defensieve browserheaders toe.

## Testen

```powershell
node test-risk-engine.js
node test-integrity.js
```
