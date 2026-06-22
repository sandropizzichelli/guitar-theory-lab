import { useMemo, useState } from "react";
import { tools } from "../../config/tools";
import { PageShell } from "../components/layout/PageShell.jsx";
import { ToolGrid } from "../components/tools/ToolGrid.jsx";
import { usePageMeta } from "../lib/meta.js";

export function ToolsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const categories = [
    "all",
    "Set Theory",
    "Harmony",
    "Fretboard",
    "Voice Leading",
    "Improvisation",
    "Analysis"
  ];

  usePageMeta({
    title: "Tools",
    description: "Browse current and future Guitar Theory Lab tools for set theory, harmony, fretboard study, and voice leading.",
    path: "/tools"
  });

  const filteredTools = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return tools.filter((tool) => {
      const searchableText = [tool.title, tool.description, tool.category, ...tool.tags, ...(tool.usefulFor ?? [])]
        .join(" ")
        .toLowerCase();
      const matchesQuery = !normalizedQuery || searchableText.includes(normalizedQuery);
      const matchesCategory = category === "all" || tool.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [category, query]);

  return (
    <PageShell
      eyebrow="Tools"
      title="Available tools"
      subtitle="A modular registry for current and future GTL instruments."
    >
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
      </section>
      <section className="platform-section">
        <div className="platform-section-heading">
          <div>
            <p className="platform-eyebrow">Available now</p>
            <h2>{filteredTools.length} active modules</h2>
          </div>
          <p>Filters are intentionally light for now, but the catalog is ready to grow.</p>
        </div>
        <ToolGrid items={filteredTools} variant="detailed" />
      </section>
    </PageShell>
  );
}
