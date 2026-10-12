// 영역 안에서 그린 선을 path 문자열로 바꿔 offset-path에 넣음
const MIN_GAP = 6; // 이보다 가까운 점은 버림. 점이 너무 촘촘하면 화살표가 떨림
let drawing = null;

function toLocal(area, event) {
  const rect = area.getBoundingClientRect();
  // 썸네일처럼 크기가 줄어든 경우에도 CSS 좌표(220×120)에 맞추기 위한 비율
  const ratio = area.offsetWidth / rect.width;
  return [(event.clientX - rect.left) * ratio, (event.clientY - rect.top) * ratio];
}

// 점들을 Catmull-Rom 방식으로 이어 부드러운 곡선(C)으로 만듦
function toPath(points) {
  const round = (n) => Math.round(n * 10) / 10;
  let d = `M ${points[0].map(round).join(' ')}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C ${[...c1, ...c2, ...p2].map(round).join(' ')}`;
  }
  return d;
}

document.addEventListener('pointerdown', (event) => {
  const area = event.target.closest('.path-area');
  if (!area) return;
  area.setPointerCapture(event.pointerId);
  drawing = { area, points: [toLocal(area, event)] };
});

document.addEventListener('pointermove', (event) => {
  if (!drawing) return;
  const { area, points } = drawing;
  const point = toLocal(area, event);
  const last = points[points.length - 1];
  if (Math.hypot(point[0] - last[0], point[1] - last[1]) < MIN_GAP) return;
  points.push(point);
  if (points.length >= 3) area.querySelector('.demo-path-guide path').setAttribute('d', toPath(points));
});

function finish() {
  if (!drawing) return;
  const { area, points } = drawing;
  drawing = null;
  // 클릭만 하고 끝난 경우는 원래 곡선을 그대로 둠
  if (points.length < 3) return;
  const path = `path("${toPath(points)}")`;
  area.querySelectorAll('.path-traveler').forEach((traveler) => {
    traveler.style.offsetPath = path;
    // 새 경로에서 처음부터 다시 재생
    traveler.style.animation = 'none';
    void traveler.offsetWidth;
    traveler.style.animation = '';
  });
}

document.addEventListener('pointerup', finish);
document.addEventListener('pointercancel', finish);
