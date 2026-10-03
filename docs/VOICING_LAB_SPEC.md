# Voicing Lab — specifica musicale e interfaccia

Riferimento grafico: commit approvato e pubblicato `3cf7f86`. La prima versione è locale, senza modifiche agli altri strumenti e senza pubblicazione. Questa specifica conserva anche le fasi successive approvate.

## Principi e precisazioni approvate

- Identità fisica della posizione: corde, tasti, altezze assolute. C4 = MIDI 60. Accordatura E2 A2 D3 G3 B3 E4. Il cambio di fondamentale in analisi non modifica mai la posizione, anche senza blocco.
- Il blocco conserva la posizione durante nuove ricerche e costruzioni. La modifica manuale e il comando esplicito «Usa posizione» rimangono consentiti. I risultati sono confrontabili con la posizione conservata.
- Completezza della formula e dipendenza dal contesto sono dimensioni indipendenti. Una formula completa può essere ambigua. Una formula con omissioni non è automaticamente inutilizzabile. Le letture senza fondamentale richiedono contesto.
- Separare disposizione teorica (altezze), realizzazione sulla chitarra (assegnazione a corde/tasti) e difficoltà stimata. Una posizione trovata non viene dichiarata automaticamente suonabile. La stima geometrica non verifica dita, barrè, mobilità o esecuzione.
- Poche letture convenzionali motivate; quando il dizionario non offre una sigla utile, presentare la struttura intervallare.

## Accessi e interfaccia

Due accessi: «Analizza una posizione» e «Costruisci». Tastiera protagonista con sei corde e tasti 0–24, una nota per corda, mute e input numerico equivalente. Vista note con ottave / gradi. Ordine sonoro sempre grave–acuto; mantenere assegnazione alle corde anche con voci incrociate.

Desktop: barra accessi/approccio, colonna controlli, tastiera e letture a destra. Mobile: controlli essenziali, tastiera scorrevole e letture in colonna. Avorio, verde, bordi sottili e intestazione compatta coerenti con il riferimento.

Approcci: Generale e Ted Greene — V-System. Generale costruisce close/drop e riconosce il gruppo V risultante. Greene mette in evidenza i gap e la tabella dei quattordici gruppi; nella prima versione non pretende di offrire conversioni o costruzioni originali di Greene. Nessun altro chitarrista prima di studio e verifica.

Tre controlli concettualmente separati nel progetto completo:

1. Fondamentale interpretativa: modifica gradi, spelling, sigle e omissioni; non aggiunge note.
2. Basso esterno opzionale: aggiunge una nota con ottava, realmente sotto il basso attuale. Accompagnamento separato o corda libera; nessuna sostituzione implicita. Fase successiva, senza controllo inattivo.
3. Centro modale opzionale: esplora compatibilità senza modificare fondamentale o posizione. Fase successiva, senza controllo inattivo.

## Precisione armonica

Rivolto armonico = basso rispetto alla formula interpretata. Disposizione = ordine e distanze reali. Reinterpretazione = nuova fondamentale sulle stesse note. Inversione intervallare = trasformazione rispetto a un asse e conseguenti altre note; non è un rivolto e non è implementata nella prima versione.

Slash chord: il basso è realmente presente. Se non è una nota strutturale, non assegnare automaticamente un numero di rivolto. Per accordi di sesta mostrare «basso sulla sesta» senza imporre un terzo rivolto. Non assegnare un rivolto completo alle letture senza fondamentale.

Spelling dipendente dalla formula: G♭ in Cø7 e F♯ in D7(♭9,♭13). Conservare altezze identiche anche quando cambiano i nomi.

Dizionario iniziale: triadi maggiore/minore/sus, quattro voci maj7, 7, m7, ø7, dim7, m(maj7), 6, m6, add9; formule 9, m9, maj9 e 7(♭9,♭13), con omissioni dichiarate e vincoli sui componenti essenziali. Non è un riconoscitore esaustivo di qualsiasi sigla jazz. Principale sulla fondamentale selezionata e massimo due alternative ordinate per poche omissioni e formule compatte. La presenza di una formula completa non elimina l'ambiguità.

## Close e drop generali

Quattro classi distinte in ciclo cromatico; close = quattro note consecutive entro un'ottava. Generare quattro disposizioni iniziali, alzando di un'ottava le note ruotate alla fine. Registro selezionabile.

Voci numerate dall'alto prima della trasformazione: 1 soprano, 2 alto, 3 tenore, 4 basso. Per ogni voce selezionata sottrarre 12 semitoni, simultaneamente, poi ordinare. Nessuna rinumerazione intermedia.

| Operazione | Da C4 E4 G4 B4 | Gruppo V calcolato |
|---|---|---|
| Close | C4 E4 G4 B4 | V-1 |
| Drop 2 | G3 C4 E4 B4 | V-2 |
| Drop 3 | E3 C4 G4 B4 | V-4 |
| Drop 4 | C3 E4 G4 B4 | V-6 |
| Drop 2+3 | E3 G3 C4 B4 | V-3 |
| Drop 2+4 | C3 G3 E4 B4 | V-5 |
| Drop 3+4 | C3 E3 G4 B4 | V-13 |
| Drop 2+3+4 | C3 E3 G3 B4 | V-14 |

La corrispondenza generale viene verificata sui 495 insiemi di quattro classi, tutte le quattro disposizioni strette e otto operazioni. Queste equivalenze sono deduzioni software dalla classificazione, non una tabella di nomenclatura attribuita all'autore. Numeri V e numeri drop non sono intercambiabili. Drop doppi e altri procedimenti restano aperti finché non verificati.

Ricerca: per ogni altezza MIDI trovare corde e tasti esatti, con una nota per corda. Filtri per corde, intervallo tasti e apertura delle note premute; le corde a vuoto non aumentano l'apertura geometrica. Non trasporre né adattare note ai filtri. Nessun risultato conserva la disposizione teorica. Non assumere ordine di altezza coincidente con ordine delle corde.

## Ted Greene — quattordici gruppi

Sistema di Greene per quattro note senza raddoppi. Classificazione iniziale con Metodo 2 di James Hober: contare quante occorrenze delle quattro classi presenti si inseriscono strettamente fra B–T, T–A, A–S. Escludere fondamentale o quinta omesse. B/T/A/S sono definiti dalle altezze effettive.

| Gruppo | Gap | Cmaj7 con soprano B4 (costruzione teorica software) |
|---|---|---|
| V-1 | 0 0 0 | C4 E4 G4 B4 |
| V-2 | 1 0 1 | G3 C4 E4 B4 |
| V-3 | 0 1 2 | E3 G3 C4 B4 |
| V-4 | 2 1 0 | E3 C4 G4 B4 |
| V-5 | 1 2 1 | C3 G3 E4 B4 |
| V-6 | 4 0 0 | C3 E4 G4 B4 |
| V-7 | 5 0 1 | G2 C4 E4 B4 |
| V-8 | 2 2 2 | G2 E3 C4 B4 |
| V-9 | 1 0 5 | G2 C3 E3 B4 |
| V-10 | 1 4 1 | G2 C3 E4 B4 |
| V-11 | 2 1 4 | E2 C3 G3 B4 |
| V-12 | 4 1 2 | E2 G3 C4 B4 |
| V-13 | 0 4 0 | C3 E3 G4 B4 |
| V-14 | 0 0 4 | C3 E3 G3 B4 |

Formule cronologiche del Metodo 1, seguendo il ciclo delle quattro classi, non l'ordine sonoro:

- V-1: BTAS, SBTA, ASBT, TASB.
- V-2: TABS, STAB, BSTA, ABST.
- V-3: ABTS, SABT, TSAB, BTSA.
- V-4: STBA, ASTB, BAST, TBAS.
- V-5: BATS, SBAT, TSBA, ATSB.
- V-8: TBSA, ATBS, SATB, BSAT.

Gruppi derivati: V-6 = basso di V-1 -12; V-7 = basso di V-2 -12; V-9 = soprano di V-2 +12; V-10 = basso e tenore di V-2 -12; V-11 = soprano di V-4 +12; V-12 = basso di V-3 -12; V-13 = basso e tenore di V-1 -12; V-14 = soprano di V-1 +12.

Quattro disposizioni sistematiche per gruppo: ciascuna voce passa alla successiva classe del ciclo conservando il gruppo. Non ruotare semplicemente l'elenco grave–acuto. Raddoppi, numero diverso da quattro voci e gap fuori tabella non vengono forzati in un gruppo vicino. Con un futuro basso aggiunto, classificare separatamente le quattro voci originali.

### Conversioni documentate — fase successiva

Soprano fisso; spostamenti di un'ottava salvo indicazione:

| Origine → destinazione | Operazione |
|---|---|
| V-1 → V-2 | abbassa alto |
| V-2 → V-3 | abbassa alto |
| V-3 → V-4 | alza tenore |
| V-2 → V-5 | abbassa tenore |
| V-1 → V-6 | abbassa basso |
| V-2 → V-7 | abbassa basso |
| V-3 → V-8 | abbassa tenore |
| V-8 → V-9 | abbassa alto |
| V-9 → V-10 | alza alto |
| V-5 → V-11 | abbassa alto due ottave |
| V-3 → V-12 | abbassa basso |
| V-6 → V-13 | abbassa tenore |
| V-13 → V-14 | abbassa alto |

Soprano diverso: V-2 → V-4 abbassando soprano due ottave; V-4 → V-11 e V-1 → V-14 alzandolo un'ottava. Conservare condizioni di corde e registro riportate nelle note originali. Scambi di voci e catalogo completo richiedono trascrizione, fixture e verifica aggiuntive. Tracciare voce originale, spostamento, soprano effettivo, gruppo finale e fonte. Il «Fixed Soprano Tour» è il nome di Hober; le sue ricostruzioni della sequenza usata da Greene sono ipotesi, non dichiarazioni dell'autore.

## Tre esempi completi

Tasti 6→1, x = muta.

1. **x 3 5 4 5 x**: C3 G3 B3 E4; V-2 (1 0 1); origine close G3 B3 C4 E4, drop 2. Cmaj7, gradi 1 5 7 3, formula completa ma ambigua. A: Am9/C, gradi ♭3 ♭7 9 5, fondamentale omessa, contesto richiesto. Futuro A2 esterno: Am9 completo; sulla chitarra 5 3 5 4 5 x. Centro C futuro: ionico/lidio compatibili, manca F/F♯ discriminante.
2. **x 0 2 0 1 x**: A2 E3 G3 C4; V-2; origine close E3 G3 A3 C4, drop 2. Am7, 1 5 ♭7 ♭3, completo e ambiguo. C6/A, 6 3 5 1, completo, basso sulla sesta. Fmaj9/A, 3 7 9 5, fondamentale omessa. Futuro F2 esterno: Fmaj9 completo, 1 0 2 0 1 x. Centro A futuro: dorico/eolio/frigio compatibili, seconda e sesta assenti.
3. **x 3 4 3 4 x**: C3 G♭3 B♭3 E♭4; V-2; origine close G♭3 B♭3 C4 E♭4, drop 2. Cø7, 1 ♭5 ♭7 ♭3, completo e ambiguo. A♭9/C, 3 ♭7 9 5, fondamentale omessa. Su D conservare soltanto **D7(♭9,♭13)/C**, gradi ♭7 3 ♭13 ♭9, fondamentale e quinta omesse; G♭ diventa F♯ senza cambiare altezza. Futuro A♭2 esterno: A♭9 completo, 4 3 4 3 4 x. Centro C futuro: locrio/locrio ♮2 compatibili, manca D♭/D.

## Compatibilità modali — fase successiva

Inclusione delle note sonore nelle scale candidate di famiglie esplicite (maggiore, minore melodica, minore armonica). Mostrare centro, famiglia, note caratteristiche presenti e discriminanti assenti; nessun modo unico dedotto da quattro note. Il basso esterno attivo partecipa al confronto. Compatibilità non prova funzione armonica.

## Verifiche e sequenza

1. Modello note, input e fondamentale indipendente; tre esempi e spelling.
2. Close/drop e ricerca esatta; trasformazioni combinate simultanee, tutte le disposizioni, no risultati fuori filtri e voci incrociate.
3. Letture limitate motivate, omissioni e completezza/context indipendenti.
4. V-System: quattordici fixture indipendenti dal codice, invarianza sotto trasposizione, confronto con tabella Metodo 1 e quiz delle fonti prima di ampliare il catalogo.
5. UI responsive: cambio fondamentale con e senza blocco, conservazione durante ricerca, risultati espliciti, assenza di errori/overflow della pagina. Tastiera con scorrimento locale.
6. Dopo questa prima versione: conversioni verificate; basso esterno; compatibilità modali; eventuale ampliamento del dizionario e stima ergonomica più robusta.

Riutilizzo esaminato: accordatura MIDI e normalizzazione di Goodrick importate senza modifica. Ricerca esatta nuova perché Goodrick impone l'ordine sonoro coincidente con quello delle corde. Set Explorer conferma il principio del basso calcolato per altezza assoluta. Harmonic Intersections conserva classi di altezza: non riutilizzare il mapper per classificare gli spazi reali. Nessuna modifica alle copie integrate o autonome degli altri strumenti.

## Fonti e attribuzione

- [Archivio V-System](https://tedgreene.com/teaching/v_system.asp).
- [Metodo 1, spiegazione della tabella di Greene — Hober](https://tedgreene.com/images/lessons/v_system/03_Method1_HowToRecognize.pdf).
- [Metodo 2, Chord Tone Gap Method — Hober](https://tedgreene.com/images/lessons/v_system/10_Method_2-The_Chord_Tone_Gap_Method.pdf).
- [Greene, Conversion Methods, 1989/2003](https://tedgreene.com/images/lessons/v_system/V-System_Conversion_Methods_1989-02-04and2003-06-19.pdf).
- [Fixed Soprano Tour — Hober](https://www.tedgreene.com/images/lessons/v_system/24_The_Fixed_Soprano_Tour.pdf).
- [Systematic Inversions — Hober](https://www.tedgreene.com/images/lessons/v_system/27_How_Systematic_Inversions_Relate_to_the_V-System.pdf).

Nota sintetica UI: «V-System di Ted Greene; spiegazioni e Metodo 2 di James Hober. Ricerca delle posizioni, selezione delle letture e stima geometrica sono estensioni di Guitar Theory Lab.»

## Stato della prima versione e verifica locale — 3 ottobre 2026

Implementati input e analisi, fondamentale indipendente dalla posizione, blocco per nuove ricerche, close e sette drop dalle quattro disposizioni, ricerca delle altezze esatte, letture con omissioni e classificazione V con fonti. Nessun controllo provvisorio per conversioni, basso esterno o modi.

Avvio: `npm run dev`; aprire `http://127.0.0.1:5180/tools/voicing-lab`. Il catalogo registra Voicing Lab soltanto quando `import.meta.env.DEV` è vero: la build ordinaria di produzione lo esclude. Nessuna pubblicazione eseguita.

Verifica dedicata: `npm run test:voicing` — 9 test musicali e 6 verifiche Chromium a desktop 1440px, mobile 390px e 320px, tutti superati. Include 15.840 trasformazioni (495 insiemi × quattro close × otto operazioni), tre esempi, lettura D corretta, voci incrociate, fondamentale con/senza blocco, ricerca con/senza risultati, attribuzione e assenza di overflow della pagina. Il riconoscimento dei quattordici esempi è confrontato anche con una codifica indipendente della tabella Metodo 1.

Regressioni: 12 verifiche browser preesistenti e 54 test autonomi degli altri strumenti superati. Build ordinaria e build locale di sviluppo comprensiva del nuovo strumento riuscite. Non sono stati modificati i sorgenti degli altri strumenti.

Limiti reali: accordatura standard, sei corde, 24 tasti, una nota per corda, costruzione di quattro classi distinte; dizionario armonico circoscritto; difficoltà geometrica senza verifica delle diteggiature; classificazione V esclusa per raddoppi e altre cardinalità; conversioni Greene, basso esterno e modi rimandati. Il selettore Greene mette in evidenza la classificazione e non dichiara una costruzione autonoma Greene già disponibile. Non sono inclusi audio o salvataggio persistente.

## Correzioni della prima versione — spelling e letture compatte

Lo spelling della costruzione deriva dalla fondamentale e dai gradi della formula scelta, anche nelle quattro close iniziali, nei drop e nei risultati. Dmaj7 usa D–F♯–A–C♯. I risultati conservano la fondamentale e la formula della ricerca originale: modificare i controlli non riscrive le etichette dei risultati precedenti. La funzione di spelling modifica soltanto la presentazione; altezze MIDI, assegnazioni a corde/tasti e classificazione V restano quelle precedenti.

Per strutture libere, convenzione esplicita di nomi cromatici con bemolli, senza dedurre una formula armonica dalla struttura. Le eventuali interpretazioni della posizione restano nel pannello di analisi separato.

Ogni scheda di lettura presenta una sola riga di gradi, una sola riga di omissioni quando presenti, e indicatori distinti di completezza e contesto/ambiguità. Eliminati gli elenchi duplicati e la frase sulla completezza già rappresentata dall'indicatore. Una breve motivazione rimane per letture implicite quando spiega il ruolo della terza/settima o del tritono.

Verifiche aggiornate: 11 test musicali e 8 verifiche browser superati; build locale comprensiva del nuovo strumento riuscita. Dmaj7 verificato in tutte le quattro close e otto operazioni; G♭ → F♯ della posizione semidiminuita verificato con e senza blocco, conservando MIDI, corde, tasti e V-2. Le precedenti verifiche esaustive di close/drop e dei quattordici gruppi V passano invariate. Nessuna aggiunta di conversioni, basso esterno o modi; nessuna modifica agli altri strumenti, commit o pubblicazione.
