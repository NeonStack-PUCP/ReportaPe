import { Link } from "@tanstack/react-router";
import { FileText, Lightbulb, Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold shadow-sm">
            <span className="text-base">R</span>
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-lg font-bold tracking-tight text-foreground">
              Reporta<span className="text-primary">Pe</span>
            </span>
            <span className="hidden text-[10px] font-medium uppercase tracking-wider text-muted-foreground sm:block">
              Plataforma cívica
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <Link
            to="/"
            className="rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
            activeOptions={{ exact: true }}
            activeProps={{ className: "bg-muted" }}
          >
            Mapa cívico
          </Link>
          <a
            href="#como-funciona"
            className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Cómo funciona
          </a>
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            to="/proposal/new"
            className="inline-flex items-center gap-2 rounded-md border border-secondary/30 bg-accent px-3.5 py-2 text-sm font-semibold text-secondary transition hover:bg-secondary/10"
          >
            <Lightbulb className="h-4 w-4" /> Nueva propuesta
          </Link>
          <Link
            to="/report/new"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
          >
            <FileText className="h-4 w-4" /> Nueva denuncia
          </Link>
        </div>

        <button
          className="rounded-md p-2 text-foreground md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Abrir menú"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-surface md:hidden">
          <div className="flex flex-col gap-1 px-4 py-3">
            <Link
              to="/"
              className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
              onClick={() => setOpen(false)}
            >
              Mapa cívico
            </Link>
            <Link
              to="/proposal/new"
              className="inline-flex items-center gap-2 rounded-md border border-secondary/30 bg-accent px-3 py-2 text-sm font-semibold text-secondary"
              onClick={() => setOpen(false)}
            >
              <Lightbulb className="h-4 w-4" /> Nueva propuesta
            </Link>
            <Link
              to="/report/new"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground"
              onClick={() => setOpen(false)}
            >
              <FileText className="h-4 w-4" /> Nueva denuncia
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
