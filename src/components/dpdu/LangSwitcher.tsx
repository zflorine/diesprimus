import { LANGS, useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function LangSwitcher() {
  const { lang, setLang } = useLang();
  return (
    <div className="flex items-center gap-1 text-xs">
      {LANGS.map((l, i) => (
        <span key={l.code} className="flex items-center gap-1">
          {i > 0 && <span className="text-muted-foreground/40">·</span>}
          <button
            onClick={() => setLang(l.code)}
            className={cn(
              "px-1 py-0.5 tracking-wide transition-colors",
              lang === l.code
                ? "text-foreground underline underline-offset-4"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {l.label}
          </button>
        </span>
      ))}
    </div>
  );
}