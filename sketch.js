let capture;
let pg;
let bubbles = [];

function setup() {
  // 產生一個全螢幕的畫布
  createCanvas(windowWidth, windowHeight);
  // 擷取攝影機影像
  capture = createCapture(VIDEO);
  // 初始化一個繪圖層 (Graphics)
  pg = createGraphics(100, 100);
  // 隱藏預設的影片元件，只在畫布上繪製
  capture.hide();
}

function draw() {
  // 畫布背景顏色為 e7c6ff
  background('#e7c6ff');
  
  // 當攝影機成功啟動後，同步調整 pg 的寬高與視訊一致
  if (capture.width > 0 && (pg.width !== capture.width || pg.height !== capture.height)) {
    pg = createGraphics(capture.width, capture.height);
  }

  // 在 graphics 層上繪製冒泡泡效果
  pg.clear(); // 清除上一幀內容，保持透明背景

  // 每隔幾幀產生一個新泡泡
  if (frameCount % 5 === 0 && capture.width > 0) {
    bubbles.push({
      x: random(pg.width),
      y: pg.height + 20,
      size: random(10, 30),
      speed: random(1, 4)
    });
  }

  pg.noFill();
  pg.stroke(255, 200); // 半透明白色
  pg.strokeWeight(1.5);

  for (let i = bubbles.length - 1; i >= 0; i--) {
    let b = bubbles[i];
    b.y -= b.speed; // 向上移動
    b.x += sin(frameCount * 0.1 + i) * 0.5; // 輕微左右晃動
    pg.circle(b.x, b.y, b.size);
    
    // 移除超出畫面的泡泡以維持效能
    if (b.y < -50) bubbles.splice(i, 1);
  }

  // 計算影像寬高為整個畫布寬高的 60%
  let vW = width * 0.6;
  let vH = height * 0.6;
  
  push();
  // 水平翻轉座標系統以修正鏡像問題
  translate(width, 0);
  scale(-1, 1);
  
  // 在翻轉後的座標系中計算置中座標並繪製影像
  image(capture, (width - vW) / 2, (height - vH) / 2, vW, vH);
  // 將 graphics 層疊加在影像上方
  image(pg, (width - vW) / 2, (height - vH) / 2, vW, vH);
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
