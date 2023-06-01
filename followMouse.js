const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');
let WIDTH = (canvas.width = document.documentElement.clientWidth);
let HEIGHT = (canvas.height = document.documentElement.clientHeight);
const param = {
  num: 100,
  color: false,
  r: 0.9,
  o: 0.09, // 圆消失的条件
  a: 1,
};
let color;
let color2;
const roundArr = [];

window.addEventListener('resize', () => {
  WIDTH = canvas.width = document.documentElement.clientWidth;
  HEIGHT = canvas.height = document.documentElement.clientHeight;
});

// 将圆的相关信息存储起来
window.addEventListener('mousemove', (e) => {
  const mouseX = e.clientX;
  const mouseY = e.clientY;
  roundArr.push({
    mouseX,
    mouseY,
    r: param.r,
    o: 1,
  });
});
// window.onmousemove = function (e) {
//
// }

// 判断参数中是否设置了color
if (param.color) {
  color2 = param.color;
} else {
  color = Math.random() * 360;
}

function animate() {
  if (!param.color) {
    color += 0.1;
    color2 = 'hsl(' + color + ',100%,80%)';
  }

  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  for (let i = 0; i < roundArr.length; i++) {
    ctx.fillStyle = color2;
    ctx.beginPath();
    ctx.arc(roundArr[i].mouseX, roundArr[i].mouseY, roundArr[i].r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
    roundArr[i].r += param.r;
    roundArr[i].o -= param.o;

    if (roundArr[i].o <= 0) {
      roundArr.splice(i, 1);
      i--;
    }
  }

  window.requestAnimationFrame(animate);
}

animate();
