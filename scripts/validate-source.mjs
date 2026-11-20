import { readFileSync } from "node:fs";
import { validateIssue } from "./content-lib.mjs";

// This contract applies to the bilingual issues added from the November backlog onward.
export function validateSource(issue, source) {
  const date = issue.date.replaceAll(".", "-");
  const check = (ok, message) => { if (!ok) throw new Error(date + ": " + message); };
  validateIssue(issue, { requireTranslation: true });
  const md = source.trimEnd().replaceAll("\r\n", "\n");
  const lines = md.split("\n");
  const compact = value => value.trim().replace(/\s+/gu, " ");
  const size = value => [...value].length;
  check(size(md) <= 16000, "source exceeds 16000 characters");
  check(lines[0] === '<!-- SITE_ISSUE_START date="' + date + '" -->' &&
        lines.at(-1) === "<!-- SITE_ISSUE_END -->" &&
        md.split("<!-- SITE_ISSUE_START").length === 2 &&
        md.split("<!-- SITE_ISSUE_END").length === 2, "incorrect boundaries");
  const [, month, day] = date.split("-");
  check(lines[1] === "# 企业 AI 每日简报｜" + Number(month) + "月" + Number(day) + "日", "title/date mismatch");
  const manifests = lines.filter(l => l.startsWith("SITE_MANIFEST"));
  check(manifests.length === 1 && manifests[0] === "SITE_MANIFEST：date=" + date + "；items=" + issue.items.length, "manifest mismatch");
  const heads = [...md.matchAll(/^## (.+)$/gm)];
  const tail = ["takeaways", "contrarian", "跨来源判断", "本期项目方向"];
  const names = [...issue.items.map((a,i) => (i+1) + ". " + a.title), ...tail];
  check(heads.length === names.length && heads.every((m,i) => m[1] === names[i]), "missing or misordered issue or article headings");
  const body = i => md.slice(heads[i].index + heads[i][0].length, heads[i+1]?.index ?? md.lastIndexOf("<!-- SITE_ISSUE_END")).trim();
  const fields = [["摘要","summary",180,260],["系统设计","design",180,320],["证据与局限","evidence",220,380],["项目启发","idea",100,180]];
  for (const [i,item] of issue.items.entries()) {
    const article = body(i);
    const sections = [...article.matchAll(/^\*\*(摘要|系统设计|证据与局限|项目启发)\*\*[ \t]*$/gm)];
    const meta = article.slice(0,sections[0]?.index);
    check(meta.includes("**类型：**") && meta.includes("**发布日期及来源：**"), "article metadata missing: " + (i+1));
    for (const link of [item.url,...(item.relatedLinks ?? []).map(l => l.url)]) check(meta.includes(link), "source link missing: "+link);
    check(sections.length === 4, "incorrect article section count: " + (i+1));
    for (const [j,[label,key,min,max]] of fields.entries()) {
      const s=sections[j], prose=article.slice(s.index+s[0].length,sections[j+1]?.index).trim();
      check(s[1] === label && compact(prose) === compact(item[key]), "source/JSON mismatch: " + (i+1) + " " + label);
      check(size(prose) >= min && size(prose) <= max, (i+1) + " " + label + " length " + size(prose));
    }
    check(/证据(?:等级|级别|分级)/.test(item.evidence), "missing evidence grade");
  }
  const n=issue.items.length;
  const ord = s => [...s.matchAll(/^(\d+)[.、] +\S/gm)].map(m=>m[1]).join(",");
  check(ord(body(n)) === "1,2,3,4", "expected four numbered takeaways");
  check(issue.takeaways.every(t => compact(body(n)).includes(compact(t))), "takeaways differ from JSON");
  check(compact(body(n+1)) === compact(issue.contrarian), "contrarian differs from JSON");
  check(body(n+2).length > 0 && compact(issue.thesis).includes(compact(body(n+2))), "missing cross-source judgment in JSON thesis");
  check(ord(body(n+3)) === "1,2" && issue.projectIdeas.every(p => body(n+3).includes(p.title)), "expected two matching project directions");
}
export function verifyFiledSource(issue) {
  const date = issue.date.replaceAll(".", "-");
  if (date >= "2026-11-12") validateSource(issue, readFileSync("content/sources/" + date + ".md","utf8"));
}
