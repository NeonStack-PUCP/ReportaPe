import { useRef, useState } from "react";
import { Camera, ImagePlus, X } from "lucide-react";

const SAMPLE_PHOTOS = [
  "https://images.unsplash.com/photo-1517089596392-fb9a9033e05b?w=1200&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=1200&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1601584115197-04ecc0da31d6?w=1200&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519750013411-d23d44e470a2?w=1200&q=80&auto=format&fit=crop",
];

export function PhotoUpload({
  value,
  onChange,
  error,
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  error?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  function simulateUpload(url: string) {
    setUploading(true);
    setTimeout(() => {
      onChange(url);
      setUploading(false);
    }, 800);
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => simulateUpload(reader.result as string);
    reader.readAsDataURL(file);
  }

  if (value) {
    return (
      <div className="relative overflow-hidden rounded-xl border border-border bg-muted">
        <img src={value} alt="Evidencia" className="h-64 w-full object-cover" />
        <button
          type="button"
          onClick={() => onChange(null)}
          className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-md bg-surface/95 px-2 py-1 text-xs font-medium text-foreground shadow-card hover:bg-surface"
        >
          <X className="h-3.5 w-3.5" /> Cambiar foto
        </button>
        <div className="absolute bottom-2 left-2 rounded-md bg-success/90 px-2 py-1 text-[11px] font-semibold text-success-foreground">
          ✓ Evidencia cargada
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex h-48 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-surface text-center transition hover:border-primary hover:bg-primary/5"
      >
        {uploading ? (
          <>
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-sm font-medium text-muted-foreground">
              Subiendo evidencia…
            </p>
          </>
        ) : (
          <>
            <div className="rounded-full bg-primary/10 p-3 text-primary">
              <Camera className="h-6 w-6" />
            </div>
            <p className="text-sm font-semibold text-foreground">
              Sube una foto como evidencia
            </p>
            <p className="text-xs text-muted-foreground">
              Toca para tomar foto o adjuntar archivo (JPG, PNG)
            </p>
          </>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground">
          O usa una imagen de muestra:
        </p>
        <div className="grid grid-cols-4 gap-2">
          {SAMPLE_PHOTOS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => simulateUpload(p)}
              className="group relative aspect-square overflow-hidden rounded-md border border-border bg-muted hover:ring-2 hover:ring-primary"
            >
              <img src={p} alt="" className="h-full w-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100">
                <ImagePlus className="h-4 w-4 text-white" />
              </div>
            </button>
          ))}
        </div>
      </div>
      {error && (
        <p className="text-sm font-medium text-primary">{error}</p>
      )}
    </div>
  );
}
