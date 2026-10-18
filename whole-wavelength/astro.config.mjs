// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://guendeti.github.io',
  base: '/projektarbeit-test',
  output: 'static',
  markdown: { shikiConfig: { theme: 'github-light' } },
});
