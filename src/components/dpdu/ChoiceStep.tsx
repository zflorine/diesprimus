import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DomainTag } from "./DomainTag";
import { DOMAIN_ORDER, useLang, useT } from "@/lib/i18n";
import type { Activity } from "@/lib/dpdu-store";

export function ChoiceStep({
  dateLabel,
  proposals,
  onSelect,
  onRegenerate,
}: {
  dateLabel: string;
  proposals: Activity[];
  onSelect: (a: Activity) => void;
  onRegenerate: () => void;
}) {
  const t = useT();
  const { lang } = useLang();

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="text-center">
        <p className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground capitalize">
          {dateLabel}
        </p>
        <h2 className="mt-4 font-serif text-3xl text-foreground">{t.chooseOne}</h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">{t.chooseHint}</p>
      </div>

      <div className="mt-12 space-y-10">
        {DOMAIN_ORDER.map((domaine) => {
          const pair = proposals.filter((a) => a.domaine === domaine);
          return (
            <section key={domaine}>
              <DomainTag domaine={domaine} />
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {pair.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => onSelect(a)}
                    className="group flex flex-col border border-foreground/15 bg-background p-5 text-left transition-colors hover:border-foreground hover:bg-foreground hover:text-background"
                  >
                    <span className="font-serif text-lg leading-snug">{a.titre[lang]}</span>
                    <span className="mt-2 text-sm text-muted-foreground group-hover:text-background/70">
                      {a.tutoriel[lang]}
                    </span>
                  </button>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <div className="mt-12 flex justify-center">
        <Button
          variant="outline"
          className="rounded-none border-foreground/30"
          onClick={onRegenerate}
        >
          <RefreshCw className="mr-1" />
          {t.regenerate}
        </Button>
      </div>
    </div>
  );
}