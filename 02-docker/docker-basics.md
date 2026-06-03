# Docker 基础认知

## 这篇是干什么的

这篇不是为了把 Docker 讲成官方文档。

它的目标更直接：

- 先让我搞清楚几个最常见的词
- 看到命令时知道自己大概在干什么
- 在真实项目里遇到问题时，不至于完全没抓手

## 先说一句人话

Docker 可以先理解成：

**把项目运行所需要的环境和应用本身，一起放进一个相对隔离的运行盒子里。**

这对前端接手后端项目特别有用，因为很多时候你卡住的不是代码本身，而是：

- Python 版本不对
- 本机依赖装不上
- 系统库缺失
- 别人的项目在你电脑上跑不起来

而 Docker 的核心价值之一，就是尽量减少“每个人电脑环境都不一样”带来的问题。

## 最常见的几个词

### Docker Desktop 是什么

Docker Desktop 可以先理解成：

**你电脑上用来运行 Docker 的桌面软件。**

在 macOS 上，通常先安装 Docker Desktop，之后终端里才会有 `docker` 命令可用。

### `docker` 是什么

`docker` 是命令行工具本体。

你在终端里输入：

```bash
docker --version
```

就是在调用它。

### 镜像是什么

镜像可以先理解成：

**一个已经准备好的运行模板。**

里面通常包含：

- 基础操作系统环境
- 运行时
- 依赖包
- 项目代码
- 启动方式

你可以把镜像粗略理解成“可复用的项目运行快照”。

### 容器是什么

容器可以先理解成：

**镜像真正跑起来后的实例。**

也就是说：

- 镜像更像模板
- 容器更像正在运行的实际进程

### `docker compose` 是什么

`docker compose` 可以先理解成：

**按项目配置批量管理服务的工具。**

它会读取项目里的 `docker-compose.yml`，按照里面写好的规则去：

- 创建容器
- 启动容器
- 停止容器
- 重建容器
- 配置端口、环境变量、挂载目录

如果说 `docker` 更偏底层单兵操作，`docker compose` 更像“按项目清单来启动整个应用”。

## 最常见的几个命令

### 查看 Docker 版本

```bash
docker --version
docker compose version
```

### 查看正在运行的容器

```bash
docker ps
```

### 查看所有容器

```bash
docker ps -a
```

这里的 `-a` 是 `all`，表示看全部，包括：

- 正在运行的
- 已经停止的
- 退出失败的

### 启动 Compose 项目

```bash
docker compose up -d
```

这里的 `-d` 是 `detached`，表示后台运行。

### 停止并删除 Compose 项目相关资源

```bash
docker compose down
```

### 查看容器日志

```bash
docker logs 容器名
```

比如：

```bash
docker logs zn_plan
```

### 强制删除容器

```bash
docker rm -f 容器名
```

这里的 `-f` 是 `force`，表示强制：

- 如果容器还在运行，就先停掉
- 然后再删除

## `docker compose up`、`docker stop`、`docker compose down` 的区别

### `docker compose up -d`

它不一定每次都新建容器。

通常是：

- 没有容器时，创建并启动
- 容器已存在但停止了，直接启动
- 配置或镜像变化明显时，可能重建

### `docker stop`

```bash
docker stop 容器名
```

这个命令是：

**只停止容器，但不删除容器本身。**

### `docker compose down`

这个命令更彻底。

通常会：

- 停止 Compose 创建的容器
- 删除 Compose 创建的容器
- 删除 Compose 创建的网络

默认通常不会删除镜像，也不会动挂载卷里的持久化数据。

## 为什么有时候会看到多个容器

如果你只是反复执行 `docker compose up -d`，一般不会无脑长出一堆同名容器。

但如果你执行了：

```bash
docker compose run ...
```

它可能会额外起一个临时容器来执行一次性命令，所以你会看到新的容器。

这类容器往往不是正式服务容器，而是排查、调试、一次性执行任务时用的。

## 端口映射怎么理解

比如你看到这样的配置：

```yaml
ports:
  - 8829:6969
```

可以先理解成：

- 容器里程序监听 `6969`
- 你本机通过 `8829` 去访问它

所以浏览器访问地址通常会是：

```text
http://localhost:8829
```

## 一句话总结

现阶段先记住这几句就够用：

- Docker Desktop 是桌面运行环境
- `docker` 是命令行工具
- 镜像是模板
- 容器是模板跑起来后的实例
- `docker compose` 是按项目配置批量管理服务
- `docker ps` 看运行中的容器
- `docker ps -a` 看全部容器
- `docker rm -f` 里的 `-f` 是强制删除
