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
- [ ] Integrare i file immagine nel repository di sviluppo (PNG pronti localmente; caricamento GitHub ancora da completare).
- [ ] Aggiornare manifest PWA, favicon e icona iOS/Android.
- [ ] Verificare l'icona su schermata iniziale Android e in installazione PWA.
- Nota: la grafica è una prima proposta generata in questa sessione; non è ancora stata dichiarata definitiva né pubblicata.

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
