# Set-class Explorer — proposta di tastiera interattiva

Proposta da approvare prima dell'implementazione. Nessuna modifica al tool durante la revisione finale di Voicing Lab. Riferimento grafico: revisione approvata `3cf7f86`; riuso del comportamento di tastiera verificato in Voicing Lab, con adattamento alla teoria degli insiemi.

## Due modalità con stati distinti

**Esplora** è la modalità iniziale e conserva cataloghi, trasformazioni Tn/TnI, gruppi di corde, risultati, filtri, mappe e collegamenti intervallari esistenti. Il tocco di una casella mostra nota, ottava, classe, corda e tasto e mette in evidenza le occorrenze della stessa classe. Non sostituisce il set del catalogo e non produce una nuova posizione. La nota osservata è un riferimento, non una nota suonata o aggiunta al set. I controlli di catalogo continuano a determinare il materiale evidenziato. Un comando «Usa questa posizione come input», accanto a un risultato reale, copia esattamente quella posizione nello stato di inserimento e apre la relativa modalità: è l'unico trasferimento dal catalogo alla posizione.

**Inserisci una posizione** è un input fisico indipendente, inizialmente vuoto: sei corde in accordatura standard, una nota per corda, tasto 0 oppure corda muta. Toccare un tasto sostituisce quello della stessa corda; toccare quello selezionato o «×» silenzia la corda. Sono disponibili anche sei selettori numerici, dalla corda 6 alla 1, e «Svuota posizione» esplicito. Non si generano automaticamente diteggiature sostitutive.

Il cambio di modalità conserva entrambi gli stati: nessuna copia implicita della posizione, del set o della trasformazione. In inserimento i filtri di ricerca del catalogo non eliminano note dalla posizione; rimangono nella modalità Esplora. Il riconoscimento non è vincolato alla pagina di cardinalità attualmente aperta: una posizione a tre classi viene riconosciuta come tricordo anche se il catalogo precedente era dei tetracordi. «Apri questa set class in Esplora» è un comando separato; conserva l'input fisico mentre apre il catalogo pertinente.

## Modello e regole musicali

Record fisico per ogni nota: corda, tasto, MIDI, nome con ottava. Ordinamento per altezza effettiva; a parità di altezza, ordine deterministico delle corde. Nessuna assunzione che il basso sia sulla corda dal numero più alto. L'analisi astratta usa invece le classi distinte `MIDI mod 12`, senza ottave o molteplicità. Numeri 0–11 con C=0; T ed E solo come alias documentati nei cataloghi esistenti, non come nomi di note.

Set class = equivalenza per trasposizione e inversione Tn/TnI; prime form = rappresentante normalizzato secondo la convenzione dichiarata del catalogo. La posizione e il suo ordine sonoro non sono la prime form. L'inversione della set theory non è un rivolto dell'accordo e non viene applicata alla chitarra dal riconoscimento.

Vettore intervallare `<ic1 ic2 ic3 ic4 ic5 ic6>`: per ogni coppia non ordinata di classi distinte, `ic=min(d,12-d)`. Ogni coppia conta una volta. La somma è `n(n−1)/2`. Raddoppi, unisoni e ottave non contribuiscono nuove coppie fra classi; restano però nei record fisici e nella tastiera. Il vettore non identifica sempre una sola set class: mantenere i numeri Z e distinguere set Z-correlati.

Non introdurre fondamentale armonica, sigle di accordo, gradi modali o gruppo V in questo flusso. Spelling neutro cromatico coerente con la convenzione documentata del tool, senza attribuire funzione a una nota.

## Risultato compatto e casi limite

Sopra la tastiera: «Posizione: × · 3 · 2 · 0 · 1 · 0». Sotto: nomi con ottava, numero di note fisiche e numero di classi distinte; badge dei raddoppi solo se presenti. Risultato principale: set delle classi, numero Forte quando disponibile, prime form e vettore intervallare. Dettagli richiudibili: normal order, confronto diretto/invertito per la prime form, classi ripetute con rispettive corde, conteggio delle coppie e fonte/convenzione. Non aggiungere automaticamente note mancanti per raggiungere la cardinalità del catalogo.

Il catalogo principale esaminato contiene famiglie a 3, 4, 5 e 6 classi. La disponibilità di un numero Forte viene stabilita dalla tabella effettiva, non solo dalla cardinalità:

- Nessuna nota: messaggio «Inserisci almeno una nota»; nessun risultato precedente lasciato come corrente.
- Una o due classi: posizione valida, classi/prime form/vettore calcolati; «Cardinalità fuori dal catalogo attuale», numero Forte non assegnato e comando di apertura del catalogo disattivato.
- Tre–sei classi: lookup verificato della prime form; eventuale mancata corrispondenza dichiarata, senza scegliere il set più vicino. Prima dell'integrazione verificare l'intera tabella e le convenzioni di packing; non dichiarare già completo il lookup per ogni insieme.
- Sette–dodici classi: impossibili con sei corde e una nota per corda nel nuovo input. Se emergono dai materiali astratti esistenti (per esempio supersets/complementi), restano consultabili in Esplora e non vengono convertite implicitamente in una posizione a sei note. Nessun ampliamento del catalogo in questa fase.
- Raddoppi: sei note su tre classi sono un tricordo, non un esacordo; nessuna nota fisica viene cancellata dal riconoscimento.

## Esempi e fixture previste

| Input reale, corde 6→1 | Altezze effettive | Classi distinte | Riconoscimento atteso |
| --- | --- | --- | --- |
| × 3 2 0 1 0 | C3 E3 G3 C4 E4 | {0,4,7} | 5 note / 3 classi; 3-11, prime form (037), vettore <0 0 1 1 1 0> |
| × 3 5 4 5 × | C3 G3 B3 E4 | {0,4,7,11} | 4-20, prime form (0158), vettore <1 0 1 2 2 0> |
| × 0 2 0 1 × | A2 E3 G3 C4 | {0,4,7,9} | 4-26, prime form (0358), vettore <0 1 2 1 2 0> |
| × 3 4 3 4 × | C3 G♭3 B♭3 E♭4 | {0,3,6,10} | 4-27, prime form (0258), vettore <0 1 2 1 1 1> |
| 0 × × × × 0 | E2 E4 | {4} | 2 note / 1 classe; raddoppio d'ottava, prime form (0), vettore nullo, fuori catalogo |

Fixture astratte separate: (0146) 4-Z15 e (0137) 4-Z29 hanno entrambe <1 1 1 1 1 1>, ma non la stessa set class. Per le altezze incrociate: posizione × 11 0 0 0 × produce D3 G3 G♯3 B3, basso sulla corda 4; conservare i tasti ed evitare ordinamento per corda. Un cambio di grafia G♭/F♯ non modifica il riconoscimento.

Gli esempi musicali denominano soltanto le note: l'appartenenza a una set class non conferma una lettura armonica.

## Riutilizzo previsto, dopo approvazione

Esaminati `src/legacy-tools/set-visualizer/{Fretboard.jsx,setUtils.js,setData.js,GenericSetPage.jsx,genericSetPageTransitions.js}`. Esistono già `normalizePcs`, `normalOrder`, `primeForm`, `findForteNumberByPf`, il modello di accordatura e il catalogo delle prime form/vettori. La tastiera attuale visualizza mappe, occorrenze e collegamenti intervallari; non la si sostituisce con un input che perda questi comportamenti. Il vettore per un input fuori catalogo va calcolato dalle coppie: oggi diversi flussi leggono il vettore direttamente dalla tabella.

Il primo passo tecnico sarà estrarre la tastiera di Voicing Lab in un componente di presentazione condiviso, mantenendo per default il suo rendering e i callback attuali. Contratto proposto: accordatura con MIDI, limiti dei tasti, selezioni per corda, modalità read-only/inspect/edit, etichette, decorazioni, corde riservate/disabilitate e callback `onInspect`/`onChange`. Geometria configurabile per rispettare le dimensioni dei due strumenti; gli strati visuali dei collegamenti intervallari restano gestiti dall'adattatore Set-class. Nessuna analisi armonica, modale, Forte o Greene dentro il componente.

Due adattatori separati: Voicing Lab conserva fondamentale, basso, centro, firme di ricerca e snapshot; Set-class conserva target di esplorazione, posizione immessa e riduzione alle classi. Nessuno stato musicale condiviso fra strumenti. Il componente non deduplica note e non decide se una posizione è suonabile. Inizialmente conservare 0–12 tasti di Set-class, coerenti con la ricerca esistente; il componente continua a supportare 0–24 per Voicing Lab. Estensioni del registro di Set-class richiedono una fase dedicata, senza ricerca che sembri coprire tasti non previsti.

## Accessibilità e verifiche prima del rilascio

Tastiera protagonista con scorrimento interno, etichette di corda visibili, focus evidente su caselle e contenitore. Enter/Spazio attivano le caselle; i selettori sono l'accesso alternativo. Navigazione fra modalità con controlli nominati e pannello associato; nessun cambiamento fisico quando si aprono dettagli o si osserva una nota. Mobile 390/320 px senza overflow della pagina, note/ottave leggibili e distinzione fra note selezionate e semplici occorrenze del set. Nessun ruolo armonico derivato dalla sola class membership.

Verifiche previste: tutti i 2.431 insiemi di cardinalità 3–6 (220+495+792+924); equivalenza per dodici trasposizioni e dodici inversioni; confronto di catalogo e fixture indipendenti, packing ambiguo e coppie Z. Non assumere in partenza che l'algoritmo attuale segua tutti i casi della convenzione Forte: audit delle divergenze prima di riutilizzarlo, lookup basato sull'orbita Tn/TnI se necessario e documentato. Per cardinalità 0/1/2: messaggi, risultati calcolati, nessun lookup forzato. Verificare vettore con algoritmo indipendente e somma delle coppie.

Browser: inserimento/sostituzione/muting, corde aperte, raddoppi, altezze incrociate, cambio modalità con due stati conservati, comandi espliciti catalogo→input e input→catalogo; filtri di Esplora non mutano l'input. Regressioni Set-class: mappe prime/transformed, complementi, subsets/supersets, generi, filtri del basso, gruppi di corde, intervalli e navigazione URL. Regressioni Voicing Lab: spelling, close/drop, V, bassi, modale, riserva delle corde, confronto/applicazione/ripristino e focus. Non avviare integrazione prima che l'estrazione sia verificata identica nel tool esistente.

## Fonti e limiti della proposta

- [Open Music Theory · normal order](https://openmusictheory.github.io/normalOrder.html).
- [Open Music Theory · set class e prime form](https://openmusictheory.github.io/setClassAndPrimeForm1.html).
- [Open Music Theory · numeri Forte e vettori](https://openmusictheory.github.io/setClassAndPrimeForm2.html).
- [Open Music Theory · interval-class vectors](https://viva.pressbooks.pub/openmusictheory/chapter/interval-class-vectors/).

Fonti consultate il 3 ottobre 2026. Classi, Tn/TnI e vettori sono concetti teorici; doppio stato, controlli, comandi di trasferimento e architettura sono nostre scelte software. Nomi e prime form degli esempi confrontati con il catalogo del progetto; l'audit esaustivo è previsto, non già eseguito su Set-class in questa revisione. Nessuna nuova fondamentale o interpretazione armonica, ricerca ergonomica, microtonalità, accordatura alternativa o generazione AI. Monetizzazione e assistente AI restano successivi.
