import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

export const requiredIssueFields = ["issue", "date", "thesis", "takeaways", "contrarian", "items", "projectIdeas"];
export const requiredItemFields = ["type", "source", "title", "summary", "design", "evidence", "idea", "url", "image"];

export function hashIssue(issue) {
  const content = { ...issue };
  delete content.contentHash;
  return createHash("sha256").update(JSON.stringify(content)).digest("hex").slice(0, 16);
}

function assertString(value, label) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${label} 不能为空`);
}

function assertUrl(value, label) {
  assertString(value, label);
  const url = new URL(value);
  if (url.protocol !== "https:") throw new Error(`${label} 必须使用 https`);
}

export function validateIssue(issue, { checkHash = true } = {}) {
  for (const field of requiredIssueFields) if (!(field in issue)) throw new Error(`${issue.date ?? "未知日期"} 缺少 ${field}`);
  assertString(issue.issue, `${issue.date}.issue`);
  if (!/^\d{4}\.\d{2}\.\d{2}$/.test(issue.date)) throw new Error(`${issue.date} 日期必须为 YYYY.MM.DD`);
  assertString(issue.thesis, `${issue.date}.thesis`);
  assertString(issue.contrarian, `${issue.date}.contrarian`);
  if (!Array.isArray(issue.takeaways) || issue.takeaways.length !== 4) throw new Error(`${issue.date} 必须有 4 条核心结论`);
  issue.takeaways.forEach((value, index) => assertString(value, `${issue.date}.takeaways[${index}]`));
  if (!Array.isArray(issue.items) || issue.items.length < 4 || issue.items.length > 6) throw new Error(`${issue.date} 必须有 4–6 组资料`);
  const urls = new Set();
  issue.items.forEach((item, index) => {
    for (const field of requiredItemFields) if (!(field in item)) throw new Error(`${issue.date}.items[${index}] 缺少 ${field}`);
    for (const field of ["type", "source", "title", "summary", "design", "evidence", "idea"]) assertString(item[field], `${issue.date}.items[${index}].${field}`);
    assertUrl(item.url, `${issue.date}.items[${index}].url`);
    if (urls.has(item.url)) throw new Error(`${issue.date} 存在重复资料链接：${item.url}`);
    urls.add(item.url);
    if (item.relatedLinks) item.relatedLinks.forEach((link, linkIndex) => {
      assertString(link.label, `${issue.date}.items[${index}].relatedLinks[${linkIndex}].label`);
      assertUrl(link.url, `${issue.date}.items[${index}].relatedLinks[${linkIndex}].url`);
    });
    for (const field of ["src", "alt", "caption"]) assertString(item.image?.[field], `${issue.date}.items[${index}].image.${field}`);
    if (!item.image.src.startsWith("/cases/")) throw new Error(`${issue.date}.items[${index}] 图片必须位于 /cases/`);
    if (!existsSync(resolve("public", item.image.src.slice(1)))) throw new Error(`${issue.date}.items[${index}] 图片不存在：${item.image.src}`);
  });
  if (!Array.isArray(issue.projectIdeas) || issue.projectIdeas.length !== 2) throw new Error(`${issue.date} 必须有 2 个项目方向`);
  issue.projectIdeas.forEach((project, index) => {
    assertString(project.title, `${issue.date}.projectIdeas[${index}].title`);
    assertString(project.description, `${issue.date}.projectIdeas[${index}].description`);
    if (!Array.isArray(project.tags) || project.tags.length < 2) throw new Error(`${issue.date}.projectIdeas[${index}] 至少需要 2 个标签`);
  });
  if (issue.translations !== undefined) {
    const en = issue.translations?.en;
    if (!en || typeof en !== "object") throw new Error(`${issue.date}.translations.en 缺失`);
    for (const field of ["thesis", "contrarian"]) assertString(en[field], `${issue.date}.translations.en.${field}`);
    if (!Array.isArray(en.takeaways) || en.takeaways.length !== 4) throw new Error(`${issue.date}.translations.en.takeaways 必须有 4 条`);
    en.takeaways.forEach((value, index) => assertString(value, `${issue.date}.translations.en.takeaways[${index}]`));
    if (!Array.isArray(en.items) || en.items.length !== issue.items.length) throw new Error(`${issue.date}.translations.en.items 必须与中文资料逐条对应`);
    en.items.forEach((item, index) => {
      for (const field of ["type", "source", "title", "summary", "design", "evidence", "idea"]) assertString(item?.[field], `${issue.date}.translations.en.items[${index}].${field}`);
      if (!item.image || typeof item.image !== "object") throw new Error(`${issue.date}.translations.en.items[${index}].image 缺失`);
      for (const field of ["alt", "caption"]) assertString(item.image[field], `${issue.date}.translations.en.items[${index}].image.${field}`);
      const links = issue.items[index].relatedLinks ?? [];
      const translatedLinks = item.relatedLinks ?? [];
      if (translatedLinks.length !== links.length) throw new Error(`${issue.date}.translations.en.items[${index}].relatedLinks 数量必须与原文一致`);
      translatedLinks.forEach((link, linkIndex) => assertString(link?.label, `${issue.date}.translations.en.items[${index}].relatedLinks[${linkIndex}].label`));
    });
    if (!Array.isArray(en.projectIdeas) || en.projectIdeas.length !== issue.projectIdeas.length) throw new Error(`${issue.date}.translations.en.projectIdeas 必须与中文项目方向逐条对应`);
    en.projectIdeas.forEach((project, index) => {
      assertString(project?.title, `${issue.date}.translations.en.projectIdeas[${index}].title`);
      assertString(project?.description, `${issue.date}.translations.en.projectIdeas[${index}].description`);
      if (!Array.isArray(project.tags) || project.tags.length !== issue.projectIdeas[index].tags.length) throw new Error(`${issue.date}.translations.en.projectIdeas[${index}].tags 必须与中文标签逐条对应`);
      project.tags.forEach((tag, tagIndex) => assertString(tag, `${issue.date}.translations.en.projectIdeas[${index}].tags[${tagIndex}]`));
    });
  }
  const expectedHash = hashIssue(issue);
  if (checkHash && issue.contentHash !== expectedHash) throw new Error(`${issue.date} contentHash 不匹配，应为 ${expectedHash}`);
  return expectedHash;
}

export function readBriefings(path = "content/briefings.generated.json") {
  return JSON.parse(readFileSync(path, "utf8"));
}

export function readIssueFiles(directory = "content/issues") {
  return readdirSync(directory)
    .filter((name) => /^\d{4}-\d{2}-\d{2}\.json$/.test(name))
    .sort()
    .map((name) => ({ name, issue: JSON.parse(readFileSync(resolve(directory, name), "utf8")) }));
}
