import { INTERVAL_OPTIONS } from "../data/intervals";

type Props = {
  interval: number;
};

export function IntervalSelector({ interval }: Props) {
  const activeInterval = INTERVAL_OPTIONS[interval];

  return (
    <section className="panel interval-data-panel">
      <div className="interval-data-heading">
        <h2>Distance</h2>
        <span>Interval from A to B</span>
      </div>
      <output className="interval-data-value">
        +{activeInterval.semitones} semitones / {activeInterval.label}
      </output>
    </section>
  );
}
