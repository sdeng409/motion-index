import type { Example } from '../../lib/types';
import { SUPPORT, easing } from '../../lib/shared';

export default {
  id: 'word-reveal',
  section: 'technique',
  title: '단어 단위 텍스트 reveal',
  summary: '단어가 하나씩 아래에서 올라옵니다.',
  desc: '단어마다 넘치는 부분을 숨기는 틀(`overflow: hidden`)을 씌우고, 안쪽 글자를 틀 아래에서 위로 올립니다. 글자가 틀 밖에 있는 동안에는 보이지 않아서, 바닥에서 솟아오르는 것처럼 보입니다. 단어 순서는 `--i`로 넣습니다. 동작 줄이기 설정에서는 움직임 없이 서서히 나타나기만 합니다.',
  tag: 'CSS', kind: 'once', support: SUPPORT.animations,
  spec: { props: 'transform', cost: 'composite' },
  params: [
    { key: 'duration', label: '재생 시간', value: 700, min: 200, max: 2000, step: 50, unit: 'ms' },
    { key: 'stagger', label: '단어 사이 시간차', value: 70, min: 0, max: 300, step: 10, unit: 'ms' },
    easing('cubic-bezier(0.2, 0.7, 0.2, 1)'),
  ],
  html: `
    <div>
      <p class="word-reveal demo-headline">
        <span class="word"><span style="--i: 0">작은</span></span>
        <span class="word"><span style="--i: 1">움직임이</span></span>
        <span class="word"><span style="--i: 2">경험을</span></span>
        <span class="word"><span style="--i: 3">바꿉니다</span></span>
      </p>
      <p class="word-reveal demo-sub">
        <span class="word"><span style="--i: 4">단어마다</span></span>
        <span class="word"><span style="--i: 5">조금씩</span></span>
        <span class="word"><span style="--i: 6">늦게</span></span>
        <span class="word"><span style="--i: 7">올라옵니다</span></span>
      </p>
    </div>`,
  css: `
    .word-reveal .word {
      display: inline-block;
      overflow: hidden;
      /* 받침이나 descender가 잘리지 않게 아래쪽 여유를 줌 */
      padding-bottom: 0.1em;
      margin-bottom: -0.1em;
      vertical-align: top;
    }

    .word-reveal .word > span {
      display: inline-block;
      animation: word-up {{duration}} {{easing}} both;
      animation-delay: calc(var(--i, 0) * {{stagger}});
    }

    @keyframes word-up {
      from { transform: translateY(110%); }
    }

    @keyframes word-fade {
      from { opacity: 0; }
    }

    @media (prefers-reduced-motion: reduce) {
      .word-reveal .word > span { animation-name: word-fade; }
    }`,
} satisfies Example;
