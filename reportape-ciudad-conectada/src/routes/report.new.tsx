import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { StepIndicator } from "@/components/StepIndicator";
import { CategoryCard } from "@/components/CategoryCard";
import { MiniMap } from "@/components/MiniMap";
import { PhotoUpload } from "@/components/PhotoUpload";
import { LoadingState } from "@/components/LoadingState";
import { StateDataPanel } from "@/components/StateDataPanel";
import {
  CATEGORY_ICON,
  CATEGORY_LABEL,
  type Category,
  type Report,
} from "@/lib/mock-data";
import { addReport } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/report/new")({
  head: () => ({
    meta: [
      { title: "Nueva denuncia · ReportaPe" },
      {
        name: "description",
        content:
          "Crea una denuncia ciudadana en 4 pasos: categoría, ubicación, evidencia y confirmación.",
      },
      { property: "og:title", content: "Nueva denuncia · ReportaPe" },
      {
        property: "og:description",
        content:
          "Convierte un problema público en un expediente formal con respaldo de datos del Estado.",
      },
    ],
  }),
  component: NewReportPage,
});

const STEPS = [
  { label: "Categoría" },
  { label: "Ubicación" },
  { label: "Evidencia" },
  { label: "Confirmación" },
];

const CATEGORIES: Category[] = [
  "obra",
  "basura",
  "agua",
  "luz",
  "ambiente",
  "pista",
  "parque",
  "seguridad",
  "otro",
];

function NewReportPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [category, setCategory] = useState<Category | null>(null);
  const [pin, setPin] = useState({ x: 50, y: 50 });
  const [address, setAddress] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [phase, setPhase] = useState<"form" | "loading" | "review" | "done">(
    "form",
  );
  const [createdId, setCreatedId] = useState<string | null>(null);

  function next() {
    const e: Record<string, string> = {};
    if (step === 0 && !category) e.category = "Selecciona una categoría";
    if (step === 1 && !address.trim())
      e.address = "Ingresa una dirección referencial";
    if (step === 2) {
      if (!photo) e.photo = "Adjunta una foto como evidencia";
      if (!description.trim()) e.description = "Describe brevemente el caso";
    }
    setErrors(e);
    if (Object.keys(e).length) return;
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      setPhase("loading");
    }
  }

  function back() {
    if (step > 0) setStep((s) => s - 1);
  }

  function finalize() {
    if (!category) return;
    const id = `r-${Date.now()}`;
    const newReport: Report = {
      id,
      title:
        description.split(/[.\n]/)[0].slice(0, 80) ||
        `Reporte de ${CATEGORY_LABEL[category]}`,
      category,
      status: "active",
      address,
      district: address.split(",").slice(-1)[0]?.trim() || "Lima",
      date: new Date().toISOString().slice(0, 10),
      description,
      photo: photo!,
      supports: 1,
      x: pin.x,
      y: pin.y,
      stateData:
        category === "obra"
          ? {
              found: true,
              responsible: "Municipalidad Distrital correspondiente",
              infobras: String(10000 + Math.floor(Math.random() * 9000)),
              budget: "S/. 320,000",
              progress: 15,
              daysInactive: 62,
              source: "INFOBRAS · MEF",
              critical: true,
            }
          : {
              found: true,
              responsible: "Municipalidad correspondiente",
              source: "Portal de Transparencia Municipal",
            },
    };
    addReport(newReport);
    setCreatedId(id);
    setPhase("done");
    toast.success("Denuncia registrada con éxito");
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
          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
            Nueva denuncia
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Convierte un problema en un expediente formal
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Completa los 4 pasos. ReportaPe cruzará tu caso con datos públicos del
          Estado.
        </p>

        <div className="my-6">
          <StepIndicator steps={STEPS} current={step} />
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-7">
          {phase === "form" && (
            <>
              {step === 0 && (
                <div>
                  <h2 className="text-lg font-bold text-foreground">
                    ¿Qué tipo de problema deseas reportar?
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Elige la categoría que mejor describe el caso.
                  </p>
                  <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
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
                    <p className="mt-3 text-sm font-medium text-primary">
                      {errors.category}
                    </p>
                  )}
                </div>
              )}

              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-lg font-bold text-foreground">
                      ¿Dónde ocurre el problema?
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Mueve el pin en el mapa o ingresa la dirección referencial.
                    </p>
                  </div>
                  <MiniMap
                    pin={pin}
                    onPinChange={setPin}
                    showCurrentLocationButton
                    height="h-72"
                  />
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      Dirección referencial
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Ej. Av. Próceres 1820, San Juan de Lurigancho"
                      className="w-full rounded-md border border-input bg-surface px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    {errors.address && (
                      <p className="mt-1.5 text-sm font-medium text-primary">
                        {errors.address}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-lg font-bold text-foreground">
                      Adjunta evidencia del problema
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Una foto clara fortalece el expediente formal.
                    </p>
                  </div>
                  <PhotoUpload
                    value={photo}
                    onChange={setPhoto}
                    error={errors.photo}
                  />
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      Descripción del caso
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) =>
                        setDescription(e.target.value.slice(0, 300))
                      }
                      rows={5}
                      placeholder="Cuéntanos qué está pasando, desde cuándo y a quiénes afecta."
                      className="w-full rounded-md border border-input bg-surface px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <div className="mt-1 flex items-center justify-between">
                      {errors.description ? (
                        <p className="text-sm font-medium text-primary">
                          {errors.description}
                        </p>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          Sé claro y específico
                        </span>
                      )}
                      <span className="text-xs font-medium text-muted-foreground">
                        {description.length}/300
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-lg font-bold text-foreground">
                      Revisa antes de enviar
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Verifica que toda la información esté correcta.
                    </p>
                  </div>
                  <div className="overflow-hidden rounded-xl border border-border">
                    {photo && (
                      <img
                        src={photo}
                        alt=""
                        className="h-48 w-full object-cover"
                      />
                    )}
                    <div className="space-y-2 p-4">
                      <SummaryRow
                        label="Categoría"
                        value={
                          category
                            ? `${CATEGORY_ICON[category]} ${CATEGORY_LABEL[category]}`
                            : "—"
                        }
                        onEdit={() => setStep(0)}
                      />
                      <SummaryRow
                        label="Ubicación"
                        value={address || "—"}
                        onEdit={() => setStep(1)}
                      />
                      <SummaryRow
                        label="Descripción"
                        value={description || "—"}
                        onEdit={() => setStep(2)}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-7 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={back}
                  disabled={step === 0}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-foreground disabled:opacity-40 hover:bg-muted"
                >
                  <ArrowLeft className="h-4 w-4" /> Atrás
                </button>
                <button
                  type="button"
                  onClick={next}
                  className="inline-flex items-center gap-1.5 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
                >
                  {step < STEPS.length - 1 ? "Continuar" : "Verificar con el Estado"}{" "}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </>
          )}

          {phase === "loading" && (
            <LoadingState onDone={() => setPhase("review")} />
          )}

          {phase === "review" && category && (
            <div className="space-y-5">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-xs font-semibold text-success ring-1 ring-success/20">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Verificación completada
                </span>
                <h2 className="mt-2 text-lg font-bold text-foreground">
                  Encontramos datos públicos relacionados
                </h2>
                <p className="text-sm text-muted-foreground">
                  Estos son los datos que respaldarán tu denuncia.
                </p>
              </div>

              <StateDataPanel
                data={
                  category === "obra"
                    ? {
                        found: true,
                        critical: true,
                        responsible: "Municipalidad Distrital correspondiente",
                        infobras: String(10000 + Math.floor(Math.random() * 9000)),
                        budget: "S/. 320,000",
                        progress: 15,
                        daysInactive: 62,
                        source: "INFOBRAS · MEF",
                      }
                    : {
                        found: true,
                        responsible: "Municipalidad correspondiente",
                        source: "Portal de Transparencia Municipal",
                      }
                }
              />

              <div className="flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => setPhase("form")}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  ← Editar denuncia
                </button>
                <button
                  onClick={finalize}
                  className="inline-flex items-center gap-2 rounded-md bg-secondary px-5 py-2.5 text-sm font-semibold text-secondary-foreground shadow-sm hover:bg-secondary/90"
                >
                  Generar expediente formal <ArrowRight className="h-4 w-4" />
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
                ¡Tu denuncia fue registrada!
              </h2>
              <p className="text-sm text-muted-foreground">
                Generamos un expediente formal listo para compartir y presentar.
              </p>
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                <button
                  onClick={() =>
                    navigate({ to: "/report/$id", params: { id: createdId } })
                  }
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  Ver expediente <ArrowRight className="h-4 w-4" />
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

function SummaryRow({
  label,
  value,
  onEdit,
}: {
  label: string;
  value: string;
  onEdit: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-border py-2 last:border-0">
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className="text-sm text-foreground">{value}</p>
      </div>
      <button
        onClick={onEdit}
        className="shrink-0 text-xs font-semibold text-secondary hover:underline"
      >
        Editar
      </button>
    </div>
  );
}
