# FastAPI 基础认知

## 这篇是干什么的

这一篇不是为了把 [`FastAPI`](../../../yy-auth/requirements.txt) 讲成官方文档。

它的目标更实际：
- 让我先知道它到底是干啥的
- 让我看到项目里相关代码时不发懵
- 让我能把它和自己熟悉的前端思维对应起来

## 先说一句人话

[`FastAPI`](../../../yy-auth/requirements.txt) 可以先理解成：

**一个用 Python 写后端接口的框架。**

如果类比前端：
- 前端用 [`Vue`](../../../ai-app-component-basic/src/main.ts) / [`React`](https://react.dev/) 组织页面
- 后端用 [`FastAPI`](../../../yy-auth/requirements.txt) 组织接口

它帮你处理的事情包括：
- 路由怎么写
- 请求参数怎么接
- 参数怎么校验
- 返回结果怎么组织
- 中间件怎么挂
- 异常怎么处理

## 为什么它会出现在 [`yy-auth`](../../../yy-auth)

因为 [`yy-auth`](../../../yy-auth) 本质就是一个 Web 后端服务。

它要做很多接口，比如：
- 登录
- 注销
- 获取当前用户
- 权限树
- 角色管理

这些接口都需要一个框架来承载，而它用的就是 [`FastAPI`](../../../yy-auth/requirements.txt)。

在 [`app/main.py`](../../../yy-auth/app/main.py:21) 能看到：
- [`class Application(FastAPI)`](../../../yy-auth/app/main.py:21)

这就说明整个应用就是构建在 [`FastAPI`](../../../yy-auth/app/main.py:21) 之上的。

## 我可以怎么类比它

### 类比 1：前端框架里的“应用骨架”
你可以把 [`FastAPI`](../../../yy-auth/requirements.txt) 理解成后端里的应用骨架。

前端里你会关心：
- 页面路由怎么组织
- 组件怎么拆
- 状态怎么传

后端里则会关心：
- 接口路由怎么组织
- 请求参数怎么校验
- 中间件怎么串
- 返回结果怎么规范化

### 类比 2：后端接口世界里的总指挥
如果没有框架，后端就得自己处理很多底层事情。
用了 [`FastAPI`](../../../yy-auth/requirements.txt) 后，相当于很多规则和基本能力都被它接管了。

## 在项目里它通常长什么样

### 1. 应用入口
在 [`yy-auth/app/main.py`](../../../yy-auth/app/main.py) 里：
- 定义应用对象
- 注册异常处理
- 注册中间件
- 注册路由

这是最顶层。

### 2. 路由定义
在 [`yy-auth/app/apis/user/views.py`](../../../yy-auth/app/apis/user/views.py) 这种文件里，会出现：
- [`@router.get(...)`](../../../yy-auth/app/apis/user/views.py:25)
- [`@router.post(...)`](../../../yy-auth/app/apis/user/views.py:44)
- [`@router.put(...)`](../../../yy-auth/app/apis/user/views.py:131)
- [`@router.delete(...)`](../../../yy-auth/app/apis/user/views.py:155)

这些就是在定义接口。

### 3. 参数和依赖
你还会看到：
- [`Request`](../../../yy-auth/app/apis/user/views.py:5)
- [`Depends`](../../../yy-auth/app/apis/user/views.py:5)
- [`Body`](../../../yy-auth/app/apis/user/views.py:5)

这些都属于 [`FastAPI`](../../../yy-auth/requirements.txt) 常用能力。

## 它最值得我现在理解的几个点

### 路由
比如：
- [`@router.post('/user/login')`](../../../yy-auth/app/apis/user/views.py:44)

这行就表示定义了一个 POST 登录接口。

前端类比：
这有点像页面路由，但这里不是页面地址，而是接口地址。

### 依赖注入
比如：
- [`session: Session = Depends(get_db)`](../../../yy-auth/app/apis/user/views.py:48)

这个概念一开始看着有点抽，但可以先粗暴理解成：

**需要什么资源，就让框架帮你准备好塞进来。**

这里要的是数据库 session，所以就通过 [`Depends(get_db)`](../../../yy-auth/app/apis/user/views.py:48) 注入。

### 请求对象
比如：
- [`request: Request`](../../../yy-auth/app/apis/user/views.py:46)

这个对象里能拿很多请求相关的信息，比如：
- 请求头
- host
- 当前用户上下文
- URL 信息

### 异常处理
在 [`yy-auth/app/main.py`](../../../yy-auth/app/main.py) 里能看到：
- [`@app.exception_handler(...)`](../../../yy-auth/app/main.py:56)

这说明项目把一部分错误处理统一挂到了应用层。

可以理解成：
**不是每个接口自己乱报错，而是尽量有统一出口。**

### 中间件
在 [`yy-auth/app/main.py`](../../../yy-auth/app/main.py:41) 往下能看到：
- JWT 中间件
- IAM 中间件
- MySQL 中间件
- CORS 中间件

可以先把中间件理解成：
**请求真正进入接口逻辑前，要先经过的几道关卡。**

## 为什么很多人觉得它“高级”

其实不一定是它难，而是它把很多东西都组织得比较现代：
- 类型标注
- 参数校验
- 自动文档
- 依赖注入
- 异步支持

如果第一次看，很容易觉得词多、符号多、花样多。

但站在现在这个阶段，不用一下全懂。

先记住：
**它就是后端写接口的主框架。**

## 当前最值得记住的一句话

**[`FastAPI`](../../../yy-auth/requirements.txt) 的作用，就是把 Python 代码组织成一个结构清楚、能对外提供接口的后端服务。**

## 现阶段不要钻太深的点

当前先不用死磕这些：
- 异步到底怎么回事
- 依赖注入底层怎么实现
- 自动 OpenAPI 文档原理
- 生命周期细节

这些后面都会接触到。

现阶段更重要的是：
- 看到它别怕
- 知道它在项目里负责啥
- 能认出常见写法
- 能把它和真实接口联系起来

## 当前一句话类比

**前端里，框架帮你把页面组织起来；后端里，[`FastAPI`](../../../yy-auth/requirements.txt) 帮你把接口世界组织起来。**
