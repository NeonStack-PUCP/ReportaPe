import { cn } from "@/lib/utils";

export interface Step {
  label: string;
}

export function StepIndicator({
  steps,
  current,
}: {
  steps: Step[];
  current: number;
}) {
  return (
    <ol className="flex w-full items-center gap-2">
      {steps.map((s, i) => {
        const isActive = i === current;
        const isDone = i < current;
        return (
          <li key={s.label} className="flex flex-1 items-center gap-2">
            <div className="flex flex-1 items-center gap-2">
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition",
                  isDone && "border-success bg-success text-success-foreground",
                  isActive &&
                    "border-primary bg-primary text-primary-foreground shadow-sm",
                  !isActive &&
                    !isDone &&
                    "border-border bg-surface text-muted-foreground",
                )}
              >
                {isDone ? "✓" : i + 1}
              </div>
              <span
                className={cn(
                  "hidden text-sm font-medium sm:inline",
                  isActive ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={cn(
                  "h-0.5 w-6 flex-1 sm:w-12",
                  isDone ? "bg-success" : "bg-border",
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
