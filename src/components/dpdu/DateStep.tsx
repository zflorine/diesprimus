import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useLang, useT } from "@/lib/i18n";

function formatDate(iso: string, lang: string) {
  const d = new Date(iso + "T00:00:00");
  const locale = lang === "fr" ? "fr-FR" : lang === "zh" ? "zh-CN" : "en-US";
  return d.toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

function toISO(d: Date) {
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 10);
}

export function DateStep({ date, onGo }: { date: string; onGo: (iso: string) => void }) {
  const t = useT();
  const { lang } = useLang();
  const [selected, setSelected] = useState<Date>(new Date(date + "T00:00:00"));
  const [open, setOpen] = useState(false);

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-6 py-20 text-center">
      <h1 className="font-display uppercase tracking-[0.15em] text-4xl leading-tight text-foreground sm:text-5xl">
        {t.appTitle}
      </h1>

      <div className="mt-16 w-full max-w-xs">
        <p className="mb-4 text-[11px] uppercase tracking-[0.35em] text-muted-foreground">
          {t.pickDate}
        </p>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between border-foreground/20 text-left font-normal"
            >
              <span className="capitalize">{formatDate(toISO(selected), lang)}</span>
              <CalendarIcon className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="center">
            <Calendar
              mode="single"
              selected={selected}
              onSelect={(d) => {
                if (d) setSelected(d);
                setOpen(false);
              }}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>

        <Button
          className="mt-6 w-full rounded-none bg-foreground text-background hover:bg-foreground/90"
          size="lg"
          onClick={() => onGo(toISO(selected))}
        >
          {t.letsGo}
        </Button>
      </div>
    </div>
  );
}