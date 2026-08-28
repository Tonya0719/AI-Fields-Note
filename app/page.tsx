"use client";

import { useEffect, useMemo, useState } from "react";
import { briefings } from "./briefing";

type StoryView = "summary" | "design" | "evidence" | "idea";
const views: { key: StoryView; label: string }[] = [{ key: "summary", label: "摘要" }, { key: "design", label: "系统设计" }, { key: "evidence", label: "证据与局限" }, { key: "idea", label: "项目启发" }];
const Arrow = ({ down = false }: { down?: boolean }) => <span aria-hidden="true">{down ? "↓" : "↗"}</span>;
const caseVisuals = {
  "https://blogs.cisco.com/news/my-agent-and-the-rise-of-ambient-intelligence-ciscos-next-step-in-enterprise-ai": { src: "/cases/cisco-myagent.png", alt: "Cisco MyAgent 连接 Jira、Outlook、Webex 与 SharePoint 的官方视觉图", caption: "个人 Agent 连接获批应用与企业数据，在人工监督下持续推进任务。" },
  "https://www.anthropic.com/news/model-hardware-standard-research-preview": { src: "/cases/anthropic-mhs.jpg", alt: "研究人员操作显微镜的 Model Hardware Standard 官方视觉图", caption: "标准化 Driver 把显微镜和机械臂压缩成 Agent 可验证的原子操作。" },
  "https://www.nist.gov/blogs/cybersecurity-insights/back-future-why-agentic-ai-needs-strong-identity-foundation": { src: "/cases/nist-agent-identity.png", alt: "美国国家标准与技术研究院 NIST 官方标识", caption: "独立身份、范围受限的短期权限和可归责日志构成 Agent 身份基础。" },
  "https://www.glean.com/blog/go-glean-cowork": { src: "/cases/glean-cowork.webp", alt: "Glean 与 Claude Cowork 的输出偏好和任务成本对比图", caption: "预索引与自动路由显著改变了 Token 使用和单任务成本。" },
  "https://www.salesforce.com/news/stories/agentic-ai-leaders-survey-on-roi/": { src: "/cases/salesforce-agent-roi.png", alt: "Salesforce Agentic AI ROI 调查的官方信息图", caption: "窄任务、可用数据和人工升级路径比抢先上线更接近可验证 ROI。" },
  "https://metr.org/blog/2026-08-26-openai-hugging-face-incident-investigation/": { src: "/cases/agent-incident-metr.png", alt: "METR 与 Redwood Research 对 Agent 入侵事件的独立调查封面", caption: "共享基础设施成为非预期协作通道，暴露了测试环境边界的系统性风险。" },
  "https://aws.amazon.com/blogs/machine-learning/nateras-intelligent-appointment-scheduling-with-amazon-bedrock-agentcore/": { src: "/cases/natera-voice-agent.png", alt: "AWS 关于 Natera 智能预约 Agent 的工程案例封面", caption: "身份验证状态决定患者数据与高风险预约工具是否对 Agent 可见。" },
  "https://aclanthology.org/2026.eacl-industry.33/": { src: "/cases/nvidia-data-flywheel.jpg", alt: "NVIDIA 自适应数据飞轮论文首页", caption: "真实负反馈进入监控、分析、修改与灰度部署的持续改进闭环。" },
  "https://www.okta.com/newsroom/press-releases/okta-brings-first-class-identity-to-ai-agents-with-agent-sso/": { src: "/cases/okta-agent-sso.png", alt: "Okta Agent SSO 的产品发布视觉图", caption: "Agent 获得独立身份、短期凭证与可审计的用户委托范围。" },
  "https://aclanthology.org/2026.acl-long.923/": { src: "/cases/rare-rag-benchmark.jpg", alt: "RARE 高相似语料检索评估论文首页", caption: "相似版本与重复事实让企业知识库中的检索难度远高于常规基准。" },
  "https://www.reuters.com/business/google-expands-gemini-ai-platform-law-firms-lawyers-2026-08-25/": { src: "/cases/google-legal-courtlistener.png", alt: "CourtListener 接入 Gemini Enterprise for Legal 的发布页面", caption: "公共判例与引用网络通过 MCP 成为可追溯、可复核的法律证据。" },
  "https://blog.cloudflare.com/cloudflare-os/": { src: "/cases/cloudflare-os.png", alt: "Cloudflare OS 开放式 Agent 工作平台的发布视觉图", caption: "共享工作区记录 Agent 实际观察过的资源，并在分享时重新检查权限。" },
  "https://newsroom.bankofamerica.com/content/newsroom/press-releases/2026/07/bank-of-america-enhances-ericaassist-with-generative-ai-to-help-.html": { src: "/cases/bofa-erica-assist.jpg", alt: "美国银行客服人员在桌面使用耳机处理客户请求", caption: "EricaAssist 在通话中给出政策依据和下一步建议，最终决策仍由客服人员完成。" },
  "https://www.gao.gov/products/gao-26-107859": { src: "/cases/gao-ai-procurement.png", alt: "美国政府问责局 AI 采购审计报告页面", caption: "独立审计追踪采购需求、合同、持续成本和未被复用的失败经验。" },
  "https://digital-strategy.ec.europa.eu/en/policies/guidelines-ai-transparency-obligations": { src: "/cases/eu-ai-transparency.jpg", alt: "欧盟委员会 AI 透明度指南的官方视觉图", caption: "AI 身份披露、机器可读标记和人工审阅状态进入统一合规证据链。" },
  "https://github.blog/engineering/user-experience/your-alt-text-passes-automated-checks-that-doesnt-mean-its-any-good/": { src: "/cases/github-alt-text-quality.png", alt: "GitHub 无障碍扫描插件的文章视觉图", caption: "确定性规则与可选视觉模型被设计为两套不同的质量门。" },
  "https://www.reuters.com/business/starbucks-scraps-ai-inventory-tool-across-north-america-2026-05-21/": { src: "/cases/starbucks-ai-inventory.jpg", alt: "Starbucks 员工使用移动设备扫描货架库存", caption: "真实门店里的光照、货架和相似包装共同挑战视觉盘点系统。" },
  "https://github.blog/engineering/turn-one-giant-ai-generated-pull-request-to-a-reviewable-stack/": { src: "/cases/github-stacked-prs.png", alt: "GitHub 关于可审查 PR 堆栈的文章视觉图", caption: "把巨型 Agent 改动拆成依赖清晰、可分别审查的 PR。" },
  "https://netflixtechblog.com/the-ai-evolution-of-graph-search-at-netflix-d416ec5b1151": { src: "/cases/netflix-graph-search.png", alt: "Netflix Graph Search 自然语言查询的端到端架构图", caption: "RAG 只构建相关上下文，生成的 DSL 还需经过语法和幻觉校验。" },
  "https://pubsonline.informs.org/doi/10.1287/mnsc.2025.00535": { src: "/cases/copilot-field-experiment.png", alt: "生成式 AI 对软件开发者影响的现场实验论文首页", caption: "三项随机现场实验将工具访问、真实采用与任务完成分开衡量。" },
  "https://utilityanalytics.com/how-utilities-are-operationalizing-gen-ai/": { src: "/cases/utilities-genai.jpg", alt: "公用事业行业生成式 AI 圆桌文章视觉图", caption: "公用事业从员工辅助与知识搜索起步，逐步建立治理和信任。" },
  "https://engineering.salesforce.com/building-reliable-production-ai-with-durable-workflows/": { src: "/cases/salesforce-durable-workflows.png", alt: "Salesforce Agentforce Grid 的持久化列工作流架构图", caption: "父工作流拆分批次、保存执行状态，并仅重试未完成单元。" },
  "https://arxiv.org/html/2605.10912v1": { src: "/cases/wildclawbench-teaser.png", alt: "WildClawBench 与传统 Agent 基准的结构对比图", caption: "真实工具、长任务与环境审计构成了这一评测的核心差异。" },
  "https://www.tcs.com/who-we-are/newsroom/press-release/tcs-launches-agentic-ai-platform-transform-drug-development": { src: "/cases/tcs-pharma.jpg", alt: "TCS 关于生成式 AI 在制药行业应用的资料图", caption: "TCS 将生成式 AI 放入制药研发与运营场景，强调行业流程而非通用助手。" },
  "https://www.msi.org/working-paper/generative-ai-and-firm-productivity-field-experiments-in-online-retail/": { src: "/cases/msi-retail-experiments.jpg", alt: "生成式 AI 在线零售现场实验的销售影响图表", caption: "七个零售工作流的效果并不一致，增量能力决定了最终业务结果。" },
  "https://podcasts.apple.com/us/podcast/lexisnexis-on-why-standard-rag-fails-in-law/id1839285239?i=1000750307310": { src: "/cases/lexis-podcast.jpg", alt: "LexisNexis 法律 RAG 播客节目封面", caption: "节目讨论专业法律检索中的权威性、判例关系与证据复核。" },
  "https://www.reuters.com/world/asia-pacific/strong-majority-japanese-firms-have-yet-fully-embrace-ai-2026-08-12/": { src: "/cases/japan-ai-adoption.jpg", alt: "日本不同行业企业的 AI 采用阶段图表", caption: "企业采用深度在行业之间明显分化，开放使用并不等于嵌入工作流。" },
  "https://www.telerik.com/blogs/telerik-and-kendo-meet-webmcp": { src: "/cases/telerik-webmcp.png", alt: "Telerik 与 Kendo UI 的 WebMCP 产品演示图", caption: "界面组件把排序、筛选和导出暴露为 Agent 可发现的结构化工具。" },
  "https://aws.amazon.com/blogs/machine-learning/evaluating-ai-agents-real-world-lessons-from-building-agentic-systems-at-amazon/": { src: "/cases/amazon-agent-evals.png", alt: "Amazon Agent 评估方法的文章主图", caption: "任务结果、执行轨迹与生产系统指标需要被放在同一评估闭环中。" },
  "https://www.mckinsey.com/capabilities/operations/our-insights/redefining-procurement-performance-in-the-era-of-agentic-ai": { src: "/cases/procurement-agentic-ai.jpg", alt: "Agentic AI 编排采购流程的资料图", caption: "采购 Agent 的价值来自贯通合同、订单、发票与异常处理，而不是孤立生成文本。" },
  "https://www.mdpi.com/2674-113X/5/2/15": { src: "/cases/graph-rag.png", alt: "知识图谱增强客户服务 RAG 的流程图", caption: "向量检索与实体关系图共同为复杂客服问题提供可追踪上下文。" },
  "https://www.expresscomputer.in/news/86-of-enterprises-have-deployed-ai-agents-but-just-34-trust-them-forrester-study/136898/": { src: "/cases/boomi-forrester.jpg", alt: "企业采用人工智能的报道主图", caption: "部署率与信任度之间的落差提示：上线并不等于形成可靠自治能力。" },
  "https://www.ncsc.gov.uk/blogs/managing-the-cyber-risk-of-agentic-ai": { src: "/cases/ncsc-agentic-risk.jpg", alt: "英国 NCSC 关于 Agentic AI 网络风险的文章主图", caption: "最小权限、网络隔离、人工批准和紧急停止构成基础安全边界。" },
  "https://arxiv.org/abs/2605.05253": { src: "/cases/enterprise-rag-pipeline.png", alt: "EnterpriseRAG-Bench 企业资料生成与评测管线图", caption: "评测主动注入跨应用关系、重复、冲突与缺失信息，模拟企业知识库的混乱。" },
  "https://codeforamerica.org/explore/government-ai-landscape-assessment/": { src: "/cases/gov-ai-assessment.png", alt: "Code for America 政府 AI 景观评估资料图", caption: "评估从准备度、试点与实施进一步延伸到影响测量和持续学习。" },
  "https://www.appen.com/podcasts/future-of-ai-agents-long-context-benchmarks": { src: "/cases/appen-context-benchmark.jpg", alt: "Appen 关于 AI 评测的播客资料图", caption: "长任务评估需要同时观察上下文恢复、工具选择、失败恢复和交接时机。" },
  "https://www.wearedevelopers.com/videos/100108-building-sovereign-ai-lessons-from-deploying-secure-rag-systems-using-confidential-computing": { src: "/cases/confidential-rag-video.jpg", alt: "机密计算与安全 RAG 技术演讲画面", caption: "敏感数据在解析、向量检索和推理期间同样需要隔离与保护。" },
  "https://arxiv.org/pdf/2512.04123": { src: "/cases/production-agent-survey.png", alt: "生产 Agent 调查中的验证方法共现图", caption: "部署团队组合多种验证方法，并普遍保留人工检查与短工作流。" },
  "https://arxiv.org/html/2605.05538v1": { src: "/cases/microsoft-agentic-rag.png", alt: "Microsoft AgenticRAG 的迭代调查循环图", caption: "模型通过搜索、进入文档和检查证据循环调查，而非接受一次检索的结果。" },
  "https://arxiv.org/html/2605.05287v1": { src: "/cases/permission-aware-rag.webp", alt: "多租户权限感知 RAG 的参考架构图", caption: "租户身份和角色过滤进入检索层，降低跨租户证据泄漏风险。" },
  "https://arxiv.org/html/2602.15859v1": { src: "/cases/customer-service-rag.png", alt: "客户服务知识提取与自动处理结果图表", caption: "历史对话经过质检、知识提取和模拟评估后，只自动处理高置信度问题。" },
  "https://arxiv.org/html/2606.04037v2": { src: "/cases/agent-licensing-evals.png", alt: "Agent 上线测试的跨模型评估热力图", caption: "规则生成的正常、边缘与攻击场景共同形成上线前的证据矩阵。" },
} as const;

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
  const openCase = (index: number) => {
    setOpenStory(index);
    setStoryView("summary");
    requestAnimationFrame(() => requestAnimationFrame(() => document.getElementById(`case-${issueIndex}-${index}`)?.scrollIntoView({ behavior: "smooth", block: "start" })));
  };

  return <main className="site-shell" id="top">
    <div className="scroll-progress" aria-hidden="true"><span style={{ width: `${progress}%` }} /></div>
    <nav className="nav" aria-label="主导航">
      <a className="brand" href="#top"><span className="brand-mark">AF</span><span>AI FIELD NOTES</span></a>
      <div className="nav-links"><a className="active" href="#signal">今日判断</a><a href="#cases">案例</a><a href="#projects">项目</a><a href="#archive">归档</a></div>
      <label className="issue-picker"><span className="sr-only">选择简报</span><select value={issueIndex} onChange={(event) => chooseIssue(Number(event.target.value))}>{briefings.map((issue, index) => <option key={issue.issue} value={index}>{issue.issue}</option>)}</select></label>
    </nav>

    <section className="hero">
      <aside className="hero-rail" aria-label="简报日期"><strong>{briefing.date.slice(-2)}</strong><span>{briefing.date.slice(5, 7)} / {briefing.date.slice(0, 4)}</span><i /><small>09:30 CST</small></aside>
      <div className="hero-title"><div className="hero-meta"><span>DAILY IMPLEMENTATION BRIEF</span><span>{briefing.issue}</span></div><h1><span>从真实案例，</span><span>找到可执行方案。</span></h1><p>每天拆解真实部署、系统设计和证据局限，<br />把资讯转成可验证的项目方向。</p></div>
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
      <header className="section-title reveal" data-reveal><span>02 / CASE INDEX</span><h2>把真实案例拆到可以行动。</h2><p>点击案例或内容标签，在摘要、系统设计、证据边界与项目启发之间切换。</p></header>
      <div className="case-list">{briefing.items.map((item, index) => { const isOpen = openStory === index; const visual = caseVisuals[item.url]; const content = storyView === "summary" ? item.summary : storyView === "design" ? item.design : storyView === "evidence" ? item.evidence : item.idea; return <article id={`case-${issueIndex}-${index}`} className={`case-row ${isOpen ? "is-open" : ""}`} key={item.title}>
        <button className="case-heading" type="button" aria-expanded={isOpen} onClick={() => openCase(index)}><span>{String(index + 1).padStart(2, "0")}</span><div><small>{item.source} / {item.type}</small><h3>{item.title}</h3></div><i aria-hidden="true">{isOpen ? "—" : "+"}</i></button>
        {isOpen && <div className={`case-body has-visual visual-${index % 2 === 0 ? "right" : "left"}`}><div className="story-tabs" role="tablist" aria-label={`${item.title} 内容视图`}>{views.map((view) => <button type="button" role="tab" aria-selected={storyView === view.key} className={storyView === view.key ? "active" : ""} onClick={() => setStoryView(view.key)} key={view.key}>{view.label}</button>)}</div><div className="story-main"><p key={storyView} className="story-copy">{content}</p><a href={item.url} target="_blank" rel="noreferrer">阅读原始资料 <Arrow /></a></div><figure className="case-visual"><a href={item.url} target="_blank" rel="noreferrer"><img src={visual.src} alt={visual.alt} /></a><figcaption><span>SOURCE VISUAL / {String(index + 1).padStart(2, "0")}</span><p>{visual.caption}</p></figcaption></figure></div>}
      </article>; })}</div>
    </section>

    <section className="projects" id="projects"><header className="section-title light reveal" data-reveal><span>03 / WHAT TO BUILD</span><h2>值得启动的小项目。</h2><p>每个方向都从一个窄问题开始，并用真实业务指标决定是否继续。</p></header><div className="project-grid">{briefing.projectIdeas.map((idea, index) => <article className="project-card" key={idea.title}><span>PROJECT / 0{index + 1}</span><h3>{idea.title}</h3><p>{idea.description}</p><div>{idea.tags.map((tag) => <small key={tag}>{tag}</small>)}</div></article>)}</div></section>

    <section className="archive" id="archive"><header className="section-title reveal" data-reveal><span>04 / ARCHIVE</span><h2>往期判断。</h2><p>选择任一期，首页内容会即时切换。</p></header><div className="archive-grid">{briefings.map((issue, index) => <button type="button" className={`archive-item ${issueIndex === index ? "active" : ""}`} onClick={() => chooseIssue(index)} key={issue.issue}><span>{issue.issue}</span><strong>{issue.date}</strong><p>{issue.thesis}</p><i>↗</i></button>)}</div></section>
    <footer><div className="footer-brand"><span className="brand-mark">AF</span><strong>AI FIELD NOTES</strong></div><p>从真实案例到可验证方案。<br />每日 09:30 更新。</p><a href="#top">回到顶部 ↑</a></footer>
  </main>;
}
