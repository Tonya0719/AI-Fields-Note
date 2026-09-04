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
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>AI Field Notes｜从案例到方案<\/title>/);
  assert.match(html, /2026-09-04/);
  assert.match(html, /ISSUE 013/);
  assert.match(html, /John Lewis 来自 AI Agent 的商品搜索占比一年增长八倍/);
  assert.match(html, /\/cases\/john-lewis-agent-shopping\.jpg/);
  assert.match(html, /Policy-to-Decision Gate/);
});

test("per-issue JSON is the only maintained briefing and image source", async () => {
  const [rawIndex, rawIssue, loader, page] = await Promise.all([
    readFile(new URL("../content/index.json", import.meta.url), "utf8"),
    readFile(new URL("../content/issues/2026-09-04.json", import.meta.url), "utf8"),
    readFile(new URL("../app/briefing.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
  ]);
  const index = JSON.parse(rawIndex);
  const issue = JSON.parse(rawIssue);
  assert.equal(index.schemaVersion, 1);
  assert.equal(index.issues[0].date, "2026.09.04");
  assert.equal(index.issues[0].contentHash, issue.contentHash);
  assert.equal(issue.items.length, 5);
  assert.ok(issue.items.every((item) => item.image?.src && item.image?.alt && item.image?.caption));
  assert.match(loader, /content\/briefings\.generated\.json/);
  assert.doesNotMatch(page, /caseVisuals|https?:\/\//);
  assert.match(page, /const visual = item\.image/);
});
