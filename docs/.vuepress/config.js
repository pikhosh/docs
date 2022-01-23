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
        ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@800&display=swap' }],
        ['meta', { name: 'application-name', content: 'Isar Database' }],
        ['meta', { name: 'apple-mobile-web-app-title', content: 'Isar Database' }],
        ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
        ['script', { async: '', src: "https://www.googletagmanager.com/gtag/js?id=G-NX9QJRWFGX" }],
        [
            'script', {},
            `window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-NX9QJRWFGX');`
        ],
        [
            'script', {},
            `(function(h,o,t,j,a,r){
                h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                h._hjSettings={hjid:2781644,hjsv:6};
                a=o.getElementsByTagName('head')[0];
                r=o.createElement('script');r.async=1;
                r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                a.appendChild(r);
            })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`
        ]
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
                text: 'pub.dev',
                link: 'https://pub.dev/packages/isar',
            },
            {
                text: 'API',
                link: 'https://pub.dev/documentation/isar/latest/isar/isar-library.html',
            },
        ],
        sidebarDepth: 1,
        sidebar: [
            {
                text: 'TUTORIALS',
                children: [
                    {
                        text: 'Quickstart',
                        link: '/tutorials/quickstart.md',
                    },
                    {
                        text: 'Contacts App',
                        link: '/tutorials/contacts_app.md',
                    },
                ],
            },
            {
                text: 'CONCEPTS',
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
                text: 'RECIPES',
                children: [
                    '/recipes/full_text_search.md',
                    '/recipes/multi_isolate.md'
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
            }
        ]
    ]
}