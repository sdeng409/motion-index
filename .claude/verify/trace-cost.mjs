// Chrome trace(JSON)에서 페이지 main thread의 Layout·Paint 횟수를 셈. 애니메이션의 렌더링 비용 등급을 실측할 때 씀
// 사용법: node .claude/verify/trace-cost.mjs <trace.json>
import { readFileSync } from 'node:fs';

const raw = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const events = Array.isArray(raw) ? raw : raw.traceEvents;

// 페이지를 그리는 renderer의 main thread만 봄 (DevTools 자체 화면 등은 뺌)
const mains = events.filter((e) => e.name === 'thread_name' && e.args?.name === 'CrRendererMain');
const counts = mains.map(({ pid, tid }) => {
  const own = events.filter((e) => e.pid === pid && e.tid === tid && e.ph === 'X');
  const count = (name) => own.filter((e) => e.name === name).length;
  return { pid, tid, Layout: count('Layout'), Paint: count('Paint'), UpdateLayoutTree: count('UpdateLayoutTree') };
});
// 활동이 가장 많은 renderer가 측정 대상 페이지임
counts.sort((a, b) => (b.Layout + b.Paint) - (a.Layout + a.Paint));
const top = counts[0] ?? { Layout: 0, Paint: 0 };
// 다시 재생할 때 생기는 몇 번의 reflow·paint는 빼고, 재생 내내 반복될 때만 그 등급으로 봄 (재생 시간 300ms 이상 기준)
const verdict = top.Layout >= 10 ? 'layout' : top.Paint >= 10 ? 'paint' : 'composite';
console.log(JSON.stringify({ verdict, ...top, renderers: counts.length }));
