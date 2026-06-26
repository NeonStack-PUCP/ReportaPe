import { AlertTriangle, CheckCircle2, Info, Building2, Banknote, Calendar, Database, Activity } from "lucide-react";
import type { StateData } from "@/lib/mock-data";
import { Badge } from "./Badge";

function DataRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-border py-2.5 last:border-0">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="text-secondary">{icon}</span>
        {label}
      </div>
      <div className="text-right text-sm font-semibold text-foreground">{value}</div>
    </div>
  );
}

export function StateDataPanel({ data }: { data: StateData }) {
  if (!data.found) {
    return (
      <div className="rounded-xl border border-border bg-surface p-4 shadow-card">
        <div className="mb-3 flex items-center gap-2">
          <div className="rounded-full bg-muted p-2 text-muted-foreground">
            <Info className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Datos del Estado
            </h3>
            <p className="text-xs text-muted-foreground">
              Verificación con fuentes públicas
            </p>
          </div>
          <Badge variant="neutral" className="ml-auto">
            Sin coincidencias
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          {data.note ??
            "No encontramos información pública relacionada. El caso continúa con la evidencia ciudadana."}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-card">
      <div className="flex items-center gap-2 border-b border-border bg-accent/40 px-4 py-3">
        <div className="rounded-full bg-success/15 p-2 text-success">
          <CheckCircle2 className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Datos verificados del Estado
          </h3>
          <p className="text-xs text-muted-foreground">
            Fuente: {data.source ?? "Plataformas públicas del Estado peruano"}
          </p>
        </div>
        <Badge variant="success" className="ml-auto">
          Verificado
        </Badge>
      </div>
      <div className="space-y-0 px-4 py-1">
        {data.responsible && (
          <DataRow
            icon={<Building2 className="h-4 w-4" />}
            label="Entidad responsable"
            value={data.responsible}
          />
        )}
        {data.infobras && (
          <DataRow
            icon={<Database className="h-4 w-4" />}
            label="Código INFOBRAS"
            value={`#${data.infobras}`}
          />
        )}
        {data.budget && (
          <DataRow
            icon={<Banknote className="h-4 w-4" />}
            label="Presupuesto asignado"
            value={data.budget}
          />
        )}
        {typeof data.progress === "number" && (
          <DataRow
            icon={<Activity className="h-4 w-4" />}
            label="Avance reportado"
            value={
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-warning"
                    style={{ width: `${data.progress}%` }}
                  />
                </div>
                <span>{data.progress}%</span>
              </div>
            }
          />
        )}
        {typeof data.daysInactive === "number" && (
          <DataRow
            icon={<Calendar className="h-4 w-4" />}
            label="Días sin movimiento"
            value={`${data.daysInactive} días`}
          />
        )}
      </div>
      {data.critical && (
        <div className="flex items-start gap-3 border-t border-warning/20 bg-warning/5 px-4 py-3">
          <AlertTriangle className="h-5 w-5 shrink-0 text-warning" />
          <div className="text-sm">
            <p className="font-semibold text-foreground">Alerta crítica detectada</p>
            <p className="text-muted-foreground">
              {data.note ??
                "El proyecto presenta presupuesto asignado sin ejecución y avance crítico. Existe evidencia formal para sustentar la denuncia."}
            </p>
          </div>
        </div>
      )}
      {!data.critical && data.note && (
        <div className="border-t border-border bg-muted/40 px-4 py-3 text-xs text-muted-foreground">
          {data.note}
        </div>
      )}
    </div>
  );
}
