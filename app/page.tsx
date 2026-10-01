"use client";

import { useEffect, useMemo, useState } from "react";
import { briefings } from "./briefing";

type StoryView = "summary" | "design" | "evidence" | "idea";
type Locale = "zh" | "en";
const ui = {
  zh: { nav: ["今日判断", "案例", "项目", "归档"], picker: "选择简报", date: "简报日期", daily: "DAILY IMPLEMENTATION BRIEF", headline: ["从真实案例，", "找到可执行方案。"], tagline: "每天拆解真实部署、系统设计和证据局限，把资讯转成可验证的项目方向。", judgment: "TODAY'S JUDGEMENT", lens: "今日判断维度", lensLabels: ["工作流", "评估", "业务指标", "证据"], sources: "SOURCES", evidenceTypes: "EVIDENCE TYPES", directions: "PROJECT DIRECTIONS", updated: "UPDATED 09:30", editor: "EDITOR'S NOTE", caseIndex: "02 / CASE INDEX", caseTitle: "把真实案例拆到可以行动。", caseIntro: "点击案例或内容标签，在摘要、系统设计、证据边界与项目启发之间切换。", storyTabs: ["摘要", "系统设计", "证据与局限", "项目启发"], original: "阅读原始资料", visual: "SOURCE VISUAL", projectsLabel: "03 / WHAT TO BUILD", projectsTitle: "值得启动的小项目。", projectsIntro: "每个方向都从一个窄问题开始，并用真实业务指标决定是否继续。", project: "PROJECT", archiveLabel: "04 / ARCHIVE", archiveTitle: "往期判断。", archiveIntro: "按月收纳，每日一篇。", archiveHint: "选择任一期，回到首页阅读。", issueCount: "期简报", expand: "展开", collapse: "收起", sourcesCount: "组资料", reading: "正在阅读", footerLine1: "从真实案例到可验证方案。", footerLine2: "每日 09:30 更新。", top: "回到顶部", englishUnavailable: "This issue does not have an English edition yet. Showing the Chinese original.", language: "Language" },
  en: { nav: ["Today's view", "Cases", "Projects", "Archive"], picker: "Choose an issue", date: "Issue date", daily: "DAILY IMPLEMENTATION BRIEF", headline: ["From real cases,", "to practical solutions."], tagline: "We unpack real deployments, system design, and evidence limits—and turn them into testable project directions.", judgment: "TODAY'S JUDGEMENT", lens: "Today's lenses", lensLabels: ["Workflow", "Evaluation", "Business metrics", "Evidence"], sources: "SOURCES", evidenceTypes: "EVIDENCE TYPES", directions: "PROJECT DIRECTIONS", updated: "UPDATED 09:30", editor: "EDITOR'S NOTE", caseIndex: "02 / CASE INDEX", caseTitle: "Turn real cases into practical moves.", caseIntro: "Choose a case or a tab to move between the summary, system design, evidence, and project takeaways.", storyTabs: ["Summary", "System design", "Evidence & limits", "Project takeaway"], original: "Read the original source", visual: "SOURCE VISUAL", projectsLabel: "03 / WHAT TO BUILD", projectsTitle: "Small projects worth starting.", projectsIntro: "Start with a narrow question; use real business metrics to decide whether to continue.", project: "PROJECT", archiveLabel: "04 / ARCHIVE", archiveTitle: "Past issues.", archiveIntro: "Filed by month, one issue per day.", archiveHint: "Choose an issue to read it on the homepage.", issueCount: "issues", expand: "Expand", collapse: "Collapse", sourcesCount: "sources", reading: "Reading now", footerLine1: "From real cases to testable solutions.", footerLine2: "Updated daily at 09:30.", top: "Back to top", englishUnavailable: "This issue does not have an English edition yet. Showing the Chinese original.", language: "Language" },
} as const;
const viewKeys: StoryView[] = ["summary", "design", "evidence", "idea"];
const Arrow = ({ down = false }: { down?: boolean }) => <span aria-hidden="true">{down ? "↓" : "↗"}</span>;
export default function Home() {
  const [issueIndex, setIssueIndex] = useState(0);
  const [lens, setLens] = useState(0);
  const [openStory, setOpenStory] = useState(0);
  const [storyView, setStoryView] = useState<StoryView>("summary");
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("signal");
  const [locale, setLocale] = useState<Locale>("zh");
  const briefing = briefings[issueIndex];
  const english = locale === "en" ? briefing.translations?.en : undefined;
  const copy = ui[locale];
  const thesis = english?.thesis ?? briefing.thesis;
  const takeaways = english?.takeaways ?? briefing.takeaways;
  const contrarian = english?.contrarian ?? briefing.contrarian;
  const projectIdeas = english?.projectIdeas ?? briefing.projectIdeas;
  const signalCopy = useMemo(() => takeaways[lens % takeaways.length], [takeaways, lens]);
  const views = viewKeys.map((key, index) => ({ key, label: copy.storyTabs[index] }));
  const archiveMonths = useMemo(() => {
    const months = new Map<string, { issue: (typeof briefings)[number]; index: number }[]>();
    briefings.forEach((issue, index) => {
      const month = issue.date.slice(0, 7);
      months.set(month, [...(months.get(month) ?? []), { issue, index }]);
    });
    return [...months.entries()].sort(([a], [b]) => b.localeCompare(a));
  }, []);

  useEffect(() => {
    const updateProgress = () => {
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(height > 0 ? Math.min(100, (window.scrollY / height) * 100) : 0);
      const current = ["archive", "projects", "cases", "signal"].find((id) => (document.getElementById(id)?.getBoundingClientRect().top ?? Infinity) <= 180);
      setActiveSection(current ?? "signal");
    };
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible")), { threshold: 0.12 });
    document.querySelectorAll("[data-reveal]").forEach((element) => observer.observe(element));
    window.addEventListener("scroll", updateProgress, { passive: true }); updateProgress();
    return () => { observer.disconnect(); window.removeEventListener("scroll", updateProgress); };
  }, [issueIndex]);

  useEffect(() => {
    document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
  }, [locale]);

  const scrollBehavior = (): ScrollBehavior => window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth";
  const chooseIssue = (index: number) => {
    setIssueIndex(index); setLens(0); setOpenStory(0); setStoryView("summary");
    document.getElementById("page-title")?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: scrollBehavior() });
  };
  const openCase = (index: number) => {
    setOpenStory(index);
    setStoryView("summary");
    requestAnimationFrame(() => requestAnimationFrame(() => document.getElementById(`case-${issueIndex}-${index}`)?.scrollIntoView({ behavior: scrollBehavior(), block: "start" })));
  };

  return <main className="site-shell" id="top">
    <div className="scroll-progress" aria-hidden="true"><span style={{ width: `${progress}%` }} /></div>
    <nav className="nav" aria-label={locale === "zh" ? "主导航" : "Main navigation"}>
      <a className="brand" href="#top"><span className="brand-mark">AF</span><span>AI FIELD NOTES</span></a>
      <div className="nav-links">{[{ id: "signal", label: copy.nav[0] }, { id: "cases", label: copy.nav[1] }, { id: "projects", label: copy.nav[2] }, { id: "archive", label: copy.nav[3] }].map((section) => <a className={activeSection === section.id ? "active" : ""} aria-current={activeSection === section.id ? "location" : undefined} href={`#${section.id}`} key={section.id}>{section.label}</a>)}</div>
      <div className="nav-tools"><div className="language-switch" role="group" aria-label={copy.language}><button type="button" aria-pressed={locale === "zh"} onClick={() => setLocale("zh")}>中文</button><button type="button" aria-pressed={locale === "en"} onClick={() => setLocale("en")}>EN</button></div><label className="issue-picker"><span className="sr-only">{copy.picker}</span><select value={issueIndex} onChange={(event) => chooseIssue(Number(event.target.value))}>{briefings.map((issue, index) => <option key={issue.issue} value={index}>{issue.issue}</option>)}</select></label></div>
    </nav>

    {locale === "en" && !english && <p className="language-notice" role="status">{copy.englishUnavailable}</p>}

    <section className="hero">
      <aside className="hero-rail" aria-label={copy.date}><strong>{briefing.date.slice(-2)}</strong><span>{briefing.date.slice(5, 7)} / {briefing.date.slice(0, 4)}</span><i /><small>09:30 CST</small></aside>
      <div className="hero-title"><div className="hero-meta"><span>{copy.daily}</span><span>{briefing.issue}</span></div><h1 id="page-title" tabIndex={-1}><span>{copy.headline[0]}</span><span>{copy.headline[1]}</span></h1><p>{copy.tagline}</p></div>
      <div className="hero-judgement" id="signal">
        <div className="judgement-meta"><span>{copy.judgment}</span><span>{String(lens + 1).padStart(2, "0")} / {String(takeaways.length).padStart(2, "0")}</span></div>
        <h2>{thesis}</h2><p key={`${issueIndex}-${lens}-${locale}`} className="signal-copy">{signalCopy}</p>
        <div className="lens-tabs" role="tablist" aria-label={copy.lens}>{takeaways.map((_, index) => <button type="button" role="tab" aria-selected={lens === index} className={lens === index ? "active" : ""} onClick={() => setLens(index)} key={index}>{copy.lensLabels[index] || `${locale === "zh" ? "判断" : "Lens"} ${index + 1}`}</button>)}</div>
        <a href="#cases" className="hero-cta">{locale === "zh" ? "阅读案例拆解" : "Explore the cases"} <Arrow down /></a>
      </div>
    </section>

    <section className="metric-strip" aria-label={locale === "zh" ? "本期概览" : "Issue overview"}><span><b>{String(briefing.items.length).padStart(2, "0")}</b> {copy.sources}</span><span><b>04</b> {copy.evidenceTypes}</span><span><b>{String(projectIdeas.length).padStart(2, "0")}</b> {copy.directions}</span><span className="updated"><i /> {copy.updated}</span></section>
    <section className="statement reveal" data-reveal><span>{copy.editor}</span><blockquote>{contrarian}</blockquote></section>

    <section className="cases" id="cases" aria-label="案例拆解">
      <header className="section-title reveal" data-reveal><span>{copy.caseIndex}</span><h2>{copy.caseTitle}</h2><p>{copy.caseIntro}</p></header>
      <div className="case-list">{briefing.items.map((item, index) => { const isOpen = openStory === index; const itemEn = english?.items[index]; const source = itemEn?.source ?? item.source; const type = itemEn?.type ?? item.type; const title = itemEn?.title ?? item.title; const visual = item.image; const content = storyView === "summary" ? itemEn?.summary ?? item.summary : storyView === "design" ? itemEn?.design ?? item.design : storyView === "evidence" ? itemEn?.evidence ?? item.evidence : itemEn?.idea ?? item.idea; return <article id={`case-${issueIndex}-${index}`} className={`case-row ${isOpen ? "is-open" : ""}`} key={item.title}>
        <button className="case-heading" type="button" aria-expanded={isOpen} onClick={() => openCase(index)}><span>{String(index + 1).padStart(2, "0")}</span><div><small>{source} / {type}</small><h3>{title}</h3></div><i aria-hidden="true">{isOpen ? "—" : "+"}</i></button>
        {isOpen && <div className={`case-body has-visual visual-${index % 2 === 0 ? "right" : "left"}`}><div className="story-tabs" role="tablist" aria-label={`${title} ${locale === "zh" ? "内容视图" : "content views"}`}>{views.map((view) => <button type="button" role="tab" aria-selected={storyView === view.key} className={storyView === view.key ? "active" : ""} onClick={() => setStoryView(view.key)} key={view.key}>{view.label}</button>)}</div><div className="story-main"><p key={`${storyView}-${locale}`} className="story-copy">{content}</p><a href={item.url} target="_blank" rel="noreferrer">{copy.original} <Arrow /></a>{"relatedLinks" in item && item.relatedLinks && <div className="related-sources">{item.relatedLinks.map((link, linkIndex) => <a href={link.url} target="_blank" rel="noreferrer" key={link.url}>{itemEn?.relatedLinks?.[linkIndex]?.label ?? link.label} ↗</a>)}</div>}</div><figure className="case-visual"><a href={item.url} target="_blank" rel="noreferrer"><img src={visual.src} alt={itemEn?.image.alt ?? visual.alt} /></a><figcaption><span>{copy.visual} / {String(index + 1).padStart(2, "0")}</span><p>{itemEn?.image.caption ?? visual.caption}</p></figcaption></figure></div>}
      </article>; })}</div>
    </section>

    <section className="projects" id="projects"><header className="section-title light reveal" data-reveal><span>{copy.projectsLabel}</span><h2>{copy.projectsTitle}</h2><p>{copy.projectsIntro}</p></header><div className="project-grid">{projectIdeas.map((idea, index) => <article className="project-card" key={idea.title}><span>{copy.project} / 0{index + 1}</span><h3>{idea.title}</h3><p>{idea.description}</p><div>{idea.tags.map((tag) => <small key={tag}>{tag}</small>)}</div></article>)}</div></section>

    <section className="archive" id="archive" aria-labelledby="archive-title">
      <header className="section-title reveal" data-reveal><span>{copy.archiveLabel}</span><h2 id="archive-title">{copy.archiveTitle}</h2><p>{copy.archiveIntro}<br />{copy.archiveHint}</p></header>
      <div className="archive-directory">
        {archiveMonths.map(([month, editions], monthIndex) => <details className="archive-month" open={monthIndex === 0} key={month}>
          <summary className="archive-month-heading">
            <span className="archive-month-date"><strong>{Number(month.slice(5))}月</strong><span>{month.slice(0, 4)}</span></span>
            <span className="archive-month-count">{editions.length} {copy.issueCount}</span>
            <span className="archive-month-action" aria-hidden="true"><span className="when-closed">{copy.expand}</span><span className="when-open">{copy.collapse}</span><i /></span>
          </summary>
          <ol className="archive-entries">
            {editions.map(({ issue, index }) => <li key={issue.issue}>
              <button type="button" className={`archive-entry ${issueIndex === index ? "is-current" : ""}`} aria-current={issueIndex === index ? "true" : undefined} onClick={() => chooseIssue(index)}>
                <span className="archive-entry-date"><time dateTime={issue.date.replaceAll(".", "-")}>{issue.date.slice(5).replace(".", " / ")}</time><span>{issue.issue}</span></span>
                <strong className="archive-entry-title">{(locale === "en" ? issue.translations?.en?.thesis : undefined) ?? issue.thesis}</strong>
                <span className="archive-entry-meta"><span>{issue.items.length} {copy.sourcesCount}</span>{issueIndex === index && <span className="archive-current-label">{copy.reading}</span>}</span>
                <span className="archive-entry-arrow" aria-hidden="true">↗</span>
              </button>
            </li>)}
          </ol>
        </details>)}
      </div>
    </section>
    <footer><div className="footer-brand"><span className="brand-mark">AF</span><strong>AI FIELD NOTES</strong></div><p>{copy.footerLine1}<br />{copy.footerLine2}</p><a href="#top">{copy.top} ↑</a></footer>
  </main>;
}
