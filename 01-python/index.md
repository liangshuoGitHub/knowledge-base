# Python 主题总览

## 这一部分是干什么的

这一部分是整个知识库里的第一本“小书”。

它的任务不是把 Python 所有知识都讲完，而是围绕一个更实际的目标展开：

**从前端工程师视角，逐步建立 Python 使用能力、后端理解能力，以及面向真实项目的实战认知。**

说得再直白一点：
不是为了背语法装懂，而是为了以后真遇到 Python 项目时，不发懵，能看、能改、能慢慢接得住。

## 当前学习定位

当前学习主线是：
- 先建立后端视角
- 再补最小语法集合
- 再熟悉命令与环境
- 再理解高频名词和 Web 后端基础
- 再进入真实项目
- 再逐步形成小规模实战能力

当前第一站，围绕公司项目 [`yy-auth`](../../yy-auth) 来认识 Python Web 后端。

## 当前目录

- [`learning-map.md`](./learning-map.md)
  - Python 主题的学习路径图
- [`glossary.md`](./glossary.md)
  - 术语表、怎么读、是什么意思、为什么会出现
- [`update-rules.md`](./update-rules.md)
  - 从人的视角说明这一主题后续怎么补、怎么整理
- [`01-basics/backend-thinking.md`](./01-basics/backend-thinking.md)
  - 前端转后端时最先该建立的思维方式
- [`01-basics/python-syntax-for-frontend.md`](./01-basics/python-syntax-for-frontend.md)
  - 面向项目阅读的最小 Python 语法集合
- [`01-basics/common-commands.md`](./01-basics/common-commands.md)
  - Python 常用命令、环境管理与少量高频语法切片
- [`02-web-backend/fastapi-basics.md`](./02-web-backend/fastapi-basics.md)
  - Python Web 后端核心概念
- [`02-web-backend/mysql-basics.md`](./02-web-backend/mysql-basics.md)
  - MySQL 在 Python 后端里的基础认知与项目内常见用法
- [`02-web-backend/redis-basics.md`](./02-web-backend/redis-basics.md)
  - Redis 在 Python 后端里的基础认知与项目内常见用法
- [`03-project-practice/yy-auth-overview.md`](./03-project-practice/yy-auth-overview.md)
  - 结合公司真实项目的实战认知
- [`03-project-practice/yy-auth-request-flow.md`](./03-project-practice/yy-auth-request-flow.md)
  - 用真实请求链路建立项目阅读感觉

## 我应该怎么读这一部分

推荐顺序：

1. 先看 [`learning-map.md`](./learning-map.md)
   - 建立整体方向感
2. 再看 [`glossary.md`](./glossary.md)
   - 先把常见名词混个脸熟
3. 再看 [`01-basics/backend-thinking.md`](./01-basics/backend-thinking.md)
   - 先把观察系统的角度从前端切到后端
4. 再看 [`01-basics/python-syntax-for-frontend.md`](./01-basics/python-syntax-for-frontend.md)
   - 先补够项目阅读用的最小语法集合
5. 再看 [`01-basics/common-commands.md`](./01-basics/common-commands.md)
   - 解决环境、依赖、启动和高频命令问题
6. 然后看 [`02-web-backend/fastapi-basics.md`](./02-web-backend/fastapi-basics.md)
   - 理解 Python 在后端里是怎么组织接口的
7. 再看 [`02-web-backend/mysql-basics.md`](./02-web-backend/mysql-basics.md) 和 [`02-web-backend/redis-basics.md`](./02-web-backend/redis-basics.md)
   - 建立数据与缓存的基础分工认知
8. 再进入 [`03-project-practice/yy-auth-overview.md`](./03-project-practice/yy-auth-overview.md)
   - 结合 [`yy-auth`](../../yy-auth) 建立项目整体地图
9. 最后看 [`03-project-practice/yy-auth-request-flow.md`](./03-project-practice/yy-auth-request-flow.md)
   - 跟懂一条真实请求链路

## 这一部分的写作原则

这一部分会尽量保持这些特点：
- 通俗易懂
- 尽量讲人话
- 必要时用一些比较“俗”的说法帮记忆
- 尽量把抽象词和真实项目联系起来
- 不追求教科书式完整，优先追求能懂、能记、能用

## 当前提醒

如果以后看 Python 项目时心里冒出这种感觉：
- 这玩意怎么这么多词
- 这名字怎么还不会读
- 我是不是基础太差了

先别慌。

这很正常。

很多时候不是你差，而是后端项目本来就更容易一上来给人“词多、层多、配置多”的感觉。

这个主题的存在，就是为了把这些东西一个一个拆开，拆到你能消化为止。
