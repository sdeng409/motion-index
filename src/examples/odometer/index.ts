import type { Example } from '../../lib/types';
import { SUPPORT, easing } from '../../lib/shared';

export default {
  id: 'odometer',
  section: 'technique',
  title: 'Odometer 숫자 롤링',
  summary: '자리마다 숫자가 굴러가며 새 값으로 바뀝니다.',
  desc: '자리마다 0부터 9까지 세로로 적힌 숫자 띠를 두고, 보여줄 숫자(`--d`)만큼 띠를 위로 올립니다. 띠는 줄바꿈 문자(`\\A`)를 넣은 가상 요소로 만들어서 HTML이 길어지지 않습니다. JS는 자리마다 `--d` 값만 바꾸고, 굴러가는 움직임은 CSS가 맡습니다. 가격, 방문자 수, 날짜 표시에 쓸 수 있습니다.',
  tag: 'JS', kind: 'interact', support: SUPPORT.transitions,
  spec: { props: 'transform', cost: 'composite' },
  params: [
    { key: 'duration', label: '재생 시간', value: 900, min: 100, max: 2500, step: 50, unit: 'ms' },
    easing('cubic-bezier(0.2, 0.7, 0.2, 1)'),
    { key: 'digit-delay', label: '자릿수 사이 시간차', value: 60, min: 0, max: 300, step: 10, unit: 'ms' },
  ],
  ids: ['odo-demo'],
  autoplay: '[data-odometer-target]',
  html: `
    <div class="demo-stack">
      <span class="odometer" id="odo-demo" role="img" aria-label="12,800원">
        <span class="odo-digit" style="--d: 1; --i: 0"></span><span class="odo-digit" style="--d: 2; --i: 1"></span><span class="odo-sep">,</span><span class="odo-digit" style="--d: 8; --i: 2"></span><span class="odo-digit" style="--d: 0; --i: 3"></span><span class="odo-digit" style="--d: 0; --i: 4"></span><span class="odo-sep">원</span>
      </span>
      <button class="demo-btn" type="button" data-odometer-target="odo-demo">금액 바꾸기</button>
    </div>`,
  css: `
    .odometer {
      display: inline-flex;
      font: 700 32px/1.2 system-ui, sans-serif;
      font-variant-numeric: tabular-nums;
    }

    .odo-digit {
      height: 1.2em;
      overflow: hidden;
    }

    /* 0~9를 세로로 쌓은 띠를 --d 칸만큼 위로 올림 */
    .odo-digit::before {
      content: "0\\A 1\\A 2\\A 3\\A 4\\A 5\\A 6\\A 7\\A 8\\A 9";
      display: block;
      white-space: pre;
      transform: translateY(calc(var(--d, 0) * -1.2em));
      transition: transform {{duration}} {{easing}};
      transition-delay: calc(var(--i, 0) * {{digit-delay}});
    }

    @media (prefers-reduced-motion: reduce) {
      .odo-digit::before { transition: none; }
    }`,
} satisfies Example;
