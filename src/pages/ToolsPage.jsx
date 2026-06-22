import { useMemo, useState } from "react";
import { tools } from "../../config/tools";
import { PageShell } from "../components/layout/PageShell.jsx";
import { ToolGrid } from "../components/tools/ToolGrid.jsx";

export function ToolsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const categories = ["all", ...new Set(tools.map((tool) => tool.category))];
  const statuses = ["all", ...new Set(tools.map((tool) => tool.status))];

  const filteredTools = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return tools.filter((tool) => {
      const searchableText = [tool.title, tool.description, tool.category, ...tool.tags]
        .join(" ")
        .toLowerCase();
      const matchesQuery = !normalizedQuery || searchableText.includes(normalizedQuery);
      const matchesCategory = category === "all" || tool.category === category;
      const matchesStatus = status === "all" || tool.status === status;
      return matchesQuery && matchesCategory && matchesStatus;
    });
  }, [category, query, status]);

  return (
    <PageShell eyebrow="Tools" title="Un registry centrale per tutti gli strumenti presenti e futuri.">
      <section className="platform-filter-bar">
        <label>
          Search
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="voice leading, set class..."
          />
        </label>
        <label>
          Category
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            {categories.map((item) => (
              <option value={item} key={item}>{item === "all" ? "All categories" : item}</option>
            ))}
          </select>
        </label>
        <label>
          Status
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            {statuses.map((item) => (
              <option value={item} key={item}>{item === "all" ? "All statuses" : item}</option>
            ))}
          </select>
        </label>
      </section>
      <ToolGrid items={filteredTools} />
    </PageShell>
  );
}
