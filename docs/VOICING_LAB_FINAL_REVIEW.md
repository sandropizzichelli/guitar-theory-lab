# Voicing Lab — revisione finale locale

3 ottobre 2026. Perimetro: fase modale e correzioni concrete di Voicing Lab; nessuna modifica ai sorgenti degli altri strumenti, nessuna pubblicazione.

## Esito e verifiche effettivamente eseguite

- 25 test musicali superati: fixture indipendenti delle 21 formule; tre esempi modali e tutte le 15 aggiunte di basso; 124.740 inclusioni e 1.496.880 inclusioni con basso aggiunto; spelling armonico/modale e ottave enarmoniche; raddoppi/cardinalità manuali; close/drop e classificazione V. Esaustivi Greene preesistenti: 221.760 disposizioni e 61.380 conversioni, con classi, gruppo finale, soprano effettivo e identità verificati; conservazione delle compatibilità dimostrata per composizione con il test di inclusione, più integrazione diretta del motore modale su V-2 per tutti i centri/bassi.
- 43 test browser di Voicing Lab superati. Tutti gli esempi Greene A–D, bassi A/D/non realizzabile/raddoppiato e percorso modale anche a 320 oltre a 390 e 1440. Percorso integrato manuale→fondamentale→close/drop→ricerca→basso→Greene→modale→applicazione→ripristino→rimozione, a tutte e tre le larghezze. No errori JS nel percorso integrato.
- Tastiera: scorrimento interno con ArrowRight, focus di contenitore e caselle, tasto 24 raggiungibile e attivabile con Enter; dettagli e fonti raggiungibili con Tab. Focus controllato dopo applicazione/ripristino Greene e rimozione del basso. Nessun overflow orizzontale della pagina a 390/320, anche con pannelli aperti.
- Anteprima in-app verificata direttamente: cinque note manuali e correzione delle etichette; Dmaj7 drop 2+3 con ricerca conservata; Cmaj7/A e basso su corda libera; conversione V-2→V-3, collisione sulla corda del basso e applicazione disabilitata; applicazione/ripristino con basso separato e focus corretto; vista delle affinità a 390 e controllo finale a 320.
- Build di produzione e build locale comprensiva di Voicing Lab riuscite. Il tool resta DEV-only: non è stato reso pubblico dalla build di produzione.
- 54 test legacy superati (16 Goodrick, 19 Harmonic, 19 Set). Tutti i 12 test browser degli altri strumenti superati, inclusi layout 1440/390/320. Questa è verifica in lettura, non modifica dei loro sorgenti.

## Correzioni di revisione

Fuori da quattro voci, il dettaglio modale usa «nota N» invece di forzare B/T/A/S o mostrare undefined. Il confronto distingue altezze identiche da sola uguaglianza delle classi; dichiara l'assenza di basso quando appropriato. La compatibilità è espressa come criterio anche nei casi senza risultati. Eliminata una ripetizione nella verifica della corda del basso e quella del motivo V non assegnato. La nota enarmonica Cø7/dorico ♯4 è mostrata solo quando le classi originali rappresentano effettivamente Cø7, senza attribuirla ad altre posizioni. Focus reso evidente e conservato sui comandi pertinenti dopo azioni che disabilitano/rimuovono il controllo attivo.

## Catture finali riproducibili

I test generano `/tmp/voicing-lab-preview/review-comparison-{1440,390,320}.png`, `review-modal-{1440,390,320}.png`, `review-restored-{1440,390,320}.png` e `review-restored-with-bass-{1440,390,320}.png`. Le catture del confronto mostrano le quattro voci; le catture del ripristino con basso includono sia il gruppo V della posizione sia l'insieme a cinque note. Le immagini sono anteprime locali e non asset del sito.

## Limiti rimasti

Accordatura standard, una nota per corda, 0–24 tasti; ricerca di altezze esatte, nessuna adattata alle corde o alle ottave. Difficoltà geometrica, non certificazione ergonomica. Quattordici gruppi V riservati a quattro classi originali distinte; nessun V sull'insieme con basso. Dizionario armonico limitato: struttura intervallare quando manca una sigla utile. Conversioni Greene d'ottava verificate attive; +24 V-2→V-9, scambi di voci e percorsi originali sulle corde non definiti restano inattivi. Tre famiglie modali in dodici classi temperate, minore melodica ascendente stabile: compatibilità non dimostra centro o funzione. Nessun audio, inferenza stilistica o assistente AI.

Roadmap verificata: solo priorità concordate e completamento locale di Voicing Lab. Proposta Set-class Explorer separata in `SET_CLASS_INTERACTIVE_FRETBOARD_PROPOSAL.md`; resta documentazione, senza implementazione. Monetizzazione e AI restano successivi.
