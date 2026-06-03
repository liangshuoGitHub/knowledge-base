# Docker 主题总览

## 这一部分是干什么的

这一部分用来沉淀我在真实项目里接触 Docker 时形成的理解。

它不追求一上来把 Docker 讲全，而是优先解决这些更实际的问题：

- Docker 到底是干什么的
- Docker Desktop、`docker`、`docker compose` 分别是什么
- 我为什么能用 Docker 跑项目，但本机不一定要装一堆依赖
- 容器、镜像、端口映射、环境变量这些词该怎么理解
- 遇到项目跑不起来时，应该先看哪里

## 当前定位

这一部分会更偏：

- 面向前端的 Docker 入门
- 面向真实项目的排障过程
- 和 Python/FastAPI 项目结合起来理解

也就是说，这不是纯 Docker 教科书，而是：

**从“我要把一个后端项目跑起来”这个真实场景出发，慢慢建立 Docker 直觉。**

## 当前目录

- [`docker-basics.md`](./docker-basics.md)
  - Docker、Docker Desktop、镜像、容器、Compose、常见命令
- [`docker-with-python-projects.md`](./docker-with-python-projects.md)
  - 结合 Python/FastAPI 项目理解 Docker 的实际作用
- [`docker-troubleshooting-notes.md`](./docker-troubleshooting-notes.md)
  - 这次 `zhinao-plan` 排障过程的沉淀

## 推荐阅读顺序

1. [`docker-basics.md`](./docker-basics.md)
2. [`docker-with-python-projects.md`](./docker-with-python-projects.md)
3. [`docker-troubleshooting-notes.md`](./docker-troubleshooting-notes.md)

## 一句话先记住

**Docker 可以先理解成：把项目运行环境连同应用一起装进一个相对隔离的盒子里运行。**

对于前端接手 Python 后端项目时，它最大的价值通常不是“学会容器技术本身”，而是：

**先把项目跑起来，再在运行过程中理解它。**
