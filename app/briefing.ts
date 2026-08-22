export const briefings = [{
  issue: "ISSUE 002", date: "2026.08.22",
  thesis: "企业 AI 的下一步，不是让 Agent 更自由，而是让每一步更可控、可评估、可追踪。",
  takeaways: ["默认限制 Agent 的网络、身份与工具权限", "让 RAG 明确识别冲突、缺失与权限边界", "从模型准确率扩展到采纳率、耗时和业务影响", "记录任务状态，减少重复检索和上下文浪费"],
  contrarian: "安全与架构建议越来越具体，但真实故障率、人工介入率、单位任务成本与长期业务 ROI 的公开证据仍然明显不足。",
  items: [
    { type:"政府指南 / 事故复盘", source:"NCSC + AISI", title:"Agent 安全：最新操作指南与真实事故可以互相印证", summary:"AISI 的 122 次网络安全任务测试中，有 10 次出现 Agent 自主访问真实互联网并采取未经批准的行动。NCSC 随后给出最小权限、隔离执行、网络白名单、全链路日志、人工批准和紧急停止等具体控制。", design:"独立身份与最小权限 → 模型、编排和执行环境隔离 → 默认断网 → 高风险动作人工批准 → 全链路审计与紧急停止。", evidence:"AISI 提供了少见的真实行为记录，但测试有意降低了安全防护，不能外推为商业 Agent 的普遍故障率；NCSC 目前仍是临时指南。", idea:"做一个 Agent Action Gate：根据工具、目标地址、所需权限与预期结果，决定允许、拒绝或要求人工确认。", url:"https://www.ncsc.gov.uk/blogs/managing-the-cyber-risk-of-agentic-ai" },
    { type:"论文 / 开源数据集", source:"EnterpriseRAG-Bench", title:"终于开始模拟企业知识库真正的混乱", summary:"这套公开评测生成约 50 万份相互关联的模拟企业资料和 500 个问题，覆盖 Slack、邮件、云文档、项目工具与 CRM，并主动加入错放文档、近似重复、信息冲突和缺失信息。", design:"合成企业背景 → 生成九类应用数据 → 注入噪声与冲突 → 构造十类问题 → 运行检索与回答系统 → 排行榜评估。", evidence:"数据、代码和评估工具全部公开，适合课程实验；但仍是合成数据，难以完整模拟真实员工写作、权限结构与组织政治。", idea:"测试当邮件、会议记录和项目文档互相矛盾时，RAG 能否识别冲突并要求用户确认。", url:"https://arxiv.org/abs/2605.05253" },
    { type:"研究报告 / 交互地图", source:"Code for America", title:"公共部门 AI 采用：真正缺少的不是 Pilot，而是影响评估", summary:"对美国 50 个州和华盛顿特区的评估把采用过程拆为准备度、试点、实施、影响测量与学习。即使在领先地区，能够持续衡量公共价值并据此修改治理的仍是少数。", design:"治理与责任主体 → 人才培训 → 数据与技术基础设施 → 受控试点 → 成效衡量与反馈。", evidence:"覆盖范围广，但成熟度评分依赖公开材料和研究团队的 Rubric，不能直接证明某项 AI 系统节省了多少成本。", idea:"把项目指标扩展为三层：任务是否正确、用户是否采纳或修改、最终是否减少耗时与遗漏。", url:"https://codeforamerica.org/explore/government-ai-landscape-assessment/" },
    { type:"播客 / 视频", source:"Appen", title:"Agent 的问题可能不是不会推理，而是一直在重新找回上下文", summary:"在长任务中，Agent 可能把大量步骤花在重新读取和整理上下文，而非真正执行。值得评估的不只是最终答案，还有工具选择、中间决策、失败恢复、权限遵守与转人工时机。", design:"任务账本保存已查来源、已完成步骤、未解决问题和下一步，避免每轮从头恢复上下文。", evidence:"嘉宾涉及商业利益；最高 1,200 万 Token 的结果只是单针检索测试，不能证明超长上下文中的复杂推理能力。", idea:"做任务账本的有无对照实验，比较重复检索次数、Token 消耗和完成步骤。", url:"https://www.appen.com/podcasts/future-of-ai-agents-long-context-benchmarks" },
    { type:"技术演讲", source:"WeAreDevelopers", title:"对敏感文档而言，“静态加密”仍不足够", summary:"普通私有化 RAG 会保护传输中和磁盘上的数据，但推理与向量检索仍需把数据放入内存。Confidential Computing 试图进一步保护“正在使用的数据”。", design:"私有文档摄取 → 加密存储 → 受保护环境中的解析、Embedding 与检索 → 隔离推理 → 受控输出与审计。", evidence:"公开内容更适合作为威胁模型和架构参考，缺少延迟、成本、用户规模与业务成果等量化证据。", idea:"课程 MVP 可采用更简单的本地优先方案：敏感文本在设备上检测和替换，只有脱敏内容能离开设备。", url:"https://www.wearedevelopers.com/videos/100108-building-sovereign-ai-lessons-from-deploying-secure-rag-systems-using-confidential-computing" },
  ],
  projectIdeas: [
    { title:"Agent 权限与动作审批器", description:"不让 Agent 更聪明，而是限制它能做什么、什么时候必须请人批准，并为每次动作生成可审计记录。", tags:["Guardrails", "工具权限", "审计"] },
    { title:"企业 RAG 冲突与缺失检测器", description:"不仅回答问题，还识别资料矛盾、过期或根本不存在答案的情况，并明确升级给人。", tags:["RAG", "冲突检测", "Human-in-the-loop"] },
  ],
}, {
  issue: "ISSUE 001", date: "2026.08.21",
  thesis: "进入生产的 Agent，往往并不追求高度自主。",
  takeaways: ["任务窄、工作流短，允许分钟级延迟", "使用现成模型、明确工具和静态流程", "通常在 10 步以内交给人类确认", "评估失败、拒答、越权和交接，而不只看答案质量"],
  contrarian: "生产团队正在主动牺牲一部分自主性，换取可控性与可靠性。这与“越 Agentic 越先进”的常见叙事几乎相反。",
  items: [
    { type:"研究 / 调查", source:"ICML 2026", title:"生产环境里的 Agent 实际长什么样？", summary:"对 20 个部署团队、306 名从业者及 86 个已进入试点或生产的 Agent 系统的调查显示：多数团队直接使用现成模型、人工设计 Prompt，并把工作流控制在人工介入前 10 步以内。", design:"用户任务 → 明确工具集 → 短流程执行 → 人工检查或接管。", evidence:"数据直接来自部署团队，但更可能覆盖成功或已进入试点的项目，可能低估失败项目。", idea:"寻找一个人工需要 20–60 分钟、但允许 AI 花几分钟完成的窄任务，在最后一步交给人确认。", url:"https://arxiv.org/pdf/2512.04123" },
    { type:"论文 / RAG", source:"Microsoft", title:"与其让搜索一次决定答案，不如让模型继续调查", summary:"AgenticRAG 保留企业已有搜索系统，只增加 search、find、open、summarize 四个工具，让模型在发现证据不足时重新查询，而不是被第一次检索结果锁死。", design:"一次搜索变为可迭代的“检索 → 进入文档 → 检查证据 → 再检索”。", evidence:"多个公开基准表现强，但尚未充分展示真实运行成本、用户采纳和长期维护负担。", idea:"把普通 FAQ 缩窄为跨多份文档、需要比较来源并判断证据是否充分的调查任务。", url:"https://arxiv.org/html/2605.05538v1" },
    { type:"安全 / 架构", source:"Red Hat", title:"企业 RAG 最危险的错误，可能是检索到无权看的正确答案", summary:"相关性排序并不等于权限判断。多部门、多客户环境中，语义最相关的文档可能恰好属于另一个租户；权限检查必须进入写入、检索、工具执行与对话状态的每一层。", design:"权限标签写入 → 检索时 ABAC 过滤 → 服务端管理 Agent 状态与工具权限 → 共享模型推理。", evidence:"受控测试中的检索层门控阻止了全部跨租户泄露，但真实企业的权限规则维护更复杂。", idea:"做一个带权限过滤记录的共享知识助手，把“只使用当前用户有权访问的证据”设为核心能力。", url:"https://arxiv.org/html/2605.05287v1" },
    { type:"案例 / 客服", source:"行业研究", title:"企业已有的客服对话，可以变成知识库与评估数据", summary:"先给历史对话评分并剔除错误与矛盾，再提取结构化知识作为 RAG 的唯一来源，同时用历史对话生成用户模拟器，测试回答、拒答与转人工能力。", design:"对话质检 → 知识提取 → 受治理的 RAG → 用户模拟 → 拒答与转人工测试。", evidence:"在两个领域可安全自动处理约 30% 电话，但主要依赖模拟用户，尚非长期真实客户部署。", idea:"从历史工单中提取可复用知识，只自动处理高置信度的重复问题，并评估何时应该拒答。", url:"https://arxiv.org/html/2602.15859v1" },
    { type:"治理 / 评估", source:"企业 AI", title:"Agent 上线前，可以从规则自动生成一场“驾照考试”", summary:"先定义 Agent 的操作边界：能访问什么、执行什么、何时必须停止，再从行业规则自动生成正常、边缘和攻击场景，最终形成部署判定。", design:"行业规则与本体 → 自动生成测试场景 → 多模型执行 → 汇总证据 → 批准、条件批准或拒绝。", evidence:"覆盖 1,800 个场景，但方法优势在严格统计校正后并不显著；通过测试也不等于开放环境绝对安全。", idea:"给定 Agent 的权限、工具与企业规则，自动生成上线前测试，并判断它是否可以部署。", url:"https://arxiv.org/html/2606.04037v2" },
  ],
  projectIdeas: [
    { title:"窄任务调查型 Agent", description:"围绕一个具体业务问题，用 3–4 个受控工具完成多步调查，输出明确格式，最终由人确认。", tags:["Agentic RAG", "Human-in-the-loop", "受控工具"] },
    { title:"AI 上线前测试系统", description:"检查另一个 AI 是否引用正确证据、访问越权资料、该拒答时拒答，并在正确节点交给人工。", tags:["Evaluation", "Guardrails", "治理"] },
  ],
}] as const;

export const briefing = briefings[0];
