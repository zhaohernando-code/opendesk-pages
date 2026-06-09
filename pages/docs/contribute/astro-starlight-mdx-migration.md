---
layout: single
title: Astro + Starlight + MDX 官网重构方案
permalink: /docs/contribute/astro-starlight-mdx-migration
sidebar:
  nav: "docs"
toc: true
---

## 状态

| 项目 | 状态 |
| --- | --- |
| 方案阶段 | Phase 0 Completed |
| 设计基线 | 已有首页 HTML 设计稿：`design-drafts/homepage-v1.html` |
| 技术栈决策 | 倾向采用 Astro + Starlight + MDX |
| 迁移准备 | Completed：[Phase 0 盘点](/docs/contribute/astro-migration-phase-0-inventory) |
| 基础工程 | Completed：Astro/Starlight/MDX 工程已初始化 |
| 代码迁移 | Phase 1 Completed，内容迁移 Not Started |
| 自动部署 | Not Started |
| 外部审核 | Completed：Phase 1 已完成 Claude + DeepSeek 收口审核，无遗留 P0/P1 |

本文档用于指导 OpenDesk 官网从当前 Jekyll 站点迁移到 Astro + Starlight + MDX。当前 Jekyll 站点只作为迁移期的线上内容和回退基线；Astro 版本完成并验证后，应删除 Jekyll/Ruby 构建入口，不长期维护双构建系统。

## 背景

当前页面仓库是 Jekyll + Minimal Mistakes 主题，内容主要分布在：

- `index.md`：首页
- `pages/docs/**`：文档中心
- `pages/about.md`：关于我们
- `pages/gallery.md` 与 `pages/usecases/**`：使用场景
- `pages/channels/**`：飞书、微信等渠道教程
- `_data/navigation.yml`：导航结构
- `assets/images/**`：产品截图、演示动图和品牌素材

这套结构适合传统文档站，但在以下方向上成本偏高：

- 现代产品首页需要大量覆写主题样式；
- 页面跳转是完整文档刷新，缺少接近 App 的过渡体验；
- 首页、使用场景、文档页的视觉密度和交互需求不同，但当前共用一个 Jekyll 主题体系；
- 自动部署链路不清晰，仓库内没有 GitHub Actions 配置。

## 目标

1. 保留静态站部署的简单性。
2. 将当前首页设计稿作为第一版视觉基线。
3. 文档内容继续由 Markdown/MDX 维护。
4. 文档中心具备目录、侧边栏、搜索、代码高亮等基础能力。
5. 首页、使用场景页和渠道页允许使用自定义组件。
6. GitHub 变更后自动构建并部署。
7. Astro 版本完成验证后，清理 Jekyll 主题、Ruby 依赖和旧内容入口，主线只保留新站点。

## 非目标

- 不在第一阶段引入登录、服务端 API、用户控制台或动态数据库。
- 不在迁移初期重写全部文档内容。
- 不在 Astro 内容、路由和部署未验证前删除当前 Jekyll 站点。
- 不长期保留 Jekyll + Astro 双构建；共存只服务于迁移期验证和回退。
- 不把最终视觉完全绑定到临时 HTML 设计稿；设计稿只作为首版风格基线。

## 推荐技术栈

| 层级 | 推荐 | 说明 |
| --- | --- | --- |
| 站点框架 | Astro | 输出静态站，支持页面级组件化，适合官网、文档和内容站混合项目 |
| 文档系统 | Starlight | 负责文档侧边栏、目录、搜索、代码块和文档布局 |
| 内容格式 | Markdown + MDX | 普通内容保持 Markdown，复杂教程和交互块使用 MDX |
| 交互组件 | Astro Islands | 首页动画、Tabs、安装命令、渠道切换等局部交互按需加载 |
| 部署 | Cloudflare Pages 优先，GitHub Pages 备选 | 当前域名已走 Cloudflare；Astro 也可用 GitHub Pages Action 部署 |

参考资料：

- [Astro 官方 GitHub Pages 部署文档](https://docs.astro.build/en/guides/deploy/github/)
- [Cloudflare Pages 官方 Astro 部署文档](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/)
- [Astro 页面与 MDX 页面说明](https://docs.astro.build/en/basics/astro-pages/)
- [Starlight 项目介绍](https://astro.build/themes/details/starlight/)

## 目标目录结构

```text
opendesk-pages/
  astro.config.mjs
  package.json
  pnpm-lock.yaml
  pnpm-workspace.yaml
  .nvmrc
  src/
    assets/
      images/
    components/
      CommandBlock.astro
      ProductWindow.astro
      ChannelPanel.astro
      SnapSection.astro
      PlatformTabs.astro
      SiteFooter.astro
    config/
      site.ts
    content/
      docs/
        docs/
          index.mdx
          quickstart/
            index.mdx
            cli.mdx
            desktop.mdx
          desktop/
            index.mdx
          manual/
            cli.mdx
          contribute/
            index.mdx
            architecture.mdx
            prepare.mdx
            cli.mdx
            desktop.mdx
            astro-starlight-mdx-migration.mdx
            astro-migration-phase-0-inventory.mdx
          plugins/
            index.mdx
      release-notes/
        2026-06-04-nightly-release.md
    pages/
      index.astro
      about.mdx
      gallery.astro
      gallery/
        file_organize.mdx
        file_transfer.mdx
      channels/
        feishu.mdx
        weixin.mdx
      news.astro
      404.astro
  public/
    assets/
      images/
    favicon.ico
```

## 页面迁移映射

| 当前 Jekyll 路径 | 目标 Astro/Starlight 路径 | 处理方式 |
| --- | --- | --- |
| `index.md` | `src/pages/index.astro` | 使用当前首页 HTML 稿重写为 Astro 组件 |
| `pages/docs/index.md` | `src/content/docs/docs/index.mdx` | 迁入 Starlight 文档；第二层 `docs/` 用于保留 `/docs/**` URL |
| `pages/docs/quickstart/*.md` | `src/content/docs/docs/quickstart/*.mdx` | 保留正文，逐步组件化安装步骤 |
| `pages/docs/manual/cli.md` | `src/content/docs/docs/manual/cli.mdx` | 迁入文档树 |
| 导航占位：`/docs/desktop/` | `src/content/docs/docs/desktop/index.mdx` | Phase 1 已建占位页，Phase 3 补正式 Desktop 手册内容 |
| 导航占位：`/docs/plugins/` | `src/content/docs/docs/plugins/index.mdx` | Phase 1 已建占位页，Phase 3 补正式插件文档 |
| `pages/docs/contribute/architecture.md` | `src/content/docs/docs/contribute/architecture.mdx` | 迁入文档树 |
| `pages/docs/contribute/prepare.md` | `src/content/docs/docs/contribute/prepare.mdx` | 迁入文档树 |
| `pages/docs/contribute/cli.md` | `src/content/docs/docs/contribute/cli.mdx` | 迁入文档树 |
| `pages/docs/contribute/desktop.md` | `src/content/docs/docs/contribute/desktop.mdx` | 迁入文档树 |
| `pages/docs/contribute/astro-starlight-mdx-migration.md` | `src/content/docs/docs/contribute/astro-starlight-mdx-migration.mdx` | 迁入文档树 |
| `pages/docs/contribute/astro-migration-phase-0-inventory.md` | `src/content/docs/docs/contribute/astro-migration-phase-0-inventory.mdx` | 迁入文档树 |
| `pages/about.md` | `src/pages/about.mdx` | 独立页面迁移，不进入 Starlight 文档树 |
| `pages/gallery.md` | `src/pages/gallery.astro` | 使用自定义场景页组件 |
| `pages/usecases/*.md` | `src/pages/gallery/*.mdx` | 作为场景详情页 |
| `pages/channels/*.md` | `src/pages/channels/*.mdx` | 保留教程内容，视频/图片用组件封装 |
| `pages/news.md` + `_posts/release_notes/*.md` | `src/pages/news.astro` + `src/content/release-notes/*.md` | 替换 Liquid 列表，按年份分组输出 |
| `_data/navigation.yml` | `astro.config.mjs` + Starlight sidebar | 转换为 Starlight sidebar 和站点导航 |
| 主导航外链：技能广场 | Astro/Starlight nav external link | 显式配置为外链，不能按内部路由处理 |
| `assets/images/**` | `src/assets/images/**` 或 `public/assets/images/**` | 需按是否经过构建优化决定 |

路径规范：

- 内部链接优先沿用当前公开 URL；对同一页面的带尾斜杠和不带尾斜杠版本必须建立兼容。
- Astro 初始化时先配置 `trailingSlash: "ignore"`，并为已知旧路径补 redirects 或等价页面，避免 Jekyll 到 Astro 切换后出现路径级 404。
- 文档中若出现旧锚点链接，迁移时必须先保留旧锚点或建立锚点映射，再删除 Kramdown 属性语法。
- Starlight 官方要求文档内容位于 `src/content/docs/`；若要让所有文档页面位于 `/docs/**` 子路径，需要将内容放入 `src/content/docs/docs/`。
- `astro.config.mjs` 不设置 `base`，生产站点从域名根路径发布；`/docs/**` 由 Starlight 内容目录 `src/content/docs/docs/**` 产生，不通过 `base: "/docs"` 实现。
- Phase 5 切流时采用明确的 canonical URL：普通内容页优先使用无尾斜杠路径，目录索引页保留尾斜杠，例如 `/docs/`、`/docs/quickstart/`；另一种写法通过平台 redirect 或等价页面兼容。

## 首页落地原则

当前 `design-drafts/homepage-v1.html` 作为首版视觉模板。迁移时不应逐行复制临时 CSS，而应拆分为稳定组件：

- `HeroSection`：品牌、主文案、安装命令和产品界面截图；
- `WorkflowSection`：一句话到工作流的能力说明；
- `ChannelSection`：飞书、微信、Desktop 等入口；
- `GallerySection`：文件整理、远程文件查找等场景；
- `CliSection`：OpenDesk Cli 与桌面 App 同能力、不同入口的说明；
- `SiteFooter`：GitCode、OpenHarmony 和版权信息。

桌面端可以保留整页滚动叙事；半屏和移动端必须降级为自然流式布局，避免内容堆叠和滚动劫持。

## 自动部署方案

### Cloudflare Pages 优先

适用原因：

- 当前公开域名 `opendesk.bitclub.ai` 已经由 Cloudflare 响应；
- Astro 静态输出目录为 `dist/`，适合 Cloudflare Pages；
- GitHub 推送可直接触发 Cloudflare Pages 构建。

建议配置：

```text
Install command: corepack enable && pnpm install --frozen-lockfile
Build command: pnpm build
Build output: dist
Node version: 22.16.0，跟随项目 .nvmrc 或 Cloudflare Pages 配置
```

`pnpm-workspace.yaml` 需要显式允许 `esbuild` 和 `sharp` 的构建脚本，避免 pnpm 默认阻止依赖 native build 后影响 Astro 构建。

### GitHub Pages 备选

如需要完全由 GitHub Actions 发布，可使用 Astro 官方 GitHub Pages Action。该方案适合保留 `liyifm/opendesk-pages` 作为源码仓库并由 Actions 产出静态页面。

## 分阶段计划

### Phase 0：迁移准备

状态：Completed，详见 [Astro 迁移 Phase 0 盘点](/docs/contribute/astro-migration-phase-0-inventory)

- 确认最终部署目标：Cloudflare Pages 或 GitHub Pages；
- 定义关键页面最小集合：`_data/navigation.yml` 中所有内部链接，以及所有带 `permalink` 的页面；
- 输出当前 URL 到目标 URL 的一对一映射表；
- 确认保留路径兼容要求，如 `/docs/quickstart/cli`、`/about`、`/docs/plugins/`；
- 清点现有图片、动图、视频 iframe 和外链；
- 扫描所有 Markdown 中的 Liquid 标签、Jekyll include、Kramdown 属性语法和 Jekyll 专有 front matter；
- 锁定首页首版视觉模板。

验收标准：

- 迁移路径表完整；
- `_data/navigation.yml` 中所有内部链接都有目标页面，或明确标记为待建设占位；
- Liquid/Jekyll 专有语法扫描结果已记录；
- 明确回退方案。

### Phase 1：Astro/Starlight 基础工程

状态：Completed

- 已初始化 Astro + Starlight + MDX；
- 已配置站点标题、favicon、导航、侧边栏；
- 已用 `src/content/docs/docs/**` 验证 Starlight `/docs/**` 子路径策略；
- 已建立基础组件目录；
- 已使用 `.nvmrc` 固定 Node 22.16.0，使用 pnpm 作为 Astro 工程包管理器；
- 已配置文档搜索、404 页面和 sitemap；
- `astro.config.mjs` 禁用 Starlight 内置 404，改由 `src/pages/404.astro` 生成站点级 `dist/404.html`，避免与自定义页面冲突；
- `assets/javascripts/copy-button.js` 暂不迁移，Starlight 代码块能力已覆盖基础复制体验；
- 已在 Jekyll `_config.yml` 中排除 `src`、`public`、`dist`、`node_modules` 和 Astro 配置文件，避免 Jekyll 解析 `.astro` front matter；
- 当前 Jekyll 站点在迁移期临时保持可构建，用于当前线上回退；这不是最终状态，Phase 5 必须删除 Jekyll/Ruby 构建入口。

验收标准：

- `pnpm build` 成功；
- Jekyll 当前构建命令在迁移期仍可成功执行，作为回退检查，不作为最终主线要求；
- Starlight 文档首页可访问于 `/docs/`；
- 首页、文档、场景页的基础路由可访问；
- 搜索、`dist/404.html` 和 sitemap 已有实现。

### Phase 2：首页组件化

状态：Todo

- 将 `homepage-v1.html` 拆分为 Astro 组件；
- 保留桌面整页滚动体验；
- 半屏和移动端使用自然流式布局；
- 使用现有 OpenDesk logo、产品截图和演示素材；
- 不引入全站重型前端状态库。

验收标准：

- 桌面、半屏、手机视口无内容重叠；
- 触控板滚动不会连续误翻多屏；
- 安装命令、CTA、产品截图显示完整；
- 建立 Lighthouse 基线，建议 Performance 不低于 80，CLS 不高于 0.1；若无法达到，必须记录原因和优化计划。

### Phase 3：文档内容迁移

状态：Todo

- 迁移 quickstart、manual、contribute 文档；
- 将 `/docs/plugins/` 和 `/docs/desktop/` 从 Phase 1 占位页补为正式内容，或保留明确的建设状态；
- 迁移 release notes 到 `src/content/release-notes/`，并用 `src/pages/news.astro` 替代 Liquid 列表；
- 将平台切换、安装命令、提示块迁移为 MDX 组件；
- 转换 Jekyll permalink 到 Astro 路由；
- 明确 Starlight `/docs` 前缀策略，避免 `/docs/quickstart/cli` 变为 `/quickstart/cli`；
- 将 Jekyll front matter 中的 `toc`、`sidebar`、`permalink` 等字段转换为 Starlight 支持的配置或迁移记录；
- 将 Kramdown 标题锚点转换为 MDX 可用写法，并维护旧锚点链接映射；
- 将 Liquid include 重写为 Astro/MDX 组件，或先展开为普通 Markdown；
- 保留必要的旧路径重定向。

验收标准：

- 当前文档中心主要页面均可访问；
- 侧边栏结构与原导航等价或更清晰；
- 图片、动图、代码块和 iframe 均正常显示。
- 当前 Jekyll permalink 列表有对应 Astro 路由或 redirect。

### Phase 4：场景页和渠道页迁移

状态：Todo

- 迁移 gallery 和 usecases；
- 迁移 Feishu、Weixin 渠道教程；
- 视频 iframe 封装为响应式组件；
- 图片资源路径统一。

验收标准：

- 使用场景页可浏览并进入详情；
- 渠道教程内容完整；
- 移动端图文不溢出。

### Phase 5：自动部署与切流

状态：Todo

- 配置 Cloudflare Pages 或 GitHub Actions；
- 设置预览环境；
- Cloudflare Pages 方案下使用分支预览或 `*.pages.dev` 预览环境；
- 配置生产域名；
- 在切流前保留 Jekyll 版本作为回退分支或 tag；
- 删除 Jekyll 主线入口：`Gemfile`、`_config.yml`、`_data/`、`_includes/`、`_posts/`、旧 `pages/`、根 `index.md`、Jekyll `assets` 中已迁移的重复资源，以及 Ruby 构建产物配置；
- 确认仓库主线只执行 Astro 构建，不再执行 Jekyll 构建；
- 切流后观察 404、缓存和静态资源路径。

验收标准：

- push 后自动构建；
- 生产域名可访问；
- 主要 URL 没有意外 404；
- 已演练回退：Cloudflare Pages 回滚到上一个部署，或 GitHub Pages 切回旧发布分支；
- Jekyll/Ruby 构建入口已从主线移除，旧版本仅存在于 tag/分支中；
- 可在 30 分钟内回退到旧版本。

## 风险与对策

| 风险 | 影响 | 对策 |
| --- | --- | --- |
| 旧 URL 失效 | 搜索、外链、文档引用失效 | 保留 permalink 或配置 redirects |
| 迁移期双构建系统冲突 | Cloudflare Pages 或 GitHub Actions 可能执行错误构建命令 | 迁移期使用独立分支；CI 中显式执行 Astro 构建；切流后删除 Jekyll 入口 |
| Jekyll/Liquid/Markdown 语法不兼容 | MDX 构建失败或内容丢失 | Phase 0 扫描 Liquid、include、Kramdown 属性和专有 front matter |
| Starlight 路由前缀不一致 | `/docs/**` 路径变更导致 404 | Phase 1 验证 `/docs` 前缀策略，并配置 redirects |
| 首页动效过重 | 移动端卡顿或滚动不稳定 | 桌面增强，移动端自然流降级 |
| MDX 组件过多 | 文档维护门槛升高 | 普通内容仍用 Markdown，只对重复结构组件化 |
| 图片路径混乱 | 构建后资源 404 | 迁移前建立资源路径规则：公共稳定路径放 `public/`，需要构建优化的资源放 `src/assets/` |
| 搜索能力遗漏 | 文档中心可用性下降 | Phase 1/3 增加搜索配置和构建后验证 |
| Sitemap/404 缺失 | SEO 和错误恢复下降 | Phase 1 增加 sitemap 与 404 规划 |
| 外链导航误处理 | 技能广场等外链被当作内部路由 | 主导航外链显式配置 external URL |
| 部署链路变化 | 线上不可用 | 先建 preview，再切生产域名 |

## 决策记录

| 日期 | 决策 | 状态 |
| --- | --- | --- |
| 2026-06-09 | 推荐从 Jekyll + Minimal Mistakes 迁移到 Astro + Starlight + MDX | Accepted |
| 2026-06-09 | 首页视觉以 `design-drafts/homepage-v1.html` 为首版模板 | Accepted |
| 2026-06-09 | 自动部署优先考虑 Cloudflare Pages，GitHub Pages 作为备选 | Preferred |
| 2026-06-09 | Claude + DeepSeek 审核指出路径映射、双构建、Liquid/MDX、URL 兼容风险；本文档已吸收 P0/P1 建议 | Completed |
| 2026-06-09 | Phase 1 使用 `src/content/docs/docs/**` 保留 `/docs/**` 路由，包管理器采用 pnpm，Node 固定为 22.16.0 | Completed |
| 2026-06-09 | 明确双构建只作为迁移期防护；Astro 验证和切流后，主线删除 Jekyll/Ruby 构建入口 | Accepted |

## 下一步

1. 使用当前 `design-drafts/homepage-v1.html` 进入 Phase 2 首页组件化；
2. 将首页拆分为 `HeroSection`、`WorkflowSection`、`ChannelSection`、`GallerySection`、`CliSection` 和 `SiteFooter`；
3. 保留桌面整页滚动体验，半屏和移动端使用自然流式布局；
4. 建立桌面、半屏、手机视口的视觉验证；
5. Phase 2 审核通过后再提交。
