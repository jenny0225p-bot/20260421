let capture;

function setup() {
  // 產生一個全螢幕的畫布
  createCanvas(windowWidth, windowHeight);
  // 擷取攝影機影像
  capture = createCapture(VIDEO);
  // 隱藏預設的影片元件，只在畫布上繪製
  capture.hide();
}

function draw() {
  // 畫布背景顏色為 e7c6ff
  background('#e7c6ff');
  
  // 計算影像寬高為整個畫布寬高的 60%
  let vW = width * 0.6;
  let vH = height * 0.6;
  
  // 計算置中座標並顯示影像
  image(capture, (width - vW) / 2, (height - vH) / 2, vW, vH);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
