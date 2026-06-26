import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Lightbulb } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { MiniMap } from "@/components/MiniMap";
import { CategoryCard } from "@/components/CategoryCard";
import { LoadingState } from "@/components/LoadingState";
import { StateDataPanel } from "@/components/StateDataPanel";
import { addProposal } from "@/lib/store";
import type { Category, Proposal } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/proposal/new")({
  head: () => ({
    meta: [
      { title: "Nueva propuesta vecinal · ReportaPe" },
      {
        name: "description",
        content:
          "Publica una propuesta vecinal en el mapa y recibe apoyo de tu comunidad.",
      },
      { property: "og:title", content: "Nueva propuesta vecinal · ReportaPe" },
    ],
  }),
  component: NewProposalPage,
});

const CATEGORIES: Category[] = [
  "ambiente",
  "pista",
  "parque",
  "luz",
  "seguridad",
  "otro",
];

function NewProposalPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category | null>(null);
  const [pin, setPin] = useState({ x: 50, y: 50 });
  const [address, setAddress] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [phase, setPhase] = useState<"form" | "loading" | "result" | "done">(
    "form",
  );
  const [createdId, setCreatedId] = useState<string | null>(null);
  // Simulated: 50% chance the proposal becomes convertible. Deterministic by title length for demo.
  const [convertible, setConvertible] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = "Ingresa un título claro";
    if (!description.trim()) errs.description = "Describe tu propuesta";
    if (!address.trim()) errs.address = "Indica una ubicación";
    if (!category) errs.category = "Selecciona una categoría";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setConvertible(description.toLowerCase().includes("ciclovía") || title.length % 2 === 0);
    setPhase("loading");
  }

  function finalize() {
    const id = `p-${Date.now()}`;
    const newProp: Proposal = {
      id,
      title,
      description,
      address,
      district: address.split(",").slice(-1)[0]?.trim() || "Lima",
      date: new Date().toISOString().slice(0, 10),
      supports: 1,
      x: pin.x,
      y: pin.y,
      status: convertible ? "convertible" : "petition",
      stateData: convertible
        ? {
            found: true,
            critical: true,
            responsible: "Municipalidad Metropolitana de Lima",
            infobras: String(8000 + Math.floor(Math.random() * 2000)),
            budget: "S/. 1,150,000",
            progress: 0,
            daysInactive: 180,
            source: "INFOBRAS · MEF",
            note: "Proyecto público aprobado con presupuesto sin ejecución.",
          }
        : {
            found: false,
            note: "No se encontró proyecto público asociado a esta zona.",
          },
    };
    addProposal(newProp);
    setCreatedId(id);
    setPhase("done");
    toast.success("Propuesta vecinal publicada");
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Volver al mapa
        </Link>

        <div className="mb-2 flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/10 px-2.5 py-1 text-xs font-semibold text-secondary">
            <Lightbulb className="h-3 w-3" /> Nueva propuesta vecinal
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Convierte una idea en una iniciativa vecinal
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Tu propuesta podrá recibir apoyo de tus vecinos y escalar como
          petición formal.
        </p>

        <div className="mt-6 rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-7">
          {phase === "form" && (
            <form onSubmit={submit} className="space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Título de la propuesta
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej. Ciclovía en Av. Universitaria"
                  className="w-full rounded-md border border-input bg-surface px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
                {errors.title && (
                  <p className="mt-1.5 text-sm font-medium text-primary">
                    {errors.title}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Descripción
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value.slice(0, 400))}
                  rows={4}
                  placeholder="Explica brevemente la mejora propuesta y a quiénes beneficiará."
                  className="w-full rounded-md border border-input bg-surface px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <div className="mt-1 flex items-center justify-between">
                  {errors.description ? (
                    <p className="text-sm font-medium text-primary">
                      {errors.description}
                    </p>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      Sé breve y específico
                    </span>
                  )}
                  <span className="text-xs font-medium text-muted-foreground">
                    {description.length}/400
                  </span>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Categoría
                </label>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                  {CATEGORIES.map((c) => (
                    <CategoryCard
                      key={c}
                      category={c}
                      selected={category === c}
                      onClick={() => setCategory(c)}
                    />
                  ))}
                </div>
                {errors.category && (
                  <p className="mt-1.5 text-sm font-medium text-primary">
                    {errors.category}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  Ubicación en el mapa
                </label>
                <MiniMap
                  pin={pin}
                  onPinChange={setPin}
                  showCurrentLocationButton
                  height="h-60"
                />
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Dirección o referencia, distrito"
                  className="w-full rounded-md border border-input bg-surface px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
                {errors.address && (
                  <p className="text-sm font-medium text-primary">
                    {errors.address}
                  </p>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-md bg-secondary px-5 py-2.5 text-sm font-semibold text-secondary-foreground shadow-sm hover:bg-secondary/90"
                >
                  Verificar y publicar <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          )}

          {phase === "loading" && (
            <LoadingState
              title="Analizando tu propuesta"
              subtitle="Cruzando con proyectos públicos, presupuesto y entidad responsable."
              steps={[
                "Consultando INFOBRAS…",
                "Verificando proyectos del MEF…",
                "Identificando entidad responsable…",
                "Analizando con inteligencia artificial…",
              ]}
              onDone={() => setPhase("result")}
            />
          )}

          {phase === "result" && (
            <div className="space-y-5">
              {convertible ? (
                <div className="rounded-xl border border-warning/30 bg-warning/5 p-4">
                  <Badge>Convertible a denuncia</Badge>
                  <h2 className="mt-2 text-lg font-bold text-foreground">
                    Encontramos un proyecto público asociado
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Existe un proyecto aprobado con presupuesto asignado pero sin
                    ejecución. Tu propuesta puede convertirse en una denuncia
                    formal con evidencia del Estado.
                  </p>
                </div>
              ) : (
                <div className="rounded-xl border border-secondary/30 bg-accent/40 p-4">
                  <Badge>Petición vecinal</Badge>
                  <h2 className="mt-2 text-lg font-bold text-foreground">
                    Tu propuesta queda como petición vecinal
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    No encontramos un proyecto público asociado. Tu propuesta
                    estará abierta a firmas y podrá escalar al alcanzar el
                    umbral de apoyos.
                  </p>
                </div>
              )}

              <StateDataPanel
                data={
                  convertible
                    ? {
                        found: true,
                        critical: true,
                        responsible: "Municipalidad Metropolitana de Lima",
                        infobras: "8821",
                        budget: "S/. 1,150,000",
                        progress: 0,
                        daysInactive: 180,
                        source: "INFOBRAS · MEF",
                      }
                    : {
                        found: false,
                        note: "No se encontró proyecto público asociado a esta zona.",
                      }
                }
              />

              <div className="flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => setPhase("form")}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  ← Editar propuesta
                </button>
                <button
                  onClick={finalize}
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  Publicar propuesta <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {phase === "done" && createdId && (
            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success/10 text-success">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <h2 className="text-xl font-bold text-foreground">
                ¡Tu propuesta está publicada!
              </h2>
              <p className="text-sm text-muted-foreground">
                Tus vecinos ya pueden apoyarla desde el mapa cívico.
              </p>
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                <button
                  onClick={() =>
                    navigate({ to: "/proposal/$id", params: { id: createdId } })
                  }
                  className="inline-flex items-center gap-2 rounded-md bg-secondary px-5 py-2.5 text-sm font-semibold text-secondary-foreground hover:bg-secondary/90"
                >
                  Ver propuesta <ArrowRight className="h-4 w-4" />
                </button>
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-muted"
                >
                  Volver al mapa
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-surface px-2.5 py-1 text-xs font-semibold text-foreground ring-1 ring-border">
      {children}
    </span>
  );
}
