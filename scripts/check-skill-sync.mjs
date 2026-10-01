// 빌드 결과의 .md·llms.txt와 skill의 references가 같은지만 비교함. 다르면 `pnpm skill`을 실행하라고 알림
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const dist = new URL('../dist/', import.meta.url).pathname;
const refs = new URL('../skill/motion-index/references/', import.meta.url).pathname;

const isRef = (name) => name.endsWith('.md') || name === 'llms.txt';
const built = readdirSync(dist).filter(isRef);
const synced = readdirSync(refs).filter(isRef);

const stale = [
  ...built.filter((name) => !existsSync(join(refs, name)) || readFileSync(join(dist, name), 'utf8') !== readFileSync(join(refs, name), 'utf8')),
  ...synced.filter((name) => !built.includes(name)),
];

if (stale.length) {
  console.error(`skill references가 빌드 결과와 다릅니다. \`pnpm skill\`을 실행하세요: ${stale.join(', ')}`);
  process.exit(1);
}
console.log(`skill references: ${built.length}개 파일이 빌드 결과와 같음`);
