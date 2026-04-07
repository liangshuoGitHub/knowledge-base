# Python 术语表

## 这一页是干什么的

这一页专门记录高频词，解决 3 件事：
- 看到词别慌
- 知道大概怎么读
- 知道它是干啥的、为啥会在项目里出现

这页不是追求百科全书式完整，而是优先记录：
- 当前真的碰到的
- 当前真的会影响理解项目的
- 当前真的容易卡住我的

## 当前术语

---

### [`FastAPI`](../../yy-auth/requirements.txt)
- 常见读法：发斯特 A P I
- 它是干什么的：一个用来写后端接口的 Python Web 框架
- 为什么会出现在这里：[`yy-auth`](../../yy-auth) 本质上就是一个接口服务，要靠它来组织路由、请求、返回和依赖注入
- 当前可以怎么记：**快速写 API 的框架**

---

### [`uvicorn`](../../yy-auth/requirements.txt)
- 常见读法：优维康
- 它是干什么的：运行 Python Web 服务的服务器程序，开发阶段很常见
- 为什么会出现在这里：写完 [`FastAPI`](../../yy-auth/requirements.txt) 还得有人把服务跑起来，本地开发时常用它
- 当前可以怎么记：**把接口服务跑起来的开发服务器**

---

### [`gunicorn`](../../yy-auth/requirements.txt)
- 常见读法：古尼康
- 它是干什么的：更偏生产环境的服务启动器 / 进程管理器
- 为什么会出现在这里：[`yy-auth`](../../yy-auth) 这种企业服务不是只给本地玩，正式部署时会更偏向用它来托管服务进程
- 当前可以怎么记：**线上更稳的启动方式**

---

### [`pydantic`](../../yy-auth/requirements.txt)
- 常见读法：派丹提克
- 它是干什么的：做数据结构定义和参数校验
- 为什么会出现在这里：后端接口不能啥都乱收，参数要先校验，类型要先管住
- 当前可以怎么记：**后端里的类型检查和参数质检员**

---

### [`dynaconf`](../../yy-auth/requirements.txt)
- 常见读法：代纳康夫
- 它是干什么的：配置管理工具
- 为什么会出现在这里：后端服务通常有很多环境配置，像数据库地址、缓存地址、接口地址这些都不能写死
- 当前可以怎么记：**专门管配置的工具**

---

### [`SQLAlchemy`](../../yy-auth/requirements.txt)
- 常见读法：S Q L 炼金术 / sequel alchemy
- 它是干什么的：数据库 ORM / 数据访问工具
- 为什么会出现在这里：[`yy-auth`](../../yy-auth) 要频繁操作用户、权限、组织等数据，需要更规范地访问数据库
- 当前可以怎么记：**把数据库表变成代码对象的炼金术**

---

### [`mysqlclient`](../../yy-auth/requirements.txt)
- 常见读法：麦 sequel 克莱恩特
- 它是干什么的：Python 连接 MySQL 的底层驱动
- 为什么会出现在这里：上层就算用了 [`SQLAlchemy`](../../yy-auth/requirements.txt)，底层也得有人真正去连 MySQL
- 当前可以怎么记：**Python 跟 MySQL 真正通话的底层连接器**

---

### [`MySQL`](./02-web-backend/mysql-basics.md)
- 常见读法：麦 sequel
- 它是干什么的：常见的关系型数据库
- 为什么会出现在这里：像 [`yy-auth`](../../yy-auth) 这种认证与权限服务，需要长期保存用户、角色、权限、组织等结构化数据
- 当前可以怎么记：**后端长期存业务数据的大仓库**
- 延伸阅读：[`MySQL 基础认知`](./02-web-backend/mysql-basics.md)

---

### [`Redis`](./02-web-backend/redis-basics.md)
- 常见读法：瑞迪斯
- 它是干什么的：内存型缓存数据库
- 为什么会出现在这里：认证服务常常需要缓存验证码、token、登录态或一些高频临时数据
- 当前可以怎么记：**放高频临时数据的高速缓存仓库**
- 延伸阅读：[`Redis 基础认知`](./02-web-backend/redis-basics.md)

---

### [`ORM`](./02-web-backend/mysql-basics.md)
- 常见读法：O R M
- 它是干什么的：对象关系映射，把数据库表和代码对象对应起来
- 为什么会出现在这里：后端项目不一定全靠手写 SQL，很多时候会通过模型、查询对象和 [`Session`](./02-web-backend/mysql-basics.md) 来操作数据库
- 当前可以怎么记：**把表和代码对象接起来的翻译层**

---

### [`Session`](./02-web-backend/mysql-basics.md)
- 常见读法：赛申
- 它是干什么的：数据库会话对象，用来承载查询、写入、提交等数据库操作
- 为什么会出现在这里：在 [`yy-auth`](../../yy-auth) 里，它会先挂到 [`request.state.db`](../../yy-auth/app/dependencies/db.py:6)，再传进 [`UserService.__init__()`](../../yy-auth/app/apis/user/service.py:184)，最后变成 [`self.session`](../../yy-auth/app/apis/user/service.py:185)
- 当前可以怎么记：**当前这次业务处理中可用的数据库操作入口**

---

### [`Model`](./02-web-backend/mysql-basics.md)
- 常见读法：摸抖
- 它是干什么的：ORM 里的模型类，通常对应数据库中的一张表
- 为什么会出现在这里：像 [`ProviderSSO`](../../yy-auth/app/apis/user/models.py:72) 这种类，本质上就是把表结构映射成 Python 类
- 当前可以怎么记：**数据库表在代码里的对象外壳**

---

### [`Column`](./02-web-backend/mysql-basics.md)
- 常见读法：卡拉姆 / 科伦
- 它是干什么的：ORM 里声明字段的方式
- 为什么会出现在这里：像 [`name = Column(String(30), unique=True, comment='标识')`](../../yy-auth/app/apis/user/models.py:73) 这种写法，就是在定义表里的一列
- 当前可以怎么记：**在代码里声明数据库字段的一种写法**

---

### [`Nacos`](../../yy-auth/app/core/zn_nacos.py)
- 常见读法：纳科斯
- 它是干什么的：配置中心 / 服务治理平台
- 为什么会出现在这里：[`yy-auth`](../../yy-auth) 这类企业服务往往不把关键配置写死在本地，而是从统一配置中心拉
- 当前可以怎么记：**公司统一放配置的地方**

---

### [`APScheduler`](../../yy-auth/requirements.txt)
- 常见读法：A P 斯凯久勒
- 它是干什么的：定时任务调度器
- 为什么会出现在这里：平台型后端服务经常需要按时间自动执行一些后台任务
- 当前可以怎么记：**后端里的定时闹钟系统**

---

### [`loguru`](../../yy-auth/requirements.txt)
- 常见读法：洛格如
- 它是干什么的：日志库
- 为什么会出现在这里：后端排错、追踪请求、记录异常时特别依赖日志
- 当前可以怎么记：**比 console.log 更正式的后端日志工具**

---

### [`JWT`](../../yy-auth/app/middlewares/jwt.py)
- 常见读法：J W T
- 它是干什么的：一种常见的身份令牌机制
- 为什么会出现在这里：[`yy-auth`](../../yy-auth) 要处理登录态，后端需要验证请求是不是合法用户发来的
- 当前可以怎么记：**后端识别你是不是登录用户的一张电子通行证**

---

### [`IAM`](../../yy-auth/app/middlewares/iam.py)
- 常见读法：I A M
- 它是干什么的：身份与权限管理
- 为什么会出现在这里：[`yy-auth`](../../yy-auth) 不只是登录服务，还涉及角色、权限、接口访问控制
- 当前可以怎么记：**谁能干什么的总管系统**

---

### [`instance`](./01-basics/common-commands.md)
- 常见读法：因斯坦斯
- 它是干什么的：类创建出来的具体对象
- 为什么会出现在这里：理解 [`self`](./01-basics/common-commands.md) 时，最关键的一步就是知道 `self` 指向当前实例对象，而不是指向 [`__init__`](./01-basics/common-commands.md)
- 当前可以怎么记：**类的一个具体成品对象**

---

### [`__init__`](./01-basics/common-commands.md)
- 常见读法：双下 init
- 它是干什么的：Python 类的初始化方法
- 为什么会出现在这里：像 [`UserService.__init__()`](../../yy-auth/app/apis/user/service.py:184) 这种写法，就是对象创建后用来设置初始属性的地方
- 当前可以怎么记：**Python 类里的 constructor**

---

### [`self`](./01-basics/common-commands.md)
- 常见读法：赛尔夫
- 它是干什么的：类实例方法里的当前对象引用
- 为什么会出现在这里：像 [`self.login_user = None`](../../yy-auth/app/apis/user/service.py:186) 这种写法，表示给当前实例对象设置属性，而不是给 [`__init__`](./01-basics/common-commands.md) 这个方法设置属性
- 当前可以怎么记：**Python 里的 this**

## 后续维护原则

后面新词继续往这里补，但优先补：
- 当前真的遇到的
- 当前真的卡住理解的
- 当前真的和项目阅读强相关的

不追求一次塞满，不然又会回到“看着很多，实际吸收不了”的老路上去。
