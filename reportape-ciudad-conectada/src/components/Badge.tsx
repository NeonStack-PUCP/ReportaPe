import { cn } from "@/lib/utils";
import { STATUS_LABEL, type ReportStatus } from "@/lib/mock-data";

const STATUS_CLASS: Record<ReportStatus, string> = {
  active: "bg-success/10 text-success ring-success/20",
  pending: "bg-warning/10 text-warning ring-warning/20",
  resolved: "bg-secondary/10 text-secondary ring-secondary/20",
  critical: "bg-primary/10 text-primary ring-primary/20",
};

export function StatusBadge({
  status,
  className,
}: {
  status: ReportStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
        STATUS_CLASS[status],
        className,
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          status === "active" && "bg-success",
          status === "pending" && "bg-warning",
          status === "resolved" && "bg-secondary",
          status === "critical" && "bg-primary animate-pulse",
        )}
      />
      {STATUS_LABEL[status]}
    </span>
  );
}

export function Badge({
  children,
  variant = "neutral",
  className,
}: {
  children: React.ReactNode;
  variant?: "neutral" | "primary" | "secondary" | "success" | "warning";
  className?: string;
}) {
  const map = {
    neutral: "bg-muted text-muted-foreground ring-border",
    primary: "bg-primary/10 text-primary ring-primary/20",
    secondary: "bg-secondary/10 text-secondary ring-secondary/20",
    success: "bg-success/10 text-success ring-success/20",
    warning: "bg-warning/10 text-warning ring-warning/20",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
        map[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
