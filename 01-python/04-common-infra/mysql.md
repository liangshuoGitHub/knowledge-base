# MySQL 基础认知

## 这篇是干什么的

这篇不是教你一口气学完 MySQL，也不是数据库教材。

它主要解决的是：

**当前从前端转向 Python 后端时，先知道 MySQL 在项目里是干什么的、为什么总会看到它、代码里通常怎么碰到它。**

## 先说一句人话版

可以先把 [`MySQL`](./mysql.md) 理解成：

**后端长期存业务数据的大仓库。**

比如这些东西，一般都不会只放在内存里：
- 用户信息
- 角色
- 权限
- 组织结构
- 配置数据

这些都更适合存到关系型数据库里，而 [`MySQL`](./mysql.md) 就是最常见的一种。

## 在 [`yy-auth`](../../../../yy-auth) 这种项目里，它大概负责什么

像 [`yy-auth`](../../../../yy-auth) 这种认证与权限服务，天然就很依赖数据库。

因为它要管理的很多数据都具有这些特点：
- 要长期保存
- 结构比较稳定
- 表和表之间有关系
- 需要按条件查询
- 需要保证一致性

比如：
- 用户属于哪个组织
- 用户有哪些角色
- 角色对应哪些权限
- 某个第三方登录配置是什么

这类数据都更适合放在 [`MySQL`](./mysql.md) 里。

## 为什么代码里不总是直接写 SQL

前端刚看后端时，常会以为数据库操作就应该都是：
- `select ...`
- `insert ...`
- `update ...`

但在 Python 项目里，很多时候你先看到的不是 SQL，而是：
- [`SQLAlchemy`](../../yy-auth/requirements.txt)
- [`Session`](./mysql.md)
- [`Model`](./mysql.md)
- [`Column`](./mysql.md)

这是因为项目通常会通过 ORM 来操作数据库。

### 什么叫 ORM

ORM 可以先简单理解成：

**把数据库表和代码对象接起来的一层翻译器。**

这样做的好处是：
- 代码更结构化
- 表结构能在代码里表达
- 查询逻辑更容易复用
- 更贴合后端项目的工程化写法

## 在项目里，数据库连接是怎么流进业务代码的

今天你问到一个特别关键的问题：

为什么业务里常看到：
- [`self.session`](../../yy-auth/app/apis/user/service.py:185)

而不是每次都手动重新连一次数据库。

### 这个项目的路径是这样的

先在中间件里为当前请求准备数据库会话：
- [`request.state.db`](../../yy-auth/app/middlewares/mysql.py:10)

然后依赖函数把它取出来：
- [`def get_db(request: Request) -> Session:`](../../yy-auth/app/dependencies/db.py:5)
- [`return request.state.db`](../../yy-auth/app/dependencies/db.py:6)

再在接口层通过依赖注入拿到 `session`：
- [`session: Session = Depends(get_db)`](../../yy-auth/app/apis/user/views.py:204)

最后传给 service：
- [`service = UserService(session)`](../../yy-auth/app/apis/user/views.py:206)

而在 [`UserService.__init__()`](../../yy-auth/app/apis/user/service.py:184) 里，会把它挂到对象上：
- [`self.session = session`](../../yy-auth/app/apis/user/service.py:185)

所以后面业务代码里就能直接使用：
- [`self.session`](../../yy-auth/app/apis/user/service.py:185)

## 为什么 [`self.session`](../../yy-auth/app/apis/user/service.py:185) 看起来这么“自然”

因为它不是凭空来的，而是对象初始化时就已经注入进来了。

你可以把这件事类比成前端：
- 在 `constructor` 里把一个 API 客户端保存到 `this.api`
- 后面方法里统一用 `this.api`

Python 这里非常像：
- [`self.session`](../../yy-auth/app/apis/user/service.py:185) ≈ `this.session`

也就是说，它背后不是“数据库有特殊魔法”，而是：

**这个项目把数据库操作入口先传进对象，再统一通过对象属性来使用。**

## [`Session`](./mysql.md) 到底是什么

你可以先把 [`Session`](./mysql.md) 理解成：

**当前这次业务处理中可用的数据库操作入口。**

它通常负责这些事：
- 查询数据
- 新增数据
- 修改数据
- 删除数据
- 提交事务

所以看到：
- [`self.session.query(...)`](../../yy-auth/app/apis/user/providers/qihoo.py:44)

你可以直接理解成：
- “拿当前这个数据库会话去查数据”

## [`Model`](./mysql.md) 和 [`Column`](./mysql.md) 该怎么读

像 [`ProviderSSO`](../../yy-auth/app/apis/user/models.py:72) 这种类，就是 ORM 模型。

它本质上对应数据库中的一张表。

而像下面这句：
- [`name = Column(String(30), unique=True, comment='标识')`](../../yy-auth/app/apis/user/models.py:73)

可以拆成这样理解：
- `name`：字段名
- [`Column`](./mysql.md)：声明一列数据库字段
- `String(30)`：字符串类型，长度上限 30
- `unique=True`：这一列不能重复
- `comment='标识'`：这列的备注是“标识”

如果翻译成人话，就是：

**定义一列名为 `name` 的字符串字段，最长 30，值不能重复，注释叫“标识”。**

## 以后在项目里看到 MySQL 相关代码时，可以先抓哪几类东西

你不需要一上来把所有数据库代码都啃完。

先抓这几类就够了：
- 模型定义在哪
- [`Session`](./mysql.md) 从哪来
- 是哪个 service 在用 [`self.session`](../../yy-auth/app/apis/user/service.py:185)
- 查的是哪张表
- 改完数据后在哪提交

先把这条线认出来，后面再看细节就会轻松很多。

## 和 Redis 的区别要怎么记

今天另一个关键点是：
- MySQL 常通过 [`self.session`](../../yy-auth/app/apis/user/service.py:185) 使用
- Redis 常通过 [`get_redis()`](../../yy-auth/app/core/cache.py:36) 使用

这不是因为 MySQL 天生该这样、Redis 天生不该那样。

更准确地说：

**是这个项目对两种资源采用了不同封装方式。**

- MySQL：依赖注入后挂到对象上
- Redis：通过全局连接池和工具函数按需获取

这个区别一旦看懂，你后面读项目时就不容易把“项目写法”和“技术本质”混在一起。

## 当前一句话总结

**MySQL 在当前学习阶段不用先学成数据库专家，先把它理解成后端长期存业务数据的仓库，再看懂 [`Session`](./mysql.md)、[`Model`](./mysql.md)、[`Column`](./mysql.md)、[`self.session`](../../yy-auth/app/apis/user/service.py:185) 这几件事怎么在 [`yy-auth`](../../../../yy-auth) 里串起来，就已经非常够用了。**
