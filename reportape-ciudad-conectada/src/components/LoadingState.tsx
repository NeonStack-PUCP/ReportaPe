import { useEffect, useState } from "react";

const DEFAULT_STEPS = [
  "Consultando INFOBRAS…",
  "Verificando datos del MEF Consulta Amigable…",
  "Identificando entidad responsable…",
  "Analizando evidencia con inteligencia artificial…",
  "Generando expediente formal…",
];

export function LoadingState({
  steps = DEFAULT_STEPS,
  onDone,
  title = "Procesando tu caso",
  subtitle = "Estamos cruzando tu reporte con fuentes oficiales del Estado peruano.",
}: {
  steps?: string[];
  onDone?: () => void;
  title?: string;
  subtitle?: string;
}) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (index >= steps.length) {
      const t = setTimeout(() => onDone?.(), 400);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setIndex((i) => i + 1), 850);
    return () => clearTimeout(t);
  }, [index, steps.length, onDone]);

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-card sm:p-8">
      <div className="mb-5 flex items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-primary border-t-transparent" />
        <div>
          <h3 className="text-lg font-bold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      <ol className="space-y-2.5">
        {steps.map((s, i) => {
          const done = i < index;
          const active = i === index;
          return (
            <li
              key={s}
              className="flex items-center gap-3 rounded-lg border border-border bg-background px-3 py-2.5"
            >
              <div
                className={
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold " +
                  (done
                    ? "bg-success text-success-foreground"
                    : active
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground")
                }
              >
                {done ? "✓" : active ? "…" : i + 1}
              </div>
              <span
                className={
                  "text-sm " +
                  (done
                    ? "text-foreground line-through decoration-success/50"
                    : active
                      ? "font-semibold text-foreground"
                      : "text-muted-foreground")
                }
              >
                {s}
              </span>
              {active && (
                <span className="ml-auto inline-flex gap-1">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:0ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:120ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:240ms]" />
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
