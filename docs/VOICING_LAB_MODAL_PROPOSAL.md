# Voicing Lab — proposta per le compatibilità modali

Stato: proposta da approvare prima dell'implementazione. Nessun controllo modale o motore di compatibilità aggiunto all'app. Fase basso esterno salvata nel commit locale `d9eca8f`; test dedicati: 19 musicali e 27 browser superati. Le tastiere degli altri strumenti, monetizzazione e assistente AI restano attività successive.

## Obiettivo e significato del risultato

Confrontare tutte le note attualmente sonore con scale di sette classi su un centro scelto esplicitamente. Il risultato indica appartenenza delle altezze alla scala, non funzione armonica, tonalità stabilita, qualità percettiva, nota da evitare o raccomandazione d'improvvisazione. Anche un solo risultato nel catalogo iniziale resta una compatibilità entro quel catalogo, non la prova di un modo unico.

La fondamentale interpretativa, il basso esterno e il centro modale sono tre stati indipendenti. Il centro è una nota con spelling, senza un'ottava obbligatoria: è un riferimento alle classi, non una nuova nota sonora. Può essere assente dalla posizione: in quel caso si segnala «Centro non presente nelle note sonore». Non viene dedotto dalla nota più grave, dall'accordo o dal basso aggiunto. Nessuna preselezione silenziosa della fondamentale come centro.

Cambiare centro, famiglie, modo osservato o livello dei dettagli modifica soltanto il confronto. Nessun tasto, corda, ottava, nota, basso, sigla armonica scelta o gruppo V viene modificato. Scegliere una lettura armonica su A non seleziona automaticamente un centro A; scegliere centro A non cambia la fondamentale interpretativa.

## Catalogo iniziale: tre famiglie, 21 modi

Tutte e tre le famiglie attive per impostazione iniziale. Base maggiore `[0,2,4,5,7,9,11]`; minore melodica `[0,2,3,5,7,9,11]`; minore armonica `[0,2,3,5,7,8,11]`. La melodica usa la forma ascendente stabile in entrambi i versi, secondo la convenzione jazz: non si fondono forma ascendente e discendente in una scala da nove classi. La distinzione dalla pratica classica è spiegata nei dettagli ([Open Music Theory](https://openmusictheory.github.io/scales.html), [Dirk Laukens, minore melodica](https://www.jazzguitar.be/blog/melodic-minor-modes)).

Da ciascuna base si ricavano sette rotazioni e si normalizza a zero l'inizio. Con centro scelto T si traspongono le formule di T; non si mantengono arbitrariamente tutte le scale parenti su C. Le formule seguenti sono fissate come convenzione scalare: sette gradi successivi, una lettera per grado. I nomi italiani sono etichette editoriali; nei dettagli restano nome originale della fonte, famiglia, numero del modo e formula.

| ID | Famiglia / modo | Nome da mostrare | Formula rispetto al centro |
| --- | --- | --- | --- |
| MAJ-I | Maggiore I | Ionico | 1 2 3 4 5 6 7 |
| MAJ-II | Maggiore II | Dorico | 1 2 ♭3 4 5 6 ♭7 |
| MAJ-III | Maggiore III | Frigio | 1 ♭2 ♭3 4 5 ♭6 ♭7 |
| MAJ-IV | Maggiore IV | Lidio | 1 2 3 ♯4 5 6 7 |
| MAJ-V | Maggiore V | Misolidio | 1 2 3 4 5 6 ♭7 |
| MAJ-VI | Maggiore VI | Eolio | 1 2 ♭3 4 5 ♭6 ♭7 |
| MAJ-VII | Maggiore VII | Locrio | 1 ♭2 ♭3 4 ♭5 ♭6 ♭7 |
| MM-I | Melodica I | Minore melodica | 1 2 ♭3 4 5 6 7 |
| MM-II | Melodica II | Dorico ♭2 | 1 ♭2 ♭3 4 5 6 ♭7 |
| MM-III | Melodica III | Lidio aumentato | 1 2 3 ♯4 ♯5 6 7 |
| MM-IV | Melodica IV | Lidio dominante | 1 2 3 ♯4 5 6 ♭7 |
| MM-V | Melodica V | Misolidio ♭6 | 1 2 3 4 5 ♭6 ♭7 |
| MM-VI | Melodica VI | Locrio ♮2 | 1 2 ♭3 4 ♭5 ♭6 ♭7 |
| MM-VII | Melodica VII | Superlocrio / alterata | 1 ♭2 ♭3 ♭4 ♭5 ♭6 ♭7 |
| HM-I | Armonica I | Minore armonica | 1 2 ♭3 4 5 ♭6 7 |
| HM-II | Armonica II | Locrio ♮6 | 1 ♭2 ♭3 4 ♭5 6 ♭7 |
| HM-III | Armonica III | Ionico ♯5 | 1 2 3 4 ♯5 6 7 |
| HM-IV | Armonica IV | Dorico ♯4 | 1 2 ♭3 ♯4 5 6 ♭7 |
| HM-V | Armonica V | Frigio dominante | 1 ♭2 3 4 5 ♭6 ♭7 |
| HM-VI | Armonica VI | Lidio ♯2 | 1 ♯2 3 ♯4 5 6 7 |
| HM-VII | Armonica VII | Superlocrio ♭♭7 | 1 ♭2 ♭3 ♭4 ♭5 ♭6 ♭♭7 |

Nomenclatura confrontata con le lezioni originali degli autori: [Dirk Laukens, modi maggiori](https://www.jazzguitar.be/blog/guitar-modes/), [Dirk Laukens, modi melodici](https://www.jazzguitar.be/blog/melodic-minor-modes), [Stef Ramin, modi armonici](https://www.jazz-guitar-licks.com/pages/guitar-scales-modes/modes-of-the-harmonic-minor-scale/). Nei dettagli: lidio dominante = lidio ♭7; locrio ♮2 = eolio ♭5; superlocrio = locrio ♭4; superlocrio ♭♭7 = ultralocrio. Gli alias non producono risultati duplicati. Evitare «locrio ♯2/♯6» come etichetta principale: qui si intende la seconda/sesta naturale rispetto alla formula maggiore, non una seconda/sesta aumentata.

## Note sonore, classi e compatibilità completa

Il modello fisico resta la lista ordinata delle note con MIDI, ottava, identità e provenienza: quattro voci della posizione e, se attivo, basso aggiunto separato o su corda inutilizzata. Includere il basso anche se esterno alla formula dell'accordo: Cmaj7/A può essere armonicamente Cmaj7 sopra A, ma A partecipa comunque al confronto con la scala.

Per il solo test di appartenenza si usa l'insieme delle classi di tutte queste note, S. Per ogni modo trasposto, M:

- **Compatibilità completa:** `S ⊆ M`. Etichetta «Tutte le note sonore nella scala»; conteggio delle classi presenti, per esempio «4 delle 7 classi». Non significa che tutte le sette note siano già suonate.
- **Affinità parziale:** almeno una classe sonora appartiene a M e almeno una ne è fuori. Conteggi `|S ∩ M| / |S|`, elenco delle note sonore fuori dalla specifica scala e gradi della scala non presenti. Nessuna percentuale di probabilità o di qualità musicale.
- Nessuna affinità se l'intersezione è vuota; dettaglio disponibile solo nel confronto completo del catalogo.

I risultati completi e parziali hanno viste separate. In «Compatibili» non compare mai una scala con note fuori scala; se l'elenco è vuoto, mostrare «Nessun modo delle famiglie selezionate contiene tutte le note». Le affinità restano un'azione esplicita, non un riempimento automatico dell'elenco vuoto. Nella vista parziale l'ordine è numero crescente di classi sonore esterne, poi ordine stabile del catalogo, senza raccomandazioni implicite.

Le note fuori scala riguardano quel modo specifico, non sono definite incompatibili con l'accordo o sbagliate in assoluto. Il basso A esterno alla formula Cmaj7 non viene marcato per questo motivo come fuori scala: l'appartenenza si verifica per ciascun modo.

Raddoppiare una classe in un'altra ottava conserva le compatibilità, pur aumentando le altezze reali. Un basso che aggiunge una nuova classe può conservare o restringere l'elenco, mai ampliarlo a centro e famiglie invariati: `Compatibili(S ∪ {b}) ⊆ Compatibili(S)`. Ottave, disposizione, gruppo V e corde non sostituiscono questo criterio.

## Gradi, spelling e informazioni mancanti

Ogni risultato mostra i gradi delle note SONORE rispetto al centro, conservando l'ordine reale dal grave all'acuto; la riga del basso aggiunto è identificata. Nel dettaglio, ogni altezza reale conserva MIDI e provenienza mentre il suo nome modale deriva dal centro e dal grado della scala. Non riusare ciecamente le etichette dell'analisi dell'accordo.

Esempio: G♭3 nella lettura Cø7 è la stessa altezza di F♯3 in C dorico ♯4. L'analisi armonica conserva il proprio spelling; la scheda modale mostra «F♯3 · ♯4», eventualmente con il nome armonico nei dettagli. Spelling del basso scelto dall'utente e spelling modale restano distinguibili. Gli enarmonici non costituiscono note aggiunte né trasformazioni.

Per il superlocrio su C la grafia scalare è C D♭ E♭ F♭ G♭ A♭ B♭; in una lettura dominante F♭ può essere E e E♭ può essere D♯. Il pannello non assume tale lettura: formula scalare principale, alias funzionali solo nei dettagli e chiaramente enarmonici. Per il superlocrio ♭♭7 su C si conserva B♭♭, non si sostituisce il grado con 6 per comodità. Ottave dei nomi correttamente derivate anche per C♭/B♯ e doppi accidenti.

Due informazioni diverse:

1. **Note caratteristiche presenti:** gradi che una fonte o la nostra legenda editoriale mette in rilievo, se effettivamente suonati. Esempi: ♯4 del lidio, 6 del dorico, ♭2 del frigio, ♭6 dell'eolio, ♭5 del locrio; combinazioni alterate per le altre famiglie. Non tutte sono uniche nel catalogo. La legenda deve dichiarare provenienza e criterio, senza simulare una diagnosi.
2. **Note discriminanti assenti:** note che distinguono due scale ancora compatibili e che non sono nelle note sonore. C ionico/C lidio: F/F♯; C lidio/C lidio ♯2: D/D♯. Non sono omissioni della formula dell'accordo e non indicano un'incompletezza del voicing.

Il confronto discriminante è calcolato sulle differenze degli insiemi di scala, `M₁ △ M₂`, verificando l'assenza da S. Non lo si confonde con le differenze solo di grafia: ♭5 e ♯4 alla stessa altezza non discriminano due scale per suono. Se due modi completi sono entrambi rimasti nell'elenco, le note che li separano non possono già essere sonore. Evitare il messaggio «modo confermato» anche in presenza di un grado caratteristico.

La selezione dei gradi caratteristici non è un assioma universale. Propongo la seguente legenda esplicita: per la maggiore riprende i gradi messi in rilievo nella lezione di Laukens (9/♯11/♭13 ricondotti a 2/♯4/♭6); per le famiglie minori è una nostra selezione editoriale delle alterazioni e coppie distintive, coerente con le formule documentate. Il dettaglio ne dichiara il criterio. Si evidenziano soltanto i gradi effettivamente presenti, senza attribuire un modo o una funzione sulla base di questa legenda.

| ID | Gradi da mettere in rilievo, se sonori | Provenienza della selezione |
| --- | --- | --- |
| MAJ-I | 3, 7 | Laukens, ionico |
| MAJ-II | 2, 6 | Laukens, dorico |
| MAJ-III | ♭2, ♭6 | Laukens, frigio |
| MAJ-IV | ♯4, 7 | Laukens, lidio |
| MAJ-V | 6, ♭7 | Laukens, misolidio |
| MAJ-VI | ♭6 | Laukens, eolio |
| MAJ-VII | ♭5 | Laukens, locrio |
| MM-I | ♭3, 6, 7 | Nostra legenda, minore con sesta/settima naturali |
| MM-II | ♭2, 6 | Nostra legenda, seconda abbassata e sesta naturale |
| MM-III | ♯4, ♯5 | Nostra legenda, quarta/quinta aumentate |
| MM-IV | ♯4, ♭7 | Nostra legenda, coppia lidia/dominante |
| MM-V | ♭6, ♭7 | Nostra legenda, sesta minore e settima minore |
| MM-VI | 2, ♭5 | Nostra legenda, seconda naturale e quinta diminuita |
| MM-VII | ♭4 | Nostra legenda, differenza rispetto al locrio |
| HM-I | ♭6, 7 | Nostra legenda, sesta minore e settima maggiore |
| HM-II | ♭5, 6 | Nostra legenda, quinta diminuita e sesta naturale |
| HM-III | ♯5, 7 | Nostra legenda, quinta aumentata e settima maggiore |
| HM-IV | ♯4, 6 | Nostra legenda, quarta aumentata e sesta naturale |
| HM-V | ♭2, 3 | Nostra legenda, seconda minore e terza maggiore |
| HM-VI | ♯2, ♯4 | Nostra legenda, seconda/quarta aumentate |
| HM-VII | ♭4, ♭♭7 | Nostra legenda, quarta diminuita e settima diminuita |

La presenza di uno di questi gradi può essere condivisa da altri modi, anche con grado enarmonico diverso. La discriminazione matematica rimane separata dalla caratterizzazione didattica.

## Tre esempi su posizioni reali

I risultati qui sotto sono stati calcolati indipendentemente ruotando le tre scale base e verificando l'inclusione. Non sono dedotti dalla sigla dell'accordo. Tutte le famiglie sono selezionate.

### 1. Cmaj7, centro C

Posizione ×–3–5–4–5–×, corde 6→1: C3 G3 B3 E4; classi C E G B. Gradi sonori 1–5–7–3.

| Modo compatibile | Scala su C | Informazioni presenti / ancora assenti |
| --- | --- | --- |
| C ionico (MAJ-I) | C D E F G A B | 3 e 7 presenti; D, F, A assenti. F distingue dal lidio, D dal lidio ♯2. |
| C lidio (MAJ-IV) | C D E F♯ G A B | 3 e 7 presenti; ♯4 F♯ assente, quindi colore lidio non dimostrato. D distingue dal lidio ♯2. |
| C lidio ♯2 (HM-VI) | C D♯ E F♯ G A B | ♯2 D♯ e ♯4 F♯ assenti; 3 e 7 presenti. Compatibilità senza attribuzione di funzione. |

La famiglia melodica non ha un risultato completo per queste quattro classi su C. Nei dettagli parziali, C lidio aumentato contiene C E B, ma non G: non compare tra i tre compatibili.

Bassi aggiunti tutti sotto C3:

- A2, corda 6 tasto 5 oppure separato: conserva tutti e tre. Cmaj7/A ha A esterno alla formula armonica ma A appartiene a tutte queste scale.
- C2 separato: cinque altezze, quattro classi; conserva tutti e tre.
- D2 separato: restano C ionico e C lidio; C lidio ♯2 non contiene D naturale.
- F2, corda 6 tasto 1: resta C ionico nel catalogo; F non è una nota già contenuta nel voicing iniziale, è la nota realmente aggiunta dal comando del basso.
- B♭2, corda 6 tasto 6: nessun risultato completo, perché i tre modi precedenti hanno B ma non B♭. Affinità parziali solo nella vista separata.

### 2. Am7, centro A

Posizione ×–0–2–0–1–×: A2 E3 G3 C4; classi A C E G. Gradi sonori 1–5–♭7–♭3.

| Modo compatibile | Scala su A | Informazioni presenti / ancora assenti |
| --- | --- | --- |
| A dorico (MAJ-II) | A B C D E F♯ G | ♭3/♭7 presenti, 6 F♯ assente. |
| A frigio (MAJ-III) | A B♭ C D E F G | ♭3/♭7 presenti; ♭2 B♭ e ♭6 F assenti. |
| A eolio (MAJ-VI) | A B C D E F G | ♭3/♭7 presenti, ♭6 F assente. |
| A dorico ♭2 (MM-II) | A B♭ C D E F♯ G | ♭3/♭7 presenti; ♭2 B♭ e 6 F♯ assenti. |
| A dorico ♯4 (HM-IV) | A B C D♯ E F♯ G | ♭3/♭7 presenti; ♯4 D♯ e 6 F♯ assenti. |

Tra le note discriminanti mancanti: B/B♭, F/F♯, D/D♯. La minore melodica I e la minore armonica I su A non sono pienamente compatibili: contengono G♯ invece di G; sono eventualmente affinità parziali, non risultati completi.

- E2, corda 6 aperta: classe già presente, conserva i cinque modi.
- B1 separato: restano dorico, eolio, dorico ♯4 (tre).
- B♭1 separato: restano frigio e dorico ♭2 (due).
- F♯2, corda 6 tasto 2: restano dorico, dorico ♭2 e dorico ♯4 (tre).
- D♯2 separato: resta dorico ♯4 nel catalogo. Nessuna nota viene aggiunta soltanto per «completare» questa scala.

### 3. Cø7, centro C

Posizione ×–3–4–3–4–×: C3 G♭3 B♭3 E♭4; classi C E♭ G♭ B♭. La sigla armonica conserva gradi 1–♭5–♭7–♭3.

| Modo compatibile | Scala su C | Gradi sonori e informazione mancante |
| --- | --- | --- |
| C locrio (MAJ-VII) | C D♭ E♭ F G♭ A♭ B♭ | 1 ♭5 ♭7 ♭3; ♭5 presente ma non discriminante fra i modi rimasti. D♭, F, A♭ assenti. |
| C locrio ♮2 (MM-VI) | C D E♭ F G♭ A♭ B♭ | 1 ♭5 ♭7 ♭3; D, F, A♭ assenti. D/D♭ distingue dagli altri locri. |
| C superlocrio (MM-VII) | C D♭ E♭ F♭ G♭ A♭ B♭ | 1 ♭5 ♭7 ♭3; ♭4 F♭ assente. Nessuna lettura dominante dedotta dal nome «alterata». |
| C locrio ♮6 (HM-II) | C D♭ E♭ F G♭ A B♭ | 1 ♭5 ♭7 ♭3; 6 A assente. A/A♭ è discriminante rispetto ai locri con ♭6. |
| C dorico ♯4 (HM-IV) | C D E♭ F♯ G A B♭ | 1 ♯4 ♭7 ♭3, stessa altezza G♭3→F♯3 nel solo spelling modale; D, G, A assenti. Il grado ♯4 è presente, ma il modo non è dedotto. |

Anche il dorico ♯4 contiene tutte le classi sonore: vietato escluderlo soltanto perché la lettura armonica chiama G♭ «quinta diminuita». La classificazione di scala lavora sulle altezze, mentre ogni formula modale assegna il proprio grado e spelling.

- G♭2, corda 6 tasto 2: raddoppio della classe 6; conserva tutti e cinque, con grafia modale F♯2 nel dorico ♯4.
- D2 separato: restano locrio ♮2 e dorico ♯4 (due). D2 non è raggiungibile come basso su questa chitarra standard, ma partecipa se applicato come accompagnamento separato.
- A♭2, corda 6 tasto 4: restano locrio, locrio ♮2 e superlocrio (tre).
- A2, corda 6 tasto 5: restano locrio ♮6 e dorico ♯4 (due).
- G2, corda 6 tasto 3: resta dorico ♯4 nel catalogo, perché contiene sia F♯ sia G. Questo risultato non cambia la sigla armonica o il gruppo V.

## Pannello e risultati compatti

«Compatibilità modali», richiudibile, inizialmente chiuso. Nessun risultato finché non si sceglie un centro. Aperto: centro con spelling, tre checkbox di famiglia, conteggio «N compatibili nelle famiglie selezionate». Famiglie deselezionate escluse solo dalla vista: non modificano la posizione.

Vista principale «Compatibili»: righe con nome su centro, famiglia/numero, gradi sonori, caratteristiche presenti (massimo due prima del dettaglio) e una breve informazione discriminante assente. Ordine stabile famiglia→numero, non classifica di probabilità. Mostrare tutte le righe compatibili; eventuale «Mostra altre» esplicito per mobile, senza nascondere il conteggio.

Ogni riga ha «Dettagli»: formula, sette nomi modali, note realmente presenti con ottave/provenienza, caratteristici e assenti, confronto discriminante fra modi, scala madre e fonte. Nessuna nota mancante sulla tastiera come se fosse suonata. Un'eventuale futura sovrapposizione della scala deve distinguere chiaramente note sonore e semplici riferimenti; non è necessaria in questa fase.

«Affinità parziali» è una vista separata, non mescolata alle righe complete. Titolo e avvertenza brevi: «Queste scale non contengono tutte le note sonore». Ogni riga esplicita numero di classi condivise e note fuori dalla scala. Formula armonica e basso esterno conservano i propri indicatori indipendenti.

Esempio di riga: «C lidio · maggiore IV — suonate 1 · 5 · 7 · 3 — ♯4 non presente». Il dettaglio spiega il confronto F/F♯; la riga non ripete l'intero accordo né tutte le sette note.

La tastiera resta protagonista. Non si aggiungono conversioni, tasti o bassi con la selezione del modo. Le fonti sono nel dettaglio del risultato e in «Metodo e nomenclatura», con un'etichetta sintetica sui limiti dell'appartenenza scalare.

## Comportamento nel confronto Greene

Centro e famiglie comuni al confronto, note sonore separate:

- **Originale:** snapshot delle quattro voci e del basso originale, anche dopo un'applicazione.
- **Candidata teorica:** quattro altezze candidate e il basso conservato. Compatibilità calcolabile anche senza realizzazione sulla chitarra. Registro/corda non validi non vengono nascosti: indicatore fisico distinto, applicazione ancora bloccata.
- **Realizzazione selezionata:** stesse altezze teoriche, quindi stesse compatibilità. Ricerca e selezione non cambiano l'originale.

Le conversioni d'ottava Greene e le disposizioni sistematiche attualmente implementate conservano le classi delle quattro voci. A basso conservato, centro e famiglie uguali, gli elenchi compatibili devono quindi essere identici; cambiano ordine sonoro, ottave, nomi con registro, soprano e gruppi V. L'identità del basso si mantiene distinta dalle voci B/T/A/S.

Mostrare una riga «Compatibilità identiche; disposizione diversa» quando è vero, con dettagli «Originale / Candidata». Non duplicare due elenchi lunghi uguali. La candidata teorica con basso che non è più sotto le voci resta consultabile come insieme di altezze, ma con «Registro del basso non valido — applicazione impossibile»; non la si presenta come realizzazione sonora valida già applicata.

«Usa questa posizione» aggiorna il confronto dell'attuale posizione solo dopo applicazione esplicita. «Ripristina originale» recupera il precedente stato fisico basso incluso e ricalcola con il centro ancora scelto. Centro e famiglie sono controlli interpretativi e non entrano nello snapshot fisico; cambiare fondamentale non cambia le compatibilità, salvo la sola grafia armonica mostrata altrove.

## Fonti e nostre scelte software

- [Open Music Theory, Scales and scale degrees](https://openmusictheory.github.io/scales.html): intervalli della maggiore, distinzione fra classi e registro, denominazione dei gradi e grafia scalare; minore classica e direzione melodica.
- [Dirk Laukens, Guitar Modes](https://www.jazzguitar.be/blog/guitar-modes/): nomi e formule della famiglia maggiore e esempi di gradi caratteristici.
- [Dirk Laukens, Melodic Minor Modes](https://www.jazzguitar.be/blog/melodic-minor-modes): sette formule e alias, convenzione jazz, grafia scalare del superlocrio.
- [Stef Ramin, Harmonic Minor Modes](https://www.jazz-guitar-licks.com/pages/guitar-scales-modes/modes-of-the-harmonic-minor-scale/): sette formule e nomenclatura della famiglia armonica.

Fonti lette il 3 ottobre 2026. Le formule e l'inclusione degli esempi sono ricontrollate per rotazione delle tre basi, indipendentemente dai suggerimenti di accordo/scala delle lezioni. Il criterio `S ⊆ M`, separazione delle affinità, discriminanti mancanti, gestione degli snapshot e pannello sono scelte di Guitar Theory Lab; non procedure attribuite a Greene. Non si importano suggerimenti di funzione, «avoid notes» o valutazioni di stile dalle fonti.

## Limiti e decisioni prima del codice

Catalogo iniziale di 21 modi in dodici classi temperate: esclusi pentatoniche, blues, bebop, diminuite, esatonali, maggiore armonica, microtonalità e combinazioni/polimodalità. Le affinità sono descrittive, non raccomandazioni. Appartenenza completa non assicura stabilità, centratura, consonanza o buona condotta delle voci; il tempo, la melodia e il contesto non sono analizzati.

La legenda proposta distingue convenzione didattica, nostra selezione editoriale e discriminazione matematica; la verifica dei record e delle fonti precede l'implementazione. Test di spelling necessario prima della UI: non basta il formatter armonico esistente, che non rappresenta tutte le alterazioni modali e i doppi accidenti. Nomi/alias non deduplicati sulla sola grafia; identità tramite famiglia e numero.

## Verifiche previste

1. Tabelle letterali indipendenti delle 21 formule; derivazione per rotazione delle tre basi, sette classi distinte, presenza del grado 1, offset e numeri modali corretti. Tutti i dodici centri, con spelling enarmonici distinti.
2. Fixture dei tre esempi: conteggi 3/5/5 e ID esatti; include esplicitamente HM-IV per Cø7. Fixture delle scale scritte, dei gradi sonori e discriminanti assenti.
3. Tutti i 495 insiemi di quattro classi × 12 centri × 21 modi = 124.740 controlli di inclusione, confrontati con un test indipendente a insiemi. Ogni classe aggiuntiva possibile (12) per ciascuna combinazione: 1.496.880 controlli di monotonia con basso. Questi sono controlli previsti, non test del prodotto già eseguiti.
4. Raddoppi e cambi d'ottava non cambiano gli elenchi; mantengono cinque altezze reali quando c'è il basso. Basso separato e su corda producono identiche compatibilità se hanno stessa altezza/classe.
5. Partizione esatta: compatibili senza classi esterne; affinità con almeno una classe condivisa e almeno una esterna; nessuna intersezione separata. Nessuna nota esclusa solo perché manca nel dizionario degli accordi.
6. Spelling: C dorico ♯4 rispetto a G♭/F♯ del Cø7; F♭ del superlocrio; B♭♭ del superlocrio ♭♭7; centri C♭ e B♯ con ottave corrette. Non spostare MIDI per ottenere una grafia più comoda.
7. Greene: tutte le 31 conversioni e le quattro disposizioni di ogni gruppo, sul dominio esaustivo già verificato, preservano gli elenchi modali a centro/basso costanti. UI della candidata teorica, collisioni, registro del basso, applicazione e ripristino completo; incompatibilità fisica e appartenenza scalare non si sostituiscono.
8. Browser desktop/mobile, anche pannello chiuso, centro assente e nessun risultato. Cambiare centro, modo osservato, famiglia, fondamentale e dettagli mantiene esattamente note, basso, corde, tasti e classificazione V. Nessuna selezione di modo applica una posizione o introduce note.

## Sequenza proposta

Prima catalogo/formule, alias, spelling e legenda documentata; poi motore puro con fixture ed esaustivi; poi pannello compatibili, dettaglio e vista affinità separata; infine confronto Greene e verifica desktop/mobile. Riutilizzare il modello fisico e gli snapshot del basso; mantenere il calcolo modale indipendente dal dizionario delle sigle armoniche. Nessuna modifica agli altri strumenti.

## Esito dell'implementazione locale

Proposta approvata, implementata e verificata localmente; salvata con la revisione finale. Nessuna pubblicazione online. Per mantenere compatta la vista principale, gradi, caratteristiche e discriminanti sono interamente nei dettagli; le righe principali mostrano nome, famiglia/grado e classi presenti. Gli elenchi completi e parziali hanno viste separate e ordine stabile. Lo spelling delle note esterne nelle affinità è cromatico dichiarato, poiché quelle note non hanno un grado nella scala.

Fixture indipendenti delle 21 formule; esempi 3/5/5 e tutte le 15 aggiunte di basso sopra elencate; 124.740 inclusioni e 1.496.880 inclusioni con classe aggiunta confrontate con insiemi indipendenti. Greene: la verifica esaustiva preesistente conserva tutte le classi su 221.760 disposizioni e 61.380 conversioni, quindi si compone con l'esaustiva inclusione modale su tutti i centri/bassi. Ulteriore integrazione diretta del motore modale per disposizioni in entrambe le direzioni e conversioni V-2, su dodici centri e dodici bassi. Non si presenta questo controllo composizionale come un nuovo test di ogni singola trasformazione × ogni centro × ogni basso.

Browser: esempi, centro assente, centro indipendente, equivalenza F♯/G♭, vista parziale, famiglie, zero risultati con B♭ su Cmaj7, basso conservato, confronto separato, applicazione/ripristino; desktop 1440 e mobile 390, oltre alle regressioni esistenti fino a 320. Catture finali in `/tmp/voicing-lab-preview/modal-*`.
