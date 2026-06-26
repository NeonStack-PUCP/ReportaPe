import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Megaphone,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { StatusBadge, Badge } from "@/components/Badge";
import { StateDataPanel } from "@/components/StateDataPanel";
import { ExpedienteViewer } from "@/components/ExpedienteViewer";
import { SupportButton } from "@/components/SupportButton";
import { MiniMap } from "@/components/MiniMap";
import { ReportCard } from "@/components/ReportCard";
import { EmptyState } from "@/components/EmptyState";
import { getReport, useReports } from "@/lib/store";
import {
  CATEGORY_ICON,
  CATEGORY_LABEL,
  SUPPORT_THRESHOLD,
  type Report,
} from "@/lib/mock-data";

export const Route = createFileRoute("/report/$id")({
  head: () => ({
    meta: [
      { title: "Detalle de denuncia · ReportaPe" },
      {
        name: "description",
        content:
          "Revisa la denuncia, el expediente formal generado por IA y los datos públicos verificados.",
      },
    ],
  }),
  component: ReportDetailPage,
});

function ReportDetailPage() {
  const { id } = useParams({ from: "/report/$id" });
  const reports = useReports();
  const [report, setReport] = useState<Report | undefined>(() => getReport(id));

  useEffect(() => {
    setReport(getReport(id));
  }, [id, reports]);

  const related = useMemo(
    () => reports.filter((r) => r.id !== id).slice(0, 3),
    [reports, id],
  );

  if (!report) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-3xl px-4 py-16">
          <EmptyState
            title="Denuncia no encontrada"
            description="La denuncia que buscas no existe o fue eliminada."
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

  const reached = report.supports >= SUPPORT_THRESHOLD;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero photo */}
      <div className="relative h-72 w-full overflow-hidden bg-muted sm:h-96">
        <img
          src={report.photo}
          alt={report.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 px-4 py-6 sm:px-6 sm:py-8">
          <div className="mx-auto max-w-6xl">
            <Link
              to="/"
              className="mb-3 inline-flex items-center gap-1.5 rounded-md bg-surface/90 px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-surface"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Volver al mapa
            </Link>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="primary">
                {CATEGORY_ICON[report.category]} {CATEGORY_LABEL[report.category]}
              </Badge>
              <StatusBadge status={report.status} />
            </div>
            <h1 className="mt-3 text-2xl font-bold text-white sm:text-4xl">
              {report.title}
            </h1>
            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-white/85">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4" /> {report.address}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />{" "}
                {new Date(report.date).toLocaleDateString("es-PE", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {reached && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-success/30 bg-success/5 p-4">
            <div className="rounded-full bg-success/15 p-2 text-success">
              <Megaphone className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">
                Solicitud colectiva generada
              </h2>
              <p className="text-sm text-muted-foreground">
                Este caso alcanzó {report.supports} apoyos vecinales y fue
                escalado como solicitud colectiva formal ante la entidad
                responsable.
              </p>
            </div>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <section className="rounded-2xl border border-border bg-surface p-5 shadow-card">
              <h2 className="text-base font-bold text-foreground">
                Descripción del caso
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-foreground/90">
                {report.description}
              </p>
            </section>

            <StateDataPanel data={report.stateData} />

            <ExpedienteViewer report={report} />

            <section>
              <h2 className="mb-3 text-base font-bold text-foreground">
                Casos cercanos relacionados
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {related.map((r) => (
                  <ReportCard key={r.id} report={r} />
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-4">
            <SupportButton
              id={report.id}
              supports={report.supports}
              threshold={SUPPORT_THRESHOLD}
            />
            <div className="rounded-2xl border border-border bg-surface p-4 shadow-card">
              <h3 className="mb-3 text-sm font-semibold text-foreground">
                Ubicación exacta
              </h3>
              <MiniMap pin={{ x: report.x, y: report.y }} height="h-56" />
              <p className="mt-2 text-xs text-muted-foreground">
                {report.address} · {report.district}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
