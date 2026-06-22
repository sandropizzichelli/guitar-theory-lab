type Props = {
  label?: string;
  notes: string[];
  tone?: "common" | "only-a" | "only-b" | "neutral";
};

export function NoteChips({ label, notes, tone = "neutral" }: Props) {
  return (
    <div className="note-chip-group">
      {label ? <span className="note-chip-label">{label}</span> : null}
      <div className="note-chips">
        {notes.length ? notes.map((note) => <span className={`note-chip ${tone}`} key={note}>{note}</span>) : <span className="muted">none</span>}
      </div>
    </div>
  );
}
