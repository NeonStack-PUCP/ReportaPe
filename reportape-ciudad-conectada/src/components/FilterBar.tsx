import { X } from "lucide-react";
import {
  CATEGORY_ICON,
  CATEGORY_LABEL,
  STATUS_LABEL,
  type Category,
  type ReportStatus,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const MAP_CATEGORIES: Category[] = [
  "obra",
  "basura",
  "agua",
  "luz",
  "ambiente",
  "pista",
  "parque",
  "seguridad",
];

const STATUSES: ReportStatus[] = ["active", "pending", "resolved", "critical"];

export interface Filters {
  category: Category | "all";
  status: ReportStatus | "all";
  zone: string;
}

export function FilterBar({
  value,
  onChange,
  zones,
}: {
  value: Filters;
  onChange: (f: Filters) => void;
  zones: string[];
}) {
  const hasFilters =
    value.category !== "all" || value.status !== "all" || value.zone !== "all";

  return (
    <div className="space-y-3 rounded-xl border border-border bg-surface p-4 shadow-card">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Filtros</h3>
        {hasFilters && (
          <button
            onClick={() =>
              onChange({ category: "all", status: "all", zone: "all" })
            }
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            <X className="h-3 w-3" /> Limpiar
          </button>
        )}
      </div>

      <div>
        <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Categoría
        </p>
        <div className="flex flex-wrap gap-1.5">
          <FilterChip
            active={value.category === "all"}
            onClick={() => onChange({ ...value, category: "all" })}
          >
            Todas
          </FilterChip>
          {MAP_CATEGORIES.map((c) => (
            <FilterChip
              key={c}
              active={value.category === c}
              onClick={() => onChange({ ...value, category: c })}
            >
              {CATEGORY_ICON[c]} {CATEGORY_LABEL[c]}
            </FilterChip>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Estado
        </p>
        <div className="flex flex-wrap gap-1.5">
          <FilterChip
            active={value.status === "all"}
            onClick={() => onChange({ ...value, status: "all" })}
          >
            Todos
          </FilterChip>
          {STATUSES.map((s) => (
            <FilterChip
              key={s}
              active={value.status === s}
              onClick={() => onChange({ ...value, status: s })}
            >
              {STATUS_LABEL[s]}
            </FilterChip>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Zona
        </p>
        <select
          value={value.zone}
          onChange={(e) => onChange({ ...value, zone: e.target.value })}
          className="w-full rounded-md border border-input bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="all">Todas las zonas</option>
          {zones.map((z) => (
            <option key={z} value={z}>
              {z}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full px-3 py-1 text-xs font-medium ring-1 transition",
        active
          ? "bg-primary text-primary-foreground ring-primary shadow-sm"
          : "bg-background text-foreground ring-border hover:bg-muted",
      )}
    >
      {children}
    </button>
  );
}
