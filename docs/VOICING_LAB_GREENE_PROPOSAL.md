# Voicing Lab — proposta per la fase Ted Greene

Stato: proposta da approvare prima dell'implementazione. Prima versione corretta salvata nel commit locale `9f23461`, con specifica e test; nessuna pubblicazione. Basso esterno e compatibilità modali restano successivi. Il riferimento grafico rimane `3cf7f86`.

## 1. Due operazioni musicalmente diverse

**Disposizioni sistematiche:** mantenere le quattro classi effettivamente presenti e il gruppo V; ogni voce sale alla successiva classe nel ciclo cromatico, nell'ottava necessaria. Applicando questo passo tre volte si ottengono, insieme all'originale, quattro disposizioni. Al quarto passo si ritrova l'originale un'ottava sopra. Si possono esplorare anche i passi discendenti. Non ruotare la lista grave–acuto e non ricostruire un accordo completo includendo note omesse.

Queste operazioni modificano le altezze, ma non le quattro classi. Il soprano generalmente cambia: non sono un tour a soprano fisso. I quattro risultati non vanno tutti chiamati automaticamente «rivolti», soprattutto nelle letture senza fondamentale o con basso non strutturale. Il badge del rivolto è un'analisi armonica distinta dall'indice della disposizione.

**Conversioni:** spostare di una o due ottave le voci originali indicate, o eseguire uno scambio documentato e precisamente definito; conservare le classi ma cambiare la spaziatura e, normalmente, il gruppo V. Identificare B/T/A/S sulle altezze reali prima di intervenire. Per operazioni combinate, applicare gli spostamenti simultaneamente e riordinare soltanto dopo.

Per entrambe: quattro voci e quattro classi distinte; altezze intere con ottave, spelling della formula già corretto, nessuna deduzione dal gruppo di corde. Unisoni, raddoppi o altri numeri di voci impediscono l'accesso a queste operazioni V. Cambiare la fondamentale rimane una reinterpretazione e non rigenera note, disposizioni o candidati.

Fonti: Hober, *How Systematic Inversions Relate to the V-System*, pp. 1, 5–7; tabella Metodo 1 e Metodo 2. Il ciclo usa 2/4/6 come equivalenti di 9/11/13 soltanto per il calcolo; lo spelling e la formula visualizzati mantengono i gradi armonici appropriati.

## 2. Le quattro disposizioni dei quattordici gruppi

La tabella seguente usa Cmaj7 e parte da un esempio per ciascun gruppo con B4 al soprano. Ogni colonna successiva applica il passo sistematico ascendente. Sono esempi teorici calcolati per questa proposta, non diteggiature attribuite a Greene. Gli indici 1–4 descrivono il percorso dall'esempio, non il numero del rivolto.

| Gruppo | Disposizione 1 | Disposizione 2 | Disposizione 3 | Disposizione 4 |
|---|---|---|---|---|
| V-1 | C4 E4 G4 B4 | E4 G4 B4 C5 | G4 B4 C5 E5 | B4 C5 E5 G5 |
| V-2 | G3 C4 E4 B4 | B3 E4 G4 C5 | C4 G4 B4 E5 | E4 B4 C5 G5 |
| V-3 | E3 G3 C4 B4 | G3 B3 E4 C5 | B3 C4 G4 E5 | C4 E4 B4 G5 |
| V-4 | E3 C4 G4 B4 | G3 E4 B4 C5 | B3 G4 C5 E5 | C4 B4 E5 G5 |
| V-5 | C3 G3 E4 B4 | E3 B3 G4 C5 | G3 C4 B4 E5 | B3 E4 C5 G5 |
| V-6 | C3 E4 G4 B4 | E3 G4 B4 C5 | G3 B4 C5 E5 | B3 C5 E5 G5 |
| V-7 | G2 C4 E4 B4 | B2 E4 G4 C5 | C3 G4 B4 E5 | E3 B4 C5 G5 |
| V-8 | G2 E3 C4 B4 | B2 G3 E4 C5 | C3 B3 G4 E5 | E3 C4 B4 G5 |
| V-9 | G2 C3 E3 B4 | B2 E3 G3 C5 | C3 G3 B3 E5 | E3 B3 C4 G5 |
| V-10 | G2 C3 E4 B4 | B2 E3 G4 C5 | C3 G3 B4 E5 | E3 B3 C5 G5 |
| V-11 | E2 C3 G3 B4 | G2 E3 B3 C5 | B2 G3 C4 E5 | C3 B3 E4 G5 |
| V-12 | E2 G3 C4 B4 | G2 B3 E4 C5 | B2 C4 G4 E5 | C3 E4 B4 G5 |
| V-13 | C3 E3 G4 B4 | E3 G3 B4 C5 | G3 B3 C5 E5 | B3 C4 E5 G5 |
| V-14 | C3 E3 G3 B4 | E3 G3 B3 C5 | G3 B3 C4 E5 | B3 C4 E4 G5 |

Le 56 disposizioni sono state calcolate e confrontate col riconoscitore V esistente durante la preparazione: tutte conservano il gruppo. Alcune non hanno una realizzazione entro l'accordatura e i filtri disponibili: rimangono valide disposizioni teoriche, senza badge «suonabile».

Per un originale inserito dall'utente, la disposizione 1 è quell'originale: non spostarlo in un registro canonico. Se l'originale manca della fondamentale, usare soltanto le quattro classi presenti; il cambio di fondamentale non altera il ciclo.

## 3. Catalogo di conversioni e attribuzione

Record di ogni procedimento: identificativo stabile, origine/destinazione V, voci originali e delta MIDI, descrizione breve, soprano atteso, fonte/pagina/riga, condizioni musicali e chitarristiche, stato di verifica. Distinguere tre stati: **documentato e verificato**, **derivazione software verificata**, **da chiarire**. Uno stato non sostituisce gli altri: un procedimento può essere documentato ma ancora incongruente nel calcolo.

### Nucleo a soprano conservato

Fonte di ogni riga: **Greene, Conversion Methods, 1989/2003**, righe della destinazione indicate nella colonna «Riga». Le indicazioni di registro/corde sono mantenute separatamente dalla trasformazione teorica.

| Origine → destinazione | Delta sulle voci originali | Riga | Condizione originale aggiuntiva |
|---|---|---|---|
| V-1 → V-2 | A −12 | V-2 | nessuna esplicita |
| V-2 → V-3 | A −12 | V-3 | nessuna esplicita |
| V-3 → V-4 | T +12 | V-4.2 | nessuna esplicita |
| V-2 → V-5 | T −12 | V-5.1 | nessuna esplicita |
| V-1 → V-6 | B −12 | V-6.1 | nessuna esplicita |
| V-5 → V-6 | T +12 | V-6.3 | gruppo di corde inferiore |
| V-2 → V-7 | B −12 | V-7.2 | nessuna esplicita |
| V-3 → V-8 | T −12 | V-8.2 | nessuna esplicita |
| V-8 → V-9 | A −12 | V-9.2 | nessuna esplicita |
| V-9 → V-10 | A +12 | V-10.1 | nessuna esplicita |
| V-2 → V-10 | B,T −12 | V-10.2 | gruppo di corde più alto |
| V-5 → V-10 | T −12 | V-10.3 | gruppo di corde alto |
| V-5 → V-11 | A −24 | V-11.2 | gruppo alto; riconfigurare diteggiatura |
| V-2 → V-12 | A −24 | V-12.1 | gruppo più alto |
| V-3 → V-12 | B −12 | V-12.1 | gruppo più alto |
| V-11 → V-12 | T +12 | V-12.3 | nessuna esplicita |
| V-6 → V-13 | T −12 | V-13.1 | nessuna esplicita |
| V-1 → V-13 | B,T −12 | V-13.1 | nessuna esplicita |
| V-5 → V-14 | A −12 | V-14.2 | gruppo alto |
| V-3 → V-14 | A −12 | V-14.2 | gruppo alto |
| V-13 → V-14 | A −12 | V-14.3 | nessuna esplicita |
| V-1 → V-14 | B,T,A −12 | V-14.4 | V-1 alto |

### Nucleo a soprano cambiato

Stessa fonte primaria, righe riportate qui sotto:

| Origine → destinazione | Delta | Riga | Condizione originale |
|---|---|---|---|
| V-2 → V-4 | S −24 | V-4.1 | dalle quattro corde alte alle cinque inferiori; soprano da corda 1 a 6 |
| V-2 → V-5 | A +12 | V-5.2 | secondo o terzo gruppo di corde V-2 |
| V-4 → V-6 | T +12 | V-6.2 | gruppo inferiore |
| V-4 → V-8 | A +12 | V-8.1 | gruppo inferiore |
| V-4 → V-11 | S +12 | V-11.1 | gruppo più basso; riconfigurare diteggiatura |
| V-5 → V-12 | T +24 | V-12.2 | gruppo più basso |
| V-3 → V-13 | A +12 | V-13.2 | gruppo più basso |
| V-1 → V-14 | S +12 | V-14.1 | gruppo più basso |

Prima di renderle applicabili: verificare ogni delta su tutte le disposizioni e su più qualità, incluse estensioni e omissioni. «Soprano conservato» significa **stessa altezza effettivamente più acuta dopo l'operazione**, non soltanto assenza di un delta sulla voce S. Se una voce interna supera il soprano, il soprano cambia. Le condizioni dette «secondo/terzo/inferiore» richiedono la mappatura esatta delle corde delle lezioni: non inventare numeri di corde.

Le conversioni d'ottava possono essere esplorate come trasformazioni teoriche anche se la prescrizione chitarristica non è applicabile all'originale; in quel caso dichiarare «trasformazione teorica verificata; percorso chitarristico della fonte non verificato per queste corde». Nessun badge di esecuzione originale di Greene.

### Varianti da chiarire prima di attivarle

- **V-2 → V-9:** la riga V-9.1 del manoscritto e la sua trascrizione indicano S +24. Su C3 G3 B3 E4 produce C3 G3 B3 E6, gap 1/0/9, fuori tabella. Il Metodo 1 definisce V-9 con soprano di V-2 +12: C3 G3 B3 E5, gap 1/0/5. Non correggere silenziosamente l'autore: catalogare le due indicazioni, verificare ulteriori lezioni/errata e tenere la variante +24 inattiva. La variante +12 può essere proposta come conversione della tabella Metodo 1, con quella fonte specifica.
- **V-2 → V-4, scambio basso/alto:** documentato in V-4.3. Richiede definire con precisione spostamenti d'ottava e registri di arrivo, mantenendo il soprano; non è uno scambio delle posizioni nell'array MIDI.
- **V-6 → V-7, scambio corde esterne:** documentato in V-7.1, soprano cambiato. L'istruzione è legata alle corde e all'accordatura; non estenderla a coppie arbitrarie. Verificare le griglie originali prima dell'attivazione.
- Catalogo Hober per origine/destinazione: utile confronto indipendente, da attribuire a Hober. Non presentare tutte le sue enumerazioni come indicazioni didattiche originali di Greene.

## 4. Confronto nell'interfaccia

Solo nell'approccio **Ted Greene — V-System**, un pannello «Esplora il gruppo» sotto l'analisi della posizione, inizialmente chiuso. Due schede interne: **Disposizioni sistematiche** e **Conversioni**. Nessuna nuova barra di controlli permanente sopra la tastiera.

Disposizioni: quattro schede compatte, ciascuna con altezze, basso/soprano, gruppo V; scegliere una scheda seleziona una candidata, senza modificare l'originale. Direzione ascendente/descendente in un controllo locale; niente trasposizione automatica per adattare il registro.

Conversioni: elenco dei soli procedimenti pertinenti al gruppo originale; filtro locale «Tutte / Soprano conservato / Soprano cambiato». Riga con operazione, gruppo finale e indicazione del soprano. Fonte e condizioni dentro «Dettagli del procedimento». Varianti aperte in una sezione informativa separata, senza pulsante di applicazione.

Quando si seleziona un candidato:

1. **Originale** sempre visibile nella tastiera principale.
2. **Disposizione candidata** con altezze esatte e movimenti delle voci originali; classificazione V calcolata, non solo dichiarata dal catalogo.
3. **Posizioni trovate** dopo ricerca: altezze invariate, stessi filtri già disponibili. Priorità alle corde originali quando possibile; ricerca su tutte le corde soltanto tramite opzione esplicita. Distinguere «nessuna sulle corde originali» da «nessuna nei filtri». Una realizzazione non è una diteggiatura verificata.
4. **Confronto** di due diagrammi, originale/candidata, e quattro righe di movimento (nota iniziale, nota finale, delta, corde). Desktop affiancati; mobile uno sotto l'altro. Non affidare la distinzione al solo colore.
5. **Usa questa posizione** abilitato soltanto quando è selezionata una realizzazione su corde/tasti. Il comando esplicito sostituisce l'originale anche se il blocco è attivo, come nella versione attuale. Se esiste soltanto la teoria, il comando non è disponibile.

Cambi di fondamentale riscrivono le letture di originale e candidata senza cambiare le geometrie. Nuova selezione teorica o nuovi filtri non sostituiscono l'originale. Una modifica manuale dell'originale invalida il candidato e richiede una nuova selezione. Dopo applicazione, «Ripristina originale» conserva uno snapshot locale finché si resta nel confronto. Le identità delle voci sono esplicite: dopo una conversione il vecchio alto può diventare basso.

## 5. Esempi verificati nella preparazione

Tasti 6→1, x = muta. Le realizzazioni sono state trovate con il motore esistente; difficoltà stimata, non esecuzione certificata.

**A. Disposizione sistematica V-2.** Originale x–3–5–4–5–x = C3 G3 B3 E4. Passo successivo: E3 B3 C4 G4; stessa spaziatura 1/0/1 e V-2. Realizzazione x–x–2–4–1–3. Movimenti: C3→E3 (+4), G3→B3 (+4), B3→C4 (+1), E4→G4 (+3). Soprano cambiato; Cmaj7 completo, basso E. Per una lettura Am9 senza fondamentale, il ciclo usa ancora C/E/G/B, senza introdurre A.

**B. V-2 → V-3 a soprano conservato.** Stesso originale. Alto originale B3 −12: B2 C3 G3 E4. Gap 0/1/2, V-3. Candidata 7–3–5–x–5–x; soprano E4 immutato, basso B2; Cmaj7/B completo. Una ricerca più restrittiva può non trovare una realizzazione: il risultato teorico resta B2 C3 G3 E4.

**C. V-2 → V-9 dalla tabella Metodo 1.** Stesso originale; soprano E4 +12: C3 G3 B3 E5, gap 1/0/5. Candidata 8–10–9–x–x–12; soprano E5 cambiato, basso C3. Fonte Metodo 1; distinto dalla variante +24 della riga V-9.1 ancora aperta.

**D. V-3 → V-12 a soprano conservato.** E3 G3 C4 B4 → E2 G3 C4 B4 abbassando il basso di un'ottava. Gap 4/1/2. Esempio di realizzazione 0–x–5–5–x–7. La possibilità con corde a vuoto è trovata dal software; la prescrizione originale di gruppo alto non viene attribuita automaticamente a questa posizione.

## 6. Verifiche prima dell'attivazione

- Le 56 fixture della tabella, confronto con Metodo 1 e Metodo 2, conservazione del gruppo e delle classi; quarto passo = originale +12. Ascendente seguito da discendente restituisce altezze esatte. Nessuna rotazione arbitraria.
- Tutti i 495 insiemi × quattordici gruppi × quattro disposizioni, generati teoricamente; verifica indipendente dei gap. Non affermare realizzabilità fisica di questi insiemi.
- Ogni conversione: target indipendente per almeno una fixture; poi tutte le disposizioni e qualità, confrontando gruppo atteso, classi e soprano effettivo. Condizioni di corde e registro testate separatamente dalle identità musicali.
- Spostamenti combinati simultanei; scambi definiti tramite delta o assegnazioni concrete, mai permutazione dell'array senza cambio sonoro.
- V-2 S+24 come fixture negativa: fuori dai gruppi, mai etichettata V-9. Fonte discordante conservata nella documentazione.
- Estensioni/rootless: ciclo soltanto delle classi presenti; fondamentale selezionata invariabile. Spelling Dmaj7 e reinterpretazione G♭→F♯ restano coperti dai test esistenti.
- Ricerca esatta, corde originali e alternative; nessun adattamento di ottave per fare apparire risultati. Candidati senza realizzazione, fuori accordatura/tasti o oltre i filtri restano teoria.
- Browser: selezione, ricerca e filtri non modificano originale con o senza blocco; solo «Usa questa posizione» applica; ripristino esatto; cambi manuali invalidano il candidato. Mobile, focus e lettura dei diagrammi distinti.

## 7. Sequenza proposta

1. Disposizioni sistematiche, fixture e pannello di confronto condiviso.
2. Conversioni d'ottava del nucleo verificato, con fonte e condizioni per ciascuna.
3. Mappatura delle condizioni chitarristiche alle griglie; scambi di voci soltanto dopo verifica.
4. Revisione delle varianti discordanti e del catalogo Hober; nessuna attivazione per semplice analogia.

La prima parte può basarsi sul modello di altezze e sul riconoscitore V già affidabili. Scambi di voci, riferimenti esatti ai gruppi di corde e la variante V-9 +24 richiedono approfondimento prima di essere presentati come procedimenti originali applicabili.

## Fonti

- [Greene, Conversion Methods, 1989/2003](https://tedgreene.com/images/lessons/v_system/V-System_Conversion_Methods_1989-02-04and2003-06-19.pdf): manoscritto e trascrizione, righe V-1…V-14. Il manoscritto è stato controllato visivamente anche per V-9.
- [Metodo 1 — spiegazione della tabella di Greene, Hober](https://tedgreene.com/images/lessons/v_system/03_Method1_HowToRecognize.pdf), p. 2 e pp. 4–5.
- [Metodo 2 — Hober](https://tedgreene.com/images/lessons/v_system/10_Method_2-The_Chord_Tone_Gap_Method.pdf), tabella e note sulle omissioni.
- [Systematic Inversions — Hober](https://www.tedgreene.com/images/lessons/v_system/27_How_Systematic_Inversions_Relate_to_the_V-System.pdf), pp. 1, 5–7.
- [Fixed Soprano Tour — Hober](https://www.tedgreene.com/images/lessons/v_system/24_The_Fixed_Soprano_Tour.pdf): esempi di Greene, ricostruzioni e denominazione di Hober da distinguere.

Nessuna nuova funzione implementata durante questa proposta. Nessun altro chitarrista aggiunto. Il documento di proposta resta fuori dal commit della prima versione, per distinguerlo dal software salvato.

Controllo preliminare aggiuntivo: i 30 procedimenti d'ottava delle due tabelle sono stati calcolati su una fixture Cmaj7 per gruppo. Tutti producono gruppo finale e stato del soprano attesi (22 conservato, 8 cambiato). Questo controllo non sostituisce la verifica su tutte le disposizioni/qualità né quella delle condizioni sulle corde.

## Esito dell'implementazione approvata

La proposta è stata approvata e implementata localmente per disposizioni sistematiche, confronto e conversioni d'ottava. I risultati e i limiti sono registrati nella specifica principale. Verifica esaustiva delle 31 conversioni (30 della proposta più V-2→V-9 +12 del Metodo 1) su 495 insiemi e quattro disposizioni; 27.720 originali sistematici nei due versi. I percorsi sulle corde rimangono non verificati e non attivati. Provenienza e verifica sono campi indipendenti, compresa la variante documentata +24 inattiva. Nessun nuovo commit o pubblicazione.
