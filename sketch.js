let capture;
let pg;

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

  // 在 graphics 層上繪製內容 (例如：黃色文字提示)
  pg.clear(); // 清除上一幀內容，保持透明背景
  pg.fill(255, 255, 0);
  pg.noStroke();
  pg.textAlign(CENTER, CENTER);
  pg.textSize(pg.width * 0.08);
  pg.text("GRAPHICS OVERLAY", pg.width / 2, pg.height / 2);

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
