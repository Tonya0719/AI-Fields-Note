import data from "../content/briefings.generated.json";

export type BriefingItem = {
  type: string;
  source: string;
  title: string;
  summary: string;
  design: string;
  evidence: string;
  idea: string;
  url: string;
  relatedLinks?: { label: string; url: string }[];
  image: { src: string; alt: string; caption: string };
};

export type BriefingItemTranslation = {
  type: string;
  source: string;
  title: string;
  summary: string;
  design: string;
  evidence: string;
  idea: string;
  relatedLinks?: { label: string }[];
  image: { alt: string; caption: string };
};

export type EnglishTranslation = {
  thesis: string;
  takeaways: string[];
  contrarian: string;
  items: BriefingItemTranslation[];
  projectIdeas: { title: string; description: string; tags: string[] }[];
};

export type Briefing = {
  issue: string;
  date: string;
  thesis: string;
  takeaways: string[];
  contrarian: string;
  items: BriefingItem[];
  projectIdeas: { title: string; description: string; tags: string[] }[];
  translations?: { en: EnglishTranslation };
  itemTranslations?: { en: { index: number; url: string; translation: BriefingItemTranslation }[] };
  contentHash: string;
};

export const briefings = data.issues as Briefing[];
export const briefing = briefings[0];
