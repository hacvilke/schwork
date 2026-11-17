import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

const isGitHubPages = process.env.DEPLOY_TARGET === 'gh-pages';

const siteUrl =
  process.env.SITE_URL ||
  (isGitHubPages ? 'https://hacvilke.github.io' : 'https://schwork.vercel.app');

const baseUrl =
  process.env.BASE_URL || (isGitHubPages ? '/schwork/' : '/');

const config: Config = {
  title: 'Schwork',
  tagline: 'Free high school study docs for Jamaica — clear notes, interactive graphs, and exam practice on phones and laptops.',
  favicon: 'img/favicon.svg',

  url: siteUrl,
  baseUrl,

  organizationName: 'hacvilke',
  projectName: 'schwork',
  trailingSlash: false,

  onBrokenLinks: 'throw',

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  headTags: [
    {
      tagName: 'meta',
      attributes: {
        name: 'theme-color',
        content: '#132238',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1.0, viewport-fit=cover',
      },
    },
  ],

  plugins: [
    function devServerProxyFixPlugin() {
      return {
        name: 'schwork-devserver-proxy-fix',
        configureWebpack(_config, isServer) {
          if (isServer) return {};
          return {
            devServer: {
              allowedHosts: 'all',
              compress: true,
              client: {
                webSocketURL: 'auto://0.0.0.0:0/ws',
              },
            },
          } as Record<string, unknown>;
        },
      };
    },
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: 'docs',
          remarkPlugins: [remarkMath],
          rehypePlugins: [
            [
              rehypeKatex,
              {
                strict: false,
                throwOnError: false,
              },
            ],
          ],
          editUrl: 'https://github.com/hacvilke/schwork/tree/main/',
          showLastUpdateTime: false,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themes: [
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        language: ['en'],
        docsRouteBasePath: '/docs',
        indexBlog: false,
        highlightSearchTermsOnTargetPage: true,
        searchResultLimits: 8,
        searchBarShortcutHint: false,
      },
    ],
  ],

  themeConfig: {
    image: 'img/social-card.svg',
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: true,
      },
    },
    navbar: {
      title: 'schwork',
      hideOnScroll: false,
      logo: {
        alt: 'Schwork Logo',
        src: 'img/logo.svg',
        width: 34,
        height: 34,
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'guideSidebar',
          position: 'left',
          label: 'Start Here',
        },
        {
          to: '/subjects',
          label: 'Subjects',
          position: 'left',
        },
        {
          type: 'docSidebar',
          sidebarId: 'poaSidebar',
          position: 'left',
          label: 'POA',
        },
        {
          type: 'docSidebar',
          sidebarId: 'itSidebar',
          position: 'left',
          label: 'IT',
        },
        {
          to: '/docs/sample-lesson',
          label: 'Sample Lesson',
          position: 'left',
        },
        {
          href: 'https://github.com/hacvilke/schwork',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Study',
          items: [
            {
              label: 'Start Here',
              to: '/docs/intro',
            },
            {
              label: 'Sample Lesson',
              to: '/docs/sample-lesson',
            },
            {
              label: 'Principles of Accounts (POA)',
              to: '/docs/poa',
            },
            {
              label: 'Information Technology (IT)',
              to: '/docs/it',
            },
            {
              label: 'Browse Subjects',
              to: '/subjects',
            },
          ],
        },
        {
          title: 'Project',
          items: [
            {
              label: 'GitHub Repository',
              href: 'https://github.com/hacvilke/schwork',
            },
            {
              label: 'Credits & Legal Notice',
              to: '/docs/credits',
            },
          ],
        },
      ],
      copyright: `Schwork · Free open-source high school study docs for Jamaica.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.nightOwl,
      additionalLanguages: ['bash', 'python', 'json', 'typescript', 'pascal', 'c', 'visual-basic'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
