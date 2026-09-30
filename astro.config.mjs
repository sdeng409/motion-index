import { defineConfig } from 'astro/config';

// GitHub Pages 프로젝트 사이트는 https://<계정>.github.io/<repo>/ 아래에 올라가므로 base가 필요함
export default defineConfig({
  site: 'https://example.github.io',
  base: '/motion-index',
  trailingSlash: 'ignore',
});
