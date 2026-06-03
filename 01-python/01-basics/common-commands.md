# Python 常用命令

## 这篇是干什么的

这一篇不讲太多原理，先解决一个很实际的问题：

**以后你在工作里碰 Python 项目时，终端里最常用的命令有哪些？**

前端转过去最容易卡住的，不是语法，而是：
- 虚拟环境怎么建
- 依赖怎么装
- 脚本怎么跑
- 包怎么管理
- 出问题时先看什么

所以这篇就按“能直接拿去用”的方式整理。

这篇的定位主要是：
- 常用命令
- 环境管理
- 项目启动
- 少量和项目阅读强相关的语法切片

如果你当前想系统补“后端思维”和“最小语法集合”，建议先看：
- [`backend-thinking.md`](./backend-thinking.md)
- [`python-syntax-for-frontend.md`](./python-syntax-for-frontend.md)

也就是说，这篇不是完整语法文档，而是更偏“上手项目前最常用的命令与环境手册”。

---

## 先建立一个基本认知

做 Python 开发时，最常见的命令链路其实是：

1. 看 Python 版本
2. 创建虚拟环境
3. 激活虚拟环境
4. 安装依赖
5. 运行脚本或启动服务
6. 导出依赖 / 排查问题

你可以先把 Python 项目类比成前端里的：
- `node` ≈ `python`
- `npm install` ≈ `pip install`
- `package.json` ≈ `requirements.txt`
- 前端本地运行命令 ≈ Python 启动脚本 / 启动服务命令

---

## 补一个今天非常关键的基础概念：`self` 到底是谁

如果你开始看后端项目，很快就会遇到这种代码：

```python
def __init__(self, session: Session, request: Request = None):
    self.session = session
    self.login_user = None
```

前端同学最容易卡住的问题通常不是语法，而是：
- 为什么 `self` 这么常见
- 为什么它不是指向 `__init__`
- 为什么 `self.login_user = None` 是给对象赋值

### 一句话先记住

**`self` 指的是当前实例对象自己，不是指向 `__init__` 这个方法。**

### 可以直接类比前端

你可以把下面这段 Python：

```python
def __init__(self, session: Session, request: Request = None):
    self.session = session
    self.login_user = None
```

脑补成前端 class 里的：

```ts
constructor(session, request) {
  this.session = session
  this.loginUser = null
}
```

也就是说：
- `__init__` ≈ `constructor`
- `self` ≈ `this`

### 为什么它不是 `__init__`

因为 `__init__` 只是类里的一个方法，真正被初始化的是“这个类创建出来的实例对象”。

所以：
- `self.session = session`
- `self.login_user = None`

本质上都可以脑补成：
- `service.session = session`
- `service.login_user = None`

### 看到 `self.xxx = yyy` 时应该怎么想

以后你在 Python 类里看到：

- `self.xxx = yyy`

就先别慌，直接翻译成人话：

**给当前这个对象设置一个属性。**

---

## 1. 查看 Python 和 pip 版本

### 查看 Python 版本

```bash
python --version
```

或者：

```bash
python3 --version
```

作用：
- 确认本机有没有 Python
- 确认当前用的是哪个版本

### 查看 pip 版本

```bash
pip --version
```

或者：

```bash
pip3 --version
```

作用：
- 看包管理器有没有装
- 看当前 pip 绑定的是哪个 Python

---

## 2. 创建虚拟环境

### 创建一个虚拟环境

```bash
python3 -m venv .venv
```

作用：
- 在当前目录下创建一个独立 Python 环境
- 避免项目之间依赖互相污染

### 这里最容易混淆的一点

很多人刚接触 Python 时会以为下面三步每次都要完整执行一遍：
1. 创建环境
2. 激活环境
3. 安装依赖

其实不是。

更准确的节奏是：
- 创建环境：通常只做一次
- 激活环境：每次新开终端时常常要做
- 安装依赖：第一次做，或者依赖文件变更后再做

### 最常见的项目初始化顺序

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### 第二次进入项目时通常怎么做

如果环境目录还在，而且 `requirements.txt` 没变化，通常只需要：

```bash
source .venv/bin/activate
```

### 什么情况下要重新安装依赖

常见场景：
- 你第一次拉这个项目
- 你刚重建了虚拟环境
- 团队更新了 `requirements.txt`
- 你切换到了另一个还没装依赖的环境

这时再执行：

```bash
pip install -r requirements.txt
```

### 什么情况下要重建环境

比如：
- 你把 `.venv` 删了
- Python 版本切换了
- 环境已经装乱，想彻底重置

这时可以删掉旧环境目录后重新创建。

---

## 3. 激活虚拟环境

### macOS / Linux

```bash
source .venv/bin/activate
```

激活后，终端前面通常会出现类似：

```bash
(.venv)
```

表示你已经进入当前项目的 Python 环境。

### 退出虚拟环境

```bash
deactivate
```

### 一个特别容易混淆的点

如果你已经激活了环境，然后手动把 `.venv` 目录删了，终端前面依然可能还显示 `(.venv)`。

这是因为：

- 删除 `.venv` 是删磁盘上的目录
- `deactivate` 是退出当前 shell 里的激活状态

它们不是同一件事。

所以遇到这种情况，正确理解是：

- 环境目录没了
- 但当前终端还保留着激活状态的痕迹

这时执行：

```bash
deactivate
```

或者直接关闭当前终端重新打开，都可以。

### 怎么查看当前项目下有哪些环境

原生 `venv` 没有统一的“环境列表”命令，因为它只是一个普通目录。

最实用的方法是找 `pyvenv.cfg`：

```bash
find . -name pyvenv.cfg
```

谁目录里有 `pyvenv.cfg`，谁基本就是一个虚拟环境。

### 怎么删除环境

如果确认某个目录就是虚拟环境，比如 `.venv`，直接删目录即可：

```bash
rm -rf .venv
```

如果当前已经激活了环境，先执行下面这条会更稳妥：

```bash
deactivate
```

然后再删对应环境目录。

---

## 4. 安装依赖

### 安装单个包

```bash
pip install requests
```

### 安装指定版本

```bash
pip install requests==2.31.0
```

### 安装 requirements.txt 里的依赖

```bash
pip install -r requirements.txt
```

这个命令非常常用。
如果你接手一个 Python 项目，通常先看有没有 `requirements.txt`。

---

## 5. 导出当前依赖

```bash
pip freeze
```

如果要导出到文件：

```bash
pip freeze > requirements.txt
```

---

## 6. 运行 Python 脚本

### 直接运行脚本

```bash
python3 app.py
```

或者：

```bash
python main.py
```

---

## 7. 启动 FastAPI 服务

如果项目是 FastAPI，一般会看到类似命令：

```bash
uvicorn app.main:app --reload
```

这里拆开理解：
- `uvicorn` 是 ASGI 服务启动器
- `app.main` 表示 Python 模块路径
- `app` 表示模块中的应用对象
- `--reload` 表示开发模式自动重载

### 一个很实用的排障思路

如果项目本来是通过更复杂的方式启动，比如：
- Gunicorn
- Docker 里的默认启动命令
- 多进程服务管理

但日志太乱、看不清真正错误时，可以尝试直接用更简单的单进程命令启动：

```bash
uvicorn app.main:app --host 0.0.0.0 --port 6969
```

这样常常能把真正的启动错误直接打印出来。

这个方法在后端排障里非常有用。

---

## 8. 进入 Python 交互环境

```bash
python3
```

退出方式：

```python
exit()
```

---

## 9. 安装项目开发常用工具

### 安装格式化工具

```bash
pip install black
```

### 安装导入排序工具

```bash
pip install isort
```

### 安装静态检查工具

```bash
pip install flake8
```

### 运行 black

```bash
black .
```

### 运行 isort

```bash
isort .
```

### 运行 flake8

```bash
flake8 .
```

---

## 10. 查看已安装包

```bash
pip list
```

---

## 11. 查看某个包的信息

```bash
pip show fastapi
```

---

## 12. 卸载包

```bash
pip uninstall requests
```

---

## 13. 如果项目同时提供 Docker，怎么判断先走哪条路

这是这次真实项目里很有价值的经验。

如果一个 Python 项目同时给了：

- `requirements.txt`
- `Dockerfile`
- `docker-compose.yml`

对于不熟 Python 的人，通常可以优先判断：

**项目作者是不是更希望你按 Docker 方式运行。**

因为很多时候：
- 本机 Python 版本不对
- 某些依赖和当前解释器不兼容
- 系统库本机不好配

这时如果项目本身已经有容器方案，优先尝试 Docker 往往更省事。

## 一句话总结

这篇最值得先记住的，不是命令本身，而是：

**先分清“环境创建”“环境激活”“依赖安装”“服务启动”“日志排障”分别属于哪一层动作。**
