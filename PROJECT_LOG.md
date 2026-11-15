# OL BORÉLER — registro di sviluppo

## Regole di progetto
- Repository di sviluppo: `bebcasaarcangeli-max/Ol-boreler2`.
- Repository stabile `bebcasaarcangeli-max/Ol-boreler`: non modificare.
- Il progetto e il backend OL BORÉLER restano completamente separati da Jupiter.
- Non distribuire agli store e non sostituire la versione stabile finché sviluppo, verifiche e collaudo non sono completati.
- Ogni modifica va registrata qui con data, file interessati, commit e stato dei test.

## Obiettivo concordato
Preparare OL BORÉLER come gioco mobile completo, con classifica globale condivisa tra tutti i giocatori e successiva distribuzione sui principali store.

Requisiti già raccolti:
1. Schermata iniziale con icona ufficiale riconoscibile e campo per il nickname.
2. Conferma del nickname e ingresso nel gioco.
3. Pulsante pausa sempre accessibile nella parte alta.
4. Schermata pausa con classifica.
5. Classifica online globale, comune a tutti i giocatori e non limitata al singolo dispositivo.
6. Progetto/backend separato da Jupiter.
7. Distribuzione sugli store soltanto dopo completamento e collaudo.

## Stato al 15 novembre 2026

### Identità visiva
- [x] Prima proposta di icona generata: illustrazione pixel-art alpina, protagonista sulla zattera, rapide e scritta OL BORÉLER.
- [x] Varianti PNG locali preparate: 512×512, 192×192, 180×180 (Apple touch icon), 32×32 (favicon).
- [x] Integrare nel repository di sviluppo i cinque PNG approvati: sorgente, icone 512×512 e 192×192, Apple touch icon 180×180 e favicon 32×32.
- [x] Aggiornare manifest PWA, favicon, Apple touch icon e sorgente di generazione icone Android.
- [ ] Collaudo visivo su dispositivo Android e installazione PWA (verifica manuale successiva).
- Nota: icona approvata dall'utente e integrata nel ramo di sviluppo; nessuna pubblicazione sul ramo main o sul repository stabile.

### Gioco e interfaccia
- [x] Versione di sviluppo separata già presente in `Ol-boreler2`, con audio e controlli audio nella barra superiore.
- [x] Prima schermata iniziale con campo nickname (max 20 caratteri) e memorizzazione locale del nickname — implementata nel branch di sviluppo, da collaudare.
- [ ] Verificare comportamento nickname su dispositivi/browser diversi.
- [x] Pulsante pausa in barra superiore, ripresa e ritorno alla schermata iniziale — implementati nel branch di sviluppo, da collaudare.
- [x] Schermata pausa con richiesta della top 10 globale tramite RPC Supabase — implementata nel branch di sviluppo, da collaudare.
- [ ] Gestione di nickname, record personale e invio punteggio.

### Classifica globale e backend
- [x] Progetto Supabase dedicato creato: `ol-boreler-scoreboard` (regione UE, Francoforte).
- [x] Tabella `public.game_scores` con RLS attivo.
- [x] RPC `get_global_leaderboard` per leggere i migliori punteggi globali.
- [x] RPC `submit_game_score` iniziale per inviare punteggi.
- [ ] Rafforzare la verifica server-side e la protezione da punteggi falsificati/spam prima del rilascio pubblico.
- [x] Collegamento iniziale del client alle RPC Supabase di classifica e invio punteggio — implementato, da verificare end-to-end.
- [ ] Testare invio e lettura da almeno due dispositivi/browser distinti.
- [ ] Verificare privacy, conservazione dati e moderazione dei nickname.

### Distribuzione e collaudo
- [ ] Test funzionali su Android e browser desktop/mobile.
- [ ] Test PWA offline/aggiornamenti cache.
- [ ] Preparare pacchetto Android firmato e materiali store.
- [ ] Verificare requisiti correnti di Google Play, Galaxy Store e Apple App Store prima della pubblicazione.
- [ ] Pubblicazione solo dopo approvazione esplicita.

## Registro modifiche

### 2026-11-15
- Aggiornato `index.html` nel branch `feature/brand-icon-and-release-tracking` (commit `a14e53d40c3e123b148308fbe44df451cc35851b`): ingresso con nickname, pulsante pausa, ripresa/ritorno all'inizio, lettura classifica globale e invio punteggio al backend dedicato.
- Queste funzioni sono implementate nel codice ma non ancora collaudate su dispositivo né verificate end-to-end con due giocatori reali.
- Creato il branch di lavoro `feature/brand-icon-and-release-tracking` a partire da `main`.
- Creato questo registro per conservare requisiti, avanzamento e verifiche.
- Generata una proposta di icona pixel-art e preparate localmente le varianti PNG indicate sopra.
- Nessuna modifica al repository stabile `Ol-boreler`.
- Nessuna pubblicazione sul branch `main` e nessuna distribuzione agli store.

### 2026-11-15 — controllo invio punteggi e permessi RPC
- Aggiornato `index.html` (commit `369f1f55a2bd484ac85e98e2d20ada1246764877`): l'invio del punteggio ora controlla la risposta HTTP e il campo `accepted` restituito dal server; mostra un esito comprensibile al giocatore e non considera riuscita una richiesta fallita.
- Aggiornati i privilegi delle RPC Supabase: revocato l'accesso ereditato da `PUBLIC` e concesso esplicitamente a `anon` e `authenticated`.
- Verifica SQL eseguita: `anon` e `authenticated` possono chiamare le RPC previste; il ruolo `PUBLIC` non dispone più di EXECUTE diretto. La lettura pubblica della classifica resta disponibile tramite il ruolo `anon`.
- Limite di sicurezza ancora aperto: il server riceve il punteggio dal browser e il player ID è conservato localmente. Quindi la classifica non è ancora resistente alla falsificazione dei punteggi; non dichiarare completato l'anti-cheat.
- Test end-to-end da browser/dispositivo e prova con due giocatori ancora da eseguire.

### 2026-11-15 — prima validazione server-side dei punteggi
- Creato e distribuito su Supabase il servizio Edge Function `ol-boreler-score`, versione 2, stato ACTIVE.
- Il gioco apre una sessione server prima di ogni discesa; il server associa sessione e player ID, registra l'orario iniziale e accetta un solo invio per sessione.
- Il server rifiuta partite inferiori a 3 secondi e punteggi superiori a un limite temporale prudenziale (26 punti/secondo + 25 punti di tolleranza), coerente con la velocità massima del ciclo di gioco.
- `index.html` ora avvia la sessione tramite Edge Function e invia il risultato alla stessa funzione; il vecchio RPC di inserimento non è più accessibile ai ruoli anonimo/autenticato.
- Tabella sessioni con RLS attivo e nessun accesso diretto a `anon` e `authenticated`. Verificato che `service_role` può leggere/creare/aggiornare sessioni e chiamare l'RPC interno.
- Commit front-end: `e951a018a4e49cbba35cf166cf6a114077d711a6` (integrazione sessioni) e `9b7f067a6dc080262618bb2fef787185ece58829` (arresto partita precedente prima del riavvio).
- Edge Function distribuita: versione 2, hash `555386864e3b65e4db4f890643beaefbc207c11fb599f6db3292577b9c69202d`.
- Limite dichiarato: non è un anti-cheat completo. Il punteggio nasce ancora nel browser; un utente determinato può manipolare il client e creare identità locali diverse. Il controllo server-side rende più difficile l'invio di valori palesemente impossibili, ma non dimostra che la partita sia stata giocata correttamente.
- Verifiche automatizzate: privilegi SQL e stato ACTIVE della funzione confermati. Test HTTP end-to-end della funzione, partita reale, due giocatori e test su smartphone ancora da eseguire.
- Advisory Supabase: RLS senza policy su `game_scores` e `ol_boreler_game_sessions` è intenzionale perché l'accesso passa dalle funzioni server; l'advisory segnala inoltre che la lettura globale è una RPC SECURITY DEFINER pubblica. La lettura pubblica è intenzionale per la classifica, da ricontrollare prima del rilascio.


### 2026-11-15 — ciclo di sviluppo, punto 1 (integrazione preliminare icona)
- Verificato il branch di sviluppo e letto lo stato effettivo dei file.
- Risolto un riferimento rotto: `index.html` e `sw.js` richiamavano `icon.svg`, ma il file non era presente nel repository.
- Creato `icon.svg` usando la risorsa immagine già archiviata in `assets-src/icon-source.b64`; registrata nel manifest PWA con finalità `any` (non dichiarata maskable).
- Aggiornata la cache service worker da `ol-boreler-v1` a `ol-boreler-v2` per forzare il rinnovo degli asset.
- Verifiche: file creato su GitHub; aggiornamenti manifest e service worker confermati dai commit. Non è stato ancora eseguito un collaudo visivo su dispositivo.
- Stato punto 1: integrazione tecnica preliminare completata; approvazione visiva dell'icona e pacchetti PNG nativi restano da confermare prima della release.


### 2026-11-15 — punto 1: identità visiva e integrazione icone
- Confermata l'approvazione dell'icona pixel-art OL BORÉLER da parte dell'utente.
- Integrati in `assets-src/` i cinque PNG caricati dall'utente su `main`, senza modificare `main`: `ol-boreler-icon.png`, `icon-512.png`, `icon-192.png`, `apple-touch-icon.png`, `favicon-32.png`.
- Aggiornati `manifest.webmanifest` (icone PWA 192/512 e variante maskable), `index.html` (favicon e Apple touch icon), `sw.js` (cache `ol-boreler-v3`) e workflow Android (usa il PNG approvato come sorgente).
- Collaudo visivo su dispositivo e installazione PWA: da eseguire nella successiva fase di test.
- Stato punto 1: COMPLETATO per identità, approvazione e integrazione degli asset nel ramo di sviluppo.
