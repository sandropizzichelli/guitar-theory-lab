# Harmonic Intersections — input interattivo

Implementazione del 4 ottobre 2026, dopo approvazione della proposta e della bozza separata. Salvataggio e pubblicazione autorizzati il 4 ottobre 2026. La copia autonoma Harmonic Intersections/ resta invariata.

## Interfaccia e stati

Ogni scheda A/B sceglie Dal catalogo oppure Posizione manuale. I due sistemi mantengono serbatoi distinti: configurazione del catalogo e sei tasti manuali. Cambiare modalità non copia o cancella note. L'editor si attiva dal pulsante nella scheda o dalla sua intestazione. Desktop: due diagrammi confrontabili, uno modificabile e l'altro consultabile. Mobile: un diagramma alla volta, riepiloghi A/B conservati.

Comuni / Solo A / Solo B è subito sotto le schede e prima delle tastiere. Registro, caselle, raddoppi, ordine sonoro e percentuale sono nei dettagli. La mappa originale è separata, con filtri e intervallo 0–12 conservati. Nascondere corde o occorrenze nella mappa non altera l'input 0–24 o il confronto.

## Regole musicali

Accordatura standard: corde 6→1 E2 A2 D3 G3 B3 E4. Un tasto intero 0–24 oppure null per ciascuna corda. Un nuovo tasto sostituisce quello della corda; una seconda attivazione o × la rende muta. Ogni nota conserva corda, tasto, MIDI, classe e nome con ottava. Ordine per MIDI effettivo, con pareggi ordinati per corda; non si assume che la corda 6 sia il basso.

Il confronto usa soltanto classi distinte, normalizzate modulo 12. Note fisiche e cardinalità astratta sono conteggiate separatamente. Una classe comune non implica unisono, stessa ottava, stessa casella o funzione armonica. Le coincidenze reali usano MIDI distinti e riportano tutte le provenienze; quelle fisiche richiedono corda e tasto identici. I raddoppi rimangono nell'input.

Percentuale mantenuta dal motore preesistente: numero di classi comuni / maggiore cardinalità fra A e B, arrotondato. Non è una graduatoria di affinità. Due input vuoti mostrano percentuale non applicabile; uno vuoto e uno non vuoto mostrano zero. Nessun risultato precedente rimane corrente.

L'input usa grafia cromatica neutra con bemolli, senza accordi o fondamentali dedotti. Il catalogo mantiene ruoli e nomi, con spelling derivato dalla sequenza di gradi: C lidio contiene F♯. Un G♭ manuale può condividere la stessa classe, senza confermare una funzione. Gradi e intervallo fra toniche non vengono assegnati agli input. Nel confronto misto i risultati e la mappa usano nomi di note.

I colori A/blu, B/arancio e comune/verde sono accompagnati da etichette. La nota comune ha doppio bordo; nella mappa A ha forma quadrata e B bordo tratteggiato, con legenda e descrizioni accessibili.

## Trasferimenti

Nessuna generazione catalogo→posizione: il catalogo contiene materiali astratti e mappe, non realizza una diteggiatura completa. Passare a manuale recupera il proprio input salvato.

«Cerca nel catalogo A/B» enumera corrispondenze esatte nelle 12 toniche, 21 scale, arpeggi diatonici e pentatoniche già disponibili. Confronta uguaglianza delle classi effettive, non sottoinsiemi, equivalenza Tn/TnI o somiglianza. Origine, tipo e grado compaiono in ogni opzione. La scelta parte vuota; solo «Apri materiale nel catalogo A/B» applica la selezione. Mantiene tasti, ottave e raddoppi nel serbatoio manuale e non modifica l'altro sistema. L'uguaglianza viene ricontrollata all'applicazione. Origini diverse restano scelte distinte, senza ranking.

## Persistenza

Chiavi gtl.harmonic.A.v1, gtl.harmonic.B.v1, gtl.harmonic.view.v1. A/B salvano separatamente modalità, sei tasti e configurazione completa di catalogo. La vista salva sistema attivo, nomi/gradi, visibilità, registro e corde della mappa. Il pannello mappa si apre inizialmente nei confronti catalogo/catalogo.

Recupero validato per versione, enum, radice 0–11, indici 0–6, tasti interi 0–24, sei corde, range e filtri. Campi invalidi usano default; errori di A non azzerano B. MIDI e analisi vengono ricalcolati dai tasti. «Svuota posizione A/B» persiste sei mute, conservando modalità, catalogo e altro sistema. Il reset dei cataloghi conserva gli input e le modalità. Storage bloccato o non scrivibile produce un avviso e permette comunque l'uso. Nessun account, rete o sincronizzazione.

## Fixture

- Cmaj7 × 3 5 4 5 ×: C3 G3 B3 E4; Am7 × 0 2 0 1 ×: A2 E3 G3 C4. Comuni C/E/G, solo A B, solo B A; 75%; unico MIDI comune G3 su corde diverse, nessuna casella comune.
- C lidio C D E F♯ G A B / Dm7 × 5 7 5 6 ×: D3 A3 C4 F4. Comuni C/D/A, solo scala E/F♯/G/B, solo posizione F. Confronto inverso simmetrico; nessuna coincidenza fisica dichiarata per la scala.
- Cmaj7 +12 tasti: stessa analisi delle classi, nessun MIDI comune all'originale.
- × 3 2 0 1 0: 5 note su 3 classi, raddoppi C/E conservati.
- × 10 0 1 0 ×: D3 G3 A♭3 B3, basso sulla corda 4.
- Posizione × 3 4 3 4 × / C lidio: G♭3 manuale e F♯ di scala coincidono come classe; comuni C/F♯, fuori scala E♭/B♭. Nessun nome Cø7 assegnato all'input.
- Vuoto, un solo sistema vuoto, nessuna intersezione, unisoni, ottave, tutti i tasti su tutte le corde e dati non validi.

## Verifiche riproducibili

- node --test tests/music/harmonic-position.test.js
- npx playwright test tests/e2e/harmonic-input.spec.js tests/e2e/harmonic-layout.spec.js
- node --test tests/music/*.test.js
- npm run e2e
- npm run test:legacy
- npm run build

Il componente condiviso GuitarFretboard resta presentazionale: nuovi parametri opzionali readOnly, cellClassName, cellDescription; default identici per Voicing Explorer e Set-class Explorer. Nessuno stato musicale condiviso. Verificare input, focus, scrolling, riserva del basso e confronto/ripristino negli adattatori esistenti.

Limiti: sei corde, accordatura standard, input massimo 24 e mappa 12, nessuna certificazione ergonomica, riconoscimento armonico automatico o generazione di posizioni. Salvataggio limitato a browser e origine. Goodrick, monetizzazione e AI restano successivi.

## Chiusura della revisione

Build di produzione riuscita; 38 test musicali/persistenza e 54 regressioni autonome superati. 80/80 verifiche browser sulla build di produzione locale superate. La suite completa copre tutti e quattro gli strumenti, apertura diretta, ricaricamento, vecchio indirizzo Voicing, input Set 0–24, persistenza e isolamento A/B. La pubblicazione segue origin/main senza push forzato, tramite Cloudflare Pages guitar-theory-lab, branch di produzione main.
