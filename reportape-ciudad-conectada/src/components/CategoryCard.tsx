import { CATEGORY_ICON, CATEGORY_LABEL, type Category } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function CategoryCard({
  category,
  selected,
  onClick,
}: {
  category: Category;
  selected?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-xl border bg-surface p-4 text-center shadow-card transition hover:-translate-y-0.5 hover:shadow-elevated",
        selected
          ? "border-primary bg-primary/5 ring-2 ring-primary/30"
          : "border-border",
      )}
    >
      <span className="text-3xl">{CATEGORY_ICON[category]}</span>
      <span className="text-xs font-semibold text-foreground">
        {CATEGORY_LABEL[category]}
      </span>
    </button>
  );
}
