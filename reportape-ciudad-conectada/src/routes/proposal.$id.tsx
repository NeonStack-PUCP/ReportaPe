import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Calendar, Lightbulb, MapPin, Megaphone } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Badge } from "@/components/Badge";
import { StateDataPanel } from "@/components/StateDataPanel";
import { SupportButton } from "@/components/SupportButton";
import { MiniMap } from "@/components/MiniMap";
import { EmptyState } from "@/components/EmptyState";
import { getProposal, useProposals } from "@/lib/store";
import { SUPPORT_THRESHOLD, type Proposal } from "@/lib/mock-data";

export const Route = createFileRoute("/proposal/$id")({
  head: () => ({
    meta: [
      { title: "Detalle de propuesta · ReportaPe" },
      {
        name: "description",
        content:
          "Revisa la propuesta vecinal, su ubicación, apoyos y datos públicos relacionados.",
      },
    ],
  }),
  component: ProposalDetailPage,
});

function ProposalDetailPage() {
  const { id } = useParams({ from: "/proposal/$id" });
  const proposals = useProposals();
  const [proposal, setProposal] = useState<Proposal | undefined>(() =>
    getProposal(id),
  );

  useEffect(() => {
    setProposal(getProposal(id));
  }, [id, proposals]);

  if (!proposal) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-3xl px-4 py-16">
          <EmptyState
            title="Propuesta no encontrada"
            description="La propuesta que buscas no existe o fue eliminada."
          />
          <div className="mt-4 text-center">
            <Link to="/" className="text-sm font-semibold text-primary hover:underline">
              ← Volver al mapa
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const reached = proposal.supports >= SUPPORT_THRESHOLD;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Volver al mapa
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">
            <Lightbulb className="mr-1 h-3 w-3" /> Propuesta vecinal
          </Badge>
          {proposal.status === "convertible" && (
            <Badge variant="warning">Convertible a denuncia formal</Badge>
          )}
          {reached && <Badge variant="success">Petición formal generada</Badge>}
        </div>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {proposal.title}
        </h1>
        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-4 w-4" /> {proposal.address}, {proposal.district}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />{" "}
            {new Date(proposal.date).toLocaleDateString("es-PE", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>

        {reached && (
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-success/30 bg-success/5 p-4">
            <div className="rounded-full bg-success/15 p-2 text-success">
              <Megaphone className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">
                Propuesta escalada a petición formal
              </h2>
              <p className="text-sm text-muted-foreground">
                Con {proposal.supports} apoyos, esta propuesta fue elevada como
                petición formal ante la entidad correspondiente.
              </p>
            </div>
          </div>
        )}

        {proposal.status === "convertible" && (
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-warning/30 bg-warning/5 p-4">
            <div className="rounded-full bg-warning/15 p-2 text-warning">
              <Megaphone className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">
                Esta propuesta puede convertirse en denuncia
              </h2>
              <p className="text-sm text-muted-foreground">
                Detectamos un proyecto público aprobado con presupuesto sin
                ejecución. Tu propuesta puede convertirse en una denuncia
                formal con evidencia del Estado.
              </p>
            </div>
          </div>
        )}

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <section className="rounded-2xl border border-border bg-surface p-5 shadow-card">
              <h2 className="text-base font-bold text-foreground">
                Descripción de la propuesta
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-foreground/90">
                {proposal.description}
              </p>
            </section>

            <StateDataPanel data={proposal.stateData} />
          </div>

          <aside className="space-y-4">
            <SupportButton
              id={proposal.id}
              supports={proposal.supports}
              threshold={SUPPORT_THRESHOLD}
            />
            <div className="rounded-2xl border border-border bg-surface p-4 shadow-card">
              <h3 className="mb-3 text-sm font-semibold text-foreground">
                Ubicación
              </h3>
              <MiniMap pin={{ x: proposal.x, y: proposal.y }} height="h-56" />
              <p className="mt-2 text-xs text-muted-foreground">
                {proposal.address} · {proposal.district}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
