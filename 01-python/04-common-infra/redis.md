# Redis 基础认知

## 这篇是干什么的

这篇不是要把 Redis 所有数据结构一次讲完。

它更关注一个现实目标：

**从当前 Python 后端学习阶段出发，先搞清楚 Redis 是什么、为什么项目里老能碰见它、它和 MySQL 在角色上有什么不同。**

## 先说一句人话版

可以先把 [`Redis`](./redis.md) 理解成：

**后端里专门放高频临时数据的高速缓存仓库。**

它和 [`MySQL`](./mysql.md) 最大的直觉差异可以先这么记：
- [`MySQL`](./mysql.md)：更像长期仓库
- [`Redis`](./redis.md)：更像高速临时仓库

## 为什么后端项目里经常会有 Redis

因为后端不是所有数据都适合直接进数据库。

有些数据的特点是：
- 访问特别频繁
- 存得不一定久
- 更强调读写速度
- 更偏临时状态

例如：
- 验证码
- 登录态
- token 相关数据
- 某些短期缓存结果
- 防刷或限流相关状态

这些场景就很适合 Redis。

## 在 [`yy-auth`](../../../../yy-auth) 这种项目里，它为什么合理

[`yy-auth`](../../../../yy-auth) 是认证与权限相关服务。

这类服务天然容易碰到很多“高频但不一定长期存档”的数据，比如：
- 登录过程中的临时状态
- token 或 sid 相关数据
- 一些快速校验需要的缓存内容

所以项目里既有 [`MySQL`](./mysql.md)，也有 [`Redis`](./redis.md)，其实非常正常。

它们不是互相替代，而是分工不同。

## 这个项目里 Redis 是怎么被拿到的

你今天问到的一个很关键的问题是：

为什么数据库经常看到：
- [`self.session`](../../yy-auth/app/apis/user/service.py:185)

而 Redis 经常看到：
- [`get_redis()`](../../yy-auth/app/core/cache.py:36)

### Redis 这条线是这样的

项目会先初始化连接池：
- [`init_cache()`](../../yy-auth/app/core/cache.py:11)
- [`_pool = redis.ConnectionPool(...)`](../../yy-auth/app/core/cache.py:22)

然后提供一个获取客户端的函数：
- [`def get_redis(db=None):`](../../yy-auth/app/core/cache.py:36)
- [`return redis.Redis(connection_pool=_pool, db=db if db is not None else _default_db)`](../../yy-auth/app/core/cache.py:45)

所以业务里常见写法是：
- [`rds = get_redis()`](../../yy-auth/app/apis/user/service.py:145)

也就是说，这个项目更偏向：

**Redis 用的时候现拿，而不是在每个 service 初始化时都挂成对象属性。**

## 这和 [`self.session`](../../yy-auth/app/apis/user/service.py:185) 的差异该怎么理解

最容易记住的一句话是：

**这不是技术本质不同，而是项目封装方式不同。**

### 当前项目里的差异
- MySQL：通过依赖注入传进 service，再变成 [`self.session`](../../yy-auth/app/apis/user/service.py:185)
- Redis：通过连接池 + [`get_redis()`](../../yy-auth/app/core/cache.py:36) 按需获取

### 用前端视角类比

可以类比成两种写法：

#### 写法 A：初始化时挂到对象上
- `this.api = apiClient`
- 后面统一 `this.api.xxx()`

这更像：
- [`self.session`](../../yy-auth/app/apis/user/service.py:185)

#### 写法 B：需要时调用工具函数获取
- `const client = getStorageClient()`
- 用完就处理当前逻辑

这更像：
- [`get_redis()`](../../yy-auth/app/core/cache.py:36)

## Redis 专题当前最值得先记住什么

现阶段你不需要一口气背很多命令或底层机制。

先记住下面这些就很够用：
- 它是内存型存储，速度快
- 它常用来放高频、临时、缓存型数据
- 它不等于 MySQL，也不主要负责长期结构化业务数据
- 在当前项目里，它常通过 [`get_redis()`](../../yy-auth/app/core/cache.py:36) 获取客户端

## 以后如果继续扩这篇，可以往哪长

后续如果你继续接触到更多 Redis 内容，这篇可以继续往下长：
- 常见数据类型
- set / get 的直观理解
- 过期时间 TTL
- 验证码缓存示例
- 登录态缓存示例
- 分布式锁、限流等更进阶场景

但这些都可以后补，当前不急。

## 当前一句话总结

**Redis 在当前阶段先理解成“后端里存高频临时数据的高速缓存仓库”就够了；在 [`yy-auth`](../../../../yy-auth) 里，它通常不是像 MySQL 那样通过 [`self.session`](../../yy-auth/app/apis/user/service.py:185) 注入到对象里，而是通过 [`get_redis()`](../../yy-auth/app/core/cache.py:36) 按需获取。**
