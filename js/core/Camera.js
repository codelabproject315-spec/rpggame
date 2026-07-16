// ============================================================
// 3Dのプレイヤー追従カメラ。
// プレイヤーの少し後方・上空からプレイヤーを見下ろす、
// 一般的な3Dアクション/RPGでよく使われる固定アングルの
// 追従カメラ（プレイヤーの向きに合わせてカメラ自体は回転させない、
// 学習用プロトタイプとしてシンプルさを優先した実装）。
// ============================================================

import * as THREE from '../vendor/three.module.min.js';
import { CAMERA_HEIGHT, CAMERA_DISTANCE, CAMERA_FOV, CAMERA_LOOK_AHEAD } from '../constants.js';

export class Camera {
  constructor(aspect) {
    this.threeCamera = new THREE.PerspectiveCamera(CAMERA_FOV, aspect, 1, 10000);
  }

  setAspect(aspect) {
    this.threeCamera.aspect = aspect;
    this.threeCamera.updateProjectionMatrix();
  }

  /**
   * プレイヤーのワールド座標(px = 3Dワールド単位として流用)に合わせて
   * カメラ位置と注視点を更新する。
   * 3D空間では、2Dの上下(y)をワールドのZ奥行きとして扱う。
   */
  follow(playerX, playerZ) {
    const camX = playerX;
    const camY = CAMERA_HEIGHT;
    const camZ = playerZ + CAMERA_DISTANCE;

    this.threeCamera.position.set(camX, camY, camZ);
    this.threeCamera.lookAt(playerX, 0, playerZ - CAMERA_LOOK_AHEAD);
  }
}
