import { Inbox } from "lucide-react";

export function EmptyState({
  title = "Sin resultados",
  description = "No hay casos que coincidan con los filtros aplicados.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface px-6 py-10 text-center">
      <div className="mb-3 rounded-full bg-muted p-3 text-muted-foreground">
        <Inbox className="h-6 w-6" />
      </div>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <p className="mt-1 max-w-xs text-xs text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

export function ErrorState({
  title = "Algo no funcionó",
  description = "Ocurrió un error al procesar tu solicitud. Puedes continuar con datos parciales o reintentar.",
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 text-center">
      <h3 className="text-sm font-bold text-primary">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-3 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          Reintentar
        </button>
      )}
    </div>
  );
}
