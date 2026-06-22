# Guitar Software Series

Cartella madre per i visualizer di chitarra. I progetti restano separati, ma da qui puoi avviare, testare e compilare tutto senza entrare ogni volta nelle sottocartelle.

## Progetti

| Progetto | Cartella | Porta dev |
| --- | --- | --- |
| Goodrick Voice Leading Visualizer | `Goodrick Voice Leading Visualizer` | `http://127.0.0.1:5173/` |
| Harmonic Intersections | `Harmonic Intersections` | `http://127.0.0.1:5174/` |
| Set Visualizer | `Set Visualizer` | `http://127.0.0.1:5175/` |

## Comandi dalla cartella madre

```bash
cd "/Users/silvialumaca/Desktop/Guitar Software Series"
```

Avvia il visualizer Goodrick:

```bash
npm run goodrick
```

Se la porta `5173` risulta occupata, il visualizer Goodrick e gia acceso: apri o ricarica `http://127.0.0.1:5173/`.

Se lavori da iPad sulla stessa rete Wi-Fi del Mac, usa il comando LAN:

```bash
npm run goodrick:lan
```

Poi apri l'indirizzo locale del Mac, per esempio:

```text
http://192.168.1.55:5173/
```

`127.0.0.1` funziona solo sul dispositivo dove gira il server. Da iPad punterebbe all'iPad, non al Mac.

Test e build del progetto Goodrick:

```bash
npm run goodrick:test
npm run goodrick:build
```

Avvia gli altri progetti:

```bash
npm run harmonic
npm run set
```

Test o build di tutta la serie:

```bash
npm run test:all
npm run build:all
```

Nota: le dipendenze restano installate dentro ogni singolo progetto. Questa cartella contiene solo comandi di coordinamento.
