import { useEffect, useState } from "react";
import {
  MOCK_PROPOSALS,
  MOCK_REPORTS,
  type Proposal,
  type Report,
} from "./mock-data";

const REPORTS_KEY = "reportape:reports";
const PROPOSALS_KEY = "reportape:proposals";
const SUPPORTS_KEY = "reportape:supports";

type Supports = Record<string, boolean>;

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("reportape:store"));
}

export function useReports(): Report[] {
  const [items, setItems] = useState<Report[]>(MOCK_REPORTS);
  useEffect(() => {
    const load = () => {
      const extra = read<Report[]>(REPORTS_KEY, []);
      const supports = read<Supports>(SUPPORTS_KEY, {});
      const all = [...extra, ...MOCK_REPORTS].map((r) => ({
        ...r,
        supports: r.supports + (supports[r.id] ? 1 : 0),
      }));
      setItems(all);
    };
    load();
    window.addEventListener("reportape:store", load);
    return () => window.removeEventListener("reportape:store", load);
  }, []);
  return items;
}

export function useProposals(): Proposal[] {
  const [items, setItems] = useState<Proposal[]>(MOCK_PROPOSALS);
  useEffect(() => {
    const load = () => {
      const extra = read<Proposal[]>(PROPOSALS_KEY, []);
      const supports = read<Supports>(SUPPORTS_KEY, {});
      const all = [...extra, ...MOCK_PROPOSALS].map((p) => ({
        ...p,
        supports: p.supports + (supports[p.id] ? 1 : 0),
      }));
      setItems(all);
    };
    load();
    window.addEventListener("reportape:store", load);
    return () => window.removeEventListener("reportape:store", load);
  }, []);
  return items;
}

export function getReport(id: string): Report | undefined {
  const extra = read<Report[]>(REPORTS_KEY, []);
  const supports = read<Supports>(SUPPORTS_KEY, {});
  const found = [...extra, ...MOCK_REPORTS].find((r) => r.id === id);
  if (!found) return undefined;
  return { ...found, supports: found.supports + (supports[found.id] ? 1 : 0) };
}

export function getProposal(id: string): Proposal | undefined {
  const extra = read<Proposal[]>(PROPOSALS_KEY, []);
  const supports = read<Supports>(SUPPORTS_KEY, {});
  const found = [...extra, ...MOCK_PROPOSALS].find((p) => p.id === id);
  if (!found) return undefined;
  return { ...found, supports: found.supports + (supports[found.id] ? 1 : 0) };
}

export function addReport(r: Report) {
  const extra = read<Report[]>(REPORTS_KEY, []);
  write(REPORTS_KEY, [r, ...extra]);
}

export function addProposal(p: Proposal) {
  const extra = read<Proposal[]>(PROPOSALS_KEY, []);
  write(PROPOSALS_KEY, [p, ...extra]);
}

export function toggleSupport(id: string): boolean {
  const supports = read<Supports>(SUPPORTS_KEY, {});
  const next = { ...supports, [id]: !supports[id] };
  if (!next[id]) delete next[id];
  write(SUPPORTS_KEY, next);
  return Boolean(next[id]);
}

export function hasSupported(id: string): boolean {
  const supports = read<Supports>(SUPPORTS_KEY, {});
  return Boolean(supports[id]);
}

export function useHasSupported(id: string): boolean {
  const [val, setVal] = useState(false);
  useEffect(() => {
    const sync = () => setVal(hasSupported(id));
    sync();
    window.addEventListener("reportape:store", sync);
    return () => window.removeEventListener("reportape:store", sync);
  }, [id]);
  return val;
}
