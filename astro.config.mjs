// @ts-check
import sitemap from '@astrojs/sitemap';
import { defineConfig, envField } from 'astro/config';

export default defineConfig({
  site: 'https://www.piotrl.net',
  trailingSlash: 'always',
  integrations: [sitemap()],
  env: {
    schema: {
      // Set in Netlify site settings; empty means no analytics script is rendered.
      UMAMI_WEBSITE_ID: envField.string({ context: 'client', access: 'public', optional: true }),
    },
  },
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
    },
  },
});
