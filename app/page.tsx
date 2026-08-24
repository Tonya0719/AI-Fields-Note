"use client";

import { useEffect, useMemo, useState } from "react";
import { briefings } from "./briefing";

type StoryView = "summary" | "design" | "evidence" | "idea";
const views: { key: StoryView; label: string }[] = [{ key: "summary", label: "摘要" }, { key: "design", label: "系统设计" }, { key: "evidence", label: "证据与局限" }, { key: "idea", label: "项目启发" }];
const Arrow = ({ down = false }: { down?: boolean }) => <span aria-hidden="true">{down ? "↓" : "↗"}</span>;

export default function Home() {
  const [issueIndex, setIssueIndex] = useState(0);
  const [lens, setLens] = useState(0);
  const [openStory, setOpenStory] = useState(0);
  const [storyView, setStoryView] = useState<StoryView>("summary");
  const [progress, setProgress] = useState(0);
  const briefing = briefings[issueIndex];
  const signalCopy = useMemo(() => briefing.takeaways[lens % briefing.takeaways.length], [briefing, lens]);

  useEffect(() => {
    const updateProgress = () => { const height = document.documentElement.scrollHeight - window.innerHeight; setProgress(height > 0 ? Math.min(100, (window.scrollY / height) * 100) : 0); };
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible")), { threshold: 0.12 });
    document.querySelectorAll("[data-reveal]").forEach((element) => observer.observe(element));
    window.addEventListener("scroll", updateProgress, { passive: true }); updateProgress();
    return () => { observer.disconnect(); window.removeEventListener("scroll", updateProgress); };
  }, [issueIndex]);

  const chooseIssue = (index: number) => { setIssueIndex(index); setLens(0); setOpenStory(0); setStoryView("summary"); window.scrollTo({ top: 0, behavior: "smooth" }); };

  return <main className="site-shell" id="top">
    <div className="scroll-progress" aria-hidden="true"><span style={{ width: `${progress}%` }} /></div>
    <nav className="nav" aria-label="主导航">
      <a className="brand" href="#top"><span className="brand-mark">AF</span><span>AI FIELD NOTES</span></a>
      <div className="nav-links"><a className="active" href="#signal">今日判断</a><a href="#cases">案例</a><a href="#projects">项目</a><a href="#archive">归档</a></div>
      <label className="issue-picker"><span className="sr-only">选择简报</span><select value={issueIndex} onChange={(event) => chooseIssue(Number(event.target.value))}>{briefings.map((issue, index) => <option key={issue.issue} value={index}>{issue.issue}</option>)}</select></label>
    </nav>

    <section className="hero">
      <aside className="hero-rail" aria-label="简报日期"><strong>{briefing.date.slice(-2)}</strong><span>{briefing.date.slice(5, 7)} / {briefing.date.slice(0, 4)}</span><i /><small>09:30 CST</small></aside>
      <div className="hero-title"><div className="hero-meta"><span>DAILY IMPLEMENTATION BRIEF</span><span>{briefing.issue}</span></div><h1><span>从案例</span><span>到方案</span></h1><p>每天拆解真实部署、系统设计和证据局限，<br />把资讯转成可验证的项目方向。</p></div>
      <div className="hero-judgement" id="signal">
        <div className="judgement-meta"><span>TODAY&apos;S JUDGEMENT</span><span>{String(lens + 1).padStart(2, "0")} / {String(briefing.takeaways.length).padStart(2, "0")}</span></div>
        <h2>{briefing.thesis}</h2><p key={`${issueIndex}-${lens}`} className="signal-copy">{signalCopy}</p>
        <div className="lens-tabs" role="tablist" aria-label="今日判断维度">{briefing.takeaways.map((_, index) => <button type="button" role="tab" aria-selected={lens === index} className={lens === index ? "active" : ""} onClick={() => setLens(index)} key={index}>{["工作流", "评估", "业务指标", "证据"][index] || `判断 ${index + 1}`}</button>)}</div>
        <a href="#cases" className="hero-cta">阅读案例拆解 <Arrow down /></a>
      </div>
    </section>

    <section className="metric-strip" aria-label="本期概览"><span><b>{String(briefing.items.length).padStart(2, "0")}</b> SOURCES</span><span><b>04</b> EVIDENCE TYPES</span><span><b>{String(briefing.projectIdeas.length).padStart(2, "0")}</b> PROJECT DIRECTIONS</span><span className="updated"><i /> UPDATED 09:30</span></section>
    <section className="statement reveal" data-reveal><span>EDITOR&apos;S NOTE</span><blockquote>{briefing.contrarian}</blockquote></section>

    <section className="cases" id="cases" aria-label="案例拆解">
      <header className="section-title reveal" data-reveal><span>02 / CASE INDEX</span><h2>真实案例，<br />拆到可以行动。</h2><p>点击案例或内容标签，在摘要、系统设计、证据边界与项目启发之间切换。</p></header>
      <div className="case-list">{briefing.items.map((item, index) => { const isOpen = openStory === index; const content = storyView === "summary" ? item.summary : storyView === "design" ? item.design : storyView === "evidence" ? item.evidence : item.idea; return <article className={`case-row reveal ${isOpen ? "is-open" : ""}`} data-reveal key={item.title}>
        <button className="case-heading" type="button" aria-expanded={isOpen} onClick={() => { setOpenStory(index); setStoryView("summary"); }}><span>{String(index + 1).padStart(2, "0")}</span><div><small>{item.source} / {item.type}</small><h3>{item.title}</h3></div><i aria-hidden="true">{isOpen ? "—" : "+"}</i></button>
        {isOpen && <div className="case-body"><div className="story-tabs" role="tablist" aria-label={`${item.title} 内容视图`}>{views.map((view) => <button type="button" role="tab" aria-selected={storyView === view.key} className={storyView === view.key ? "active" : ""} onClick={() => setStoryView(view.key)} key={view.key}>{view.label}</button>)}</div><p key={storyView} className="story-copy">{content}</p><a href={item.url} target="_blank" rel="noreferrer">阅读原始资料 <Arrow /></a></div>}
      </article>; })}</div>
    </section>

    <section className="projects" id="projects"><header className="section-title light reveal" data-reveal><span>03 / WHAT TO BUILD</span><h2>值得启动的<br />小项目。</h2><p>每个方向都从一个窄问题开始，并用真实业务指标决定是否继续。</p></header><div className="project-grid">{briefing.projectIdeas.map((idea, index) => <article className="project-card reveal" data-reveal key={idea.title}><span>PROJECT / 0{index + 1}</span><h3>{idea.title}</h3><p>{idea.description}</p><div>{idea.tags.map((tag) => <small key={tag}>{tag}</small>)}</div></article>)}</div></section>

    <section className="archive" id="archive"><header className="section-title reveal" data-reveal><span>04 / ARCHIVE</span><h2>往期判断。</h2><p>选择任一期，首页内容会即时切换。</p></header><div className="archive-grid">{briefings.map((issue, index) => <button type="button" className={`archive-item reveal ${issueIndex === index ? "active" : ""}`} data-reveal onClick={() => chooseIssue(index)} key={issue.issue}><span>{issue.issue}</span><strong>{issue.date}</strong><p>{issue.thesis}</p><i>↗</i></button>)}</div></section>
    <footer><div className="footer-brand"><span className="brand-mark">AF</span><strong>AI FIELD NOTES</strong></div><p>从真实案例到可验证方案。<br />每日 09:30 更新。</p><a href="#top">回到顶部 ↑</a></footer>
  </main>;
}
