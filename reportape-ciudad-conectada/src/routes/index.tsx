import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  Lightbulb,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { MapView } from "@/components/MapView";
import { FilterBar, type Filters } from "@/components/FilterBar";
import { ReportCard } from "@/components/ReportCard";
import { ProposalCard } from "@/components/ProposalCard";
import { EmptyState } from "@/components/EmptyState";
import { useProposals, useReports } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ReportaPe — Mapa cívico de denuncias y propuestas" },
      {
        name: "description",
        content:
          "Mapa cívico en vivo: denuncias vecinales y propuestas con respaldo de datos públicos del Estado peruano.",
      },
      { property: "og:title", content: "ReportaPe — Mapa cívico" },
      {
        property: "og:description",
        content:
          "Reporta, propone y apoya casos vecinales con expedientes formales generados por IA.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const reports = useReports();
  const proposals = useProposals();
  const [filters, setFilters] = useState<Filters>({
    category: "all",
    status: "all",
    zone: "all",
  });

  const zones = useMemo(() => {
    const set = new Set<string>();
    reports.forEach((r) => set.add(r.district));
    proposals.forEach((p) => set.add(p.district));
    return Array.from(set).sort();
  }, [reports, proposals]);

  const filteredReports = reports.filter(
    (r) =>
      (filters.category === "all" || r.category === filters.category) &&
      (filters.status === "all" || r.status === filters.status) &&
      (filters.zone === "all" || r.district === filters.zone),
  );
  const filteredProposals = proposals.filter(
    (p) =>
      (filters.category === "all" || filters.category === "propuesta") &&
      (filters.zone === "all" || p.district === filters.zone),
  );

  const totalSupports =
    reports.reduce((a, r) => a + r.supports, 0) +
    proposals.reduce((a, p) => a + p.supports, 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="border-b border-border bg-gradient-to-b from-accent/40 via-surface to-background">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:py-16">
          <div className="flex flex-col justify-center">
            <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary ring-1 ring-primary/20">
              <ShieldCheck className="h-3.5 w-3.5" /> Plataforma cívica · Perú
            </span>
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
              Tu voz vecinal,{" "}
              <span className="text-primary">expediente formal.</span>
            </h1>
            <p className="mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
              ReportaPe convierte denuncias y propuestas vecinales en expedientes
              formales, cruzando ubicación, evidencia fotográfica, datos públicos
              del Estado e inteligencia artificial.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/report/new"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-elevated transition hover:bg-primary/90"
              >
                <FileText className="h-4 w-4" /> Crear denuncia
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/proposal/new"
                className="inline-flex items-center gap-2 rounded-md border border-secondary/30 bg-surface px-5 py-3 text-sm font-semibold text-secondary shadow-card transition hover:bg-accent"
              >
                <Lightbulb className="h-4 w-4" /> Crear propuesta
              </Link>
            </div>

            <dl className="mt-8 grid grid-cols-3 gap-3 border-t border-border pt-6">
              <Stat label="Casos activos" value={reports.length + proposals.length} />
              <Stat label="Apoyos vecinales" value={totalSupports} />
              <Stat label="Distritos" value={zones.length} />
            </dl>
          </div>

          <div id="como-funciona" className="grid gap-3 self-center">
            <HowCard
              icon={<FileText className="h-4 w-4" />}
              title="1. Reporta o propón"
              text="Categoriza el caso, marca la ubicación y adjunta evidencia desde tu celular."
            />
            <HowCard
              icon={<Sparkles className="h-4 w-4" />}
              title="2. Cruzamos datos públicos"
              text="Consultamos INFOBRAS, MEF y portales municipales para verificar el caso."
            />
            <HowCard
              icon={<CheckCircle2 className="h-4 w-4" />}
              title="3. Expediente formal con IA"
              text="Generamos un expediente listo para presentar y compartir con tus vecinos."
            />
            <HowCard
              icon={<TrendingUp className="h-4 w-4" />}
              title="4. Apoyo colectivo"
              text="Al alcanzar 15 apoyos, el caso escala a solicitud colectiva formal."
            />
          </div>
        </div>
      </section>

      {/* Map + sidebar */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Mapa cívico</h2>
            <p className="text-sm text-muted-foreground">
              Explora denuncias y propuestas en tu zona. Toca un pin para ver el
              detalle.
            </p>
          </div>
          <Link
            to="/report/new"
            className="text-sm font-semibold text-primary hover:underline"
          >
            Reportar un caso nuevo →
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            <MapView reports={filteredReports} proposals={filteredProposals} />
            {filteredProposals.length > 0 && (
              <div className="grid gap-3 sm:grid-cols-2">
                {filteredProposals.map((p) => (
                  <ProposalCard key={p.id} proposal={p} />
                ))}
              </div>
            )}
          </div>

          <aside className="space-y-4">
            <FilterBar value={filters} onChange={setFilters} zones={zones} />
            <div className="rounded-xl border border-border bg-surface p-4 shadow-card">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">
                  Casos cercanos
                </h3>
                <span className="text-xs font-medium text-muted-foreground">
                  {filteredReports.length} resultados
                </span>
              </div>
              <div className="space-y-3">
                {filteredReports.length === 0 ? (
                  <EmptyState
                    title="No hay denuncias con esos filtros"
                    description="Prueba limpiar los filtros o cambiar de zona."
                  />
                ) : (
                  filteredReports.map((r) => (
                    <ReportCard key={r.id} report={r} />
                  ))
                )}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <footer className="mt-10 border-t border-border bg-surface">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-center text-xs text-muted-foreground sm:flex-row sm:px-6 sm:text-left">
          <p>
            © {new Date().getFullYear()} ReportaPe · Plataforma cívica para el Perú
          </p>
          <p>Hecho con respaldo de datos públicos del Estado e IA.</p>
        </div>
      </footer>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className="text-2xl font-bold text-foreground">{value}</dd>
    </div>
  );
}

function HowCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-3 rounded-xl border border-border bg-surface p-4 shadow-card">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-bold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}
