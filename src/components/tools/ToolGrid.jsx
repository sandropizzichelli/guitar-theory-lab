import { ToolCard } from "./ToolCard.jsx";

export function ToolGrid({ items }) {
  return (
    <div className="platform-tool-grid">
      {items.map((tool) => (
        <ToolCard tool={tool} key={tool.id} />
      ))}
    </div>
  );
}
