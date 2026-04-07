# 前端视角的 Python 最小语法

## 这篇是干什么的

这篇不是 Python 语法大全，也不是考试提纲。

它主要解决一个很现实的问题：

**前端工程师在开始看 Python 项目之前，最少应该先补哪些语法，才不容易一进项目就发懵。**

所以这篇不追求面面俱到，只追求：
- 够当前项目阅读使用
- 能和前端已有经验建立映射
- 后面真碰到代码时能认出来

如果你现在的目标是：
- 看懂项目结构
- 跟懂一条请求链路
- 先能改一点小逻辑

那这篇就够作为第一轮语法底子。

---

## 先说结论：你当前最该补的不是全部语法，而是最小集合

当前优先掌握这些就够了：
- 变量与基本类型
- 列表和字典
- 条件判断与循环
- 函数
- 类、对象、[`self`](./common-commands.md)
- [`__init__`](./common-commands.md)
- 模块与 import
- 异常处理
- 类型标注

如果把这些先补起来，你已经能开始读大部分企业 Python 后端代码了。

---

## 1. 变量和基本类型

Python 里最常见的几类值：

```python
name = "liangshuo"
age = 18
is_admin = False
price = 19.9
```

你可以先粗略理解成：
- 字符串：`"hello"`
- 整数：`1`
- 浮点数：`1.5`
- 布尔值：`True` / `False`

和前端很像，只是写法略有区别。

前端类比：

```ts
const name = 'liangshuo'
const age = 18
const isAdmin = false
const price = 19.9
```

### 当前最值得记住的一点

Python 变量声明时不用写 [`let`](./python-syntax-for-frontend.md:1) 或 [`const`](./python-syntax-for-frontend.md:1)。

直接赋值就是定义变量。

---

## 2. 列表和字典

### 列表

```python
users = ["a", "b", "c"]
```

它大概对应前端里的数组：

```ts
const users = ['a', 'b', 'c']
```

### 字典

```python
user = {
    "name": "tom",
    "age": 18,
    "active": True,
}
```

它大概对应前端里的对象：

```ts
const user = {
  name: 'tom',
  age: 18,
  active: true,
}
```

### 为什么这两个特别重要

因为你看后端项目时，参数、返回值、配置、数据库结果，很多都会长得像：
- 列表
- 字典

如果这两个不熟，看接口代码会很容易晕。

---

## 3. [`if`](./python-syntax-for-frontend.md:1) 条件判断

```python
if age >= 18:
    print("adult")
else:
    print("minor")
```

前端类比：

```ts
if (age >= 18) {
  console.log('adult')
} else {
  console.log('minor')
}
```

### 当前最值得注意的一点

Python 不用花括号，而是靠**缩进**表示代码块。

这件事一开始很不习惯，但必须尽快适应。

你以后看到：
- [`if`](./python-syntax-for-frontend.md:1)
- [`for`](./python-syntax-for-frontend.md:1)
- [`def`](./python-syntax-for-frontend.md:1)
- [`class`](./python-syntax-for-frontend.md:1)

都要立刻想到：

**缩进不是格式问题，而是语法本身。**

---

## 4. [`for`](./python-syntax-for-frontend.md:1) 循环

```python
for user in users:
    print(user)
```

你可以先类比前端：

```ts
for (const user of users) {
  console.log(user)
}
```

这类写法在项目里很常见。

比如你后面看：
- 遍历权限列表
- 遍历配置项
- 遍历查询结果

基本都会碰到。

---

## 5. 函数 [`def`](./python-syntax-for-frontend.md:1)

```python
def add(a, b):
    return a + b
```

前端类比：

```ts
function add(a, b) {
  return a + b
}
```

如果带类型标注，常会写成：

```python
def add(a: int, b: int) -> int:
    return a + b
```

你先不用对类型标注过度紧张。

当前只要知道：
- 冒号后面常是参数类型
- `->` 后面常是返回值类型

就够开始读代码了。

---

## 6. 类、对象和 [`self`](./common-commands.md)

这部分对前端同学非常关键。

```python
class UserService:
    def __init__(self, session):
        self.session = session
        self.login_user = None
```

你可以直接类比前端：

```ts
class UserService {
  constructor(session) {
    this.session = session
    this.loginUser = null
  }
}
```

当前先记住两件事：
- [`__init__`](./common-commands.md) ≈ `constructor`
- [`self`](./common-commands.md) ≈ `this`

如果这块容易卡，优先回看 [`common-commands.md`](./common-commands.md) 里关于 [`self`](./common-commands.md) 的解释。

---

## 7. 模块、包和 import

Python 项目里你会经常看到：

```python
from fastapi import Request, Depends
from app.core.cache import get_redis
```

你可以粗略理解成：
- 从别的模块把工具、类、函数引进来用

前端类比：

```ts
import { ref } from 'vue'
import { getUserInfo } from './api'
```

### 当前最值得先记住的一点

Python 项目阅读里，import 不只是“引入依赖”，它还常常帮你判断：
- 这个文件依赖了谁
- 某个能力是从哪里来的
- 项目结构是怎么组织的

所以看不懂业务时，先看 import，往往很有帮助。

---

## 8. 异常处理 [`try`](./python-syntax-for-frontend.md:1) / [`except`](./python-syntax-for-frontend.md:1)

```python
try:
    result = 1 / 0
except Exception as e:
    print(e)
```

前端类比：

```ts
try {
  const result = 1 / 0
} catch (e) {
  console.log(e)
}
```

在后端项目里，这类写法常用于：
- 调外部服务
- 数据处理
- 捕获业务异常
- 统一错误返回

你先知道这就是“出问题时怎么兜住”的语法结构，就够了。

---

## 9. 类型标注为什么在项目里老能看到

你以后读企业项目，大概率会经常看到这种写法：

```python
def login(request: Request, session: Session):
    pass
```

或者：

```python
def get_user(user_id: int) -> dict:
    pass
```

这不是装饰，而是为了：
- 提高可读性
- 帮编辑器提示
- 帮框架或校验工具理解参数
- 让协作更清楚

当前你不用把类型系统学很深。

先有这个认知就够：

**Python 在企业项目里，虽然是动态语言，但真实工程里经常会写很多类型标注。**

---

## 10. 项目阅读时最常见的语法组合长什么样

你以后看项目，经常会看到这种组合：

```python
class UserService:
    def __init__(self, session):
        self.session = session

    def get_user(self, user_id: int):
        if not user_id:
            return None
        return self.session.query(User).filter(User.id == user_id).first()
```

这里面其实就是几种基础语法的组合：
- [`class`](./python-syntax-for-frontend.md:1)
- [`def`](./python-syntax-for-frontend.md:1)
- [`self`](./common-commands.md)
- [`if`](./python-syntax-for-frontend.md:1)
- `return`
- 类型标注

你会发现，**真实项目里吓人的往往不是语法本身，而是业务词和链路感不熟。**

所以别把自己吓住。

---

## 当前阶段不用急着深挖哪些语法

你现在先不用死磕：
- 装饰器原理
- 生成器
- 迭代器协议
- 元类
- 高阶魔法方法
- 协程底层细节

这些以后有需要再补。

当前最重要的是：
- 常见写法能认出来
- 看项目时不被基础语法绊住
- 能把语法和业务结构对应起来

---

## 学完这篇后，下一步应该干什么

建议顺序：

1. 先把这篇过一遍
2. 再看 [`common-commands.md`](./common-commands.md)
3. 再看 [`FastAPI`](../02-web-backend/fastapi-basics.md)
4. 再去读 [`yy-auth`](../03-project-practice/yy-auth-overview.md)
5. 然后跟一条真实请求链路

这样能把“语法”尽快转成“项目阅读能力”。

---

## 当前一句话总结

**前端转 Python，第一轮不用学成语法高手，只要先把列表、字典、条件、循环、函数、类、self、import、异常、类型标注这几件事认熟，就已经够你开始看真实项目。**
