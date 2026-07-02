import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DomainTag } from "./DomainTag";
import { useLang, useT } from "@/lib/i18n";
import type { Activity } from "@/lib/dpdu-store";

export function ActionStep({
  activity,
  dateLabel,
  locked,
  onFeedback,
  onChange,
  onNewDay,
}: {
  activity: Activity;
  dateLabel: string;
  locked?: "done" | "failed";
  onFeedback: (status: "done" | "failed") => void;
  onChange: () => void;
  onNewDay: () => void;
}) {
  const t = useT();
  const { lang } = useLang();

  return (
    <div className="mx-auto max-w-xl px-6 py-16">
      <p className="text-center text-[11px] uppercase tracking-[0.35em] text-muted-foreground capitalize">
        {dateLabel}
      </p>
      <p className="mt-8 text-center text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
        {t.yourActivity}
      </p>

      <div className="mt-6 border border-foreground/15 p-8">
        <DomainTag domaine={activity.domaine} />
        <h2 className="mt-4 font-serif text-3xl leading-tight text-foreground">
          {activity.titre[lang]}
        </h2>
        <div className="my-6 h-px w-full bg-foreground/10" />
        <p className="text-base leading-relaxed text-muted-foreground">{activity.tutoriel[lang]}</p>
      </div>

      {locked ? (
        <div className="mt-8 text-center">
          <p className="text-sm font-medium text-foreground">
            {locked === "done" ? `✓ ${t.lockedDone}` : `✗ ${t.lockedFailed}`}
          </p>
          <Button
            variant="outline"
            className="mt-6 rounded-none border-foreground/30"
            onClick={onNewDay}
          >
            {t.newDay}
          </Button>
        </div>
      ) : (
        <>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Button
              size="lg"
              className="rounded-none bg-foreground text-background hover:bg-foreground/90"
              onClick={() => onFeedback("done")}
            >
              <Check className="mr-1" />
              {t.done}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-none border-foreground/30"
              onClick={() => onFeedback("failed")}
            >
              <X className="mr-1" />
              {t.failed}
            </Button>
          </div>
          <div className="mt-4 text-center">
            <button
              onClick={onChange}
              className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
            >
              {t.change}
            </button>
          </div>
        </>
      )}
    </div>
  );
}