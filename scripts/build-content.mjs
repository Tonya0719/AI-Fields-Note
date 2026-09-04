import { mkdirSync, writeFileSync } from "node:fs";
import { readIssueFiles, validateIssue } from "./content-lib.mjs";

const entries = readIssueFiles();
if (entries.length === 0) throw new Error("content/issues 中没有简报文件");

const issues = entries.map(({ name, issue }) => {
  validateIssue(issue);
  const expectedName = `${issue.date.replaceAll(".", "-")}.json`;
  if (name !== expectedName) throw new Error(`${name} 与简报日期 ${issue.date} 不一致`);
  return issue;
}).sort((a, b) => b.date.localeCompare(a.date));

const dates = new Set();
const issueIds = new Set();
for (const issue of issues) {
  if (dates.has(issue.date)) throw new Error(`重复日期：${issue.date}`);
  if (issueIds.has(issue.issue)) throw new Error(`重复期号：${issue.issue}`);
  dates.add(issue.date);
  issueIds.add(issue.issue);
}

const index = {
  schemaVersion: 1,
  generatedFrom: "content/issues/*.json",
  issues: issues.map((issue) => ({
    issue: issue.issue,
    date: issue.date,
    thesis: issue.thesis,
    itemCount: issue.items.length,
    contentHash: issue.contentHash,
    file: `issues/${issue.date.replaceAll(".", "-")}.json`,
  })),
};

mkdirSync("content", { recursive: true });
writeFileSync("content/index.json", `${JSON.stringify(index, null, 2)}\n`);
writeFileSync("content/briefings.generated.json", `${JSON.stringify({ schemaVersion: 1, issues }, null, 2)}\n`);
console.log(`内容构建完成：${issues.length} 期，最新 ${issues[0].date}`);
