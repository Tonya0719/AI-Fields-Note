# AI Fields Note

**Enterprise AI, observed in the field.**

AI Fields Note is a continuously updated research site focused on how AI is actually being deployed inside organizations — especially **agentic AI, RAG, evaluation, governance, human-in-the-loop workflows, and enterprise AI adoption**.

Rather than collecting broad AI news, the project looks for concrete cases where AI is attached to a real workflow, data source, decision, or business constraint.

## What each briefing covers

Each issue is structured around a small set of high-signal cases. For every case, the site separates four questions:

- **Summary** — What changed or was deployed?
- **System design** — How does the system or workflow work?
- **Evidence & limitations** — What is actually supported by data, and what is still unclear?
- **Project idea** — What can be transferred into a smaller enterprise AI project?

Issues also include a central thesis, key takeaways, a contrarian note, and a short list of project ideas.

## Research focus

The current coverage is centered on:

- Enterprise AI adoption and deployment
- AI agents and agentic workflows
- Retrieval-augmented generation (RAG)
- AI evaluation, observability, and reliability
- Human × AI work design
- Permissions, identity, governance, and safety
- AI unit economics and measurable business value
- Real production cases, field experiments, technical implementations, and credible industry evidence

The editorial preference is for **specific business problems and inspectable system designs over broad hype**.

## Repository structure

```text
AI-Fields-Note/
├── app/
│   ├── page.tsx          # Main site UI
│   ├── briefing.ts       # Structured briefing content
│   ├── globals.css       # Main styling
│   └── archive.css       # Archive styling
├── public/               # Case images and static assets
├── edgeone/              # Static Vite build used for Tencent EdgeOne
│   ├── scripts/
│   │   └── sync-content.mjs
│   ├── main.tsx
│   └── vite.config.ts
├── db/                   # Optional database scaffolding
├── drizzle/              # Optional Drizzle migrations
└── package.json
```

The editorial content currently lives in `app/briefing.ts`. The EdgeOne build copies the relevant app files into the static deployment surface before running Vite.

## Tech stack

- React 19
- TypeScript
- Vinext / Vite
- Tailwind CSS
- Tencent EdgeOne Makers for deployment
- Optional Drizzle ORM scaffolding for future persistence

## Local development

Requires Node.js `>=22.13.0`.

```bash
npm install
npm run dev
```

To verify the main build:

```bash
npm run build
```

## Tencent EdgeOne deployment

This repository contains a dedicated static build under `edgeone/`.

Recommended EdgeOne build settings:

```text
Framework preset: Vite
Root directory:   edgeone
Install command:  npm install
Build command:    npm run build
Output directory: dist
```

The EdgeOne build runs:

```bash
npm run sync-content
vite build
```

This keeps the deployed site aligned with the content and UI maintained under `app/`.

## Updating a briefing

The current workflow is intentionally simple:

1. Research and verify sources.
2. Add or update an issue in `app/briefing.ts`.
3. Add any required visual assets under `public/`.
4. Commit the changes to `main`.
5. EdgeOne rebuilds the static site.

## Editorial principle

A product announcement is not the same as production adoption, and production adoption is not the same as proven business value.

AI Fields Note therefore tries to keep **claims, system design, evidence, limitations, and inference visibly separate**.

---

Built as a personal field notebook for studying enterprise AI transformation and deployment.