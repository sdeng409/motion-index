import { defineConfig } from 'astro/config';

// Cloudflare Pages는 도메인 루트에 올라가므로 base가 필요 없음
export default defineConfig({
  site: 'https://motion-index.pages.dev',
  trailingSlash: 'ignore',
});
