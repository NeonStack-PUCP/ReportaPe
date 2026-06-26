import { Link } from "@tanstack/react-router";
import { MapPin, Users } from "lucide-react";
import { CATEGORY_ICON, type Proposal } from "@/lib/mock-data";
import { Badge } from "./Badge";

export function ProposalCard({ proposal }: { proposal: Proposal }) {
  return (
    <Link
      to="/proposal/$id"
      params={{ id: proposal.id }}
      className="group flex flex-col gap-2 rounded-xl border border-secondary/20 bg-accent/40 p-3 shadow-card transition hover:shadow-elevated hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-surface text-base shadow-sm">
            {CATEGORY_ICON.propuesta}
          </span>
          <Badge variant="secondary">Propuesta vecinal</Badge>
        </div>
        {proposal.status === "convertible" && (
          <Badge variant="warning">Convertible a denuncia</Badge>
        )}
      </div>
      <h3 className="text-sm font-semibold text-foreground group-hover:text-secondary">
        {proposal.title}
      </h3>
      <p className="line-clamp-2 text-xs text-muted-foreground">
        {proposal.description}
      </p>
      <div className="mt-auto flex items-center justify-between text-xs">
        <span className="inline-flex items-center gap-1 text-muted-foreground">
          <MapPin className="h-3 w-3" /> {proposal.district}
        </span>
        <span className="inline-flex items-center gap-1 font-semibold text-foreground">
          <Users className="h-3 w-3" /> {proposal.supports} apoyos
        </span>
      </div>
    </Link>
  );
}
