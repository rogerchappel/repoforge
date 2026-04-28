import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  integrations: [
    starlight({
      title: '{{PROJECT_NAME}} Docs',
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: '{{REPOSITORY_URL}}'
        }
      ],
      sidebar: [
        {
          label: 'Start Here',
          items: [
            { label: 'Overview', slug: 'index' },
            { label: 'Getting Started', slug: 'getting-started' },
            { label: 'Contributing', slug: 'contributing' }
          ]
        }
      ]
    })
  ]
});
