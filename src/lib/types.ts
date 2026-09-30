export type ParamValue = string | number;

export type RangeParam = {
  key: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  type?: undefined;
};

export type EasingParam = {
  key: string;
  label: string;
  value: string;
  type: 'easing';
};

export type Param = RangeParam | EasingParam;

export type Example = {
  id: string;
  section?: 'technique';
  title: string;
  summary: string;
  /** backtick으로 감싼 부분은 코드 모양으로 보여줌 */
  desc: string;
  tag: 'CSS' | 'JS';
  kind: 'once' | 'loop' | 'interact' | 'scroll';
  hint?: string;
  support: string;
  spec: {
    duration?: string;
    easing?: string;
    props: string;
    cost: 'composite' | 'paint' | 'layout';
  };
  params?: Param[];
  /** spring처럼 조정 값에서 계산해 CSS에 넣는 값 */
  derive?: (values: Record<string, ParamValue>) => Record<string, string>;
  /** View Transitions처럼 html에서 스타일을 상속받는 예제는 html에도 값을 넣어야 반영됨 */
  rootVars?: boolean;
  /** 썸네일과 상세 창에 같은 예제가 두 번 들어가므로 접미사를 붙일 id 목록 */
  ids?: string[];
  /** 재생할 때 대신 눌러 줄 요소의 selector */
  autoplay?: string;
  html: string;
  css: string;
};
