import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import "@fontsource/fraunces/400.css";
import "@fontsource/fraunces/500.css";
import "@fontsource/cinzel/500.css";
import "@fontsource/cinzel/600.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/noto-sans-sc/400.css";
import "@fontsource/noto-sans-sc/500.css";

import { LangContext, type Lang, useLang, useT } from "@/lib/i18n";
import {
  type Activity,
  type HistoryEntry,
  getActivity,
  getEntryForDate,
  LANG_KEY,
  pickDaily,
  saveEntry,
  saveProposalsForDate,
  todayISO,
} from "@/lib/dpdu-store";
import { LangSwitcher } from "@/components/dpdu/LangSwitcher";
import { DateStep } from "@/components/dpdu/DateStep";
import { ChoiceStep } from "@/components/dpdu/ChoiceStep";
import { ActionStep } from "@/components/dpdu/ActionStep";
import { HistoryView } from "@/components/dpdu/HistoryView";
import { AnnualReport } from "@/components/dpdu/AnnualReport";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  component: Index,
});

type Tab = "today" | "history" | "report";
type Step = "date" | "choice" | "action";

function Index() {
  const [lang, setLangState] = useState<Lang>("fr");

  useEffect(() => {
    const stored = localStorage.getItem(LANG_KEY) as Lang | null;
    if (stored === "fr" || stored === "en" || stored === "zh") setLangState(stored);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(LANG_KEY, l);
    } catch {
      /* ignore */
    }
  };

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      <App />
    </LangContext.Provider>
  );
}

function App() {
  const t = useT();
  const { lang } = useLang();
  const [mounted, setMounted] = useState(false);
  const [tab, setTab] = useState<Tab>("today");
  const [menuOpen, setMenuOpen] = useState(false);

  const [date, setDate] = useState(todayISO());
  const [step, setStep] = useState<Step>("date");
  const [proposals, setProposals] = useState<Activity[]>([]);
  const [shownIds, setShownIds] = useState<string[]>([]);
  const [selected, setSelected] = useState<Activity | null>(null);
  const [locked, setLocked] = useState<"done" | "failed" | undefined>();

  useEffect(() => setMounted(true), []);

  const dateLabel = useMemo(() => {
    const d = new Date(date + "T00:00:00");
    const locale = { fr: "fr-FR", en: "en-US", zh: "zh-CN" }[lang];
    return d.toLocaleDateString(locale, {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, [date, lang]);

  const openDay = (iso: string) => {
    setDate(iso);
    const existing = getEntryForDate(iso);
    if (existing) {
      const act = getActivity(existing.activityId);
      if (act) {
        setSelected(act);
        setLocked(existing.status);
        setStep("action");
        return;
      }
    }
    const picks = pickDaily(iso);
    setProposals(picks);
    setShownIds(picks.map((p) => p.id));
    setLocked(undefined);
    setSelected(null);
    setStep("choice");
  };

  const regenerate = () => {
    const picks = pickDaily(date, shownIds);
    setProposals(picks);
    setShownIds((prev) => [...prev, ...picks.map((p) => p.id)]);
  };

  const select = (a: Activity) => {
    saveProposalsForDate(date, proposals.map((p) => p.id));
    setSelected(a);
    setStep("action");
  };

  const feedback = (status: "done" | "failed") => {
    if (!selected) return;
    const entry: HistoryEntry = {
      date,
      activityId: selected.id,
      domaine: selected.domaine,
      status,
    };
    saveEntry(entry);
    setLocked(status);
  };

  const newDay = () => {
    const iso = todayISO();
    setDate(iso);
    setStep("date");
    setSelected(null);
    setLocked(undefined);
    setProposals([]);
    setShownIds([]);
  };

  if (!mounted) {
    return <div className="min-h-screen bg-background" />;
  }

  const tabs: Tab[] = ["today", "history", "report"];
  const tabLabel = (tb: Tab) =>
    tb === "today" ? t.navToday : tb === "history" ? t.navHistory : t.navReport;

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <header className="flex items-center justify-between border-b border-foreground/10 px-6 py-4">
        <button
          onClick={() => setTab("today")}
          aria-label={t.homeAriaLabel}
          className="font-display uppercase text-sm tracking-[0.15em] text-foreground"
        >
          {t.appTitle}
        </button>
        {/* Desktop nav */}
        <div className="hidden items-center gap-4 md:flex">
          <nav className="flex items-center gap-4 text-xs uppercase tracking-[0.18em]">
            {tabs.map((tb) => (
              <button
                key={tb}
                onClick={() => setTab(tb)}
                className={cn(
                  "transition-colors",
                  tab === tb ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {tabLabel(tb)}
              </button>
            ))}
          </nav>
          <Separator orientation="vertical" className="h-4" />
          <LangSwitcher />
        </div>
        {/* Mobile burger */}
        <div className="flex items-center md:hidden">
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger aria-label={t.menuAriaLabel} className="text-foreground">
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <nav className="mt-8 flex flex-col gap-6 text-sm uppercase tracking-[0.18em]">
                {tabs.map((tb) => (
                  <button
                    key={tb}
                    onClick={() => {
                      setTab(tb);
                      setMenuOpen(false);
                    }}
                    className={cn(
                      "text-left transition-colors",
                      tab === tb ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {tabLabel(tb)}
                  </button>
                ))}
              </nav>
              <Separator className="my-6" />
              <LangSwitcher />
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main>
        {tab === "today" && step === "date" && <DateStep date={date} onGo={openDay} />}
        {tab === "today" && step === "choice" && (
          <ChoiceStep
            dateLabel={dateLabel}
            proposals={proposals}
            onSelect={select}
            onRegenerate={regenerate}
          />
        )}
        {tab === "today" && step === "action" && selected && (
          <ActionStep
            activity={selected}
            dateLabel={dateLabel}
            locked={locked}
            onFeedback={feedback}
            onChange={() => setStep("choice")}
            onNewDay={newDay}
          />
        )}
        {tab === "history" && <HistoryView key={date + tab} />}
        {tab === "report" && <AnnualReport />}
      </main>
    </div>
  );
}
