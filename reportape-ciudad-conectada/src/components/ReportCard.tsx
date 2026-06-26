import { Link } from "@tanstack/react-router";
import { MapPin, Users } from "lucide-react";
import { CATEGORY_ICON, CATEGORY_LABEL, type Report } from "@/lib/mock-data";
import { StatusBadge } from "./Badge";

export function ReportCard({ report }: { report: Report }) {
  return (
    <Link
      to="/report/$id"
      params={{ id: report.id }}
      className="group flex overflow-hidden rounded-xl border border-border bg-surface shadow-card transition hover:shadow-elevated hover:-translate-y-0.5"
    >
      <div
        className="relative h-auto w-28 shrink-0 bg-muted bg-cover bg-center sm:w-32"
        style={{ backgroundImage: `url(${report.photo})` }}
      >
        <span className="absolute left-1.5 top-1.5 inline-flex h-7 w-7 items-center justify-center rounded-md bg-surface/95 text-base shadow-sm">
          {CATEGORY_ICON[report.category]}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 text-sm font-semibold text-foreground group-hover:text-primary">
            {report.title}
          </h3>
        </div>
        <p className="text-xs text-muted-foreground">
          {CATEGORY_LABEL[report.category]}
        </p>
        <div className="mt-auto flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" /> {report.district}
          </span>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-foreground">
              <Users className="h-3 w-3" /> {report.supports}
            </span>
            <StatusBadge status={report.status} />
          </div>
        </div>
      </div>
    </Link>
  );
}
