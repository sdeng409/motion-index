// Stop hook: src/examples가 바뀌었으면 Claude가 끝내기 전에 example-verifier 실행 여부를 사용자에게 묻게 함
// 같은 변경에 대해서는 한 번만 묻고, 그 뒤에 다시 바뀌면 또 물음
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const input = JSON.parse(readFileSync(0, 'utf8') || '{}');
// hook 때문에 이어진 응답에서 또 막으면 끝없이 반복되므로 바로 통과
if (input.stop_hook_active) process.exit(0);

const root = process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd();
const statePath = join(root, '.claude/state/example-verify.json');
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' });

// 경로 → blob 해시. 작업 트리와 HEAD를 같은 형식으로 만들어 비교함
function workingTree() {
  const paths = git('ls-files', '-co', '--exclude-standard', '--', 'src/examples').split('\n').filter(Boolean)
    .filter((path) => existsSync(join(root, path)));
  if (!paths.length) return {};
  const hashes = execFileSync('git', ['hash-object', '--stdin-paths'], { cwd: root, input: paths.join('\n'), encoding: 'utf8' }).trim().split('\n');
  return Object.fromEntries(paths.map((path, i) => [path, hashes[i]]));
}

function headTree() {
  return Object.fromEntries(git('ls-tree', '-r', 'HEAD', '--', 'src/examples').split('\n').filter(Boolean).map((line) => {
    const [meta, path] = line.split('\t');
    return [path, meta.split(' ')[2]];
  }));
}

const fingerprint = (tree) => createHash('sha1').update(JSON.stringify(Object.entries(tree).sort())).digest('hex');

const current = workingTree();
const head = headTree();
// 마지막 커밋과 같으면 검사할 변경이 없음 (되돌린 경우 포함)
if (fingerprint(current) === fingerprint(head)) process.exit(0);
const saved = existsSync(statePath) ? JSON.parse(readFileSync(statePath, 'utf8')) : null;
// 이미 물어본 상태가 있으면 그 뒤로 바뀐 것만 보고, 없으면 마지막 커밋과 비교함
const base = saved?.tree ?? head;
if (fingerprint(current) === fingerprint(base)) process.exit(0);

// 바뀐 파일이 속한 예제 id (src/examples/{id}/...). index.ts 같은 공용 파일은 '목록'으로 표시
const changed = new Set();
new Set([...Object.keys(current), ...Object.keys(base)]).forEach((path) => {
  if (current[path] === base[path]) return;
  const parts = path.split('/');
  changed.add(parts.length > 3 ? parts[2] : `목록(${parts[2]})`);
});
const ids = [...changed].filter((id) => !id.startsWith('목록') && existsSync(join(root, 'src/examples', id)));

mkdirSync(dirname(statePath), { recursive: true });
writeFileSync(statePath, JSON.stringify({ tree: current, askedAt: new Date().toISOString() }, null, 2));

const reason = [
  `src/examples에 변경이 있습니다: ${[...changed].join(', ')}.`,
  '작업을 마치기 전에 AskUserQuestion으로 example-verifier 에이전트로 검증할지 사용자에게 물어보세요.',
  '선택지는 "검증 실행"과 "이번엔 건너뛰기" 두 가지로 하고, 질문에 바뀐 예제 목록을 함께 적으세요.',
  `"검증 실행"이면 Agent 도구(subagent_type: "example-verifier")에 예제 id ${ids.length ? ids.join(', ') : '(바뀐 예제 없음, 목록 파일만 바뀜 → 정적 검사만)'}를 넘겨 실행하고, 결과 표의 FAIL·SKIP 항목을 요약해 보고하세요.`,
  '"이번엔 건너뛰기"면 다른 작업 없이 바로 마치세요. 같은 변경에 대해서는 다시 묻지 않습니다.',
].join('\n');

process.stdout.write(JSON.stringify({ decision: 'block', reason }));
