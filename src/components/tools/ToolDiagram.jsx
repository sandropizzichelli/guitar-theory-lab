const diagramDots = {
  sets: ["0", "3", "7", "9"],
  intersections: ["C", "E", "G", "A"],
  "voice-leading": ["I", "III", "V", "VII"]
};

export function ToolDiagram({ icon }) {
  const items = diagramDots[icon] ?? diagramDots.sets;

  return (
    <div className={`tool-diagram tool-diagram--${icon}`} aria-hidden="true">
      {items.map((item, index) => (
        <span key={`${item}-${index}`}>{item}</span>
      ))}
    </div>
  );
}
