import { readFileSync } from "node:fs";
import { readBriefings, readIssueFiles, validateIssue } from "./content-lib.mjs";

const data = readBriefings();
const index = JSON.parse(readFileSync("content/index.json", "utf8"));
const files = readIssueFiles();
if (data.schemaVersion !== 1) throw new Error("不支持的简报 schemaVersion");
if (!Array.isArray(data.issues) || data.issues.length === 0) throw new Error("简报列表不能为空");
if (index.schemaVersion !== 1 || !Array.isArray(index.issues)) throw new Error("content/index.json 格式无效");
if (files.length !== data.issues.length || index.issues.length !== data.issues.length) throw new Error("源文件、索引与生成内容数量不一致");

const dates = new Set();
const issueIds = new Set();
for (const issue of data.issues) {
  validateIssue(issue);
  if (dates.has(issue.date)) throw new Error(`重复日期：${issue.date}`);
  if (issueIds.has(issue.issue)) throw new Error(`重复期号：${issue.issue}`);
  dates.add(issue.date);
  issueIds.add(issue.issue);
}

const sorted = [...data.issues].sort((a, b) => b.date.localeCompare(a.date));
if (sorted.some((issue, index) => issue.date !== data.issues[index].date)) throw new Error("简报必须按日期从新到旧排列");
for (const [position, issue] of data.issues.entries()) {
  const record = index.issues[position];
  if (record.date !== issue.date || record.contentHash !== issue.contentHash || record.itemCount !== issue.items.length) {
    throw new Error(`${issue.date} 的索引与内容不一致`);
  }
}

const itemCount = data.issues.reduce((total, issue) => total + issue.items.length, 0);
console.log(`内容校验通过：${data.issues.length} 期，${itemCount} 组资料，最新 ${data.issues[0].date}`);
