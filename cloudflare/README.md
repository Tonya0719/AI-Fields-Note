# Cloudflare Pages deployment

This site can be deployed as a static Cloudflare Pages project without changing
the existing Sites publication. The build reads the canonical
`content/issues/*.json` files, regenerates the content index and aggregate,
validates them, and produces static assets. Do not edit generated content or
copy briefings into this directory.

## Git-connected Pages project

Connect the repository to Cloudflare Pages and use these settings:

| Setting | Value |
| --- | --- |
| Production branch | `main` |
| Root directory | repository root |
| Build command | `npm run build:cloudflare` |
| Build output directory | `cloudflare/dist` |
| Node.js version | 22 or newer |

The repository's root dependencies contain the static Vite toolchain used by
the build. `npm run build:cloudflare` runs content validation first, then uses
the shared page component and briefing loader directly. Only a CSS copy is
generated in `cloudflare/src`; no second briefing or image map is maintained.
This build does not deploy to Tencent EdgeOne.

For a local check, run `npm ci` followed by `npm run build:cloudflare`, then
confirm that `cloudflare/dist/index.html` and `cloudflare/dist/assets/` exist.

This repository does not include a Wrangler project configuration because no
Cloudflare Pages project ID, name, domain, or account settings have been
selected. Configure those in Cloudflare when connecting the repository; do not
assume the current Sites domain should be moved.
