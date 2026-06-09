---
layout: single
title: Astro 迁移 Phase 0 盘点
permalink: /docs/contribute/astro-migration-phase-0-inventory
sidebar:
  nav: "docs"
toc: true
---

## 状态

| 项目 | 状态 |
| --- | --- |
| 阶段 | Phase 0：迁移准备 |
| 状态 | Completed |
| 完成日期 | 2026-06-09 |
| 产物范围 | URL 映射、导航缺口、尾斜杠策略、Jekyll 专有语法、资源清点、回退方案 |
| 后续阶段 | Phase 1：Astro/Starlight 基础工程 |

本文档记录 OpenDesk 官网从 Jekyll 迁移到 Astro + Starlight + MDX 前的基线盘点。Phase 1 开始前，应以本文档作为路径兼容和内容迁移的输入。

## 当前仓库基线

| 类别 | 当前情况 |
| --- | --- |
| 站点框架 | Jekyll + Minimal Mistakes |
| 页面目录 | `index.md`、`pages/**/*.md` |
| Release Notes | `_posts/release_notes/*.md`，当前 19 篇 |
| 文档页面 | `pages/docs/**/*.md`，当前 12 篇，另有迁移方案文档 |
| 内容页面 | `pages/about.md`、`pages/gallery.md`、`pages/channels/*.md`、`pages/usecases/*.md`、`pages/news.md` |
| 图片资源 | `assets/images/**`，当前 26 个图片或动图文件 |
| 自定义脚本 | `assets/javascripts/copy-button.js` |
| 自定义 include | `_includes/platform-tabs.html`、`_includes/footer.html` |

## URL 映射表

| 当前 URL | 当前来源 | 目标 Astro/Starlight 路径 | 处理状态 |
| --- | --- | --- | --- |
| `/` | `index.md` | `src/pages/index.astro` | Phase 2 重写首页 |
| `/about/` | `pages/about.md` | `src/pages/about.mdx` | 保留 `/about/`，必要时兼容 `/about` |
| `/gallery` | `pages/gallery.md` | `src/pages/gallery.astro` | Phase 4 迁移 |
| `/gallery/file_organize` | `pages/usecases/file_organize.md` | `src/pages/gallery/file_organize.mdx` | Phase 4 迁移 |
| `/gallery/file_transfer` | `pages/usecases/file_transfer.md` | `src/pages/gallery/file_transfer.mdx` | Phase 4 迁移 |
| `/channels/feishu` | `pages/channels/feishu.md` | `src/pages/channels/feishu.mdx` | Phase 4 迁移 |
| `/channels/weixin` | `pages/channels/weixin.md` | `src/pages/channels/weixin.mdx` | Phase 4 迁移 |
| `/news` | `pages/news.md` + `_posts/release_notes/*.md` | `src/pages/news.astro` + content collection | 需要替换 Liquid 列表 |
| `/docs/` | `pages/docs/index.md` | `src/content/docs/index.mdx` | Phase 3 迁移 |
| `/docs/quickstart/` | `pages/docs/quickstart/index.md` | `src/content/docs/quickstart/index.mdx` | Phase 3 迁移 |
| `/docs/quickstart/cli` | `pages/docs/quickstart/cli.md` | `src/content/docs/quickstart/cli.mdx` | Phase 3 迁移 |
| `/docs/quickstart/desktop` | `pages/docs/quickstart/desktop.md` | `src/content/docs/quickstart/desktop.mdx` | Phase 3 迁移 |
| `/docs/manual/cli` | `pages/docs/manual/cli.md` | `src/content/docs/manual/cli.mdx` | Phase 3 迁移 |
| `/docs/plugins/` | 当前仅导航入口 | `src/content/docs/plugins/index.mdx` | Phase 1 建占位页，Phase 3 补正式内容 |
| `/docs/desktop/` | 当前仅导航入口 | `src/content/docs/desktop/index.mdx` | Phase 1 建占位页，Phase 3 补正式内容 |
| `/docs/contribute/` | `pages/docs/contribute/index.md` | `src/content/docs/contribute/index.mdx` | Phase 3 迁移 |
| `/docs/contribute/architecture` | `pages/docs/contribute/architecture.md` | `src/content/docs/contribute/architecture.mdx` | Phase 3 迁移 |
| `/docs/contribute/prepare` | `pages/docs/contribute/prepare.md` | `src/content/docs/contribute/prepare.mdx` | Phase 3 迁移，需替换 platform tabs |
| `/docs/contribute/cli` | `pages/docs/contribute/cli.md` | `src/content/docs/contribute/cli.mdx` | Phase 3 迁移 |
| `/docs/contribute/desktop` | `pages/docs/contribute/desktop.md` | `src/content/docs/contribute/desktop.mdx` | Phase 3 迁移 |
| `/docs/contribute/astro-starlight-mdx-migration` | `pages/docs/contribute/astro-starlight-mdx-migration.md` | `src/content/docs/contribute/astro-starlight-mdx-migration.mdx` | Phase 3 迁移 |
| `/docs/contribute/astro-migration-phase-0-inventory` | 本文档 | `src/content/docs/contribute/astro-migration-phase-0-inventory.mdx` | Phase 3 迁移 |

## 导航缺口

当前 `_data/navigation.yml` 中有两个内部链接没有对应 Jekyll 页面：

| 导航 URL | 导航位置 | 处理建议 |
| --- | --- | --- |
| `/docs/plugins/` | 文档中心 > 进阶场景 > 插件使用 | Phase 1 建 `src/content/docs/plugins/index.mdx` 占位页，Phase 3 补正式内容 |
| `/docs/desktop/` | 文档中心 > 完整使用手册 > Opendesk Desktop | Phase 1 建 `src/content/docs/desktop/index.mdx` 占位页，Phase 3 补正式 Desktop 手册内容 |

主导航中的 `https://matrix.openharmony.cn/#/skillSquare` 是外链，Astro/Starlight 配置时必须继续按外链处理。

`/news` 当前不在 `_data/navigation.yml` 主导航或文档侧边栏中，主要由首页 release notes 区块引用。Astro 迁移时应保留页面本身，但不默认加入主导航。

## 尾斜杠策略

当前 Jekyll permalink 和导航同时存在带尾斜杠和不带尾斜杠的路径，例如 `/docs/manual/cli/`、`/docs/plugins/`、`/docs/desktop/` 与 `/docs/manual/cli`。Astro 迁移采用以下策略：

1. Phase 1 在 `astro.config.mjs` 中先配置 `trailingSlash: "ignore"`，降低切换期路径差异风险。
2. 对已有导航路径保留当前写法；对同一页面的另一种写法建立 redirect 或等价可访问路径。
3. 文档正文新增链接时优先使用无尾斜杠的页面路径，目录页保留尾斜杠，例如 `/docs/`、`/docs/quickstart/`。
4. Phase 5 切流前用主要 URL 清单同时验证带尾斜杠和不带尾斜杠访问。

## Jekyll 专有语法扫描

| 文件 | 发现项 | Astro/MDX 处理方式 |
| --- | --- | --- |
| `index.md` | 使用 Liquid 遍历 `site.posts` 生成 release notes 列表 | 首页重写时改为 Astro 内容集合查询，或将 release notes 模块拆到 `NewsList.astro` |
| `pages/news.md` | 使用 Liquid 遍历 `site.posts` 按年份分组 | 改为 `src/pages/news.astro`，使用 Astro 内容集合或静态数据分组 |
| `pages/docs/contribute/prepare.md` | 两处 `{% include platform-tabs.html %}` | 改为 MDX 组件 `PlatformTabs`，参数显式传入 |
| `_includes/platform-tabs.html` | 使用 `include.windows`、`include.macos`、`include.linux` 和内联脚本 | 替换为 Astro 组件，交互脚本只在组件内加载 |
| `_includes/footer.html` | 使用 `site.footer.links`、`site.copyright` 和 Liquid 条件 | 替换为 `SiteFooter.astro`，数据从 `src/config/site.ts` 或 `astro.config.mjs` 读取 |
| `pages/docs/quickstart/cli.md` | 5 个 Kramdown 标题锚点 | MDX 不兼容该语法，Phase 3 迁移时必须保留旧锚点语义 |
| `pages/docs/manual/cli.md` | 10 个 Kramdown 标题锚点，且文内有 5 处锚点引用 | 同上，需要建立旧锚点兼容策略 |
| 多数页面 front matter | `layout`、`sidebar`、`toc`、`classes` 等 Jekyll/Minimal Mistakes 字段 | 迁移时转换为 Starlight front matter 或删除 |

### 锚点清单

| 来源文件 | 旧锚点 |
| --- | --- |
| `pages/docs/quickstart/cli.md` | `nodejs`、`npm-install`、`initial-config`、`share-config`、`upgrade` |
| `pages/docs/manual/cli.md` | `61-无头模式-headless`、`62-插件系统`、`63-调试与日志`、`64-工具管理`、`65-记忆系统`、`66-技能系统`、`67-消息渠道`、`68-mcp-服务器`、`69-配置导入导出`、`610-升级与更新` |

已发现的锚点引用：

| 来源 | 引用 | 迁移注意 |
| --- | --- | --- |
| `pages/docs/manual/cli.md` | `#61-无头模式-headless`、`#65-记忆系统`、`#63-调试与日志` | 文档内锚点必须保持可跳转 |
| `pages/docs/manual/cli.md` | `/quickstart#share-config`、`/quickstart#initial-config` | 当前路径本身疑似旧路径，Phase 3 应修正为 `/docs/quickstart/cli#share-config` 与 `/docs/quickstart/cli#initial-config` |

迁移规则：

- 优先使用支持显式 `id` 的 MDX heading 组件或 HTML heading，保留旧锚点；
- 若改用 Starlight 自然 slug，必须维护旧锚点到新锚点的映射；
- 不在未建立兼容前删除 `{#...}` 语义。

## 资源清点

| 目录 | 文件类型 | 处理建议 |
| --- | --- | --- |
| `assets/images/common/` | banner、升级说明图片 | 若路径需长期稳定，迁入 `public/assets/images/common/` |
| `assets/images/quickstart/` | 快速开始截图和动图 | 文档引用优先放入 `public/assets/images/quickstart/`，保持旧路径兼容 |
| `assets/images/manual/` | 手册动图 | 文档引用优先放入 `public/assets/images/manual/` |
| `assets/images/channels/` | 飞书、微信教程截图和动图 | 渠道页迁移时保留稳定公共路径 |
| `assets/images/gallery/` | 场景页缩略图、动图和截图 | 首页或场景组件若需要构建优化，可复制到 `src/assets/images/gallery/`；旧路径保留在 `public/` |
| `assets/images/cli-logo.png` | 当前站点 logo | Phase 1 作为站点 logo；Phase 2 首页继续复用 |
| `assets/images/openharmony/logo.png` | 页尾 OpenHarmony logo | `SiteFooter.astro` 继续引用 |
| `assets/javascripts/copy-button.js` | Jekyll 文档复制按钮脚本 | Starlight 已有代码块能力，Phase 1 评估后删除或不迁移 |

资源迁移原则：

- 需要保持旧 URL 的资源放入 `public/assets/**`；
- 只被 Astro 组件内部使用、且希望构建优化的资源放入 `src/assets/**`；
- 迁移期间不移动原 `assets/**`，先复制到 Astro 目录，确认无 404 后再清理。

## 部署与回退基线

Phase 1 到 Phase 4 期间，当前 Jekyll 站点保持可构建状态。每个阶段提交前至少验证：

```bash
bundle exec jekyll build
```

Astro 工程初始化后，每个阶段提交前同时验证：

```bash
npm run build
```

回退策略：

1. 迁移工作在独立分支进行，生产域名不直接切到该分支。
2. 切流前保留 Jekyll 版本的最后一个 commit 或 tag。
3. Cloudflare Pages 切流时先使用 preview 环境验证主要 URL。
4. 如果切流后出现大量 404 或构建失败，Cloudflare Pages 回滚到上一部署；GitHub Pages 方案则切回旧发布分支。

## Phase 1 输入

Phase 1 初始化 Astro/Starlight 时必须先满足：

1. `package.json`、`astro.config.mjs` 和 `src/**` 与当前 Jekyll 文件共存，不删除 Jekyll 入口。
2. Starlight 文档根路径必须验证为 `/docs/**`。
3. 先补 `src/content/docs/plugins/index.mdx` 和 `src/content/docs/desktop/index.mdx` 占位页，避免导航 404。
4. 先建立 `SiteFooter`、`PlatformTabs`、基础页面壳层等组件目录，后续再迁具体内容。
5. 保留当前 `assets/**` 路径，等 Astro 预览稳定后再做资源迁移。
6. 创建 `src/content/release-notes/` 内容集合位置，Phase 3 再迁 19 篇 release notes。
