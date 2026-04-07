---
layout: home

hero:
  name: 个人知识库
  text: 简洁、结构化、可持续演进的技术知识系统
  tagline: 从前端工程实践出发，逐步沉淀 Python、后端认知与真实项目阅读能力。
  actions:
    - theme: brand
      text: 进入 Python 专题
      link: /01-python/
    - theme: alt
      text: 查看学习地图
      link: /01-python/learning-map
    - theme: alt
      text: 快速开始
      link: /#quick-start

features:
  - title: Structured Knowledge
    details: 不是零散笔记堆积，而是按主题、层级、阅读路径组织的长期知识库。
  - title: Project-Driven Learning
    details: 结合 [`yy-auth`](./01-python/03-project-practice/yy-auth-overview.md) 等真实项目建立后端直觉，而不是只背概念。
  - title: Browser-Native Reading
    details: 通过 [`VitePress`](https://vitepress.dev/) 本地访问，获得更稳定的目录、导航、搜索和阅读体验。
---

## Overview

这不是一个“把 Markdown 文件放在仓库里”的目录集合。

它更接近一个持续演进的技术文档站：
- 有明确的主题入口
- 有分层结构
- 有稳定导航
- 有阅读顺序
- 有面向未来扩展的空间

当前第一阶段聚焦 [`Python`](./01-python/index.md)，目标不是一次性学全，而是建立一种更稳的能力增长方式：

> 从前端工程视角切入，逐步获得 Python 使用能力、后端理解能力，以及面向真实业务项目的分析能力。

## Architecture

### 内容层
- [`knowledge-base-repo/README.md`](./README.md)
- [`knowledge-base-repo/01-python/index.md`](./01-python/index.md)
- [`knowledge-base-repo/01-python/glossary.md`](./01-python/glossary.md)
- [`knowledge-base-repo/01-python/learning-map.md`](./01-python/learning-map.md)

### 展示层
- [`VitePress`](https://vitepress.dev/)
- 站点配置文件：`.vitepress/config.mts`
- 本地搜索、侧边栏、导航、页面目录

### 实战层
- [`yy-auth 项目整体认知`](./01-python/03-project-practice/yy-auth-overview.md)
- [`yy-auth 请求链路初识`](./01-python/03-project-practice/yy-auth-request-flow.md)
- 从真实服务入口、路由、中间件、接口处理到请求链路的逐步理解

## Current Modules

### Python Foundation
- [`Python 主题总览`](./01-python/index.md)
- [`Python 学习地图`](./01-python/learning-map.md)
- [`Python 术语表`](./01-python/glossary.md)
- [`Python 主题维护规则`](./01-python/update-rules.md)（面向人阅读的主题维护说明）

### Practical Backend Entry
- [`Python 常用命令`](./01-python/01-basics/common-commands.md)
- [`FastAPI 基础认知`](./01-python/02-web-backend/fastapi-basics.md)
- [`MySQL 基础认知`](./01-python/02-web-backend/mysql-basics.md)
- [`Redis 基础认知`](./01-python/02-web-backend/redis-basics.md)

### Real Project Practice
- [`yy-auth 项目整体认知`](./01-python/03-project-practice/yy-auth-overview.md)
- [`yy-auth 请求链路初识`](./01-python/03-project-practice/yy-auth-request-flow.md)

## Reading Path

如果想按最稳的顺序进入，推荐这样读：

1. [`Python 主题总览`](./01-python/index.md)
2. [`Python 学习地图`](./01-python/learning-map.md)
3. [`Python 术语表`](./01-python/glossary.md)
4. [`Python 常用命令`](./01-python/01-basics/common-commands.md)
5. [`FastAPI 基础认知`](./01-python/02-web-backend/fastapi-basics.md)
6. [`yy-auth 项目整体认知`](./01-python/03-project-practice/yy-auth-overview.md)
7. [`yy-auth 请求链路初识`](./01-python/03-project-practice/yy-auth-request-flow.md)

## Quick Start

### 本地运行

```bash
npm install
npm run docs:dev
```

### 本地构建

```bash
npm run docs:build
```

启动后，通过浏览器访问本地地址即可查看最新内容，而不需要在编辑器文件树里逐篇打开。

## Design Principles

- 内容优先沉淀到稳定位置
- 结构优先于碎片堆积
- 基础理解和项目实战并行推进
- 尽量用自己的话写出未来还能继续接得上的知识
- 知识库作为内容源，文档站作为展示层

## Next Expansion

后续可以继续扩展的方向包括：
- Python 技术栈拆解
- 更细的项目模块理解
- 小规模 Python 实战
- 前端专题
- 其他长期积累主题
