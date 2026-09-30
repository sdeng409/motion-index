// 빌드 결과의 .md와 llms.txt를 skill의 references로 복사함. 사이트와 skill이 같은 내용을 쓰게 하기 위함
import { cpSync, readdirSync, rmSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const dist = new URL('../dist/', import.meta.url).pathname;
const out = new URL('../skill/motion-index/references/', import.meta.url).pathname;

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
const files = readdirSync(dist).filter((name) => name.endsWith('.md') || name === 'llms.txt');
files.forEach((name) => cpSync(join(dist, name), join(out, name)));
console.log(`skill references: ${files.length} files`);
