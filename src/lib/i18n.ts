import { createContext, useContext } from "react";

export type Lang = "fr" | "en" | "zh";

export const LANGS: { code: Lang; label: string }[] = [
  { code: "fr", label: "FR" },
  { code: "en", label: "EN" },
  { code: "zh", label: "中文" },
];

export type DomainKey =
  | "creation_expression"
  | "esprit_connaissance"
  | "sciences_technique"
  | "corps_exploration"
  | "love_sex";

export const DOMAIN_ORDER: DomainKey[] = [
  "creation_expression",
  "esprit_connaissance",
  "sciences_technique",
  "corps_exploration",
  "love_sex",
];

export const DOMAIN_COLORS: Record<DomainKey, string> = {
  creation_expression: "#cca47a",
  esprit_connaissance: "#9b8fd6",
  sciences_technique: "#8fb4e5",
  corps_exploration: "#8fca9e",
  love_sex: "#e8a6c4",
};

type Dict = {
  appTitle: string;
  tagline: string;
  navToday: string;
  navHistory: string;
  navReport: string;
  pickDate: string;
  letsGo: string;
  regenerate: string;
  chooseOne: string;
  chooseHint: string;
  done: string;
  failed: string;
  yourActivity: string;
  change: string;
  lockedDone: string;
  lockedFailed: string;
  historyTitle: string;
  historyEmpty: string;
  prev: string;
  next: string;
  page: string;
  reportTitle: string;
  generateReport: string;
  downloadChart: string;
  reportEmpty: string;
  reportYAxis: string;
  selectYear: string;
  validatedActivities: string;
  newDay: string;
  domains: Record<DomainKey, string>;
  months: string[];
};

export const T: Record<Lang, Dict> = {
  fr: {
    appTitle: "Dies primus dies ultimus",
    tagline: "Une activité, un jour. Comme si c'était le premier et le dernier.",
    navToday: "Aujourd'hui",
    navHistory: "Historique",
    navReport: "Rapport",
    pickDate: "Choisis la date du jour",
    letsGo: "Let's go !",
    regenerate: "Regénérer les idées",
    chooseOne: "Choisis une seule activité",
    chooseHint: "Choisis une activité parmi les dix propositions.",
    done: "C'est fait",
    failed: "Je n'ai pas pu le faire",
    yourActivity: "Ton activité du jour",
    change: "Changer",
    lockedDone: "Réussie",
    lockedFailed: "Non réalisée",
    historyTitle: "Historique",
    historyEmpty: "Aucune activité enregistrée pour l'instant.",
    prev: "Précédent",
    next: "Suivant",
    page: "Page",
    reportTitle: "Rapport annuel",
    generateReport: "Générer mon rapport annuel",
    downloadChart: "Télécharger mon graph",
    reportEmpty: "Pas encore assez de données pour un rapport.",
    reportYAxis: "Activités validées",
    selectYear: "Année",
    validatedActivities: "activités validées",
    newDay: "Nouvelle journée",
    domains: {
      creation_expression: "Création & Expression",
      esprit_connaissance: "Esprit & Connaissance",
      sciences_technique: "Sciences & Technique",
      corps_exploration: "Corps & Exploration",
      love_sex: "Amour & Relations",
    },
    months: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"],
  },
  en: {
    appTitle: "Dies primus dies ultimus",
    tagline: "One activity, one day. As if it were the first and the last.",
    navToday: "Today",
    navHistory: "History",
    navReport: "Report",
    pickDate: "Pick today's date",
    letsGo: "Let's go!",
    regenerate: "Regenerate ideas",
    chooseOne: "Choose a single activity",
    chooseHint: "Choose one activity from the ten proposals.",
    done: "Done",
    failed: "I couldn't do it",
    yourActivity: "Your activity for the day",
    change: "Change",
    lockedDone: "Completed",
    lockedFailed: "Not completed",
    historyTitle: "History",
    historyEmpty: "No activity recorded yet.",
    prev: "Previous",
    next: "Next",
    page: "Page",
    reportTitle: "Annual report",
    generateReport: "Generate my annual report",
    downloadChart: "Download my chart",
    reportEmpty: "Not enough data yet for a report.",
    reportYAxis: "Validated activities",
    selectYear: "Year",
    validatedActivities: "validated activities",
    newDay: "New day",
    domains: {
      creation_expression: "Creation & Expression",
      esprit_connaissance: "Mind & Knowledge",
      sciences_technique: "Science & Technique",
      corps_exploration: "Body & Exploration",
      love_sex: "Love & Relationships",
    },
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  },
  zh: {
    appTitle: "Dies primus dies ultimus",
    tagline: "一天，一件事。仿佛它既是第一天，也是最后一天。",
    navToday: "今天",
    navHistory: "历史",
    navReport: "报告",
    pickDate: "选择今天的日期",
    letsGo: "开始！",
    regenerate: "重新生成建议",
    chooseOne: "只选择一项活动",
    chooseHint: "从十个建议中选择一项活动。",
    done: "完成了",
    failed: "我没能做到",
    yourActivity: "你今天的活动",
    change: "更换",
    lockedDone: "已完成",
    lockedFailed: "未完成",
    historyTitle: "历史",
    historyEmpty: "还没有任何记录。",
    prev: "上一页",
    next: "下一页",
    page: "第",
    reportTitle: "年度报告",
    generateReport: "生成我的年度报告",
    downloadChart: "下载图表",
    reportEmpty: "数据还不足以生成报告。",
    reportYAxis: "已完成的活动",
    selectYear: "年份",
    validatedActivities: "项已完成活动",
    newDay: "新的一天",
    domains: {
      creation_expression: "创作与表达",
      esprit_connaissance: "心智与知识",
      sciences_technique: "科学与技术",
      corps_exploration: "身体与探索",
      love_sex: "爱与关系",
    },
    months: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
  },
};

export const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: "fr",
  setLang: () => {},
});

export function useLang() {
  return useContext(LangContext);
}

export function useT() {
  const { lang } = useLang();
  return T[lang];
}