import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const target = resolve(root, "cloudflare/src/globals.css");
const css = await readFile(resolve(root, "app/globals.css"), "utf8");

await mkdir(dirname(target), { recursive: true });
await writeFile(target, css.replace(/^@import\s+["']tailwindcss["'];?\s*/u, ""), "utf8");
