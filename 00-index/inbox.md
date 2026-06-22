# 待整理收件箱（inbox）

> 所有会话沉淀的草稿先进这里，按写入时间从上到下排列。
> 写入由全局 skill `knowledge-base-deposit` 自动完成，整理分发由仓库 skill `knowledge-base-inbox-triage` 完成。
> 流程说明见 [`知识库使用方法`](./index.md)。
> 整理后已提炼进正文的条目，从本文件删除，只保留尚未消化的草稿。

## 这里装的是什么

每条草稿都是某次会话临结束时自动生成的「原料」，不是成品。它带一个写入时间戳，方便后续按时间线回看和整理。

每条草稿的固定结构是：

```markdown
## [YYYY-MM-DD HH:MM] 草稿主题标题

- 主题：一句话说明这次主要在聊什么
- 关联仓库/项目：涉及真实项目就写明，没有写「无」

### 结论 / 认知
这次想明白的关键结论，讲人话、能复述。

### 命令 / 代码片段
高频命令、关键代码，用代码块；没有就省略这一节。

### 术语
这次出现、以后可能会忘的名词，给通俗解释；没有就省略。

### 待验证问题
还没想透、需要以后确认的点；没有就省略。

---
```

## 怎么往这里加 / 怎么清空

- **加**：任意会话里说「沉淀知识库草稿」，全局 skill 会自动生成草稿并追加到下面。
- **清空**：在知识库目录下说「整理碎片」，整理 skill 会把草稿提炼进正文对应章节，并把已提炼的条目从这里删掉。

---

## [2026-06-22 17:55] AI专家后台管理系统规划 + 本地 Python 全栈环境搭建

- 主题：从零规划 AI 专家后台管理系统（前后端），并搭建本地 Python 开发环境实现全栈联调
- 关联仓库/项目：`ai-app-aiexpert-backend`（前端）、`zhinao-plan`（Python 服务端）

### 结论 / 认知

1. **往现有 Python 服务加功能的最轻量方式**：在 `zhinao-plan/app/apis/` 下新建子目录即可。`routes.py` 有动态路由加载机制，会自动扫描 `apis/` 下所有子目录的 `views.py` 并注册路由。不用改任何启动配置。

2. **本地跑 Python 服务 vs Docker 跑**：写代码阶段用本地 `uvicorn --reload`（改一行 1~2 秒自动生效），Docker 适合部署不适合开发（改代码要重启容器，慢且难调试）。和前端 `npm run dev` vs `npm run build` 是同一个道理。

3. **前后端本地全栈联调**：前端 Vite（6010 端口）通过 proxy 转发请求到本地 Python 服务（8000 端口），两端都热更新，和纯前端开发体验一致。

4. **spec 流程做跨会话持久化**：用 `proposal.md`（为什么做 + 做什么）→ `design.md`（怎么做）→ `tasks.md`（步骤 + 进度）三文件管理变更。新会话只需读这三个文件就能恢复全部上下文。`tasks.md` 的 `- [ ]` / `- [x]` 跟踪进度。

5. **macOS 下 pyenv 安装 Python 后的 SSL 坑**：新装的 Python 可能缺 SSL 根证书，pip 报 `CERTIFICATE_VERIFY_FAILED`。用 `--trusted-host pypi.org --trusted-host files.pythonhosted.org` 绕过。

### 命令 / 代码片段

```bash
# pyenv 安装 + Python 版本管理
brew install pyenv

# ~/.zshrc 加入这三行
export PYENV_ROOT="$HOME/.pyenv"
export PATH="$PYENV_ROOT/bin:$PATH"
eval "$(pyenv init -)"

# 安装 + 切换版本
pyenv install 3.12.2
cd zhinao-plan
pyenv local 3.12.2   # 在目录下创建 .python-version 文件

# 虚拟环境 + 安装依赖
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt --trusted-host pypi.org --trusted-host files.pythonhosted.org

# 本地启动（带热更新）
uvicorn app.main:app --port 8000 --reload
# Swagger UI: http://localhost:8000/docs
```

```typescript
// vite.config.ts — proxy 转发到本地 Python 服务
proxy: {
  '/api': {
    target: 'http://localhost:8000'
  }
}
```

### 术语

- `pyenv`：Python 版本管理器，类似 nvm。同一台机器多版本共存，按目录切换。
- `venv`：Python 内置虚拟环境，类似 node_modules 的隔离思路。
- `uvicorn`：跑 FastAPI 的 ASGI 服务器。加 `--reload` = 热更新。
- `Swagger UI`：FastAPI 自带的接口文档页（`/docs`），可以直接在浏览器测接口。
- `--trusted-host`：pip 跳过 SSL 验证的参数，公司网络/新装 Python 常需要。

### 待验证问题

1. `deploy_expert` 接口的具体业务逻辑——是改数据库标记还是调其他服务 API？
2. pip 装 `mysqlclient` 在某些 macOS 上可能需要先 `brew install mysql-client pkg-config`，本次碰巧没报错但不确定换机器会不会遇到。
3. VS Code 集成终端和外部终端的环境变量不一定同步——装完 pyenv 后如果 VS Code 找不到 `python`，需要重新 `source ~/.zshrc` 或重启 VS Code。

---

## [2026-06-22 18:00] zhinao-plan 动态路由加载 + Vite proxy 联调验证

- 主题：为 AI 专家后台新增后端 API 模块（expert_backend），并完成前后端本地联调验证
- 关联仓库/项目：`ai-app-aiexpert-backend`（前端）、`zhinao-plan`（Python 服务端）

### 结论 / 认知

1. **zhinao-plan 动态路由加载机制细节**：`routes.py` 用 `os.walk` + `importlib.import_module(f'apis.{dir_name}.views')` 自动注册路由。新模块只需建目录 + 写 `views.py` 导出 `router = APIRouter()`。但 **新增目录不会触发 uvicorn `--reload`**，必须手动 kill 重启进程。

2. **Vite proxy 联调验证方法**：不能光看 `curl localhost:6010` 返回 302 就说通了。正确验证：请求 `localhost:6010/api/xxx` 能拿到后端真实 JSON 数据 + HTTP 200，才算整条链路（前端 → Vite proxy → 后端 → 数据库）打通。最靠谱的是在页面加按钮，浏览器里点击看结果。

3. **前端搜索方案选择**：专家数据量小（十几条），搜索用前端 computed/getters 内存过滤比调后端接口体验好（即时响应、零网络延迟）。后端 `search_experts` 接口留着作为预备能力，专家量增至百条以上再切换。

4. **新增后端模块的最小文件集**：`__init__.py`（空）+ `schemas.py`（Pydantic）+ `services.py`（业务逻辑）+ `views.py`（路由），四个文件搞定一个功能模块。

### 命令 / 代码片段

```bash
# 重启 uvicorn（--reload 不检测新目录的创建，必须手动重启）
kill <pid> && cd zhinao-plan && ./venv/bin/uvicorn app.main:app --port 8000 --reload

# 验证新接口（中文参数必须 URL 编码）
curl -s 'http://localhost:8000/api/plan/expert_backend/my_experts'
curl -s 'http://localhost:8000/api/plan/expert_backend/search_experts?keyword=%E5%AE%89%E5%85%A8'
```

```python
# zhinao-plan 新模块最小结构
# apis/expert_backend/
# ├── __init__.py          # 空文件
# ├── schemas.py           # Pydantic Schema（请求体定义）
# ├── services.py          # 业务逻辑（复用 apis/plan/models.py 的 ORM 模型）
# └── views.py             # router = APIRouter()，会被 routes.py 自动发现

# services.py 核心模式：
from apis.plan.models import AISubCategory, AITag
from apis.expert.services import TagService  # 复用已有的标签服务

class BackendExpertService:
    def __init__(self, session, headers):
        self.session = session
        self.user_id = headers.get("yy_user_id", 0)
        self.tag_service = TagService(session, headers)
```

### 术语

- `JsonResponse`：zhinao-plan 自定义的 FastAPI Response 类，统一返回 `{code: 1000, data: ..., msg: null}` 格式，1000 表示成功
- `get_db`：FastAPI 的 `Depends` 注入，提供 SQLAlchemy Session 实例
- `jsonable_encoder`：zhinao-plan 自定义版（不是 FastAPI 内置的），把 SQLAlchemy ORM 对象序列化成 dict
- `yy_user_id`：请求 headers 里的用户 ID 字段，宿主应用微应用鉴权体系传过来的

### 待验证问题

1. `optimize_prompt` 接口依赖 `settings.ZHOUZUYI_VLLM_CONFIG`（vLLM 服务地址），还没实际测试 LLM 调用能否联通
2. uvicorn `--reload` 到底是靠 `watchfiles` 还是 `watchgod`？是否可以配置监控目录创建事件？（本次实测：只监控文件修改，不监控新目录）
3. `deploy_expert` 的完整业务流程——MVP 目前只改 `provider` 字段，实际部署到 wx/wa 环境可能涉及调用其他内部 API

---

## [2026-06-22 18:05] AI专家后台 Phase 2 前端开发 + spec 偏差修正

- 主题：AI 专家后台管理系统 Phase 2 前端列表页开发，以及发现并修正 spec 与实际代码的 6 处偏差
- 关联仓库/项目：`ai-app-aiexpert-backend`（前端）+ `zhinao-plan`（后端 `apis/expert_backend/`）

### 结论 / 认知

1. **项目里新旧表并存时，越早统一越好**。这个项目有旧表 `pm_ai_sub_category` 和新表 `ai_experts`，开发时果断全部迁到新表，避免了后续 Phase 3 创建/编辑时在两套数据模型间纠结。

2. **Spec 必须跟代码同步更新**。开发中做了 6 处技术决策变更（换表、加接口、改字段），但 spec 没同步，差点导致 Phase 3 按老 spec 对接旧接口。教训：每次技术决策偏离 spec 时，当场更新，不要攒着。

3. **本地开发绕过网关的 JWT 解析方案**。生产环境网关会把 JWT 解析后的 `user_id` 注入 request header（`yy_user_id`），但本地直连没网关。解法是后端自己从 `Authorization` header 里解析 JWT payload 作为兜底。

4. **后台管理接口应该独立建模块，不要混用前台接口**。虽然底层同一张表，但后台管理的查询维度（按用户、按类型分组）跟前台不同，独立模块更清晰，也方便后续权限控制。

### 命令 / 代码片段

后端 JWT 兜底解析（不验证签名，纯解 payload）：
```python
import base64, json

auth = headers.get("authorization", "")
token = auth[7:]  # 去掉 "Bearer "
payload_b64 = token.split(".")[1]
# base64url 补齐 padding
padding = 4 - len(payload_b64) % 4
if padding != 4:
    payload_b64 += "=" * padding
payload = json.loads(base64.urlsafe_b64decode(payload_b64))
user_id = payload.get("uid")
org_id = payload.get("org_id")
```

前端 axios 开发模式 token fallback：
```typescript
const DEV_TOKEN = '...';
axios.interceptors.request.use(config => {
  let token = window.__MicroAPP__?.user.token;
  if (!token) token = DEV_TOKEN;  // 本地开发无微应用环境
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

### 术语

- `expert_type`：AI 专家的类别字段。0=用户自建，1=系统通用（行业通用），2=系统专项（专项能力）
- `support_env`：专家部署的环境标识，逗号分隔，如 `"wx,wa"`。wx=微信端，wa=网安端
- `AIExpertOption`：`ai_expert_options` 表，存专家的输出标签（output_labels），和 `AIExpert` 是一对多关系
- `ZHOUZUYI_VLLM_CONFIG`：后端调用 LLM 的配置项，指向自建的 vLLM 推理服务（Qwen3-30B），用于 prompt 优化

### 待验证问题

1. `my_experts` 在测试/生产环境中，网关注入的 header 名到底是 `yy_user_id` 还是别的？当前是从已有代码推断的，没有看到网关配置文档
2. Phase 3 创建专家时，`agent_uuid` 是由后端生成还是调用 AgentHub 返回？需要看前台 `create_ai_expert` 的实际逻辑确认

---

## [2026-06-22 18:08] AI专家后台 Phase 3 —— CRUD 接口 + 创建页面 + 服务端概念讲解

- 主题：实现后端 CRUD 接口（create/update/get/delete），前端创建/编辑页面对接，以及给前端开发讲解 Python 服务端核心概念
- 关联仓库/项目：`ai-app-aiexpert-backend`（前端）、`zhinao-plan`（后端 `apis/expert_backend/`）

### 结论 / 认知

1. **`flush()` vs `commit()` 是理解事务的关键**。`flush()` = 执行 SQL 拿到自增 ID 但不提交，`commit()` = 最终确认。创建专家的流程是"flush 拿 ID → 写选项表 → 调 AgentHub → 回写 agent_uuid → commit"，中间任何一步失败都可以 `rollback()` 撤销全部。这就是事务的核心——要么全做，要么全不做。

2. **编辑时选项的"增量对比"策略**：从数据库查出已有选项做成 map（`{id: option}`），遍历前端提交的列表：有 id 且在 map 中 → 更新；没 id → 新增；map 中剩余未匹配的 → 物理删除。这个模式在有"可变长度子项"的编辑场景通用。

3. **`agent_uuid` 的来源确认**：是调用 `AiAgentService().create_agent()` 由 AgentHub 返回的，不是后端自己生成的。创建流程是先写 DB 拿到 expert_id 和 option_ids，然后把这些 ID 传给 AgentHub 注册智能体，最后把返回的 agent_uuid 回写到 ai_experts 表。

4. **前端输出定义要区分专家类型**：是否专家展示固定的"是/否"两张卡片（绿+红），分类专家展示可编辑的多标签输入列表。这不只是 UI 差异，对应后端 `output_type` 为 `boolean` 时不需要 `output_labels`，为 `label` 时必须有。

5. **高级配置（模型/温度/最大长度）存在 `ext_data` JSON 字段**：这些参数当前后端还没真正使用（创建 Agent 时没传），属于"先存后用"。等 Phase 4 即时试用接口实现时需要确认 AgentHub 是否支持这些参数。

### 命令 / 代码片段

创建专家的核心事务流程：
```python
try:
    ai_expert = AIExpert(name=..., agent_uuid=None)
    self.session.add(ai_expert)
    self.session.flush()  # 拿到 id，但没 commit

    # 写选项
    for option in output_labels:
        expert_option = AIExpertOption(expert_id=ai_expert.id, ...)
        self.session.add(expert_option)
        self.session.flush()

    # 调外部服务
    agent_id = AiAgentService().create_agent(data)
    ai_expert.agent_uuid = agent_id

    self.session.commit()  # 全部成功，提交
except Exception as e:
    self.session.rollback()  # 出错，全部撤销
    if agent_id:
        AiAgentService().delete_agent(agent_id)  # 清理外部资源
```

编辑时选项的增量对比：
```python
existing_options_map = {opt.id: opt for opt in existing_options}
new_option_ids = set()

for option in submitted_labels:
    if option.id and option.id in existing_options_map:
        # 更新已有
        existing_options_map[option.id].option_name = option.name
        new_option_ids.add(option.id)
    else:
        # 新增
        new_opt = AIExpertOption(expert_id=..., option_name=option.name)
        self.session.add(new_opt)
        self.session.flush()
        new_option_ids.add(new_opt.id)

# 删除被移除的
for opt_id in existing_options_map:
    if opt_id not in new_option_ids:
        session.query(AIExpertOption).filter(id==opt_id).delete()
```

### 术语

- **DB（Database）**：数据库。后端存数据的地方，类比前端 localStorage 但持久化、支持复杂查询
- **事务（Transaction）**：一组"要么全做要么全不做"的数据库操作。`commit` 确认，`rollback` 撤销
- **ORM（SQLAlchemy）**：用 Python 对象操作数据库。`AIExpert(name="xxx")` 等价于 `INSERT INTO ai_experts ...`
- **软删除**：不真删数据，只把 `status` 设为 0。好处是数据可恢复、不影响外键
- **一对多（1:N）**：一个专家对多个标签选项。`ai_experts` 1条 ↔ `ai_expert_options` N条，用 `expert_id` 关联
- **`raise BasicException(...)`**：Python 的 `throw new Error(...)`，抛出业务异常返回给前端
- **`except Exception as e`**：Python 的 `catch(e) {...}`，捕获异常

### 待验证问题

1. 高级配置中的模型选择和温度/最大长度存在 `ext_data` 里，但后端 `create_agent` / `run_agent` 调用时还没用到这些参数。Phase 4 即时试用时需确认 AgentHub 接口是否支持
2. `introduction`（介绍）存在 `ext_data.introduction` 而非独立字段，如果后续需按介绍搜索或在卡片上展示，可能要加独立数据库字段

---
