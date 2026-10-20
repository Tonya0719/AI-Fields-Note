import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server renders the latest structured briefing", async () => {
  const index = JSON.parse(await readFile(new URL("../content/index.json", import.meta.url), "utf8"));
  const latest = index.issues[0];
  const issue = JSON.parse(await readFile(new URL(`../content/${latest.file}`, import.meta.url), "utf8"));
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>AI Field Notes｜从案例到方案<\/title>/);
  assert.ok(html.includes(issue.date.replaceAll(".", "-")));
  assert.ok(html.includes(issue.issue));
  assert.ok(html.includes(issue.items[0].title));
  assert.ok(html.includes(issue.items[0].image.src));
  assert.ok(html.includes(issue.projectIdeas[0].title));
});

test("per-issue JSON is the only maintained briefing and image source", async () => {
  const [rawIndex, loader, page] = await Promise.all([
    readFile(new URL("../content/index.json", import.meta.url), "utf8"),
    readFile(new URL("../app/briefing.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
  ]);
  const index = JSON.parse(rawIndex);
  const rawIssue = await readFile(new URL(`../content/${index.issues[0].file}`, import.meta.url), "utf8");
  const issue = JSON.parse(rawIssue);
  assert.equal(index.schemaVersion, 1);
  assert.equal(index.issues[0].date, issue.date);
  assert.equal(index.issues[0].contentHash, issue.contentHash);
  assert.ok(issue.items.length >= 4 && issue.items.length <= 6);
  assert.ok(issue.items.every((item) => item.image?.src && item.image?.alt && item.image?.caption));
  assert.match(loader, /content\/briefings\.generated\.json/);
  assert.doesNotMatch(page, /caseVisuals|https?:\/\//);
  assert.match(page, /const visual = item\.image/);
});
