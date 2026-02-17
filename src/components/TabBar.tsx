export default function TabBar<T extends string>({
  tabs,
  active,
  onChange,
}: {
  tabs: { key: T; label: string }[];
  active: T;
  onChange: (tab: T) => void;
}) {
  return (
    <div className="border-b border-[var(--line)]">
      <div className="flex gap-0">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className={`tab-button px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.1em] transition-colors ${
              active === tab.key
                ? "border-b-2 border-[var(--accent)] text-[var(--ink)]"
                : "border-b-2 border-transparent text-[var(--ink-muted)] hover:text-[var(--ink)]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
