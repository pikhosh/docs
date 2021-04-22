module.exports = {
  title: 'Isar Database',
  tagline: 'Super Fast Cross Platform Database for Flutter & Web Apps',
  url: 'https://isar.dev',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/isar.svg',
  organizationName: 'isar',
  projectName: 'isar',
  plugins: [
    [
      '@docusaurus/plugin-pwa',
      {
        debug: true,
        offlineModeActivationStrategies: [
          'appInstalled',
          'standalone',
          'queryString',
        ],
        pwaHead: [
          {
            tagName: 'link',
            rel: 'icon',
            href: '/img/isar.png',
          },
          {
            tagName: 'link',
            rel: 'manifest',
            href: '/manifest.json', // your PWA manifest
          },
          {
            tagName: 'meta',
            name: 'theme-color',
            content: '#4799fc',
          },
        ],
      },
    ],
  ],
  themeConfig: {
    navbar: {
      title: 'Isar Database',
      logo: {
        alt: 'Isar Logo',
        src: 'img/isar.svg',
      },
      items: [
        /*{
          to: 'docs/',
          activeBasePath: 'docs',
          label: 'Docs',
          position: 'left',
        },
        { to: 'blog', label: 'Examples', position: 'left' },*/
        {
          href: 'https://github.com/isar/isar',
          label: 'GitHub',
          position: 'right',
        },
        {
          href: 'https://pub.dev/documentation/isar/latest/isar/isar-library.html',
          label: 'API',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Quickstart',
              to: '/',
            },
            {
              label: 'Documentation',
              to: '/schema',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/isardb',
            },
            {
              label: 'Github Discussions',
              href: 'https://github.com/isar/isar/discussions',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Pub.dev',
              to: 'https://pub.dev/packages/isar',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/isar/isar',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Simon Leier.`,
    },
    prism: {
      additionalLanguages: ['dart'],
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/isar/docs/edit/main/',
          routeBasePath: '/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
