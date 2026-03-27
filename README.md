# 个人知识库

## 这是什么

这是一个以长期积累为目标的个人知识库。

它不是随手乱扔内容的文件夹，而是尽量往 一本书 的方向去长：
- 有总入口
- 有主题分层
- 有术语表
- 有项目实战记录
- 有临时笔记区
- 未来还能迁移到博客

当前第一批主题从 [`Python`](./01-python/README.md) 开始，后续会逐步扩展到：
- 前端开发
- RC 遥控车
- 路亚
- 以及其他持续积累的兴趣和能力主题

## 知识库原则

1. 聊天成果优先沉淀到已有文档，而不是到处新建散文件
2. 同一主题尽量持续补充到固定位置，让知识库越来越像一本书
3. 临时笔记和正式内容分开
4. 项目实战和基础知识并行积累
5. 尽量使用通俗、能记住、能复述的表达
6. 从一开始就考虑未来迁移到博客
7. 做链接时优先引用真实存在的文件，避免先写未来目录

## 当前目录

- [`README.md`](./README.md)
  - 知识库总入口
- [`01-python`](./01-python/README.md)
  - 第一个主题，聚焦 Python 学习、后端认知和公司项目实战

## 我怎么使用它

### 日常积累

你可以把它理解成三层：
- 原始积累：零碎想法、外部资料、聊天结论
- 整理沉淀：按主题写成正式笔记
- 输出发布：未来迁移到博客

### 你可以怎么命令我

后续可以直接这样说：
- 把今天关于 [`yy-auth`](../yy-auth) 的内容补进知识库
- 把 [`FastAPI`](../yy-auth/requirements.txt) 的解释补到 Python Web 那一节
- 把这些名词读法整理到 [`glossary.md`](./01-python/glossary.md)
- 给 [`yy-auth`](../yy-auth) 这一节补一张 Mermaid 图
- 把这段内容补到 [`common-commands.md`](./01-python/01-basics/common-commands.md)

### 我自己补充时怎么做

你可以直接改 Markdown 文件。

如果一时还没想好放哪，建议先补到最接近主题的现有文档里，比如：
- Python 命令类内容放到 [`common-commands.md`](./01-python/01-basics/common-commands.md)
- 术语类内容放到 [`glossary.md`](./01-python/glossary.md)
- 项目理解类内容放到 [`yy-auth-overview.md`](./01-python/03-project-practice/yy-auth-overview.md)

后续再让我帮你整理归位。

## 未来方向

这个知识库未来会优先保持：
- Markdown 为主
- Mermaid 图辅助
- 目录稳定
- 文件命名清晰
- 适合迁移到博客系统

等内容积累起来后，可以迁移到：
- VitePress
- VuePress
- Docusaurus
- Astro

到那时，知识库是内容源，博客是展示层。
