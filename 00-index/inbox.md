# 待整理收件箱（inbox）

> 所有会话沉淀的草稿先进这里，按写入时间从上到下排列。
> 写入由全局 skill `knowledge-base-deposit` 自动完成，整理分发由仓库 skill `knowledge-base-inbox-triage` 完成。
> 流程说明见 [`知识库使用方法`](./index.md)。

---

## 2026-07-03 · yy-auth 组织层级体系理解

**分类建议**：`03-backend/yy-auth/组织层级.md`

### Organization 表层级字段

| 字段 | 类型 | 说明 |
|------|------|------|
| `top_org_id` | INT | 顶级组织ID，0=自己就是顶级 |
| `parent_org_id` | INT | 父组织ID，0=顶级组织 |
| `org_level` | TINYINT | 组织层级，1=顶级 |
| `org_path` | VARCHAR(100) | 组织路径，格式 `/1/3/5/`（从根到自身） |

### 一级组织（顶级）三条件同时成立

- `top_org_id = 0`
- `parent_org_id = 0`
- `org_level = 1`

### org_path 维护机制

- 建表时全量初始化：`UPDATE SET org_path = CONCAT('/', id, '/')` (yy_auth_0006.sql)
- 创建组织时自动写入：`_update_org_path(org, parent_org_id)` → 顶级: `/{id}/`，子级: `{parent.org_path}{id}/`
- 已被 yy-auth 内部权限系统使用：`get_org_admin_accessible_org_ids` 用 `org_path.like()` 查所有下级

### get_org_list 返回逻辑

- **超管不传 parent_org_id**：返回所有 `parent_org_id=0` 的组织（即所有一级组织）
- **组织管理员不传 parent_org_id**：返回 `parent_org_id=自身org_id` 的直接子组织 + 自身
- **显式传 parent_org_id**：返回该 parent 的直接子组织

### 向上穿透方案（用于专家可见性）

子组织用户 → 调 `get_org_detail` 获取 `top_org_id` → 一级组织用户 `top_org_id=0` 时用自身 org_id → 匹配关系表中配置的一级组织 org_id

---
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

## [2026-06-24 11:10] 用原型做"视觉对齐"的方法论：核对真实结构、保持自己代码风格、数据差异留占位

- 主题：拿产品 HTML 原型做高保真 UI 对齐时，怎么既还原视觉又不污染自己的代码风格，以及遇到原型与项目数据模型不一致时怎么处理
- 关联仓库/项目：ai-app-aiexpert-backend

### 结论 / 认知

1. **"视觉对齐原型" ≠ "照搬原型代码"**。原型是设计参考稿，里面大量行内 style、写死 hex、`var(--xxx)`、`onclick="xxx()"` 字符串都不能搬进项目。正确做法是把原型的**视觉规格**（色值、圆角、间距、字号、配色规律）提取出来，用项目自己的写法（scoped scss 嵌套、computed、组件事件）重新实现。改之前先跟用户确认这个边界，能省掉返工。

2. **动手前一定先核对原型的真实 DOM 结构和 render 函数，别凭截图臆测**。这次最大的一个坑：一开始凭"专家广场"几个字定位错了目标页（原型里有两套相似页面：3140 行「AI专家广场」和 10561 行「智能体广场」，真正要的是后者）。靠用户给的关键词重新 grep、逐行读 render 函数（`renderSqBuiltinCard`/`renderFactoryCard`）才确认真实的卡片结构、按钮文案、配色变量。

3. **原型里"看起来矛盾"的设计，先核对再下结论，往往是它本身就这样**。这次发现页面同时用了两个蓝紫色——Tab 下划线 `#2563eb`、按钮/交互 `#6366f1`，一度以为自己看错。查了 `:root` 的 CSS 变量定义（`--primary` 只定义一处 = `#2563eb`，按钮是行内写死 `#6366f1`）才确认是原型本身的设计，照搬即可，不要自作主张统一。

4. **凭截图二次核对能纠正第一版的猜测**。第一版我把自建专家做成了绿色「●自建」标签，结果用户给的原型截图显示"我创建的"卡片也是按通用/专项显示（没有"自建"这个标签）。看真实截图比看代码片段更能发现这类语义错误。

5. **原型与项目数据模型不一致时：让用户拍板映射方案 + 留 TODO 占位，不要擅自猜**。原型里自建专家分通用/专项（靠 `type: general/special` 字段），但项目数据模型自建专家只有 `expert_type=0`，缺这个维度字段。处理方式：跟用户确认后先按「通用」占位渲染，代码里写明 TODO 注释（"待后端补 general/special 字段后按真实类型渲染"），既不阻塞样式落地，也不埋下错误数据假设。

6. **FontAwesome 找等价图标替换原型 SVG 的优先级**：原型用的是内联 SVG，项目用 FA 图标库，应优先在 FA 里找语义相近的图标（盾牌 `shield-halved`、星 `star`、播放 `play`、编辑笔 `pen-to-square`、部署云 `cloud-arrow-up`、垃圾桶 `trash-can`），实在没有再用原型 SVG。新图标要在 `src/assets/utils/fortawesome.ts` 注册，且要确认 `node_modules/@fortawesome/pro-solid-svg-icons/` 下真有对应 `.js` 文件（拼错名字编译不报错，但运行时图标空白）。

### 命令 / 代码片段

```bash
# 浏览器 MCP 工具不可用时，用 curl 探测 dev server + 验证 SFC 是否编译通过
curl -s -o /dev/null -w "%{http_code}" --max-time 5 "http://localhost:6010/ai-app-aiexpert-backend/"
# 拉取编译后的 .vue（vite 会返回转译后的 JS，若有错会是错误覆盖层），grep error 判断
curl -s --max-time 8 "http://localhost:6010/<base>/src/views/components/expert-card.vue" | grep -i "error"

# 确认 FA 图标在 pro-solid 包里真实存在（避免拼错名字导致运行时空白图标）
ls node_modules/@fortawesome/pro-solid-svg-icons/faPenToSquare.js
```

```vue
<!-- 数据模型缺字段时的 TODO 占位写法（保持注释说明 why） -->
<!-- TODO: 自建专家(expert_type=0)暂按「通用」占位显示。
     原型中自建专家也分通用/专项，但当前数据模型缺 general/special 字段，
     待后端补充后再按真实类型渲染。 -->
const categoryClass = computed(() => {
  return props.item.expert_type === 2 ? 'special' : 'common'
})
```

### 术语
- **高保真对齐**：不只是"差不多像"，而是色值/圆角/间距/字号逐项对齐设计稿
- **render 函数核对**：原型若是 JS 动态渲染卡片，真实 DOM 结构和文案要去读它的 `xxxCard.innerHTML = ...` 拼接逻辑，而不是看静态 HTML 那几个占位

### 待验证问题
- 自建专家的通用/专项维度，后端最终用哪个字段承载（复用 `output_type` 还是新增 `type` 字段）？确定后要回来把 expert-card.vue 的 TODO 占位逻辑改成真实判定
- "我创建的"卡片 4 个按钮（测试/编辑/部署/删除）在 3 列窄卡片下是否会挤/换行？已加 `nowrap` 但未经浏览器实测（本次 MCP 浏览器工具不可用）

---

## [2026-06-23 16:50] Ant Design Vue Modal 样式穿透与弹窗布局最佳实践

- 主题：ant-design-vue 3.x Modal 组件的样式穿透问题及弹窗内容滚动+底部固定的布局方案
- 关联仓库/项目：ai-app-aiexpert-backend

### 结论 / 认知
1. **scoped 样式中 `:deep(.ant-modal-body)` 对 teleport 渲染的 Modal 无效**。因为 Modal 通过 teleport 渲染到 `document.body`，与组件的 scoped scope attribute 不匹配。
2. **解决方案：`wrapClassName` + 全局样式**。给 `<a-modal>` 设置 `wrapClassName="my-modal-wrap"`，然后在全局 SCSS（不带 scoped）中写 `.my-modal-wrap .ant-modal-body { ... }`。
3. **弹窗"上滚下固定"布局**：modal body 设为 `display: flex; flex-direction: column; max-height: 78vh;`，内容区域 `flex: 1; overflow-y: auto; min-height: 0;`，底部 footer `flex-shrink: 0;`。
4. **全局 disabled 按钮样式覆盖自定义深色按钮**：全局样式中 `&[disabled] { background: #edf2fa; color: #81889c; }` 会覆盖自定义深色按钮。需用更高权重选择器 `.run-btn.ant-btn.ant-btn-primary[disabled]` + `!important` 来覆盖。

### 命令 / 代码片段
```vue
<!-- Modal 使用 wrapClassName -->
<a-modal wrapClassName="expert-detail-modal-wrap" :visible="visible" :footer="null">
  <div class="scrollable-content">...</div>
  <div class="fixed-footer">...</div>
</a-modal>
```

```scss
// 全局样式（非 scoped）
.expert-detail-modal-wrap {
  .ant-modal-body {
    padding: 0 !important;
    display: flex !important;
    flex-direction: column !important;
    max-height: 78vh !important;
  }
}

// 覆盖 disabled 按钮
.run-btn.ant-btn.ant-btn-primary[disabled] {
  background: #1f2430 !important;
  color: rgba(255,255,255,0.45) !important;
}
```

### 术语
- **teleport**：Vue 3 内置组件，将子树渲染到 DOM 中另一个位置（Modal 渲染到 body 下），导致 scoped 样式失效
- **wrapClassName**：ant-design-vue Modal 的属性，给最外层 wrapper div 添加 class，可用于全局样式定位

### 待验证问题
- ant-design-vue 4.x 是否改用 `rootClassName` 或 Composition API 的 `useStyle` 解决此问题？

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

## [2026-06-23 17:40] Vuex actions 模块中 export 非函数值的陷阱 + antdv Dropdown 自定义面板

- 主题：Vuex namespaced module 的 actions 文件不能 export 普通对象；antdv Dropdown 的 overlay slot 实现自定义面板
- 关联仓库/项目：ai-app-aiexpert-backend

### 结论 / 认知

1. **Vuex actions 文件中所有 export 的成员都会被当作 action handler 注册**。如果 export 一个普通对象（如 `export const ENV_MAP = {...}`），TypeScript 会报"不能将类型 Record<string, string> 分配给类型 Action<S, R>"。解法：把非 action 的常量抽到独立 constants.ts 文件中 export。

2. **antdv `a-dropdown` 的 `#overlay` slot 可以放任意内容**，不局限于 `a-menu`。只要在 slot 中放一个带样式的 div，就能实现自定义下拉面板（如 Checkbox 列表、表单等）。关键点：
   - 面板内元素点击时需 `@click.stop` 阻止冒泡，否则 Dropdown 会自动关闭
   - placement 设为 `topRight`（向上弹出）可避免被页面底部截断

3. **后端接口的环境白名单要和前端常量同步维护**。前端 `DEPLOY_ENV_OPTIONS` 和后端 `VALID_ENVIRONMENTS` 如果不一致，会导致前端选了某个环境但后端拒绝。MVP 阶段两边手动对齐（都是 wx/wa），后续可考虑前端启动时调一个"获取可用环境列表"接口来动态获取。

### 命令 / 代码片段

```typescript
// ❌ 错误：在 actions.ts 中 export 普通对象
export const ENV_MAP = { wx: 'WX系统' }  // Vuex 会尝试把它注册为 action

// ✅ 正确：抽到独立文件
// constants.ts
export const ENV_MAP = { wx: 'WX系统' }
// actions.ts
import { ENV_MAP } from './constants'
```

```vue
<!-- antdv Dropdown 自定义面板（非 Menu） -->
<a-dropdown :trigger="['click']" placement="topRight">
  <a-button>部署到环境 ▾</a-button>
  <template #overlay>
    <div class="custom-panel">
      <div v-for="env in options" @click.stop="toggle(env)">
        <a-checkbox :checked="isDeployed(env)" />
        <span>{{ env.label }}</span>
      </div>
    </div>
  </template>
</a-dropdown>
```

### 术语
- **Vuex Module actions 注册机制**：Vuex 在创建 namespaced module 时，会遍历 actions 对象的所有 key-value，期望每个 value 都是函数（ActionHandler）或 `{root, handler}` 对象
- **overlay slot**：antdv Dropdown 的具名插槽，用于自定义下拉内容（替代默认的 Menu）

---

## [2026-06-23 15:30] AgentHub run vs debug 接口选型 + Ant Design Vue 版本陷阱

- 主题：AI 专家后台即时试用功能的接口选型决策，以及 Ant Design Vue 3.x/4.x API 差异踩坑
- 关联仓库/项目：ai-app-aiexpert-backend、zhinao-plan

### 结论 / 认知

1. **AgentHub 的 run 和 debug 接口的使用场景完全不同**：
   - `run_agent(agent_uuid, text)` — 针对**已注册**的 Agent（有 agent_uuid），直接用 uuid 运行，Agent 已保存好所有配置
   - `debug_agent(agent_type, config, text)` — 针对**未创建**的 Agent（创建前预测试），需要传完整 config（definition/constraint/output）
   - 后台管理的"即时试用"是对已部署专家测试 → 用 run
   - 创建页面的"预测试"是对还没保存的配置测试 → 用 debug

2. **AgentHub 返回的结果格式因 agent_type 而异**：
   - `labeler`：response JSON 中 `label` 字段是 `[{"标签名": option_id}, ...]`
   - `classifier`：分类结果可能在 `content.class` 中
   - `checker`：可能返回非 JSON 纯文本
   - 需要 `_parse_run_result()` 统一适配这三种情况

3. **Ant Design Vue 3.x 和 4.x 的 Modal API 命名不同**：
   - 3.x：`:visible` 控制显隐
   - 4.x：`:open` 控制显隐（breaking change）
   - 一定要先 `cat package.json | grep ant-design-vue` 确认版本再写代码

### 命令 / 代码片段

```python
# AgentHub run 接口调用（已注册 Agent）
agent_service = AiAgentService()
result = agent_service.run_agent(expert.agent_uuid, test_content)
# 返回: {"response": "...", "elapsed_ms": 846, "agent_type": "labeler"}
```

```python
# 结果解析核心逻辑
response_data = json.loads(agent_result["response"])
# labeler: response_data["label"] = [{"食品安全": 181}, ...]
# classifier: response_data["content"] = '{"class": "政治类", "core_event": "..."}'
# checker: response 可能是纯文本 "是"
```

### 待验证问题

1. AgentHub `run_agent` 是否支持传 `model_id` / `temperature` 等参数？目前 `ext_data` 中保存了这些高级配置但没有透传
2. Puppeteer 为何无法访问 Vite 3 dev server（headless Chrome 被 Vite 的 base path 中间件拦截）—— 是否有 workaround？

---

## [2026-06-24 14:30] 详情弹窗"部署"按钮按专家类型分流两套交互

- 主题：同一个「部署到环境」按钮，精品专家走下拉即时部署、自建专家走二级弹窗，如何在 Vue3+Vuex 里优雅分流
- 关联仓库/项目：ai-app-aiexpert-backend（Vue3+Vite+Vuex+AntDV）

### 结论 / 认知

1. **同名按钮不同交互，靠 getter 分流，别在模板里堆条件**：
   - 在 store 里加语义化 getter `isCustomExpert = state.expert?.expert_type === 0`
   - 模板用 `v-if="isCustomExpert"`（开二级弹窗）/ `v-else-if="canDeploy"`（开下拉）/ `v-else`（兜底关闭）
   - 比在模板里直接写 `expert_type===0` 可读性强，也方便复用

2. **二级弹窗（弹窗里再开弹窗）要独立挂载，不要嵌套在父 a-modal 内部**：
   - 把 `<DeployManageModal />` 放在父 `</a-modal>` 之后、与父 modal 同级（Vue3 template 支持多根节点）
   - 各自用 store 里独立的 visible 状态控制，避免 teleport 层级 / z-index / 关闭联动的坑

3. **原型环境值大写、后端字段小写 —— 转换放在 store action 边界**：
   - 原型 `_selectedDeployEnvs` 用 'WX'/'WA'/'none'；后端 `support_env` 存 'wx,wa'
   - 进弹窗 `openDeployManage`：support_env.split(',').toUpperCase() 初始化选中
   - 出弹窗 `confirmDeployManage`：选中 .toLowerCase().join(',') 写回
   - 转换集中在 store，组件层只认一套（大写卡片 value），不散落

4. **环境卡片"互斥但可多选"逻辑**（WX/WA 可同时选，但与 none 互斥）：
   - 点 none → 直接 `['none']`
   - 点 WX/WA → 先剔除 none，toggle 该项，若清空则回落 `['none']`

5. **组织下拉**：原型手写了 dropdown，在 antdv 项目里直接用 `a-select mode="multiple"` 更省事可维护，视觉差异可接受

6. **协作模式：数据源/接口未定时，写进 spec「待产品确认点」而非擅自决定**：
   - 本次组织选项 + 确认提交接口都未定 → 与用户确认后本期硬编码 + mock，把 PM-1/PM-2 显式写进 tasks.md
   - 既不阻塞前端样式对齐，又给产品/后端留下可追溯的决策项

### 命令 / 代码片段

```ts
// store getter 分流
export const isCustomExpert = (state: any) => state.expert?.expert_type === 0

// 环境值大小写转换（store action 边界）
const envs = (state.expert?.support_env || '')
  .split(',').map((s: string) => s.trim().toUpperCase()).filter(Boolean)
// 提交时：envs.map(e => e.toLowerCase()).join(',')
```

```vue
<!-- 二级弹窗独立挂载，与父 modal 同级 -->
  </a-modal>
  <DeployManageModal />
</template>
```

### 待验证问题

1. 自建专家若同时也有 general/special 维度（待后端补字段），分流逻辑是否需要再细化
2. 组织多选最终是否需要接真实组织列表接口（PM-1 待确认）
3. 确认提交是否要扩展 deploy_expert 入参接收 accuracy/org（PM-2 待确认）

---

## [2026-06-24 16:10] Ant Design Vue Modal 改不动外壳样式的根因：Teleport 渲染到 body，scoped :deep 选不中

- 主题：为什么给 a-modal 写了圆角/隐藏关闭按钮的 scoped 样式不生效，根因与正确改法
- 关联仓库/项目：ai-app-aiexpert-backend

### 结论 / 认知

1. **现象**：在弹窗组件的 `<style scoped>` 里写 `:deep(.ant-modal-content){border-radius:16px}`、`:deep(.ant-modal-close){display:none}`，编译没报错，但页面上完全不生效——弹窗还是直角、默认关闭按钮还在。

2. **根因**：Ant Design Vue 的 Modal（以及 Drawer、message、Dropdown overlay 等）内部用 **Teleport 把真实 DOM 节点渲染到 `<body>` 末尾**，不在当前组件的 DOM 子树里。而 `scoped` 的作用域边界恰恰是"组件自己的 DOM 子树"——它给元素打 `data-v-xxx` 属性、给选择器加 `[data-v-xxx]` 限定。Teleport 出去的节点拿不到这个属性匹配，所以 scoped（哪怕加 `:deep`）选不中。

3. **正确改法**：凡是要改 Modal 的**外壳层**（`.ant-modal-content` / `.ant-modal-close` / `.ant-modal-mask` / `.ant-modal-body` 这些）：
   - 给 modal 传一个 `wrapClassName="xxx-wrap"`（Ant 会把它加到 Teleport 出去的最外层 wrap 上）；
   - 把样式写进**全局（非 scoped）** 的 `global.scss`，用 `.xxx-wrap .ant-modal-content{...}` 这种带 wrap 前缀的选择器提权，避免污染其他弹窗。
   - 组件内部 body 里的**自定义内容**（自己写的 header、按钮、卡片）才用 scoped，那些确实在组件子树内。

4. **判断口诀**：样式写了不生效，先别怀疑选择器拼错——先想"这个节点真实挂在哪"。经 Teleport / Portal 渲染的组件，节点都跑到 body 了，scoped 天然管不到。

### 命令 / 代码片段

```vue
<!-- 组件里：传 wrapClassName -->
<a-modal wrapClassName="deploy-manage-modal-wrap" :footer="null">
  <!-- 这里面是组件子树，scoped 生效 -->
</a-modal>
```

```scss
// global.scss（非 scoped）：靠 wrap 前缀提权，只影响这个弹窗
.deploy-manage-modal-wrap {
  .ant-modal-content { border-radius: 16px !important; overflow: hidden !important; }
  .ant-modal-close   { display: none !important; }  // 隐藏默认无边框关闭 X
}
```

### 术语

- **Teleport**（Vue3 内置组件，对应 React 的 Portal）：把一段模板渲染到 DOM 树的另一个位置（通常是 body），常用于弹窗/浮层，避免被父容器的 `overflow:hidden`、`z-index`、`transform` 影响。
- **scoped 的边界**：scoped 通过给组件内元素加唯一 `data-v-hash` 属性 + 选择器追加属性限定来隔离样式，作用域就是"带这个 hash 的 DOM 子树"。Teleport 出去的节点不带 hash，所以在作用域外。

---

### 2026-06-25 · Python 服务端跨服务 HTTP RPC 调用

**场景**：zhinao-plan 需要获取 yy-auth 的组织列表数据。

**分层架构约定**：
- `core/` 目录放公共基础设施（封装外部服务调用），多个业务模块可复用
- `core/yy_auth.py :: AuthService` 封装调 yy-auth 的 HTTP 请求，暴露语义化方法（`get_user_info()`、`get_org_list()` 等）
- 业务模块（如 `apis/expert_backend/views.py`）通过 `AuthService(headers)` 调用，不直接写 `requests.get()`

**Nacos 配置中心**：
- 配置不在本地代码文件里，而是运行时从 Nacos 动态注入到 `settings` 对象
- `settings.YY_AUTH.HOST` 等值在 Nacos 配置中心的 DATA_ID=`zn_plan` 里维护
- 本地 `settings_dev.yml` 只存 Nacos 连接信息，启动时 `settings.update(app_config)` 合并远端配置
- 好处：不同环境（dev/test/prod）的服务地址自动切换，不硬编码在代码里

**跨服务调用踩坑**：
1. **URL 前缀**：yy-auth 服务自身带 `/api/user` 前缀，网关转发不剥离。必须 curl 验证真实路径，不能凭路由定义猜。
2. **Headers 透传**：要传完整的原始 headers（和已有的 `get_user_info()` 保持一致），不要只提取 Authorization，因为 yy-auth 的认证中间件可能依赖其他 headers。
3. **权限校验**：yy-auth 的 `get_org_list` 需要超管/组织管理员权限，普通用户 token 会 401。

**Dynaconf 动态配置**：
```python
from dynaconf import Dynaconf
settings = Dynaconf(settings_files=[...])
# 启动时从 Nacos 拉配置并合并
nacos_config = NacosConfig()
settings.update(nacos_config.get_config())
# 之后可直接用 settings.YY_AUTH.HOST 访问
```

---

### 2026-06-25 · expert_type 扩展设计思考

**需求矛盾**：后管创建的专家需要同时满足两个条件
- 后管里按 user_id 归入"我创建的"（类似 type=0 的行为）
- 前台里归入"精品专项"（类似 type=2 的行为）

**解决方案**：新增 `expert_type=3`，让不同端做不同路由：
- 后管 `my_experts()`: 只查 `expert_type == 3`
- 前台 `list_all_ai_expert()`: 把 `expert_type=3` 也归入 `builtin_special`
- 前端 `getSceneType()`: `[2, 3].includes(expert_type)` → `'special'`

**教训**：不要一开始就否定"加新枚举值"——当一个字段需要在不同上下文表现不同行为时，加新值是最清晰的方案，比用 flag 组合或条件判断更可维护。

---

### 2026-06-26 · yy-auth 组织体系：树结构 + 按用户权限过滤

**Organization 表关键字段（树结构）**：
| 字段 | 作用 |
|------|------|
| `parent_org_id` | 直接父级（0=顶级） |
| `top_org_id` | 所属的顶级组织（0=自己就是顶级） |
| `org_level` | 层级深度（1=顶级, 2=二级...） |
| `org_path` | 完整路径（如 `/1/3/5/`，冗余字段加速祖先/后代查询） |

**`get_org_list` 按用户身份过滤**：
- 超管（`is_superuser=True`）→ 看所有一级组织（`parent_org_id=0`）
- 组织管理员 → 只看自己的 org + 直接下级
- 普通用户 → 403 无权

**返回的是扁平一层**，不递归展开子树。要看更深层级需再次调用传 `parent_org_id`。

**核心认知**："不同环境展示不同组织"≠ 需要建环境-组织映射表。真正的原因是不同环境用了不同身份的管理员 token，yy-auth 按 token 对应的 org_id 天然过滤。

---

### 2026-06-26 · 三元关系表设计：专家 × 环境 × 组织

**场景**：需要精确控制"哪个环境的哪个组织能看到某专家"。

**表设计**：
```sql
CREATE TABLE ai_expert_deploy (
  expert_id INT NOT NULL,
  environment VARCHAR(20) NOT NULL,  -- wx/wa/test-wx
  org_id INT NOT NULL,
  org_name VARCHAR(100),  -- 冗余，避免每次查 yy-auth
  accuracy VARCHAR(20),
  UNIQUE KEY (expert_id, environment, org_id)
);
```

**读写分离思维**：
- **写入**（后管管理员）：多选环境 × 多选组织 = 多条记录
- **读取**（前台用户）：用户身份天然单值（1 个 org_id + 1 个 environment），`WHERE env=? AND org_id=?` 查出可见专家

---

### 2026-06-26 · 无界（Wujie）微前端：宿主嵌入子应用的两种方式

**方式 A：WujieApp 组件（宿主自有）**

`ai-app-admin` 在 `components/wujie-app/index.vue` 里封装了一个通用组件：
```vue
<template>
  <div ref="aiApp"></div>
</template>
<script setup>
onMounted(() => {
  window.__MicroAPP__.basic.startApp({
    name: config.name,    // 子应用注册名
    url: config.url,      // 子应用部署地址
    alive: true,          // 保活模式
    el: aiApp.value,      // 挂载 DOM
    props: { ... }
  })
})
</script>
```
使用方：直接 `import WujieApp from '@/components/wujie-app/index.vue'`，传 config 即可。

**方式 B：layout-app 组件（基座共享组件库注入）**

`ai-app-discovery-custom-event` 等应用用的是基座提供的 `<layout-app>`：
```ts
// main.ts
window.__MicroAPP__.component.install([{ lib: 'layout', doc: document }], () => {
  app.mount('#vite-xxx')
})
```
调用 `component.install` 后，基座的共享组件库（`ai-app-component-basic` 的 layout 模块）被注入到当前沙箱，`<layout-app>` 就可以在模板中直接用了。

**什么时候用哪个**：
- 宿主本身是 Vue 应用且有自己的 WujieApp 封装 → 用方式 A
- 子应用需要在无界沙箱内再嵌套另一个子应用 → 用方式 B（依赖基座 component.install）

**子应用 URL 的拼接**：
- 线上：`window.app_domain + '/ai-app-xxx/'`（app_domain 由基座注入，如 `https://wx.di.360.cn`）
- 本地开发：fallback 到 `http://localhost:PORT/ai-app-xxx/`

---

## [2026-07-22 18:26] 通过云堡垒机和 FinalShell 自助查询 Docker 日志

- 主题：理解云堡垒机、FinalShell、测试服务器和 Docker 容器之间的关系，并沉淀可复用的日志查询方法
- 关联仓库/项目：hot-topic-analysis

### 结论 / 认知

排查测试环境日志时，实际链路是“本机客户端 → 云堡垒机 → 测试宿主机 → Docker 容器 → 应用日志”。堡垒机网页和 FinalShell 都只是连接入口，进入资产前看到的 `[Host]>` 是资产搜索器，不是 Linux Shell；只有提示符变为 `[用户@服务器 ~]$` 后，`hostname`、`docker` 等命令才会真正执行。

FinalShell 下方文件区经过堡垒机映射后会出现虚拟路径，个人可读写目录最终对应测试服务器的 `/home/<用户>`；系统目录或其他用户目录变灰通常是权限限制。下方“命令”区适合保存只读快捷命令，勾选“末尾添加回车符 CR”后会立即执行；需要先修改参数的模板可以不勾选，使用 `read -p` 交互读取任务 ID 的模板则可以勾选。

日志查询要先确认服务器和容器身份，再按时间和任务 ID 缩小范围。`docker logs -f` 是持续追踪，用 `Ctrl+C` 中断；`less` 是分页阅读器，底部出现 `(END)` 时用 `q` 退出。`less -S` 会禁止长行自动折行，适合查看包含长 JSON 的日志，左右方向键可横向移动。

应用日志前出现两份时间时，前者是 `docker logs --timestamps` 添加的 UTC 时间，后者是应用输出的北京时间，两者相差 8 小时但代表同一时刻。人工阅读可看北京时间，精确比较事件顺序可看 Docker 的小数秒时间；不需要 Docker 时间时去掉 `--timestamps`。

### 命令 / 代码片段

确认当前服务器身份：

```bash
hostname && whoami && pwd
```

定位目标项目容器：

```bash
sudo docker ps --format 'table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}' | grep 'hot-topic-analysis'
```

实时查看最近 200 行日志：

```bash
sudo docker logs -f --tail 200 hot-topic-analysis-container
```

按任务 ID 分页查看完整上下文，不显示 Docker UTC 时间：

```bash
read -r -p '请输入任务ID: ' TASK_LOG_ID; sudo docker logs --since 24h hot-topic-analysis-container 2>&1 | grep -C 200 "$TASK_LOG_ID" | less -S
```

按任务 ID 导出日志并校验大小：

```bash
read -r -p '请输入任务ID: ' TASK_LOG_ID; sudo docker logs --since 24h hot-topic-analysis-container 2>&1 | grep -C 300 "$TASK_LOG_ID" > "/home/<用户>/${TASK_LOG_ID}.log"; ls -lh "/home/<用户>/${TASK_LOG_ID}.log"; wc -l "/home/<用户>/${TASK_LOG_ID}.log"
```

只查看任务相关的入口接口调用：

```bash
read -r -p '请输入任务ID: ' TASK_LOG_ID; sudo docker logs --since 24h hot-topic-analysis-container 2>&1 | grep -F "$TASK_LOG_ID" | grep -E 'views \| (GET|POST|PATCH|DELETE|run|resume|export)' | less -S
```

常见符号：`|` 把左侧输出交给右侧；`2>&1` 把错误输出并入正常输出；`>` 覆盖写文件；`>>` 追加写文件；`grep -C 200` 显示命中位置前后各 200 行。

### 术语

- `堡垒机`：公司统一的服务器访问入口，负责认证、授权和操作审计。
- `SSH`：远程登录 Linux 服务器的协议；FinalShell 是 SSH 客户端。
- `容器`：项目在服务器上的隔离运行单元，同一宿主机可以混部多个项目。
- `主机密钥指纹`：SSH 服务器身份摘要，首次连接应核对后保存；后续若突然变化，应先找运维确认。
- `CR`：回车符。快捷命令末尾添加 CR，相当于发送后自动按 Enter。
- `SFTP`：基于 SSH 的文件传输能力；经过堡垒机时可能显示虚拟目录或受权限限制。

### 待验证问题

- 测试环境重新发布后是否保留旧容器日志，取决于部署脚本和 Docker 日志策略；查不到历史日志时需确认是否有集中式日志平台或宿主机归档。
- FinalShell 文件面板能否稳定透传所有目标资产的 SFTP 权限，需要结合堡垒机策略继续观察。

---

## [2026-07-22 19:31] 从复制命令到理解 Docker 日志查询

- 主题：理解 Linux/Docker 日志命令的组成方式，以及数据库有任务但当前容器查不到日志的原因
- 关联仓库/项目：hot-topic-analysis

### 结论 / 认知

一条日志查询命令可以按管道符拆成多个独立程序：`docker logs` 只负责输出指定容器当前保留的日志，`grep` 只把这些日志当普通文本筛选。Docker 不知道搜索内容是任务 ID、错误关键词还是中文话题名；管道符左边属于 Docker，右边属于 `grep`。

数据库记录与容器日志生命周期不同。数据库中的任务可以长期存在，而 `docker logs` 绑定具体容器实例。通过 `docker inspect` 看到当前容器的 `Created` 与 `StartedAt` 只相差不到 1 秒，说明发布系统删除旧容器后创建了新容器，而不是简单重启；旧任务早于新容器创建时间，因此当前 `docker logs` 无法命中，但之前导出到宿主机个人目录的日志快照仍可读取。时间末尾的 `Z` 表示 UTC，换算北京时间需加 8 小时。

命令中的名称和字段需要区分：`docker ps --format` 中的 `.Names`、`.Image`、`.Status`、`.Ports` 是 Docker 固定模板字段；`\t` 是制表符，用于分列。`grep 'hot-topic-analysis'` 是对整行做包含匹配，不只检查容器名；`docker inspect hot-topic-analysis-container` 则把完整容器名当作精确查询对象，因此不需要再接管道和 `grep`。格式字符串中的中文只是自定义输出标签，双大括号中的字段才是固定语法。

### 命令 / 代码片段

```bash
echo "主机名：$(hostname)"
echo "用户：$(whoami)"
echo "当前目录：$(pwd)"

sudo docker ps --format 'table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}' | grep 'hot-topic-analysis'

sudo docker inspect --format '容器ID={{.Id}} 创建={{.Created}} 启动={{.State.StartedAt}} 镜像={{.Config.Image}}' hot-topic-analysis-container

sudo docker logs --timestamps --since 24h hot-topic-analysis-container 2>&1 \
  | grep -F -C 200 '任务ID'

sudo docker logs -f --tail 200 hot-topic-analysis-container 2>&1 \
  | grep --line-buffered -Ei 'traceback|exception|error|timeout'

echo $?
```

`grep` 返回 `0` 表示命中，`1` 表示命令正常但没有匹配，`2` 表示参数或表达式错误。

### 术语

- `ps`：`process status`，Linux 中查看进程状态；`docker ps` 借用这个名称查看容器状态。
- `pwd`：`print working directory`，显示当前工作目录；`$PWD` 是 Shell 保存的当前目录变量。
- `grep`：名称源自 `g/re/p`，即全局搜索正则表达式并打印匹配结果；`p` 是 `print`。
- `ls -lh`：`list + long format + human-readable`，详细列出文件并使用 K/M/G 等易读单位显示大小。
- `2>&1`：把标准错误合并到标准输出，使后续管道也能筛选异常内容。
- `-F`：按普通字符串匹配，查任务 ID 时比正则表达式更直观。
- `-C 200`：显示命中行前后各 200 行上下文。
- 行尾 `\`：命令续行符，表示下一行仍属于同一条命令。

### 待验证问题

- 测试环境是否接入集中式日志平台；如果已接入，容器发布后可从平台查询旧实例日志，不必依赖人工导出的快照。
- Docker 日志轮转的大小和保留份数配置，决定同一容器实例中历史日志能保留多久。

---

## [2026-07-30 15:33] 极库云前端流水线部署与排障

- 主题：把前端项目从人工打包交付改造成极库云自动构建、上传、备份和发布的完整流水线
- 关联仓库/项目：ai-app-keyword-monitor；极库云私有化流水线

### 结论 / 认知

传统服务器上的前端静态资源部署，最小闭环是：拉取代码 → 安装依赖并构建 → 压缩构建目录 → 上传到服务器临时目录 → 远程 Shell 校验、备份和替换。上传任务不应直接覆盖 Nginx 正在读取的目录，应先传到 `/tmp`，完整校验后再切换，避免用户读到只上传了一部分的版本。

本次项目的 Vite 构建产物不是常见的 `dist/`，而是 `ai-app-keyword-monitor/`。服务器上的实际部署目录是 `/data/apps/ekm-front-install-v1.2.0-new/html/ai-app-keyword-monitor`，Nginx/OpenResty 内部根目录是 `/usr/share/nginx/html`，宿主机目录通过原有部署结构提供给 Nginx。

流水线操作远程主机必须使用公共账号，不能使用个人账号或 root。公共账号本身不需要拥有部署目录，但流水线无法交互输入密码，所以必须验证 `sudo -n id` 能直接返回 root。正式目录、备份目录均为 `root:root`、权限 `755`，发布命令因此统一通过免密 sudo 执行。更安全的长期做法是让运维只授权一个由 root 管理的固定发布脚本，而不是给公共账号开放任意 sudo 命令。

发布脚本先在固定临时目录解压并校验 `index.html`、`assets/`，再把当前目录移动为上一版本备份，最后把已完整解压的新目录移动到正式位置。新版本校验失败时恢复备份。当前方案固定保留一份 `ai-app-keyword-monitor-pipeline-previous`，连续执行两次流水线均成功，且第二次发布后正式目录时间晚于备份目录，证明重复发布和上一版本备份逻辑有效。

极库云的“发送 Shell 指令”会先经过 Jenkins Groovy，再交给远程 Shell。脚本中的 `$APP_NAME` 被 Groovy 抢先解析，导致 `MissingPropertyException: No such property: APP_NAME for class: WorkflowScript`；即使加反斜杠，平台生成脚本时仍可能把转义处理掉。最终通过使用不含 Shell 变量和 `$` 的固定路径脚本绕开两层解析问题。遇到这类错误时要先看远程连接日志：如果尚未出现 `sshScript` 或远程命令输出，说明服务器文件根本没有被修改，不需要回滚。

验证发布不能只看 `Finished: SUCCESS`。还要确认页面改动确实生效、核心功能正常、浏览器控制台无新增报错、静态资源请求没有 404，并在服务器确认正式目录和上一版本备份都存在、属主及权限正确。本次修改页面文案后已生效，并连续发布两次成功，开发环境流水线闭环已跑通。

### 命令 / 代码片段

构建并生成上传包：

```bash
npm install
npm run build
tar -czf ai-app-keyword-monitor.tar.gz ai-app-keyword-monitor
```

验证流水线公共账号的免密 sudo、上传包和内容结构：

```bash
whoami
sudo -n id
sudo -n ls -lh /tmp/ai-app-keyword-monitor.tar.gz
sudo -n tar -tzf /tmp/ai-app-keyword-monitor.tar.gz | head -20
```

发布后通过堡垒机验证正式目录和上一版本备份：

```bash
sudo ls -ld \
  /data/apps/ekm-front-install-v1.2.0-new/html/ai-app-keyword-monitor \
  /data/apps/ekm-front-install-v1.2.0-new/html/bak/ai-app-keyword-monitor-pipeline-previous
```

### 术语

- `构建产物`：执行前端构建后生成、可以直接交给 Web 服务器提供访问的静态文件。
- `免密 sudo`：执行 sudo 命令时无需交互输入密码；流水线无人值守执行时需要这种能力，但应按最小权限授权。
- `临时目录发布`：先把完整新版本放入独立目录并验证，再整体切换到正式目录，避免半成品暴露给访问者。
- `Groovy 插值`：Jenkins 在远程 Shell 执行前先解析字符串中的变量表达式，可能与 Shell 自身的变量语法冲突。
- `回滚`：新版本发布失败后恢复上一份可用文件，缩短故障时间。

### 待验证问题

- 当前构建环境 Node.js 为 `20.11.1`，但新安装的 Sass 等依赖要求至少 `20.19.0`；需升级 Node，并提交锁文件后改用 `npm ci`，避免依赖漂移造成未来构建突然失败。
- 当前只保留一份上一版本备份；后续可评估按时间保留多份、设置清理策略，并增加部署后的 HTTP 健康检查。
- 日志显示 SSH host key checking 被关闭，存在中间人攻击风险；应确认极库云是否支持维护可信 `known_hosts`。
- 尚未做可控的自动回滚演练，可在无人联调的开发环境窗口故意触发新版本校验失败，确认旧版本能够自动恢复。

---

## [2026-07-30 16:29] npm 私有仓库认证的配置分层

- 主题：理解项目 `.npmrc`、个人 `~/.npmrc`、Nexus 认证和流水线私密变量如何协作
- 关联仓库/项目：ai-app-keyword-monitor；fe-project-toolkit；公司 Nexus fontawesome 仓库

### 结论 / 认知

`.npmrc` 中“包从哪里下载”和“访问仓库时带什么凭证”是两类独立配置，所以同一个地址会出现两次。`@fortawesome:registry=...` 把 `@fortawesome/*` 包路由到内部 Nexus；`//仓库地址/:_auth=...` 则把认证限定在该地址，避免凭证发送给其他 registry，不能把 `:_auth` 拼进 registry URL。

当前 `NEXUS_AUTH` 来源是 `Base64(用户名:密码)`，npm 在执行 `npm install` 时读取 `.npmrc` 并把它用于 Nexus Basic Auth。Base64 只是可逆编码，不是加密；它适合临时验证，但不应把个人账号密码硬编码进 Git。`_authToken` 需要 Nexus 实际签发并支持相应 Token，不能把用户名密码的 Base64 直接换个键名当 Token 使用。长期优先申请只读服务 Token，其次是只读公共账号，个人密码只应作为临时方案。

npm 会合并多层配置：个人 `~/.npmrc` 和项目根目录 `.npmrc` 都会被读取，项目级同名配置优先。开发人员执行 `npm adduser --registry=...` 后，npm 会把该仓库的认证写入个人 `~/.npmrc`；项目只要保存 `@fortawesome` 的 registry 地址，本地 `npm install` 就能组合使用两层配置。但如果项目仍写着 `_auth=${NEXUS_AUTH}`，本机又没有该环境变量，项目级配置可能覆盖个人配置并导致认证失败。

流水线没有开发人员的个人 `~/.npmrc`，因此若项目只提交仓库地址，CI 必须在 `npm install` 前从极库云私密变量把认证临时写入构建账号的用户级 npm 配置。由此形成清晰分工：代码仓库保存无敏感信息的地址；本地开发保存个人认证；流水线运行时注入机器认证。

公司 Nexus 的 `repo.geelib.qihoo.net` 当前解析为私网地址 `10.16.24.91`，意味着本地使用一般需要公司内网或 VPN。公司页面给出的 `npm config set registry=fontawesome仓库` 是通用说明，但业务项目还要安装 Vue、Vite 等公共依赖，不应把全局 registry 都指向只存 Font Awesome 的 Hosted 仓库；更合适的是仅配置 `@fortawesome` scope。

团队脚手架目前通过 157MB 的本地压缩包绕过 Font Awesome Pro 安装，模板依赖版本为 6.2.0，而本次 Nexus 已验证的是 7.x。要用 Nexus 替代压缩包，不能只修改 `.npmrc`：还需统一依赖版本、确认 Nexus 包覆盖、设计本地与 CI 认证方式，并在无缓存、无 `node_modules` 的干净项目中执行安装和构建验证。

### 命令 / 代码片段

项目中只保存公共源和 Font Awesome 的作用域路由：

```ini
registry=https://registry.npmmirror.com
@fortawesome:registry=http://repo.geelib.qihoo.net:8360/nexus/repository/fontawesome/
```

开发人员在终端执行一次交互登录，认证写入个人 `~/.npmrc`：

```bash
npm adduser --registry=http://repo.geelib.qihoo.net:8360/nexus/repository/fontawesome/
```

临时生成 Basic Auth 值的原理如下，输出不可提交或公开：

```bash
printf '%s' '用户名:密码' | base64
```

### 术语

- `scoped registry`：只让某个 npm 作用域（如 `@fortawesome`）使用指定仓库，不影响其他依赖。
- `用户级 .npmrc`：位于个人主目录的 npm 配置，适合保存个人认证，不进入项目 Git。
- `项目级 .npmrc`：随项目提交的配置，优先级高于用户级同名项，应避免包含真实凭证。
- `_auth`：通常保存用户名和密码的 Base64，用于 Basic Auth；可逆，不等于加密。
- `_authToken`：服务端签发的访问 Token；安全性优势来自可限权、可吊销和不等于个人密码。

### 待验证问题

- 公司 Nexus 是否支持为 npm 仓库签发只读 `_authToken`，或提供流水线专用只读服务账号。
- `fontawesome` 仓库能否在公司内网开放匿名只读，从而省去本地和流水线认证。
- 模板统一升级到 Font Awesome 7.x 后，所有图标 API、构建结果以及现有项目兼容性是否正常。
- 极库云构建脚本运行时写入用户级 npm 认证，是否会受到 Jenkins Groovy 对 Shell 变量的提前解析影响。

---
