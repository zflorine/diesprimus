export type ActivityRecord = {
  id: string;
  domaine: "creation_expression" | "esprit_connaissance" | "sciences_technique" | "corps_exploration";
  titre: { fr: string; en: string; zh: string };
  tutoriel: { fr: string; en: string; zh: string };
};
export declare const activitiesData: ActivityRecord[];
export default activitiesData;