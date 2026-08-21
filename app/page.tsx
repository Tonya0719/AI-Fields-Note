import { briefing, briefings } from "./briefing";

const Arrow = () => <span aria-hidden="true">↗</span>;

export default function Home() {
  return (
    <main>
      <nav className="nav" aria-label="主导航">
        <a className="brand" href="#top" aria-label="AI FIELD NOTES 首页">
          <span className="brand-mark">AF</span><span>AI FIELD NOTES</span>
        </a>
        <div className="nav-links"><a href="#brief">今日简报</a><a href="#ideas">项目方向</a><a href="#about">关于</a></div>
        <span className="edition">企业 AI · 每日更新</span>
      </nav>

      <section className="hero" id="top">
        <div className="hero-kicker"><span className="live-dot" /> DAILY INTELLIGENCE / {briefing.issue}</div>
        <h1>企业 AI，<br />去掉噪声之后。</h1>
        <div className="hero-bottom">
          <p>每天筛选真正值得读的论文、部署案例与深度分析。关注 Agent、RAG 和那些小而具体、能落地的业务问题。</p>
          <a className="read-button" href="#brief">阅读今日简报 <span>↓</span></a>
        </div>
        <div className="hero-orbit" aria-hidden="true"><span>AI</span></div>
      </section>

      <section className="signal-strip" aria-label="简报特色">
        <span>01 / 真实部署</span><span>02 / 系统设计</span><span>03 / 证据与局限</span><span>04 / 项目启发</span>
      </section>

      <section className="lead" id="brief">
        <header className="section-head"><span>今日信号</span><span>{briefing.date} · 新加坡</span></header>
        <div className="lead-grid">
          <div className="lead-number">{briefing.items.length.toString().padStart(2, "0")}</div>
          <div>
            <p className="eyebrow">本期最重要的结论</p><h2>{briefing.thesis}</h2>
            <div className="thesis-list">{briefing.takeaways.map((item) => <p key={item}><span>—</span>{item}</p>)}</div>
          </div>
          <aside className="side-note"><span className="side-label">反共识观察</span><p>{briefing.contrarian}</p></aside>
        </div>
      </section>

      <section className="stories" aria-label="今日资料">
        {briefing.items.map((item, index) => (
          <article className="story" key={item.title}>
            <div className="story-index">{String(index + 1).padStart(2, "0")}</div>
            <div className="story-main">
              <div className="tags"><span>{item.type}</span><span>{item.source}</span></div>
              <h3>{item.title}</h3><p className="dek">{item.summary}</p>
              <dl className="story-details">
                <div><dt>系统设计</dt><dd>{item.design}</dd></div>
                <div><dt>证据 / 局限</dt><dd>{item.evidence}</dd></div>
              </dl>
            </div>
            <div className="story-action">
              <p><strong>项目启发</strong>{item.idea}</p>
              <a href={item.url} target="_blank" rel="noreferrer" aria-label={`打开资料：${item.title}`}>阅读原文 <Arrow /></a>
            </div>
          </article>
        ))}
      </section>

      <section className="archive" aria-label="简报归档">
        <header className="section-head"><span>简报归档</span><span>{briefings.length} ISSUES</span></header>
        <div className="archive-row">
          {briefings.map((issue) => (
            <a href="#brief" key={issue.issue} className="archive-card">
              <span>{issue.issue}</span><strong>{issue.date}</strong><small>{issue.thesis}</small>
            </a>
          ))}
        </div>
      </section>

      <section className="ideas" id="ideas">
        <header className="section-head light"><span>值得做的方向</span><span>PROJECT PATTERNS</span></header>
        <div className="ideas-grid">
          {briefing.projectIdeas.map((idea, index) => (
            <article key={idea.title}>
              <span className="idea-no">0{index + 1}</span><h3>{idea.title}</h3><p>{idea.description}</p>
              <div className="idea-tags">{idea.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
            </article>
          ))}
        </div>
      </section>

      <footer id="about">
        <div><span className="brand-mark inverse">AF</span><strong>AI FIELD NOTES</strong></div>
        <p>一份面向企业 AI 实践者的每日情报。<br />少一点趋势判断，多一点可验证的系统设计。</p>
        <span className="footer-meta">下一期 · 明日上午</span>
      </footer>
    </main>
  );
}
