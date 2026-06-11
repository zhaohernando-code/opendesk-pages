import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://opendesk.bitclub.ai',
  // Production deploys at the domain root, so public page assets intentionally use root-absolute URLs.
  trailingSlash: 'always',
  devToolbar: {
    enabled: false,
  },
  integrations: [
    starlight({
      title: 'OpenDesk',
      description: 'Personal AI operator for desktop workflows.',
      favicon: '/favicon.ico',
      logo: {
        src: './src/assets/images/cli-logo.png',
        alt: 'OpenDesk',
      },
      pagefind: true,
      // Site-level fallback is provided by src/pages/404.astro, which builds to dist/404.html.
      disable404Route: true,
      customCss: ['./src/styles/starlight.css', './src/styles/header.css'],
      components: {
        Head: './src/components/starlight/Head.astro',
        Header: './src/components/starlight/Header.astro',
      },
      sidebar: [
        {
          label: '快速开始',
          items: [
            { label: 'Opendesk Cli', slug: 'docs/quickstart/cli' },
            { label: 'Opendesk Desktop (桌面版)', slug: 'docs/quickstart/desktop' },
            { label: 'Desktop 快速上手', slug: 'docs/manual/quickstart' },
            { label: 'Desktop 快速上手', slug: 'docs/manual/quickstart' },
          ],
        },
        {
          label: '进阶场景',
          items: [{ label: '插件使用', slug: 'docs/plugins' }],
        },
        {
          label: '完整使用手册',
          items: [
            { label: 'Opendesk Cli', slug: 'docs/manual/cli' },
            { label: 'Opendesk Desktop (桌面版)', slug: 'docs/desktop' },
            { label: '功能指南', slug: 'docs/manual/tools' },
            { label: '技能系统', slug: 'docs/manual/skills' },
            { label: '使用案例', slug: 'docs/manual/use-cases' },
            { label: '最佳实践', slug: 'docs/manual/best-practices' },
            { label: '常见问题', slug: 'docs/manual/faq' },
          ],
        },
        {
          label: '开发者指南',
          items: [
            { label: '架构介绍', slug: 'docs/contribute/architecture' },
            { label: '准备开发环境', slug: 'docs/contribute/prepare' },
            { label: 'Opendesk Cli 开发上手', slug: 'docs/contribute/cli' },
            { label: 'Opendesk Desktop 开发上手', slug: 'docs/contribute/desktop' },
          ],
        },
      ],
      social: [
        {
          icon: 'gitlab',
          label: 'GitCode',
          href: 'https://gitcode.com/IntelliOS/OpenDesk',
        },
      ],
    }),
    mdx(),
    sitemap(),
  ],
});
