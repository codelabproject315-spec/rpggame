// ============================================================
// プレイヤーを中心に追従するカメラ。
// マップの端では画面端が画面外を映さないようクランプする。
// ============================================================

export class Camera {
  constructor(viewportWidth, viewportHeight) {
    this.viewportWidth = viewportWidth;
    this.viewportHeight = viewportHeight;
    this.x = 0;
    this.y = 0;
  }

  /**
   * プレイヤー座標(px)とマップサイズ(px)から、カメラの左上座標を更新する
   */
  follow(targetX, targetY, mapWidthPx, mapHeightPx) {
    let x = targetX - this.viewportWidth / 2;
    let y = targetY - this.viewportHeight / 2;

    // マップがビューポートより小さい場合は中央寄せにする
    const maxX = Math.max(0, mapWidthPx - this.viewportWidth);
    const maxY = Math.max(0, mapHeightPx - this.viewportHeight);

    x = Math.min(Math.max(x, 0), maxX);
    y = Math.min(Math.max(y, 0), maxY);

    // マップがビューポートより小さい軸は中央に固定
    if (mapWidthPx < this.viewportWidth) {
      x = -(this.viewportWidth - mapWidthPx) / 2;
    }
    if (mapHeightPx < this.viewportHeight) {
      y = -(this.viewportHeight - mapHeightPx) / 2;
    }

    this.x = x;
    this.y = y;
  }
}
