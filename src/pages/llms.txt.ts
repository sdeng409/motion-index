import type { APIRoute } from 'astro';
import { EXAMPLES } from '../examples';
import { siteUrl } from '../lib/build-sources';
import { ADAPT_RULES, SITE_TITLE } from '../lib/markdown';
import { SECTIONS, sectionOf } from '../lib/shared';

// https://llmstxt.org 형식. AI가 목록을 보고 필요한 예제의 .md만 골라 읽게 함
export const GET: APIRoute = () => {
  const lines = [
    `# ${SITE_TITLE}`,
    '',
    `> 실무에서 자주 쓰는 웹 애니메이션 ${EXAMPLES.length}가지. 모두 순수 HTML·CSS와 vanilla JS로 작성되어 어떤 프레임워크에도 옮길 수 있습니다. 각 링크의 .md에는 설명, 조정 가능한 값, HTML·CSS·JS 코드, 옮길 때 지킬 규칙이 들어 있습니다.`,
    '',
    '적용할 때 공통 규칙:',
    '',
    ...ADAPT_RULES.map((rule) => `- ${rule}`),
  ];
  SECTIONS.forEach((section) => {
    lines.push('', `## ${section.title}`, '', section.desc, '');
    EXAMPLES.filter((ex) => sectionOf(ex) === section.key).forEach((ex) => {
      lines.push(`- [${ex.title}](${siteUrl(`${ex.id}.md`)}): ${ex.summary} (${ex.tag}, ${ex.spec.props})`);
    });
  });
  lines.push('', '## Optional', '', `- [전체 예제 한 파일](${siteUrl('llms-full.txt')}): 모든 예제의 .md를 이어 붙인 파일`);
  return new Response(`${lines.join('\n')}\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
