export const briefings = [{
  issue: "ISSUE 004", date: "2026.08.24",
  thesis: "可靠企业 AI 的差距，越来越少来自模型本身，越来越多来自工作流恢复、评估设计和证据治理。",
  takeaways: ["把长任务拆成可检查、可重试的最小单元", "固定模型后，Agent 编排框架仍可带来巨大差异", "用真实业务指标比较现有流程与 AI 增量", "RAG 必须检查证据的版本、权威性与替代关系"],
  contrarian: "公开工程资料能证明可靠性机制，随机实验能证明少数业务结果，但多数 Agent 产品发布仍缺少客户级错误率、长期人工介入率和完整单位经济性。",
  items: [
    { type:"生产工程复盘 / 产品演示", source:"Salesforce Engineering", title:"可靠 Agent 首先是分布式执行问题", summary:"Agentforce Grid 需要对约一万条记录反复读取、调用模型、验证并写回。关键改造不是更换模型，而是将任务拆成持久化的父子工作流，每行成功后保存检查点，仅重试未完成单元。", design:"列任务作为父工作流 → 行或批次作为子工作流 → 每行成功后 Checkpoint → 仅重试未完成单元 → 幂等写入。", evidence:"内部压力测试中，旧同步路径约 90% 失败，迁移后为 0%，P95 完成时间改善约 60%；但数据来自厂商内部，尚不能视为独立生产 SLA。", idea:"做一个可恢复文档处理器，为每个合同、发票或 PII 检查任务保存状态与输出哈希，并主动注入超时和重复回调。", url:"https://engineering.salesforce.com/building-reliable-production-ai-with-durable-workflows/" },
    { type:"论文 / 开源基准 / 排行榜", source:"WildClawBench", title:"同一模型，仅更换 Agent 运行框架就可能相差 18 个百分点", summary:"60 个双语真实任务中有 26 个多模态任务，每次运行平均约 8 分钟、超过 20 次工具调用。评测不仅检查最终产物，还审计环境状态与副作用。", design:"Docker 中运行真实 CLI Agent → 调用浏览器、邮件、日历和文件工具 → 确定性产物检查 → 环境状态与副作用审计 → 必要时使用 LLM/VLM 评委。", evidence:"任务、容器和评分代码公开，可复现性较好；但仅有 60 题，主要模拟个人数字工作环境，缺少真实企业权限和合规审批链。", idea:"固定模型与任务，只比较有无任务账本、错误恢复或结构化工具两种编排，并记录成功率、成本、时长和副作用。", url:"https://arxiv.org/html/2605.10912v1" },
    { type:"产品发布 / 行业报道", source:"TCS ADD AgentHub", title:"药物安全 Agent 已瞄准个案处理，但收益仍是厂商自报", summary:"平台将 Agent 限定为具体角色，覆盖药物安全报告摄取、数据录入编码、文献分析、复核质控与人工最终决策，并强调角色权限、审计和渐进部署。", design:"ICSR 报告摄取 → 数据录入与编码 → 文献分析 → 复核与质控 → 人工治理和最终决策。", evidence:"TCS 宣称多项效率与成本改善，但未披露客户、样本量、基线、模型或错误率，二手报道也明确指出这些只是内部评估。", idea:"不要做完整药物安全 Agent；只做文献到安全个案字段提取，每个字段强制附原文 Span、置信度与 NEEDS REVIEW 状态。", url:"https://www.tcs.com/who-we-are/newsroom/press-release/tcs-launches-agentic-ai-platform-transform-drug-development" },
    { type:"研究报告 / 随机现场实验", source:"MSI + Columbia", title:"GenAI 是否有用，取决于它相对原流程增加了多少能力", summary:"一家跨境零售平台在数百万用户和商品上随机测试七个工作流。五个有细粒度交易数据的实验中，销售影响从无法检测到提升 16.3%，收益主要来自转化率，而非客单价。", design:"保持价格与其他投入不变，随机比较现有流程与现有流程加 AI，并用真实交易、退货率和评分衡量结果。", evidence:"本期证据最强：随机分配、多个工作流和真实交易结果；但公司匿名，实验较早，Prompt、模型与运行成本均未公开。", idea:"优先选择现有流程有明显缺口的环节，主指标直接使用转化、处理时长或遗漏率，而不是回答是否流畅。", url:"https://www.msi.org/working-paper/generative-ai-and-firm-productivity-field-experiments-in-online-retail/" },
    { type:"播客 / 专业 RAG", source:"LexisNexis", title:"法律 RAG 的危险不是找不到相似判例，而是找到已被推翻的判例", summary:"专业法律检索不能只依赖向量相似度，还需要法律要点知识图谱、权威来源和判例关系检查，并由 Reflection Agent 复核回答。", design:"问题规划 Agent → 法律要点知识图谱检索 → 权威来源与判例关系检查 → 回答生成 → Reflection Agent 复核。", evidence:"架构说明揭示了专业 RAG 的真实失败模式，但来自商业产品负责人，未公开测试集规模、真实错误率或对照实验。", idea:"做一个失效证据检测器，检查文档版本、生效日期、替代关系与权威等级；引用失效证据时拒绝生成最终答案。", url:"https://podcasts.apple.com/us/podcast/lexisnexis-on-why-standard-rag-fails-in-law/id1839285239?i=1000750307310" },
    { type:"独立媒体调查", source:"Reuters / Nikkei Research", title:"采用率与采用深度是两件不同的事", summary:"日本企业调查中，60% 只在部分业务使用 AI，24% 尚未决定或不考虑采用，只有 16% 称已作为全公司工具；即使全公司使用，部分受访者也仅用于文档生成。", design:"采用深度应分层记录：开放账号 → 偶尔使用 → 嵌入工作流 → 产生可审计结果 → 改善业务指标。", evidence:"来源独立于 AI 厂商，有助于纠正采用即转型的统计幻觉；但数据来自管理者自报，缺少 ROI 与实际使用日志。", idea:"项目至少记录任务完成率、人工修改率、重复使用率与每个合格结果成本。", url:"https://www.reuters.com/world/asia-pacific/strong-majority-japanese-firms-have-yet-fully-embrace-ai-2026-08-12/" },
  ],
  projectIdeas: [
    { title:"可恢复的批量 AI 检查流水线", description:"以文档或记录为最小重试单元，具备 Checkpoint、幂等写入和明确人工复核状态，用故障恢复与处理时长证明价值。", tags:["Durable Workflow", "幂等", "故障恢复"] },
    { title:"带版本关系的 RAG 证据检查器", description:"专门发现过期、被替代或互相冲突的政策、合同条款与操作文档，而不是尝试回答所有知识问题。", tags:["RAG", "证据治理", "版本关系"] },
  ],
}, {
  issue: "ISSUE 003", date: "2026.08.23",
  thesis: "Agent 真正进入业务流程后，关键不只是完成任务，而是用更稳定的接口执行、持续评估失败，并优先处理可追溯的异常。",
  takeaways: ["结构化工具调用比视觉点击更稳定", "任务、轨迹和系统指标必须一起评估", "从发票与合同一致性等窄任务证明价值", "把用户纠错自动转成回归测试案例"],
  contrarian: "调查和咨询报告声称 Agent 部署与 ROI 快速增长，但工程团队仍在解决基本的评估、权限和可靠性问题；“已部署”并不等于已经获得稳定自治能力。",
  items: [
    { type:"产品发布 / 技术文章 / 演示视频", source:"Progress WebMCP", title:"与其让 Agent 看屏幕点按钮，不如让界面暴露结构化工具", summary:"新版 Telerik 和 Kendo UI 让网页组件能以结构化工具被 Agent 发现和调用，避免依赖截图、坐标和 DOM 猜测。表格排序、筛选和导出都可以注册成带参数的明确工具。", design:"网页组件注册工具描述 → Agent 发现工具与参数 → 应用自身执行排序、筛选或导出 → 返回结构化结果。", evidence:"产品能力已经可以试用，但公开证据主要来自厂商演示，尚无大规模成功率、权限测试或与 GUI 操作 Agent 的正式比较；旧系统也需要主动改造。", idea:"比较视觉点击与结构化工具调用完成同一表格任务时的成功率、步骤数，以及界面变化后的稳定性。", url:"https://www.telerik.com/blogs/telerik-and-kendo-meet-webmcp" },
    { type:"企业工程博客 / 技术 Workshop", source:"Amazon", title:"最终答案正确，不代表 Agent 的执行过程可靠", summary:"Amazon 将 Agent 评估拆为任务、轨迹和系统三个层次，并把生产监控发现的新失败案例持续加入 Golden Dataset。人工专家负责检查多 Agent 冲突并校准 LLM 评委。", design:"任务完成度评估 → 工具与步骤轨迹检查 → 延迟、成本和安全监控 → 生产失败回流 Golden Dataset → 人工校准。", evidence:"资料来自真实 Amazon 团队经验，但没有披露各类 Agent 的失败率或详细对照数据，也自然偏向 AWS 产品体系。", idea:"用户恢复或修改某个 PII Span 后，自动保存为失败案例并加入回归测试集，下一版本必须重新通过。", url:"https://aws.amazon.com/blogs/machine-learning/evaluating-ai-agents-real-world-lessons-from-building-agentic-systems-at-amazon/" },
    { type:"行业分析 / 匿名企业案例", source:"McKinsey", title:"采购 Agent 最可信的起点，是发票与合同一致性检查", summary:"一家制药企业让 Agent 持续比较合同条款、采购订单、发票与交付情况，据报告减少了 4% 的价值泄漏。这个任务比自动谈判更窄，也更容易用差异清单验证。", design:"读取合同条款 → 获取采购订单与发票 → 对齐产品、价格、数量和付款条件 → 标记差异 → 人工处理异常。", evidence:"报告提供量化结果，但企业匿名，未公开模型、样本量、实施成本或计算方法，应视为咨询项目中的客户主张，而非独立验证。", idea:"输入合同和发票，输出带证据位置的差异清单，并把模糊条款标记为 NEEDS REVIEW。", url:"https://www.mckinsey.com/capabilities/operations/our-insights/redefining-procurement-performance-in-the-era-of-agentic-ai" },
    { type:"同行评审论文 / 行业案例", source:"Knowledge Graph + RAG", title:"知识图谱加 RAG 在进出口客服中的小规模验证", summary:"系统同时使用向量知识库、Neo4j 关系图谱和已验证答案缓存，处理质量异常、订单追踪和替代产品等问题。在 101 个企业问题上，加入图谱后的平均评分高于纯 RAG。", design:"内部文档与对话 → 向量检索 + 实体关系图谱 → 生成回答 → GPT 评估 → 高分答案缓存。", evidence:"架构与行业问题较具体，但测试集只有 101 题且主要依赖 GPT 评分；自动缓存高分答案还可能把评估错误固化进知识库。", idea:"先证明普通向量检索在哪类实体关系问题上失败，再决定是否为产品、供应商、质量问题和替代品增加知识图谱。", url:"https://www.mdpi.com/2674-113X/5/2/15" },
    { type:"委托调查 / 媒体摘要", source:"Forrester Consulting + Boomi", title:"86% 已部署与 34% 信任 Agent 之间，可能存在统计口径问题", summary:"对 409 名 IT 管理者的调查称 86% 已越过 Agent 试点阶段，但只有 34% 信任 Agent 采取的行动。治理较成熟的组织更常使用 API 管理、集中式 MCP 治理与 Agent 控制层。", design:"API 与集成管理 → 集中式 MCP 治理 → Agent 控制和编排层 → AI 与系统集成团队统一运营。", evidence:"调查由厂商委托，受访者是管理者而非一线用户；部署、信任和损失的定义在公开摘要中并不充分，部署率也显著高于其他调查。", idea:"不要把是否上线当作成功指标，改测自动完成率、人工修改率、异常升级率、直接采纳率和每个合格结果成本。", url:"https://www.expresscomputer.in/news/86-of-enterprises-have-deployed-ai-agents-but-just-34-trust-them-forrester-study/136898/" },
  ],
  projectIdeas: [
    { title:"Exception-first Checker", description:"让 AI 只比较两类业务材料并定位可追溯的不一致，例如发票与合同、文本与 PII 规则、回答与证据。", tags:["异常优先", "证据定位", "Human-in-the-loop"] },
    { title:"Failure-to-Eval Loop", description:"把用户修改、拒绝和人工接管记录自动转为下一轮回归测试案例，让真实失败持续改善评估集。", tags:["Evaluation", "回归测试", "反馈闭环"] },
  ],
}, {
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
