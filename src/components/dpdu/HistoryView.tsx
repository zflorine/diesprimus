import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DomainTag } from "./DomainTag";
import { useLang, useT } from "@/lib/i18n";
import { getActivity, getHistory } from "@/lib/dpdu-store";

const PER_PAGE = 7;

export function HistoryView() {
  const t = useT();
  const { lang } = useLang();
  const [page, setPage] = useState(1);

  const entries = useMemo(
    () => [...getHistory()].sort((a, b) => (a.date < b.date ? 1 : -1)),
    [],
  );

  const totalPages = Math.max(1, Math.ceil(entries.length / PER_PAGE));
  const current = entries.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const locale = lang === "fr" ? "fr-FR" : lang === "zh" ? "zh-CN" : "en-US";

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h2 className="font-serif text-3xl text-foreground">{t.historyTitle}</h2>

      {entries.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">{t.historyEmpty}</p>
      ) : (
        <>
          <ul className="mt-8 divide-y divide-foreground/10 border-y border-foreground/10">
            {current.map((e) => {
              const a = getActivity(e.activityId);
              const d = new Date(e.date + "T00:00:00");
              return (
                <li key={e.date} className="flex items-start justify-between gap-4 py-4">
                  <div className="min-w-0">
                    <DomainTag domaine={e.domaine} />
                    <p className="mt-1 font-serif text-lg leading-snug text-foreground">
                      {a ? a.titre[lang] : e.activityId}
                    </p>
                    <p className="mt-1 text-xs capitalize text-muted-foreground">
                      {d.toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                  </div>
                  <span
                    className="mt-1 shrink-0 text-xs font-medium"
                    style={{ color: e.status === "done" ? "#111" : "#9ca3af" }}
                  >
                    {e.status === "done" ? `✓ ${t.lockedDone}` : `✗ ${t.lockedFailed}`}
                  </span>
                </li>
              );
            })}
          </ul>

          <div className="mt-8 flex items-center justify-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="mr-1" />
              {t.prev}
            </Button>
            <span className="text-sm text-muted-foreground">
              {t.page} {page} / {totalPages}
            </span>
            <Button
              variant="ghost"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              {t.next}
              <ChevronRight className="ml-1" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}