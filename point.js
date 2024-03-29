const c = document.getElementById('canvas');
const ctx = c.getContext('2d');
let cWidth, cHeight;
// 当窗口大小发生改变时重新规划高度
resize();
window.onresize = resize;

// 初始化画布高宽
function resize() {
  cWidth = c.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  cHeight = c.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
}

// 初始化鼠标位置
const mouse = {
  x: null,
  y: null,
  max: 20000,
};
// 监测鼠标位置
// 鼠标移入时
window.addEventListener('mousemove', (e) => {
  e = e || window.event;
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

// 鼠标移除时
window.addEventListener('mouseout', () => {
  mouse.x = null;
  mouse.y = null;
});
// 初始化150个点
const dots = [];
for (let i = 0; i < 200; i++) {
  const x = Math.random() * cWidth;
  const y = Math.random() * cHeight;
  const moveX = Math.random() * 2 - 1; // 移动的x,y的位置；这样移动才不会忘一边倒，有正有负
  const moveY = Math.random() * 2 - 1;
  dots.push({
    x: x,
    y: y,
    moveX: moveX,
    moveY: moveY,
    max: 10000,
  });
}
setTimeout(function () {
  animate();
}, 100); // 延迟一点绘制这些点
function animate() {
  ctx.clearRect(0, 0, cWidth, cHeight); // 清除画布上之前的痕迹
  const allDots = [mouse].concat(dots); // 将鼠标位置添加进入所有的点
  dots.forEach(function (dot) {
    ctx.fillRect(dot.x, dot.y, 1, 1); // 绘制点
    // 画布上点点的移动
    dot.x += dot.moveX;
    dot.y += dot.moveY;
    // 当点的位置在边界时，将点运动的方向反向
    if (dot.x >= cWidth || dot.x <= 0) {
      dot.moveX *= -1;
    }
    if (dot.y >= cHeight || dot.y <= 0) {
      dot.moveY *= -1;
    }
    for (let i = 0; i < allDots.length; i++) {
      // 循环比较点与点||鼠标之间的距离
      if (dot === allDots[i] || allDots[i].x === null || allDots[i].y === null) {
        continue;
      }
      // 两点距离的平方
      const dis2 = (dot.x - allDots[i].x) * (dot.x - allDots[i].x) + (dot.y - allDots[i].y) * (dot.y - allDots[i].y);
      if (dis2 <= allDots[i].max) {
        // 如果距离在点与点||鼠标之间的范围内
        if (allDots[i] === mouse && dis2 > allDots[i].max / 2) {
          // 如果当前点是鼠标位置的话，向鼠标位置靠近，但有一定距离
          dot.x -= (dot.x - allDots[i].x) * 0.05;
          dot.y -= (dot.y - allDots[i].y) * 0.05;
        }
        // 距离比率...主要是为了两个点点之间的连线生动一点
        const ratio = (allDots[i].max - dis2) / allDots[i].max;
        ctx.beginPath();
        ctx.lineWidth = ratio / 2;
        ctx.strokeStyle = 'rgba(240,240,240,' + ratio + ')';
        ctx.moveTo(dot.x, dot.y);
        ctx.lineTo(allDots[i].x, allDots[i].y);
        ctx.stroke();
      }
    }
    allDots.splice(allDots.indexOf(dot), 1);
  });
  setTimeout(function () {
    animate();
  }, 15); // 更新的时间
}
