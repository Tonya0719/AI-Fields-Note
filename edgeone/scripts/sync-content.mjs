import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "../..");
const targetDir = resolve(import.meta.dirname, "../src");

await mkdir(targetDir, { recursive: true });

const files = ["page.tsx", "briefing.ts", "globals.css"];
for (const file of files) {
  let content = await readFile(resolve(projectRoot, "app", file), "utf8");
  if (file === "globals.css") {
    content = content.replace(/^@import\s+["']tailwindcss["'];?\s*/u, "");
  }
  await writeFile(resolve(targetDir, file), content, "utf8");
}
