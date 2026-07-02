import { useMemo, useRef, useState } from "react";
import { toPng } from "html-to-image";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DOMAIN_COLORS, DOMAIN_ORDER, useT } from "@/lib/i18n";
import { buildAnnualReport, getReportYears, hasReportData } from "@/lib/dpdu-store";

export function AnnualReport() {
  const t = useT();
  const chartRef = useRef<HTMLDivElement>(null);

  const years = useMemo(() => getReportYears(), []);
  const hasData = hasReportData();
  const [year, setYear] = useState<number>(years[0] ?? new Date().getFullYear());

  const data = buildAnnualReport(year).map((row) => ({
    ...row,
    label: t.months[row.month as number],
  }));

  const download = async () => {
    if (!chartRef.current) return;
    const dataUrl = await toPng(chartRef.current, { backgroundColor: "#ffffff", pixelRatio: 2 });
    const link = document.createElement("a");
    link.download = `dpdu-rapport-annuel-${year}.png`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-serif text-3xl text-foreground">{t.reportTitle}</h2>
        {hasData && years.length > 1 && (
          <Select value={String(year)} onValueChange={(v) => setYear(Number(v))}>
            <SelectTrigger className="w-32 rounded-none">
              <SelectValue placeholder={t.selectYear} />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={String(y)}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {!hasData ? (
        <p className="mt-8 text-sm text-muted-foreground">{t.reportEmpty}</p>
      ) : (
        <>
          <div ref={chartRef} className="mt-8 bg-white px-4 pt-4 pb-12">
            <p className="mb-2 text-center font-display text-2xl uppercase tracking-[0.15em] text-foreground">
              {t.appTitle}
            </p>
            <p className="mb-6 text-center text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
              {t.reportYAxis} · {year}
            </p>
            <ResponsiveContainer width="100%" height={360}>
              <LineChart data={data} margin={{ top: 8, right: 16, bottom: 32, left: -16 }}>
                <CartesianGrid stroke="#eee" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#6b7280" }} tickLine={false} axisLine={{ stroke: "#e5e7eb" }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#6b7280" }} tickLine={false} axisLine={false} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
                {DOMAIN_ORDER.map((dom) => (
                  <Line
                    key={dom}
                    type="monotone"
                    dataKey={dom}
                    name={t.domains[dom]}
                    stroke={DOMAIN_COLORS[dom]}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-6">
            <Button
              variant="outline"
              className="rounded-none border-foreground/30"
              onClick={download}
            >
              <Download className="mr-1" />
              {t.downloadChart}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}