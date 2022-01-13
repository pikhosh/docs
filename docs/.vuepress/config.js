module.exports = {
    head: [
        [
            'link',
            {
                rel: 'icon',
                type: 'image/png',
                sizes: '256x256',
                href: `/icon-256x256.png`,
            },
        ],
        [
            'link',
            {
                rel: 'icon',
                type: 'image/png',
                sizes: '512x512',
                href: `/icon-512x512.png`,
            },
        ],
        ['meta', { name: 'application-name', content: 'Isar Database' }],
        ['meta', { name: 'apple-mobile-web-app-title', content: 'Isar Database' }],
        [
            'meta',
            { name: 'apple-mobile-web-app-status-bar-style', content: 'black' },
        ],
        ['script', { type: 'text/javascript', src: 'https://static.hotjar.com/c/hotjar-2781644.js?sv=6', async: 'true' }],
    ],
    locales: {
        '/': {
            lang: 'en-US',
            title: 'Isar Database',
            description: 'Super Fast Cross Platform Database for Flutter',
        },
    },
    themeConfig: {
        logo: '/isar.svg',
        repo: 'isar/isar',
        docsRepo: 'isar/docs',
        docsDir: 'docs',
        contributors: true,
        navbar: [
            {
                text: 'API',
                link: 'https://pub.dev/documentation/isar/latest/isar/isar-library.html',
            },
        ],
        sidebar: [
            {
                text: 'Quickstart',
                link: '/quickstart.md',
            },
            {
                text: 'Concepts',
                children: [
                    '/schema.md',
                    '/crud.md',
                    '/queries.md',
                    '/transactions.md',
                    '/indexes.md',
                    '/links.md',
                    '/watchers.md',
                    '/type_converters.md',
                    '/limitations.md'
                ],
            },
            {
                text: "Sample Apps",
                link: "https://github.com/isar/samples",
            },
        ],
    },
    markdown: {
        code: {
            lineNumbers: false,
        }
    },
    plugins: [
        [
            '@vuepress/shiki',
            {
                theme: 'one-dark-pro'
            },
            '@vuepress/google-analytics',
            {
                'id': 'G-NX9QJRWFGX'
            }
        ]
    ]
}