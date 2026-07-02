import { activitiesData } from "../data/activitiesData";
import { DOMAIN_ORDER, type DomainKey } from "./i18n";

export type Activity = {
  id: string;
  domaine: DomainKey;
  titre: { fr: string; en: string; zh: string };
  tutoriel: { fr: string; en: string; zh: string };
};

export const ACTIVITIES = activitiesData as Activity[];

const BY_ID = new Map(ACTIVITIES.map((a) => [a.id, a]));
export function getActivity(id: string): Activity | undefined {
  return BY_ID.get(id);
}

export type HistoryEntry = {
  date: string; // YYYY-MM-DD
  activityId: string;
  domaine: DomainKey;
  status: "done" | "failed";
};

type ProposalRecord = Record<string, string[]>; // date -> proposed ids

const HISTORY_KEY = "dpdu_history";
const PROPOSALS_KEY = "dpdu_proposals";
export const LANG_KEY = "dpdu_lang";

const COOLDOWN_DAYS = 60;
const PER_DOMAIN = 2;

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function isBrowser() {
  return typeof window !== "undefined" && !!window.localStorage;
}

export function getHistory(): HistoryEntry[] {
  if (!isBrowser()) return [];
  return safeParse<HistoryEntry[]>(localStorage.getItem(HISTORY_KEY), []);
}

export function getEntryForDate(date: string): HistoryEntry | undefined {
  return getHistory().find((e) => e.date === date);
}

export function saveEntry(entry: HistoryEntry) {
  if (!isBrowser()) return;
  const history = getHistory().filter((e) => e.date !== entry.date);
  history.push(entry);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

function getProposals(): ProposalRecord {
  if (!isBrowser()) return {};
  return safeParse<ProposalRecord>(localStorage.getItem(PROPOSALS_KEY), {});
}

export function saveProposalsForDate(date: string, ids: string[]) {
  if (!isBrowser()) return;
  const all = getProposals();
  all[date] = ids;
  localStorage.setItem(PROPOSALS_KEY, JSON.stringify(all));
}

function daysBetween(a: string, b: string): number {
  const da = new Date(a + "T00:00:00").getTime();
  const db = new Date(b + "T00:00:00").getTime();
  return Math.abs(da - db) / (1000 * 60 * 60 * 24);
}

/**
 * Ids that are ineligible on `refDate`:
 * - proposed (on any date) within the cooldown window but never chosen,
 * - or marked "failed" within the window,
 * - or already "done" within the window (avoid immediate repeats).
 */
export function getCooldownSet(refDate: string): Set<string> {
  const blocked = new Set<string>();
  const history = getHistory();
  const chosenByDate = new Map<string, string>();
  for (const e of history) chosenByDate.set(e.date, e.activityId);

  for (const e of history) {
    if (daysBetween(refDate, e.date) <= COOLDOWN_DAYS) blocked.add(e.activityId);
  }

  const proposals = getProposals();
  for (const [date, ids] of Object.entries(proposals)) {
    if (daysBetween(refDate, date) > COOLDOWN_DAYS) continue;
    const chosen = chosenByDate.get(date);
    for (const id of ids) {
      if (id !== chosen) blocked.add(id); // proposed but not chosen
    }
  }
  return blocked;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Pick 2 eligible activities per domain for the given date.
 * `exclude` lets re-rolls skip ids already shown this session.
 */
export function pickDaily(date: string, exclude: string[] = []): Activity[] {
  const blocked = getCooldownSet(date);
  for (const id of exclude) blocked.add(id);
  const result: Activity[] = [];

  for (const domaine of DOMAIN_ORDER) {
    const pool = ACTIVITIES.filter((a) => a.domaine === domaine);
    let eligible = pool.filter((a) => !blocked.has(a.id));
    if (eligible.length < PER_DOMAIN) {
      // Relax: drop the session exclusion first, then fall back to full pool.
      eligible = pool.filter((a) => !getCooldownSet(date).has(a.id));
      if (eligible.length < PER_DOMAIN) eligible = pool;
    }
    result.push(...shuffle(eligible).slice(0, PER_DOMAIN));
  }
  return result;
}

export function todayISO(): string {
  const d = new Date();
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 10);
}

/** Years (desc) that contain at least one "done" activity. */
export function getReportYears(): number[] {
  const years = new Set<number>();
  for (const e of getHistory()) {
    if (e.status === "done") years.add(new Date(e.date + "T00:00:00").getFullYear());
  }
  return [...years].sort((a, b) => b - a);
}

/** Count of "done" activities per domain per month (Jan–Dec) for a given calendar year. */
export function buildAnnualReport(year?: number) {
  const target = year ?? new Date().getFullYear();
  const history = getHistory().filter((e) => e.status === "done");

  const rows = Array.from({ length: 12 }, (_, month) => {
    const row: Record<string, number | string> = { month, year: target };
    for (const dom of DOMAIN_ORDER) row[dom] = 0;
    return row;
  });

  for (const e of history) {
    const d = new Date(e.date + "T00:00:00");
    if (d.getFullYear() !== target) continue;
    rows[d.getMonth()][e.domaine] = (rows[d.getMonth()][e.domaine] as number) + 1;
  }
  return rows;
}

export function hasReportData(): boolean {
  return getHistory().some((e) => e.status === "done");
}