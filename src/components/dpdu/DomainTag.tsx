import { DOMAIN_COLORS, type DomainKey, useT } from "@/lib/i18n";

export function DomainTag({ domaine }: { domaine: DomainKey }) {
  const t = useT();
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
      <span
        className="h-2 w-2 rounded-full"
        style={{ backgroundColor: DOMAIN_COLORS[domaine] }}
        aria-hidden
      />
      {t.domains[domaine]}
    </span>
  );
}