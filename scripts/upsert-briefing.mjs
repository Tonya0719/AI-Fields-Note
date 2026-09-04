import { readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { hashIssue, validateIssue } from "./content-lib.mjs";

const inputPath = process.argv[2];
if (!inputPath) throw new Error("用法：node scripts/upsert-briefing.mjs <new-issue.json>");

const incoming = JSON.parse(readFileSync(inputPath, "utf8"));
incoming.contentHash = hashIssue(incoming);
validateIssue(incoming);

const outputPath = `content/issues/${incoming.date.replaceAll(".", "-")}.json`;
let existing;
try {
  existing = JSON.parse(readFileSync(outputPath, "utf8"));
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}
if (existing?.contentHash === incoming.contentHash) {
  console.log(`${incoming.date} 内容未变化，无需更新`);
  process.exit(0);
}
writeFileSync(outputPath, `${JSON.stringify(incoming, null, 2)}\n`);
const result = spawnSync(process.execPath, ["scripts/build-content.mjs"], { stdio: "inherit" });
if (result.status !== 0) process.exit(result.status ?? 1);
console.log(`${incoming.date} 已写入 ${outputPath}`);
