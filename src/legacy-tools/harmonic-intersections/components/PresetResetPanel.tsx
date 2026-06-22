type Props = {
  onReset: () => void;
};

export function PresetResetPanel({ onReset }: Props) {
  return (
    <section className="panel">
      <div className="panel-title-row">
        <h2>Preset</h2>
      </div>
      <button className="reset-button" onClick={onReset}>
        Reset C Ionian / C Ionian
      </button>
    </section>
  );
}
