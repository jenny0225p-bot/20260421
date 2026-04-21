let capture;
let pg;
let bubbles = [];

function setup() {
  // 產生一個全螢幕的畫布
  createCanvas(windowWidth, windowHeight);
  // 擷取攝影機影像
  capture = createCapture(VIDEO);
  // 隱藏預設的影片元件，只在畫布上繪製
  capture.hide();
  // 先初始化一個預設大小的繪圖層
  pg = createGraphics(windowWidth, windowHeight);
}

function draw() {
  // 畫布背景顏色為 e7c6ff
  background('#e7c6ff');
  
  // 1. 計算影像寬高為整個畫布寬高的 60%
  let vW = width * 0.6;
  let vH = height * 0.6;

  // 2. 當攝影機成功取得尺寸後，同步調整 pg 的解析度（確保與視訊同比例）
  if (capture.width > 0 && (pg.width !== capture.width || pg.height !== capture.height)) {
    pg = createGraphics(capture.width, capture.height);
  }

  // 在 graphics 層上繪製冒泡泡效果
  pg.clear(); 
  if (frameCount % 5 === 0) {
    bubbles.push({
      x: random(pg.width),
      y: pg.height + 20,
      size: random(10, 30),
      speed: random(1, 4)
    });
  }
  pg.noFill();
  pg.stroke(255, 200);
  pg.strokeWeight(1.5);
  for (let i = bubbles.length - 1; i >= 0; i--) {
    let b = bubbles[i];
    b.y -= b.speed;
    b.x += sin(frameCount * 0.1 + i) * 0.5;
    pg.circle(b.x, b.y, b.size);
    if (b.y < -50) bubbles.splice(i, 1);
  }

  push();
  // 3. 移動到畫布中間並進行水平翻轉（鏡像修正）
  translate(width / 2, height / 2);
  scale(-1, 1);
  imageMode(CENTER);
  
  // 4. 繪製攝影機影像與泡泡層
  image(capture, 0, 0, vW, vH);
  image(pg, 0, 0, vW, vH);
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
