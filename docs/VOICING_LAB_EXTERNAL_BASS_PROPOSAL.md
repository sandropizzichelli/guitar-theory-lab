# Voicing Lab — proposta per il basso esterno

Stato: proposta successiva alla fase Greene, non implementata. Compatibilità modali e assistente AI restano fasi future.

## Obiettivo e invarianti

Aggiungere una nota reale alla posizione, senza cambiare le quattro note originali, le loro ottave, le corde o i tasti. La fondamentale interpretativa resta un controllo separato: scegliere un basso non imposta una fondamentale e cambiare fondamentale non cambia il basso.

La nota deve essere esplicita, con spelling e ottava scientifica (C4 = MIDI 60). Si conservano sia l'altezza sia il nome scelto; gli eventuali nomi armonici coerenti con la fondamentale sono una presentazione distinta. Una nota enarmonica equivalente non cambia l'altezza.

Il basso deve essere strettamente sotto la nota più grave della posizione originale. Una nota uguale o più alta non viene accettata come basso esterno. Non si corregge automaticamente la sua ottava. Raddoppiare una classe in un'altra ottava aggiunge comunque una nota reale.

## Due realizzazioni

1. **Accompagnamento separato.** La nota appartiene all'insieme sonoro, senza assegnazione a una corda della chitarra. Può rappresentare un altro strumento o un accompagnamento previsto; non implica che il software produca audio. Non si applicano i limiti di estensione della chitarra. La schermata la mostra come nota separata sotto il diagramma, mai come tasto fittizio.
2. **Corda inutilizzata.** Si cercano esclusivamente corde attualmente mute, con `altezza corda aperta + tasto = altezza richiesta`, accordatura standard e 0–24 tasti. Non si sposta nessuna nota originale. I risultati indicano corda, tasto e nuova apertura complessiva. Si distingue assegnazione trovata da difficoltà geometrica e diteggiatura non verificata. Una corda numericamente più bassa non basta: conta l'altezza effettiva. Se nessuna corda muta raggiunge la nota esatta, la realizzazione sulla chitarra non è disponibile; nessuna trasposizione implicita o sostituzione con accompagnamento separato.

La ricerca può offrire più corde inutilizzate; la scelta non applica. Soltanto «Aggiungi questo basso» conferma la nota e la sua realizzazione. «Rimuovi basso» recupera la posizione senza il basso aggiunto. Le quattro note originali rimangono identificate separatamente anche quando il diagramma mostra cinque note.

## Interfaccia essenziale

Pannello «Basso esterno», richiudibile, inizialmente disattivato. Nella testata chiusa, dopo applicazione: per esempio «A2 · corda 6, tasto 5» oppure «D2 · accompagnamento separato».

Aperto: selettore della nota con alterazione, ottava esplicita e riepilogo dell'altezza; selettore «Accompagnamento separato / Corda inutilizzata». L'ottava non viene scelta silenziosamente. Validazione vicino ai controlli: «Deve essere sotto C3», «Nessuna corda inutilizzata raggiunge D2», ecc.

Anteprima in due parti: «Posizione originale» e «Insieme con basso». Nella modalità chitarra il punto aggiunto usa un segno distinto oltre al colore; si esplicita la corda riservata. Le note originali mantengono tasti e identità. Nella modalità separata il basso compare su una riga autonoma. Risultati, applicazione e rimozione restano nel pannello; la tastiera principale non perde il ruolo centrale.

Sotto l'analisi, due righe concise: «Posizione: V-2 · quattro voci» e «Insieme sonoro: cinque note, basso A2». Fonti, convenzioni e limiti nei dettagli; nessun controllo per modi o AI.

## Letture armoniche

Analizzare le classi dell'insieme completo, conservando tutte le altezze e le provenienze delle note nel modello. Le omissioni dipendono dalla formula selezionata: una fondamentale aggiunta non rimane indicata come omessa. I raddoppi di classe non introducono un nuovo grado, ma rimangono visibili nella disposizione reale.

Il basso reale è la nuova nota. La slash segue la lettura: compare se il basso è diverso dalla fondamentale interpretativa, anche quando è una nota della formula. Se coincide con la fondamentale, non si aggiunge una slash ridondante. Formula completa e ambiguità/dipendenza dal contesto rimangono indicatori separati. Mostrare poche sigle motivate; dove il dizionario non sostiene una sigla utile, mostrare la struttura intervallare, senza inventare estensioni.

Il gruppo V continua a descrivere soltanto le quattro voci originali. L'insieme a cinque note non viene classificato con il riconoscitore Greene a quattro note, anche se il basso raddoppia una delle quattro classi. Si evita l'etichetta ambigua «V-2 con basso» per tutto l'insieme. B/T/A/S originali restano riferiti alla posizione; il basso aggiunto ha un'identità separata, senza rinominare il vecchio basso in modo implicito.

## Convivenza con confronto Greene

Le candidate Greene trasformano soltanto le quattro voci originali. L'anteprima mantiene il basso aggiunto e verifica separatamente che rimanga sotto la candidata e, se sulla chitarra, che la corda sia ancora libera. Il gruppo e il soprano del procedimento Greene riguardano le quattro voci.

Se una candidata occupa la corda del basso, o scende sotto di esso, la disposizione teorica resta consultabile ma l'applicazione dell'insieme è bloccata con motivo esplicito. Il programma non sposta il basso, non cambia modalità e non adatta le ottave. L'utente deve scegliere una realizzazione compatibile oppure rimuovere/modificare esplicitamente il basso.

«Ripristina originale» deve recuperare uno snapshot completo: quattro note e assegnazioni originali più stato, nota/ottava, modalità e assegnazione del basso precedente. Il cambio della fondamentale non entra nel ripristino fisico. Una modifica manuale della posizione invalida il confronto e richiede nuova validazione del basso, senza alterarlo silenziosamente.

## Esempi previsti

| Posizione originale (corde 6→1) | Basso aggiunto | Realizzazione | Lettura e conseguenza |
| --- | --- | --- | --- |
| ×–3–5–4–5–×: C3 G3 B3 E4 | A2 | Corda 6, tasto 5; 5–3–5–4–5–× | Su A: Am9 completo, comunque possibile ambiguità; su C: Cmaj7/A. V-2 delle quattro voci invariato. |
| ×–3–4–3–4–×: C3 G♭3 B♭3 E♭4 | D2 | Accompagnamento separato | Su D: D7(♭9,♭13), quinta omessa; la fondamentale è ora presente. F♯ è lo spelling armonico della nota fisicamente invariata. Cinque altezze reali, V-2 della sola posizione. |
| ×–3–5–4–5–×: C3 G3 B3 E4 | D2 | Corda inutilizzata | Nessun risultato: D2 è sotto la corda più grave E2. L'originale non cambia, applicazione disabilitata; modalità separata disponibile solo se scelta esplicitamente. |
| ×–3–5–4–5–×: C3 G3 B3 E4 | C2 | Accompagnamento separato | Cmaj7 con raddoppio della fondamentale in altra ottava; cinque altezze, quattro classi. Nessun gruppo V attribuito all'intero insieme. |

## Verifiche prima del rilascio

- Invarianza delle quattro tuple identità/MIDI/corda/tasto, selezionando nota, ottava, modalità, risultati, filtri e fondamentale; confronto prima/dopo aggiunta e rimozione.
- Basso strettamente inferiore: nota uguale e superiore rifiutate, ottava scientifica e alterazioni verificate; nessuna correzione automatica.
- Ricerca esatta solo su corde mute: zero, uno e più risultati; limite di estensione, corda aperta, raddoppio di classe, collisione con corda occupata e voci incrociate.
- Fixture indipendenti dei quattro esempi: sigle, omissioni, spelling, basso reale, numero di note/classi e V della posizione invariato. Cambio G♭/F♯ di presentazione senza cambiare MIDI.
- Candidate Greene compatibili/incompatibili per registro e corda; nessuna mutazione del basso durante selezione o ricerca; applicazione esplicita, ripristino di snapshot completo.
- Desktop/mobile e tastiera: distinzione grafica accessibile anche senza colore, pannello chiuso, dettagli, applicazione disabilitata senza realizzazione, letture senza duplicazioni.

## Sequenza proposta

1. Modello separato del basso e validazione di nota/ottava; fixture musicali prima della UI.
2. Accompagnamento separato, anteprima/applicazione/rimozione e analisi dell'insieme completo.
3. Ricerca esatta su corde inutilizzate e confronto geometrico della posizione a cinque note.
4. Integrazione con snapshot e candidate Greene; verifiche UI e responsive.

Verificabile subito: altezze, invarianti, ordine reale, omissioni, ricerca su corde mute e classificazione V della posizione. Da approfondire: diteggiature fisiche a cinque note e ampiezza del dizionario armonico, senza trasformare la stima in certificazione di suonabilità. Questa è una nostra estensione software, non un procedimento del V-System attribuito a Greene.
