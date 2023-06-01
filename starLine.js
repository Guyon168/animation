const requestAnimFrame = (function () {
  return (
    window.requestAnimFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    }
  );
})();
// 获取canvas元素
const canvas = document.getElementById('canvas');
// 获取2D元素，设置画笔
const cxt = canvas.getContext('2d');
let w, h;
const num = 200; // 粒子的初始数量
let data = []; // 存储粉色点位置数据
let move = {}; // 存储鼠标位置数据
window.onresize = init();
init();
// 页面初始化
function init() {
  data = [];
  move = {};
  // 设置canvas画布的宽和高,实现canvas和浏览器等宽等高
  h = canvas.height = window.innerHeight;
  w = canvas.width = window.innerWidth;
  // 粉色点位置,运动速度增量
  for (let i = 0; i < num; i++) {
    // 循环创建粉色点
    // 创建一个对象，对象中含有圆心的x,y坐标以及x,y方向上的增量
    data[i] = {
      x: Math.random() * w,
      y: Math.random() * h,
      cX: Math.random() * 0.6 - 0.3,
      cY: Math.random() * 0.6 - 0.3,
    };
    Circle(data[i].x, data[i].y); // 实参
  }
}

// 绘制粉色小点
function Circle(x, y) {
  // 形参
  cxt.save(); // 保存路径
  cxt.fillStyle = 'pink'; // 设置填充样式
  // 开始划路径
  cxt.beginPath();
  // arc威画圆函数，参数分别代表圆心坐标，圆半径，画的弧度大小，及顺时针or逆时针
  cxt.arc(x, y, 0.5, Math.PI * 2, false);
  cxt.closePath(); // 结束路径
  // 调用填充函数
  cxt.fill();
  cxt.restore(); // 释放路径
}

// 粉色点的运动及连线
(function draw() {
  cxt.clearRect(0, 0, w, h); // 先清除画布
  for (let i = 0; i < num; i++) {
    // 当前点
    data[i].x += data[i].cX;
    data[i].y += data[i].cY;
    // 边界判断
    if (data[i].x < 0 || data[i].x > w) data[i].cX = -data[i].cX;
    if (data[i].y < 0 || data[i].y > h) data[i].cY = -data[i].cY;
    // 将坐标改变的粒子进行重绘；
    Circle(data[i].x, data[i].y);
    // 用勾股定理来判断两点是否连线
    for (let j = i + 1; j < num; j++) {
      // 下一个点
      if (
        (data[i].x - data[j].x) * (data[i].x - data[j].x) + (data[i].y - data[j].y) * (data[i].y - data[j].y) <=
        50 * 50
      ) {
        line(data[i].x, data[i].y, data[j].x, data[j].y, false);
      }

      if (move.x) {
        if ((data[i].x - move.x) * (data[i].x - move.x) + (data[i].y - move.y) * (data[i].y - move.y) <= 50 * 50) {
          line(data[i].x, data[i].y, move.x, move.y, true);
        }
      }
    }
  }
  requestAnimFrame(draw); // 帧动画解决定时器bug
})(); // 这样可使函数自执行
// 绘制线条
function line(x1, y1, x2, y2, isMove) {
  // 线性渐变
  const color = cxt.createLinearGradient(x1, y1, x2, y2);
  if (!isMove) {
    color.addColorStop(0, 'yellow');
    color.addColorStop(1, 'pink');
  } else {
    color.addColorStop(0, '#fff');
    color.addColorStop(1, '#0bd2dd');
  }

  cxt.save(); // 保存路径
  cxt.strokeStyle = color;
  // 开始划路径
  cxt.beginPath();
  cxt.moveTo(x1, y1);
  cxt.lineTo(x2, y2);
  cxt.stroke(); // 划线
  cxt.restore(); // 释放路径
}
// 移入鼠标进行连线
document.onmousemove = function (e) {
  // 获取鼠标的位置数据
  move.x = e.clientX;
  move.y = e.clientY;
};
