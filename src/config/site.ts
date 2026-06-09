export const site = {
  title: 'OpenDesk',
  description: 'Personal AI operator for desktop workflows.',
  repoUrl: 'https://gitcode.com/IntelliOS/OpenDesk',
  nav: [
    { label: '首页', href: '/' },
    { label: '快速开始', href: '/docs/quickstart/cli/' },
    { label: '文档中心', href: '/docs/' },
    {
      label: '使用场景',
      href: '/gallery/',
      items: [
        { label: '文件整理', href: '/gallery/file_organize/' },
        { label: '远程文件查找', href: '/gallery/file_transfer/' },
        { label: '批量文件处理', href: '/gallery/file_batch/' },
      ],
    },
    { label: '更新日志', href: '/news/' },
    { label: '技能广场', href: 'https://matrix.openharmony.cn/#/skillSquare', external: true },
    { label: '关于我们', href: '/about/' },
  ],
  footerLinks: [
    { label: 'GitCode', href: 'https://gitcode.com/IntelliOS/OpenDesk' },
    { label: 'OpenHarmony', href: 'https://gitcode.com/IntelliOS/OpenDesk' },
  ],
  copyright: '© 2026 The OpenDesk Team, All Right Reserved.',
};
