type Props = {
  onReset: () => void;
};

export function PresetResetPanel({ onReset }: Props) {
  return (
    <section className="panel preset-panel">
      <button className="reset-button" onClick={onReset}>
        Reset C Ionian / C Ionian
      </button>
    </section>
  );
}
