---
name: knowledge-base-inbox-triage
description: 用于整理 [`knowledge-base-repo`](knowledge-base-repo) 的统一收件箱 [`00-index/inbox.md`](knowledge-base-repo/00-index/inbox.md)。触发提示词实例（用户在知识库目录下说出其中任意一句就应使用本 skill）：「整理知识库碎片」「整理知识库草稿」「收集知识库碎片」「整理收件箱」「把 inbox 提炼进正文」「分发收件箱草稿」「消化一下待整理的内容」。它负责把收件箱里按时间累积的草稿，去重、合并、按主题分发进正文对应章节，并清空已提炼的条目。仅服务于本仓库。
---

# Knowledge Base Inbox Triage（收件箱整理）

## 这个 skill 干什么

它是多会话沉淀流程的第二步。第一步由全局 skill `knowledge-base-deposit` 把各会话的草稿自动写进统一收件箱 [`00-index/inbox.md`](knowledge-base-repo/00-index/inbox.md)；本 skill 负责把收件箱里攒下来的草稿，提炼、分发进正文对应章节，再把已消化的条目从收件箱清掉。

一句话分工：

- `knowledge-base-deposit`：会话 → 收件箱（只追加，带时间戳）
- `knowledge-base-inbox-triage`（本 skill）：收件箱 → 正文（去重、合并、分发、清空）

## 规则继承

本 skill 只管「收件箱 → 正文」的搬运与提炼调度。具体的**表达规范、链接规范、代码分层、中文提交**等规则，统一遵守 [`.claude/knowledge-base-maintenance/SKILL.md`](knowledge-base-repo/.claude/knowledge-base-maintenance/SKILL.md)，本文件不重复抄写。重点记住那边几条：

- 优先补到已有文档，不随意新建散文件
- 通用名词（`requirements.txt`、`.venv` 等）只用代码样式，不乱加链接
- 连续代码用代码块，单个名词用行内代码
- 经验类内容整理成「场景 / 判断方式 / 推荐做法 / 常见误区」结构
- git 提交信息用中文

## 执行流程

命中本 skill 后，按顺序做：

### 1. 读出收件箱所有条目

读 [`00-index/inbox.md`](knowledge-base-repo/00-index/inbox.md)，列出当前所有草稿条目。每条以 `## [时间戳] 主题标题` 开头，按时间从上到下排列。

如果收件箱为空（只有骨架和占位说明），告诉用户「收件箱当前为空，没有要整理的」，结束。

### 2. 按主题分组、判断归宿

把条目按主题分组，对每组判断该并入哪个**已有正文文档**。常见映射：

- `zhinao-plan` 相关 → [`01-python/03-project-practice/zhinao-plan-request-flow.md`](knowledge-base-repo/01-python/03-project-practice/zhinao-plan-request-flow.md)
- `yy-auth` 相关 → `01-python/03-project-practice/` 下对应文档
- FastAPI / MySQL / Redis 等 → `01-python/02-web-backend/` 下对应文档
- Python 命令类 → `01-python/01-basics/common-commands.md`
- 术语类 → `01-python/glossary.md`
- Docker 相关 → `02-docker/` 下对应文档

判断不到合适的已有文档时，**先问用户**：归到哪篇、还是新建一个文档（新建要符合 maintenance skill 的「主题明显独立才新建」原则）。不要自己拍板乱建散文件。

如果一次要整理的条目很多、跨多个主题，可以先把分组结果和打算的归宿列给用户看一眼再动手。

### 3. 提炼并入正文

对同一主题的多条碎片：

- 去重：相同结论只留一条
- 合并：把分散在多条里的同一件事拼成完整的一段
- 按主线重组：用「自己的话」组织成正文该有的逻辑，而不是把草稿原样粘进去
- 并入目标文档的对应章节，遵守 maintenance skill 的表达与链接规则

草稿里的「待验证问题」如果还没结论，不要硬塞进正文当定论；可以保留在收件箱里等想清楚，或在正文里以明确的「待确认」措辞标注。

### 4. 清空已提炼的条目

已经并入正文的条目，从 [`00-index/inbox.md`](knowledge-base-repo/00-index/inbox.md) **删除**：

- 只删已消化的，尚未提炼的草稿保留在收件箱里
- 若全部提炼完，保留文件骨架（标题、说明引用块、格式示例、末尾占位说明），让它回到「当前为空」的状态，不要把整个文件删掉
- 删除时按 `## [时间戳]` 锚点定位，确保不误删别的条目

### 5. 汇报

明确告诉用户：

- 哪些条目（按时间戳/主题）被提炼了
- 分别并入了哪些真实文件
- 收件箱还剩几条没消化（如果有）
- 如果执行了 git commit：提交信息（中文）、所在分支、是否已推送

## 触发模糊或冲突时先问，不硬上

如果用户的触发提示词含糊，或可能命中别的 skill，不要凭猜测直接动正文，先把理解和疑问说出来让用户决断，确认后再做。常见需要先确认的情况：

- 说不清是要「整理整个收件箱」，还是只整理某一条 / 某个主题
- 像是想**直接补某篇正文**（这属于 `knowledge-base-maintenance` 的活），而不是从收件箱分发
- 某条草稿归到哪篇正文文档拿不准（按执行流程第 2 步，匹配不到合适文档时本来就要问用户）
- 收件箱为空或内容太碎，整理价值不大时，先告知现状再问要不要继续

## 快速自检清单

完成整理前检查：

- 是否优先并入了已有文档，而不是随手新建散文件
- 匹配不到归宿时，是否问了用户而非乱放
- 已提炼的条目是否都从收件箱删干净了，未消化的是否原样保留
- 收件箱若清空，是否保留了骨架而非删掉整个文件
- 表达、链接、提交是否遵守了 maintenance skill 的规则
- 是否明确告诉用户改了哪几个真实文件、收件箱剩多少条
