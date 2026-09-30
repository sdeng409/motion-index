import type { Example } from '../../lib/types';
import { SUPPORT, easing } from '../../lib/shared';

export default {
  id: 'toggle-switch',
  title: '토글 스위치',
  summary: '켜고 끌 때 손잡이가 살짝 튕기며 이동합니다.',
  desc: '실제 체크박스에 `role="switch"`를 붙이고 모양만 스위치처럼 바꿨습니다. 그래서 키보드 조작과 스크린 리더 지원을 따로 만들 필요가 없습니다. easing의 마지막 값을 1보다 크게(1.4) 주어서, 손잡이가 목표 지점을 살짝 지나쳤다가 돌아옵니다.',
  tag: 'CSS', kind: 'interact', support: SUPPORT.transitions,
  spec: { props: 'transform, background-color', cost: 'paint' },
  params: [
    { key: 'duration', label: '재생 시간', value: 200, min: 0, max: 800, step: 10, unit: 'ms' },
    easing('cubic-bezier(0.3, 0.7, 0.4, 1.4)'),
  ],
  html: `
    <label class="switch">
      <input type="checkbox" role="switch" checked>
      <span class="switch-track" aria-hidden="true"></span>
      알림 받기
    </label>`,
  css: `
    .switch {
      position: relative;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      font: 500 14px system-ui, sans-serif;
      cursor: pointer;
    }

    .switch input {
      position: absolute;
      width: 1px;
      height: 1px;
      opacity: 0;
    }

    .switch-track {
      position: relative;
      width: 44px;
      height: 26px;
      border-radius: 999px;
      background: #c5c9d2;
      transition: background-color {{duration}} ease;
    }

    .switch-track::before {
      content: "";
      position: absolute;
      top: 3px;
      left: 3px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #fff;
      box-shadow: 0 1px 3px rgb(0 0 0 / 0.25);
      transition: transform {{duration}} {{easing}};
    }

    .switch input:checked + .switch-track { background: #16a34a; }
    .switch input:checked + .switch-track::before { transform: translateX(18px); }

    .switch input:focus-visible + .switch-track {
      outline: 2px solid #2f4bd8;
      outline-offset: 2px;
    }

    @media (prefers-reduced-motion: reduce) {
      .switch-track,
      .switch-track::before { transition: none; }
    }`,
} satisfies Example;
