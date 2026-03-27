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
- [`node`](package.json) ≈ [`python`](knowledge-base-repo/01-python/01-basics/common-commands.md)
- [`npm install`](package.json) ≈ [`pip install`](knowledge-base-repo/01-python/01-basics/common-commands.md)
- [`package.json`](package.json) ≈ [`requirements.txt`](yy-auth/requirements.txt)
- 前端本地运行命令 ≈ Python 启动脚本 / 启动服务命令

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

在很多公司环境里，[`python`](knowledge-base-repo/01-python/01-basics/common-commands.md) 和 [`python3`](knowledge-base-repo/01-python/01-basics/common-commands.md) 不一定一样。
你以后看到命令跑不起来，先别慌，先看版本。

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

### 创建一个名为 venv 的虚拟环境
```bash
python3 -m venv venv
```

作用：
- 在当前目录下创建一个独立 Python 环境
- 避免项目之间依赖互相污染

这一步非常重要。
你可以把它类比成：
**给当前项目单独开一个依赖隔离空间。**

很多 Python 项目第一步不是直接装依赖，而是先建虚拟环境。

---

## 3. 激活虚拟环境

### macOS / Linux
```bash
source venv/bin/activate
```

激活后，终端前面通常会出现类似：
```bash
(venv)
```

表示你已经进入当前项目的 Python 环境。

### 退出虚拟环境
```bash
deactivate
```

这和前端不太一样，前端一般不会频繁手动“进环境/退环境”，但 Python 很常见。

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
如果你接手一个 Python 项目，通常先看有没有 [`requirements.txt`](yy-auth/requirements.txt)。

就像前端接项目会先看 [`package.json`](package.json) 一样。

---

## 5. 导出当前依赖

```bash
pip freeze
```

作用：
- 列出当前环境安装的所有包及版本

如果要导出到文件：
```bash
pip freeze > requirements.txt
```

作用：
- 生成或更新 [`requirements.txt`](yy-auth/requirements.txt)

这个动作相当于前端里把依赖版本记录下来，方便别人安装一致环境。

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

作用：
- 执行某个 Python 文件

如果你后面开始写一些：
- 小工具
- 数据清洗脚本
- 定时处理脚本
- 简单接口服务

这条命令会很常用。

---

## 7. 启动 FastAPI 服务

如果项目是 [`FastAPI`](knowledge-base-repo/01-python/02-web-backend/fastapi-basics.md)，一般会看到类似命令：

```bash
uvicorn app.main:app --reload
```

这里拆开理解：
- [`uvicorn`](yy-auth/requirements.txt) 是 ASGI 服务启动器
- [`app.main`](yy-auth/app/main.py) 表示 Python 模块路径
- [`app`](yy-auth/app/main.py:1) 表示模块中的应用对象
- [`--reload`](knowledge-base-repo/01-python/01-basics/common-commands.md) 表示开发模式自动重载

这个命令你以后看后端同事发启动方式时，经常会遇到。

---

## 8. 进入 Python 交互环境

```bash
python3
```

进入后你可以直接写：
```python
print("hello")
1 + 2
```

作用：
- 临时测试语法
- 验证某段逻辑
- 快速试一个对象或函数

前端里你可能更习惯浏览器控制台；
Python 里这个交互环境就有点像本地 REPL 控制台。

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

这些工具分别像：
- [`black`](knowledge-base-repo/01-python/01-basics/common-commands.md) ≈ 前端里的格式化工具
- [`isort`](knowledge-base-repo/01-python/01-basics/common-commands.md) ≈ import 排序工具
- [`flake8`](knowledge-base-repo/01-python/01-basics/common-commands.md) ≈ 代码规范检查工具

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

作用：
- 看当前环境装了哪些包

如果你怀疑某个包没装，可以先跑这个。

---

## 11. 查看某个包的信息

```bash
pip show fastapi
```

作用：
- 查看包版本
- 安装位置
- 依赖信息

比如你在看 [`yy-auth`](yy-auth) 时，想确认某个包是不是当前环境里的，就可以这么查。

---

## 12. 卸载包

```bash
pip uninstall requests
```

作用：
- 删除不再需要的依赖

一般执行后会让你确认一次。

---

## 13. 按模块方式运行代码

```bash
python3 -m app.main
```

这个命令和直接跑文件相比，区别在于：
- 它按模块方式执行
- 更适合包结构明确的项目

后面你如果遇到相对导入问题，别人可能会让你试试 [`python -m`](knowledge-base-repo/01-python/01-basics/common-commands.md) 方式运行。

---

## 14. 常见排查命令

### 看 Python 路径
```bash
which python3
```

### 看 pip 路径
```bash
which pip
```

作用：
- 判断你当前到底用的是哪个解释器、哪个 pip
- 很适合排查“明明装了包却找不到”这种问题

### 查看环境变量
```bash
env | grep PYTHON
```

作用：
- 看有没有特殊 Python 环境配置影响运行

---

## 15. 我建议你最先记住的 8 条

如果现在不想一下记太多，先记住这 8 条最够用：

```bash
python3 --version
pip --version
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 app.py
uvicorn app.main:app --reload
pip freeze > requirements.txt
```

这 8 条基本已经能覆盖：
- 建环境
- 装依赖
- 跑脚本
- 跑服务
- 导出依赖

---

## 16. 前端转 Python 时最常见的几个坑

### 坑 1：没进虚拟环境就开始装包
结果：
- 包装到全局环境里
- 项目依赖变脏
- 不同项目互相影响

### 坑 2：[`python`](knowledge-base-repo/01-python/01-basics/common-commands.md) 和 [`python3`](knowledge-base-repo/01-python/01-basics/common-commands.md) 混着用
结果：
- 解释器不一致
- pip 安装位置和运行环境对不上

### 坑 3：依赖装了但服务还是报错
这时先查：
- [`which python3`](knowledge-base-repo/01-python/01-basics/common-commands.md)
- [`which pip`](knowledge-base-repo/01-python/01-basics/common-commands.md)
- [`pip show 包名`](knowledge-base-repo/01-python/01-basics/common-commands.md)

### 坑 4：把 [`requirements.txt`](yy-auth/requirements.txt) 当成可有可无
其实它很关键。
它就是团队里统一环境的基础之一。

---

## 17. 如果结合你当前岗位，最实用的学习顺序

你是前端开发，所以我建议不是先背一堆 Python 命令，而是按这个顺序：

1. 会看版本：[`python3 --version`](knowledge-base-repo/01-python/01-basics/common-commands.md)
2. 会建环境：[`python3 -m venv venv`](knowledge-base-repo/01-python/01-basics/common-commands.md)
3. 会进环境：[`source venv/bin/activate`](knowledge-base-repo/01-python/01-basics/common-commands.md)
4. 会装依赖：[`pip install -r requirements.txt`](yy-auth/requirements.txt)
5. 会跑脚本：[`python3 xxx.py`](knowledge-base-repo/01-python/01-basics/common-commands.md)
6. 会跑服务：[`uvicorn app.main:app --reload`](knowledge-base-repo/01-python/01-basics/common-commands.md)
7. 会排查环境：[`which python3`](knowledge-base-repo/01-python/01-basics/common-commands.md)

做到这一步，你已经能开始接触真实 Python 项目了。

---

## 一句话总结

**Python 常用命令不用一口气全背，先把“看版本、建环境、进环境、装依赖、跑脚本、跑服务、查环境”这条主线掌握住，就已经够你开始上手公司里的 Python 项目。**
