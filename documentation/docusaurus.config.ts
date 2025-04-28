import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'PokecenterManager',
  tagline: 'API multi-tenant pour centres Pokémon 🩺⚡',
  favicon: 'img/pokecenterManager/favicon.ico',

  url: 'http://younsylvestre.com',
  baseUrl: '/pokecenterManager/',

  organizationName: 'Itaromi', // Ton GitHub user/org
  projectName: 'pokecenterManager', // Ton repo GitHub

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'fr',
    locales: ['fr'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/Itaromi/pokecenterManager/tree/main/docs/',
        },
        blog: false, // Désactive le blog ici !
        theme: {
          customCss: './src/css/custom.css',
        },
      },
    ],
  ],

  themeConfig: {
      image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'PokecenterManager',
      logo: {
        alt: 'Pokecenter Logo',
        src: 'img/pokecenterManager/pokecenter-logo.jpg',
      },
      items: [
        { type: 'docSidebar', sidebarId: 'tutorialSidebar', position: 'left', label: 'Documentation' },
        { href: 'https://github.com/Itaromi/pokecenterManager', label: 'GitHub', position: 'right' },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [{ label: 'Introduction', to: '/docs/hello' }],
        },
        {
          title: 'Communauté',
          items: [
            { label: 'GitHub', href: 'https://github.com/Itaromi/pokecenterManager' },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} PokecenterManager.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
