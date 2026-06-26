import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { CATEGORY_ICON, type Proposal, type Report } from "@/lib/mock-data";
import { StatusBadge, Badge } from "./Badge";
import { MapPin, Users, X } from "lucide-react";

type Pin =
  | { kind: "report"; item: Report }
  | { kind: "proposal"; item: Proposal };

export function MapView({
  reports,
  proposals,
}: {
  reports: Report[];
  proposals: Proposal[];
}) {
  const [active, setActive] = useState<Pin | null>(null);

  return (
    <div className="relative h-[480px] w-full overflow-hidden rounded-2xl border border-border map-grid-bg map-streets shadow-card lg:h-[640px]">
      {/* Decorative compass */}
      <div className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-surface text-xs font-bold text-secondary shadow-card ring-1 ring-border">
        N
      </div>
      <div className="absolute left-4 top-4 z-10 rounded-lg bg-surface/95 px-3 py-2 text-xs shadow-card ring-1 ring-border backdrop-blur">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-primary" /> Denuncias
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-secondary" /> Propuestas
          </span>
        </div>
      </div>

      {reports.map((r) => (
        <button
          key={r.id}
          type="button"
          onClick={() => setActive({ kind: "report", item: r })}
          className="absolute z-10 -translate-x-1/2 -translate-y-full transition hover:scale-110"
          style={{ left: `${r.x}%`, top: `${r.y}%` }}
          aria-label={r.title}
        >
          <div className="flex flex-col items-center">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-base text-primary-foreground shadow-elevated ring-4 ring-primary/15">
              {CATEGORY_ICON[r.category]}
            </div>
            <div className="-mt-1 h-2 w-2 rotate-45 bg-primary" />
          </div>
        </button>
      ))}

      {proposals.map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => setActive({ kind: "proposal", item: p })}
          className="absolute z-10 -translate-x-1/2 -translate-y-full transition hover:scale-110"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
          aria-label={p.title}
        >
          <div className="flex flex-col items-center">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-base text-secondary-foreground shadow-elevated ring-4 ring-secondary/15">
              💡
            </div>
            <div className="-mt-1 h-2 w-2 rotate-45 bg-secondary" />
          </div>
        </button>
      ))}

      {active && (
        <div className="absolute bottom-4 left-1/2 z-20 w-[92%] max-w-sm -translate-x-1/2">
          <div className="relative overflow-hidden rounded-xl border border-border bg-surface shadow-elevated">
            <button
              type="button"
              onClick={() => setActive(null)}
              className="absolute right-2 top-2 z-10 rounded-md bg-surface/90 p-1 text-muted-foreground hover:bg-muted"
              aria-label="Cerrar"
            >
              <X className="h-4 w-4" />
            </button>
            {active.kind === "report" ? (
              <Link to="/report/$id" params={{ id: active.item.id }}>
                <div
                  className="h-32 w-full bg-muted bg-cover bg-center"
                  style={{ backgroundImage: `url(${active.item.photo})` }}
                />
                <div className="space-y-2 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="primary">
                      {CATEGORY_ICON[active.item.category]} Denuncia
                    </Badge>
                    <StatusBadge status={active.item.status} />
                  </div>
                  <h4 className="text-sm font-semibold text-foreground">
                    {active.item.title}
                  </h4>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {active.item.district}
                    </span>
                    <span className="inline-flex items-center gap-1 font-semibold text-foreground">
                      <Users className="h-3 w-3" /> {active.item.supports} apoyos
                    </span>
                  </div>
                </div>
              </Link>
            ) : (
              <Link to="/proposal/$id" params={{ id: active.item.id }}>
                <div className="space-y-2 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="secondary">💡 Propuesta vecinal</Badge>
                    {active.item.status === "convertible" && (
                      <Badge variant="warning">Convertible a denuncia</Badge>
                    )}
                  </div>
                  <h4 className="text-sm font-semibold text-foreground">
                    {active.item.title}
                  </h4>
                  <p className="line-clamp-2 text-xs text-muted-foreground">
                    {active.item.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {active.item.district}
                    </span>
                    <span className="inline-flex items-center gap-1 font-semibold text-foreground">
                      <Users className="h-3 w-3" /> {active.item.supports} apoyos
                    </span>
                  </div>
                </div>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
