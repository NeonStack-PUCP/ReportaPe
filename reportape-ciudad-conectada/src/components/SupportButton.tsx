import { Heart, Users } from "lucide-react";
import { toast } from "sonner";
import { toggleSupport, useHasSupported } from "@/lib/store";
import { cn } from "@/lib/utils";

export function SupportButton({
  id,
  supports,
  threshold = 15,
}: {
  id: string;
  supports: number;
  threshold?: number;
}) {
  const supported = useHasSupported(id);
  const reached = supports >= threshold;

  function handleClick() {
    if (supported) {
      toggleSupport(id);
      toast("Apoyo retirado", { description: "Puedes volver a apoyar cuando quieras." });
      return;
    }
    toggleSupport(id);
    toast.success("¡Gracias por apoyar este caso!", {
      description: "Tu apoyo suma presión cívica formal.",
    });
  }

  const progress = Math.min(100, (supports / threshold) * 100);

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-card">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-primary/10 p-2 text-primary">
            <Users className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              Apoyo vecinal
            </p>
            <p className="text-xs text-muted-foreground">
              {reached
                ? "Umbral alcanzado para solicitud colectiva"
                : `Faltan ${threshold - supports} apoyos para escalar a solicitud colectiva`}
            </p>
          </div>
        </div>
        <span className="text-2xl font-bold text-foreground">{supports}</span>
      </div>

      <div className="mb-4 h-2 overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "h-full transition-all duration-500",
            reached ? "bg-success" : "bg-primary",
          )}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mb-4 flex items-center gap-1.5">
        {Array.from({ length: Math.min(6, supports) }).map((_, i) => (
          <div
            key={i}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary/15 text-[10px] font-bold text-secondary ring-2 ring-surface"
            style={{ marginLeft: i === 0 ? 0 : -8 }}
          >
            {String.fromCharCode(65 + ((i * 7) % 26))}
            {String.fromCharCode(65 + ((i * 3 + 4) % 26))}
          </div>
        ))}
        {supports > 6 && (
          <span className="ml-1 text-xs font-medium text-muted-foreground">
            +{supports - 6} vecinos más
          </span>
        )}
      </div>

      <button
        onClick={handleClick}
        className={cn(
          "inline-flex w-full items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold shadow-sm transition",
          supported
            ? "bg-success/10 text-success ring-1 ring-success/30 hover:bg-success/15"
            : "bg-primary text-primary-foreground hover:bg-primary/90",
        )}
      >
        <Heart
          className={cn("h-4 w-4", supported && "fill-current")}
        />
        {supported ? "Ya apoyaste este caso" : "Apoyar este caso"}
      </button>
    </div>
  );
}
