# Roadmap

## Priorità concordate — 3 ottobre 2026

Questa sequenza aggiorna le priorità operative; le fasi architetturali sotto restano come riferimento.

- [x] Completare e verificare Voicing Lab: Greene, basso esterno e compatibilità modali, con revisione finale desktop/mobile e salvataggio locale. Nessuna pubblicazione online. Fasi precedenti: Greene `4f69e3d`, basso esterno `d9eca8f`.
- [ ] Estendere la tastiera interattiva agli altri strumenti, dopo Voicing Lab e prima della monetizzazione. Riutilizzare un componente comune, con comportamenti musicali specifici e modalità distinte «Esplora» / «Inserisci una posizione», senza modifiche accidentali ai risultati.
  - [ ] **Set-class Explorer, per primo:** inserire una posizione e ricavarne set class, prime form e vettore intervallare, gestendo separatamente altezze reali e classi di altezza.
  - [ ] **Harmonic Intersections:** assegnare le note selezionate al sistema A o B e aggiornare il confronto e l'intersezione.
  - [ ] **Goodrick Voice Leading:** selezionare un voicing o una voce da seguire ed evidenziare le transizioni; valutare la modifica libera soltanto dopo aver definito i vincoli musicali del percorso.
- [ ] Rendere Guitar Theory Lab a pagamento: definire offerta e confine gratuito/premium, poi account, pagamenti e accessi. Aggiornare le diciture «Free to use» / «No sign-in required» quando l'offerta cambia.
- [ ] Implementare un assistente AI collegato ai motori musicali verificati, dopo le priorità precedenti. L'implementazione futura è confermata dall'utente; tempi e perimetro restano da definire. Iniziare dentro Voicing Lab con richieste circoscritte (analisi con fondamentale scelta, conversioni Greene a soprano fisso, ricerca dei drop su corde selezionate), risultati visuali e spiegazioni fondate sulle fonti. I calcoli restano affidati ai motori musicali; prevedere gestione delle ambiguità, verifica della concordanza fra spiegazioni e diagrammi, chiamate AI protette e limiti d'uso. Estensione agli altri strumenti e percorsi didattici con memoria in fasi successive. Nessuna dipendenza AI da aggiungere durante il completamento attuale.

Le voci sono attività pianificate, non funzionalità già disponibili né autorizzazioni alla pubblicazione.

## Phase 1: Modular platform

- Root platform shell
- Tool registry
- Tool routes
- Legacy adapters for the three current tools
- Initial documentation

## Phase 2: PWA

- Manifest
- Placeholder icon
- Service worker
- Installability checks

## Phase 3: Login

- Supabase client
- Login page
- User profile model
- Dashboard protection
- Initial schema contract

## Phase 4: Saved items

- Generic saved item schema
- Tool-specific serializers
- User library
- RLS policies

## Phase 5: Export

- Image export
- PDF export
- Teacher materials

## Phase 6: Stripe

- Checkout
- Webhook handling
- Subscription state
- Pro feature gating

## Phase 7: Teacher and institution plans

- Teacher workflows
- Institution licenses
- Future classes/students model

## Phase 8: New tools

Examples:

- rhythm-structures
- intervallic-cells
- d-andrea-areas
- transformational-networks
- chord-scale-lab
- atonal-improvisation-paths
- scale-networks
- set-complexes
- common-tone-lab
- fretboard-transformations
