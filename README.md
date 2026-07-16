# Songbook — self-hosted PWA

## Dateien
- `index.html` — die komplette App (UI + Logik in einer Datei)
- `sw.js` — Service Worker (Offline-Shell, cached auch die Google-Fonts nach dem ersten Besuch)
- `manifest.webmanifest` + `icons/` — macht die App installierbar

## Hosting
Alle Dateien zusammen in ein Verzeichnis auf einen Webserver legen — fertig.
Es gibt kein Backend: **alle Daten (Songs, Ideen, Aufnahmen) liegen in IndexedDB auf dem Endgerät.**

Wichtig:
- **HTTPS ist Pflicht** (oder `http://localhost` zum Testen). Ohne HTTPS gibt es weder
  Service Worker noch Mikrofonzugriff.
- Die Ordnerstruktur beibehalten (`sw.js` und `manifest.webmanifest` neben `index.html`,
  Icons in `icons/`). Ein Unterverzeichnis wie `https://example.com/songbook/` funktioniert,
  da alle Pfade relativ sind.

## Updates ausrollen
Neue `index.html` hochladen genügt — der Service Worker aktualisiert die Shell im Hintergrund
beim nächsten Aufruf (sichtbar ab dem übernächsten Laden). Wer es sofort erzwingen will:
in `sw.js` die Konstante `VERSION` hochzählen (z. B. `songbook-v2`).

## Daten & Backups
- Die App fragt `navigator.storage.persist()` an, damit der Browser die Daten nicht
  unter Speicherdruck löscht.
- Trotzdem gilt: Browserdaten der Website löschen = Bibliothek weg.
  **Regelmäßig über Menü → „Export everything" sichern.** Der Export enthält alles
  inklusive Audio; der Import fügt nur Neues hinzu und überspringt Duplikate —
  er eignet sich damit auch zum Übertragen/Zusammenführen zwischen Geräten.

## Bedienung unterwegs
- **Zurück-Taste (Android):** schließt erst offene Menüs/Dialoge, geht dann eine Ansicht
  zurück (Song → Songliste → …). Erst an der Wurzel verlässt sie die App.
- **Wischen:** links/rechts wechselt zwischen Songs und Ideen.

## iOS-Hinweis
Auf dem iPhone/iPad: in Safari öffnen → Teilen → „Zum Home-Bildschirm". Aufnahmen werden
dort als AAC (m4a) gespeichert statt Opus/WebM — Import/Export bleibt kompatibel.
