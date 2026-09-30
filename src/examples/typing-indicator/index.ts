import type { Example } from '../../lib/types';
import { SUPPORT } from '../../lib/shared';

export default {
  id: 'typing-indicator',
  title: 'Typing indicator',
  summary: '채팅의 "입력 중" 점 세 개가 차례로 튀어 오릅니다.',
  desc: '세 점에 같은 애니메이션을 주고, 시작 시간만 한 주기의 15%씩 늦춥니다. 늦추는 시간을 주기에 비례해서 계산하므로, 속도를 바꿔도 점들이 이어서 튀는 리듬이 유지됩니다.',
  tag: 'CSS', kind: 'loop', support: SUPPORT.animations,
  spec: { props: 'transform, opacity', cost: 'composite' },
  params: [
    { key: 'duration', label: '한 번 반복 시간', value: 1200, min: 400, max: 3000, step: 50, unit: 'ms' },
    { key: 'height', label: '튀어 오르는 높이', value: 5, min: 0, max: 16, step: 1, unit: 'px' },
  ],
  html: `
    <div class="typing" role="status" aria-label="상대방이 입력 중">
      <span></span><span></span><span></span>
    </div>`,
  css: `
    .typing {
      display: inline-flex;
      gap: 5px;
      padding: 12px 16px;
      border-radius: 18px 18px 18px 4px;
      background: #e9ebf0;
    }

    .typing span {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #6b7280;
      animation: typing-bounce {{duration}} ease-in-out infinite;
    }

    .typing span:nth-child(2) { animation-delay: calc({{duration}} * 0.15); }
    .typing span:nth-child(3) { animation-delay: calc({{duration}} * 0.3); }

    @keyframes typing-bounce {
      0%, 60%, 100% { opacity: 0.4; transform: none; }
      30% { opacity: 1; transform: translateY(calc({{height}} * -1)); }
    }

    @media (prefers-reduced-motion: reduce) {
      .typing span { animation: none; }
    }`,
} satisfies Example;
