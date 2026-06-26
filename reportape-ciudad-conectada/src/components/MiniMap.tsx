import { MapPin, Navigation } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function MiniMap({
  pin,
  onPinChange,
  showCurrentLocationButton = false,
  height = "h-64",
}: {
  pin?: { x: number; y: number };
  onPinChange?: (p: { x: number; y: number }) => void;
  showCurrentLocationButton?: boolean;
  height?: string;
}) {
  const [position, setPosition] = useState(pin ?? { x: 50, y: 50 });

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    if (!onPinChange) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const next = { x, y };
    setPosition(next);
    onPinChange(next);
  }

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-xl border border-border map-grid-bg map-streets",
        height,
        onPinChange && "cursor-crosshair",
      )}
      onClick={handleClick}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/[0.02]" />
      <div
        className="absolute -translate-x-1/2 -translate-y-full transition-all duration-200"
        style={{ left: `${position.x}%`, top: `${position.y}%` }}
      >
        <div className="flex flex-col items-center">
          <div className="rounded-full bg-primary p-2 text-primary-foreground shadow-elevated ring-4 ring-primary/20">
            <MapPin className="h-4 w-4" fill="currentColor" />
          </div>
          <div className="-mt-1 h-2 w-2 rotate-45 bg-primary" />
        </div>
      </div>
      {showCurrentLocationButton && onPinChange && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            const next = { x: 50, y: 50 };
            setPosition(next);
            onPinChange(next);
          }}
          className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-md bg-surface px-3 py-1.5 text-xs font-semibold text-secondary shadow-card ring-1 ring-border hover:bg-accent"
        >
          <Navigation className="h-3.5 w-3.5" /> Usar ubicación actual
        </button>
      )}
      <div className="absolute left-3 top-3 rounded-md bg-surface/90 px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground shadow-card">
        Mapa cívico · Lima
      </div>
    </div>
  );
}
