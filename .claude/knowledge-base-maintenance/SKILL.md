---
name: knowledge-base-maintenance
description: 用于维护 [`knowledge-base-repo`](knowledge-base-repo) 的项目级 skill。只要用户提出“补充知识库”“整理知识库文档”“沉淀聊天结论到知识库”“修改知识库笔记”“提交或推送知识库改动”等与 [`knowledge-base-repo`](knowledge-base-repo) 相关的任务，就应主动使用这个 skill。尤其当任务涉及 Markdown 文档更新、主题结构调整、文档归档、Git 提交或推送时，必须使用本 skill，并遵守中文提交、链接克制和优先补已有文档等规则。
---

# Knowledge Base Maintenance

## 这个 skill 的定位

这个 skill 服务于 [`knowledge-base-repo`](knowledge-base-repo) 本身。

它不是某一篇具体知识内容，而是“维护知识库时应遵守的执行规则”。

它的目标是让知识库随着内容变多，仍然保持：
- 结构稳定
- 表达统一
- 提交规范一致
- 文档越来越像一本持续生长的书，而不是越积越乱的 Markdown 集合

## 何时必须使用

当任务满足下面任一情况时，应主动命中本 skill：
- 把聊天内容沉淀进 [`knowledge-base-repo`](knowledge-base-repo)
- 修改知识库里的 Markdown 文档
- 新增、整理、迁移主题内容
- 调整知识库目录、导航、主题结构
- 提交或推送 [`knowledge-base-repo`](knowledge-base-repo) 的改动

## 核心维护规则

### 1. 优先补到已有文档，不随意新建散文件
如果当前内容能自然放进现有文档，优先更新已有文档。

只有在主题明显独立、已有文档无法自然承接时，才考虑新建文件。

目标是让知识库越来越像一本结构化的书，而不是不断横向长出零碎页面。

### 2. 文档内容优先用中文表达，并尽量写成“自己的话”
知识库内容优先使用简体中文，表达要尽量：
- 清楚
- 直白
- 方便未来回看
- 能复述

不要把内容写成只依赖当前聊天上下文才能看懂的临时记录。

### 3. Git 提交信息必须使用中文
只要任务涉及对 [`knowledge-base-repo`](knowledge-base-repo) 执行 Git 提交：
- commit message 必须是中文
- 应使用简洁、明确、可复盘的表达
- 除非用户明确要求，否则不要使用英文提交信息

推荐示例：
- `补充 Python 虚拟环境操作说明`
- `整理 Python 主题维护规则`
- `更新知识库首页导航`

反例：
- `docs: update python environment notes`
- `fix docs`
- `update knowledge base`

### 4. 链接只用于真实且需要跳转的文件
在 Markdown 中处理文件名、目录名、命令参数时，要克制使用链接。

#### 默认只用代码样式，不加链接的内容
- 通用文件名，如 `requirements.txt`
- 通用目录名，如 `.venv`、`venv`
- 环境名、变量名、命令参数、示例路径
- 只是用于说明概念、不需要跳转的名称

#### 只有这些场景才加链接
- 需要明确指向仓库中真实存在的文件
- 用户阅读时确实需要点击跳转
- 导航页、索引页、交叉引用页需要建立文档间路径

例如：
- [`knowledge-base-repo/README.md`](knowledge-base-repo/README.md)
- [`knowledge-base-repo/01-python/index.md`](knowledge-base-repo/01-python/index.md)

不要为了形式统一，把所有文件名都写成链接。

### 5. 经验总结优先整理成可复用结构
如果新增内容是经验、流程、判断标准，优先整理成：
- 场景
- 判断方式
- 推荐做法
- 常见误区

不要只堆零散结论。

### 6. 主题页与维护规则页分工不同
如果某个主题下存在维护规则页面，例如 [`knowledge-base-repo/01-python/update-rules.md`](knowledge-base-repo/01-python/update-rules.md)，要遵守“收敛而不是删除”的原则：
- AI 执行约束优先沉淀到本 skill
- 面向人阅读的主题维护说明保留在文档页中
- 避免两边大段重复
- 保留页面的人类阅读价值，而不是把所有内容都塞进 skill

## 执行步骤

命中本 skill 后，按这个顺序思考：

1. 先判断新内容最适合归入哪个已有文档
2. 如果涉及主题维护说明，区分“给 AI 的规则”和“给人看的说明”
3. 修改 Markdown 时遵守“通用名词不乱加链接”的规则
4. 如果涉及 Git 提交，提交信息必须改成中文
5. 汇报结果时，明确指出实际修改了哪些文件

## 输出要求

### 文档更新说明
向用户汇报时，应明确列出实际修改文件，例如：
- 已更新 [`knowledge-base-repo/01-python/01-basics/common-commands.md`](knowledge-base-repo/01-python/01-basics/common-commands.md)
- 已更新 [`knowledge-base-repo/01-python/update-rules.md`](knowledge-base-repo/01-python/update-rules.md)

### 提交说明
如果已提交或推送，应明确说明：
- 提交信息
- 所在分支
- 是否已推送

## 快速自检清单

在完成 [`knowledge-base-repo`](knowledge-base-repo) 相关任务前，检查：
- 是否优先补到了已有文档
- 是否把只属于 AI 的执行约束写进了 skill，而不是全部塞进主题页面
- 是否避免给 `requirements.txt`、`.venv` 这类通用名词乱加链接
- 如果执行了 Git commit，提交信息是否为中文
- 是否明确告诉用户修改了哪几个真实文件
