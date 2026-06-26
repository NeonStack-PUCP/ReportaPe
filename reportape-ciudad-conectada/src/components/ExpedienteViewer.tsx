import { Download, FileText, Share2 } from "lucide-react";
import { toast } from "sonner";
import { CATEGORY_LABEL, type Report } from "@/lib/mock-data";

export function buildExpediente(report: Report): string {
  const sd = report.stateData;
  return [
    "EXPEDIENTE CIUDADANO FORMAL",
    `Código: RPE-${report.id.toUpperCase()}`,
    `Fecha de emisión: ${new Date().toLocaleDateString("es-PE")}`,
    "",
    "1. RESUMEN DEL CASO",
    `Se reporta el siguiente hecho de interés público: "${report.title}".`,
    `Categoría: ${CATEGORY_LABEL[report.category]}. Distrito: ${report.district}.`,
    "",
    "2. DESCRIPCIÓN PRESENTADA POR EL CIUDADANO",
    report.description,
    "",
    "3. UBICACIÓN",
    `Dirección referencial: ${report.address}, ${report.district}, Lima.`,
    "",
    "4. EVIDENCIA",
    "Fotografía adjunta como evidencia visual del estado actual del hecho reportado.",
    "",
    "5. DATOS PÚBLICOS CRUZADOS",
    sd.found
      ? `• Entidad responsable: ${sd.responsible ?? "—"}\n• INFOBRAS: ${sd.infobras ?? "—"}\n• Presupuesto asignado: ${sd.budget ?? "—"}\n• Avance reportado: ${sd.progress ?? "—"}%\n• Días sin movimiento: ${sd.daysInactive ?? "—"}\n• Fuente: ${sd.source ?? "—"}`
      : "No se encontraron coincidencias en fuentes públicas. El caso se sustenta con evidencia ciudadana.",
    "",
    "6. ANÁLISIS AUTOMATIZADO",
    sd.critical
      ? "La inteligencia artificial detecta una condición crítica: el proyecto cuenta con presupuesto asignado y registro formal, pero presenta avance significativamente bajo respecto al tiempo transcurrido. Se recomienda elevar el caso ante el órgano de control institucional."
      : "El caso presenta elementos suficientes para iniciar una acción cívica formal y solicitar respuesta de la entidad responsable.",
    "",
    "7. SOLICITUD",
    "Se solicita a la entidad responsable atender el presente expediente, brindar respuesta formal dentro de los plazos legales y comunicar las acciones adoptadas a la comunidad afectada.",
    "",
    `— Generado automáticamente por ReportaPe con ${report.supports} apoyos vecinales.`,
  ].join("\n");
}

export function ExpedienteViewer({ report }: { report: Report }) {
  const content = buildExpediente(report);

  function handleDownload() {
    toast.success("Descarga simulada del expediente PDF iniciada");
  }
  function handleShare() {
    navigator.clipboard
      ?.writeText(`${window.location.origin}/report/${report.id}`)
      .catch(() => {});
    toast.success("Enlace del expediente copiado al portapapeles");
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-gradient-to-r from-secondary/10 via-secondary/5 to-transparent px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-secondary p-2 text-secondary-foreground">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">
              Expediente formal generado por IA
            </h3>
            <p className="text-xs text-muted-foreground">
              Documento listo para presentar o compartir
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-2 text-sm font-semibold text-foreground hover:bg-muted"
          >
            <Share2 className="h-4 w-4" /> Compartir
          </button>
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 rounded-md bg-secondary px-3 py-2 text-sm font-semibold text-secondary-foreground shadow-sm hover:bg-secondary/90"
          >
            <Download className="h-4 w-4" /> Descargar PDF
          </button>
        </div>
      </div>
      <div className="bg-[#fafaf7] p-5 sm:p-7">
        <div className="mx-auto max-w-2xl rounded-md bg-surface p-6 shadow-card ring-1 ring-border">
          <pre className="whitespace-pre-wrap font-sans text-[13.5px] leading-relaxed text-foreground">
            {content}
          </pre>
        </div>
      </div>
    </div>
  );
}
