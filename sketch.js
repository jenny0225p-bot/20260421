let capture;
let pg;
let bubbles = [];
let saveBtn;

function setup() {
  // 產生一個全螢幕的畫布
  createCanvas(windowWidth, windowHeight);

  // 1. 指定使用前置鏡頭 (facingMode: user) 並關閉音訊
  let constraints = {
    video: {
      facingMode: "user"
    },
    audio: false
  };
  capture = createCapture(constraints);
  
  // 2. 關鍵：修正手機瀏覽器（特別是 iOS Safari）不顯示視訊的問題
  // playsinline 讓影片在網頁內播放，muted 則能繞過多數瀏覽器的自動播放阻擋
  capture.elt.setAttribute('playsinline', '');
  capture.elt.setAttribute('muted', '');
  
  // 隱藏預設的影片元件，只在畫布上繪製
  capture.hide();

  // 建立擷取按鈕，並增加適合手機觸控的大小與樣式
  saveBtn = createButton('擷取目前畫面');
  saveBtn.style('padding', '15px 30px'); // 增大點擊區域
  saveBtn.style('font-size', '18px');     // 增大文字
  saveBtn.style('background-color', '#fff');
  saveBtn.style('border-radius', '12px');
  saveBtn.style('border', 'none');
  saveBtn.style('box-shadow', '0 4px 10px rgba(0,0,0,0.3)'); // 增加陰影方便辨識
  saveBtn.style('width', '180px');        // 固定寬度以利計算位置
  saveBtn.position(windowWidth / 2 - 90, windowHeight - 80);
  saveBtn.mousePressed(takeSnapshot);
  
  // 先給予一個暫時的寬高，避免在攝影機啟動前 pg 物件無效
  pg = createGraphics(windowWidth, windowHeight); 
  capture.play(); // 嘗試在啟動時直接呼叫播放
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

  // 如果攝影機尚未讀取到有效影像資料，則跳過繪製，避免畫面出現錯誤或黑屏
  if (capture.width < 10) {
    return;
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
  // 視窗縮放時重新調整按鈕位置
  saveBtn.position(windowWidth / 2 - 90, windowHeight - 80);
}

// 3. 關鍵：手機瀏覽器政策規定視訊播放通常需要使用者的第一下點擊
// 如果畫面是黑的，請在螢幕上點擊任何地方
function mousePressed() {
  if (capture && capture.elt) {
    capture.play();
    // 此舉能確保在使用者點擊後，視訊流被瀏覽器正式允許播放
  }
}

// 擷取畫面並儲存的函式
function takeSnapshot() {
  let vW = width * 0.6;
  let vH = height * 0.6;
  let x = (width - vW) / 2;
  let y = (height - vH) / 2;
  
  // 從畫布中擷取視訊所在範圍的影像
  let shot = get(x, y, vW, vH);
  save(shot, 'snapshot.jpg');
}
