// 빌드 때만 쓰는 도우미. 예제 JS 원문과 공개 주소를 만듦
const demos = import.meta.glob<string>('../examples/*/demo.js', { query: '?raw', import: 'default', eager: true });

export const demoSource = (id: string) => demos[`../examples/${id}/demo.js`] ?? '';

const base = import.meta.env.BASE_URL.replace(/\/?$/, '/');

export const siteUrl = (path = '') => new URL(`${base}${path}`, import.meta.env.SITE).href;
