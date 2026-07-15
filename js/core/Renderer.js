// ============================================================
// 3D描画を担当するクラス（Three.js使用）。
// 地面は「タイルの色をキャンバスに描いてテクスチャ化した1枚の平面」、
// 木・岩・山・建物・NPCなどは個別の3Dオブジェクトとして配置する。
// 「見た目」に関する変更はほぼこのファイルだけで完結する。
// ============================================================

import * as THREE from '../vendor/three.module.min.js';
import { TileType, TILE_DEFINITIONS } from '../data/tileTypes.js';
import { BUILDING_DEFINITIONS } from '../data/buildingTypes.js';
import { OBJECT_DEFINITIONS } from '../data/objectTypes.js';
import { NPC_DEFINITIONS } from '../data/npcTypes.js';
import { TILE_SIZE, HEIGHTS, Direction } from '../constants.js';

const GROUND_PX_PER_TILE = 16; // 地面テクスチャの解像度（タイル1枚あたりのピクセル数）

const ORIGINAL_OBJECT_SHAPES = new Set([
  'signboard', 'bench', 'streetlight', 'mailbox', 'vendingMachine', 'treasureChest', 'flowerBed',
]);

const FACING_OFFSETS = {
  [Direction.DOWN]: [0, 1],
  [Direction.UP]: [0, -1],
  [Direction.LEFT]: [-1, 0],
  [Direction.RIGHT]: [1, 0],
};

// ------------------------------------------------------------
// モジュール内ヘルパー（クラスの状態を持たない純粋な生成関数群）
// ------------------------------------------------------------

function makeLabelSprite(text, fontSize = 34) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.font = `bold ${fontSize}px sans-serif`;
  const paddingX = 18;
  const textWidth = ctx.measureText(text).width;
  canvas.width = Math.ceil(textWidth + paddingX * 2);
  canvas.height = Math.ceil(fontSize * 1.7);

  // canvasサイズを変えるとcontextの設定がリセットされるため再設定
  ctx.font = `bold ${fontSize}px sans-serif`;
  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.SpriteMaterial({ map: texture, depthTest: false, transparent: true });
  const sprite = new THREE.Sprite(material);
  const scale = 0.028;
  sprite.scale.set(canvas.width * scale, canvas.height * scale, 1);
  sprite.renderOrder = 999;
  return sprite;
}

function buildGroundTexture(mapData) {
  const canvas = document.createElement('canvas');
  canvas.width = mapData.width * GROUND_PX_PER_TILE;
  canvas.height = mapData.height * GROUND_PX_PER_TILE;
  const ctx = canvas.getContext('2d');

  for (let row = 0; row < mapData.height; row++) {
    for (let col = 0; col < mapData.width; col++) {
      const tileId = mapData.tiles[row][col];
      const def = TILE_DEFINITIONS[tileId];
      const px = col * GROUND_PX_PER_TILE;
      const py = row * GROUND_PX_PER_TILE;

      ctx.fillStyle = def ? def.color : '#000000';
      ctx.fillRect(px, py, GROUND_PX_PER_TILE, GROUND_PX_PER_TILE);

      if (def && def.decoration === 'flower') {
        ctx.fillStyle = '#e85d75';
        const cx = px + GROUND_PX_PER_TILE / 2;
        const cy = py + GROUND_PX_PER_TILE / 2;
        for (const [ox, oy] of [[-3, -2], [3, -1], [0, 3]]) {
          ctx.beginPath();
          ctx.arc(cx + ox, cy + oy, 1.6, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function buildGroundMesh(mapData) {
  const width = mapData.width * TILE_SIZE;
  const depth = mapData.height * TILE_SIZE;
  const geometry = new THREE.PlaneGeometry(width, depth);
  const material = new THREE.MeshLambertMaterial({ map: buildGroundTexture(mapData) });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.set(width / 2, 0, depth / 2);
  return mesh;
}

/**
 * マップの外側を覆う背景用の地面。
 * ズームアウトしてもマップの端の外側に何もない空間（背景色）が
 * 見えてしまわないよう、実際のマップより十分広い単色の地面を
 * 少しだけ低い位置に敷いておく（本来のマップの地面がその上に重なる）。
 */
function buildSurroundingGround(mapData) {
  const width = mapData.width * TILE_SIZE;
  const depth = mapData.height * TILE_SIZE;
  const size = Math.max(width, depth) + TILE_SIZE * 120;
  const geometry = new THREE.PlaneGeometry(size, size);
  const material = new THREE.MeshLambertMaterial({ color: '#6fae4e' });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.set(width / 2, -0.5, depth / 2);
  return mesh;
}

function collectTilePositions(mapData, tileId) {
  const positions = [];
  for (let row = 0; row < mapData.height; row++) {
    for (let col = 0; col < mapData.width; col++) {
      if (mapData.tiles[row][col] === tileId) {
        positions.push([col * TILE_SIZE + TILE_SIZE / 2, row * TILE_SIZE + TILE_SIZE / 2]);
      }
    }
  }
  return positions;
}

function buildTreeCluster(positions, { scale = 1, dark = false } = {}) {
  if (!positions.length) return null;
  const group = new THREE.Group();

  const trunkGeo = new THREE.CylinderGeometry(TILE_SIZE * 0.06 * scale, TILE_SIZE * 0.08 * scale, TILE_SIZE * 0.5 * scale, 6);
  const trunkMat = new THREE.MeshLambertMaterial({ color: dark ? '#3d2a18' : '#5a3a22' });
  const trunkMesh = new THREE.InstancedMesh(trunkGeo, trunkMat, positions.length);

  const canopyGeo = new THREE.ConeGeometry(TILE_SIZE * 0.36 * scale, TILE_SIZE * 0.9 * scale, 7);
  const canopyMat = new THREE.MeshLambertMaterial({ color: dark ? '#224d22' : '#2d6b2d' });
  const canopyMesh = new THREE.InstancedMesh(canopyGeo, canopyMat, positions.length);

  const dummy = new THREE.Object3D();
  positions.forEach(([x, z], i) => {
    dummy.position.set(x, TILE_SIZE * 0.25 * scale, z);
    dummy.rotation.set(0, 0, 0);
    dummy.updateMatrix();
    trunkMesh.setMatrixAt(i, dummy.matrix);

    dummy.position.set(x, TILE_SIZE * 0.5 * scale + TILE_SIZE * 0.4 * scale, z);
    dummy.updateMatrix();
    canopyMesh.setMatrixAt(i, dummy.matrix);
  });

  group.add(trunkMesh, canopyMesh);
  return group;
}

function buildRockCluster(positions) {
  if (!positions.length) return null;
  const geo = new THREE.IcosahedronGeometry(TILE_SIZE * 0.32, 0);
  const mat = new THREE.MeshLambertMaterial({ color: '#8a8a8a', flatShading: true });
  const mesh = new THREE.InstancedMesh(geo, mat, positions.length);
  const dummy = new THREE.Object3D();
  positions.forEach(([x, z], i) => {
    dummy.position.set(x, TILE_SIZE * 0.22, z);
    dummy.rotation.set(Math.random() * 0.4, Math.random() * Math.PI, Math.random() * 0.4);
    dummy.updateMatrix();
    mesh.setMatrixAt(i, dummy.matrix);
  });
  return mesh;
}

function buildMountainCluster(positions) {
  if (!positions.length) return null;
  const geo = new THREE.ConeGeometry(TILE_SIZE * 0.65, HEIGHTS.MOUNTAIN, 8);
  const mat = new THREE.MeshLambertMaterial({ color: '#6e6255' });
  const mesh = new THREE.InstancedMesh(geo, mat, positions.length);
  const dummy = new THREE.Object3D();
  positions.forEach(([x, z], i) => {
    dummy.position.set(x, HEIGHTS.MOUNTAIN / 2, z);
    dummy.updateMatrix();
    mesh.setMatrixAt(i, dummy.matrix);
  });
  return mesh;
}

function buildCliffCluster(positions) {
  if (!positions.length) return null;
  const geo = new THREE.BoxGeometry(TILE_SIZE, HEIGHTS.CLIFF, TILE_SIZE);
  const mat = new THREE.MeshLambertMaterial({ color: '#5a4b3c' });
  const mesh = new THREE.InstancedMesh(geo, mat, positions.length);
  const dummy = new THREE.Object3D();
  positions.forEach(([x, z], i) => {
    dummy.position.set(x, HEIGHTS.CLIFF / 2, z);
    dummy.updateMatrix();
    mesh.setMatrixAt(i, dummy.matrix);
  });
  return mesh;
}

function buildBridgeDeckCluster(positions) {
  if (!positions.length) return null;
  const geo = new THREE.BoxGeometry(TILE_SIZE * 0.95, HEIGHTS.BRIDGE, TILE_SIZE * 0.95);
  const mat = new THREE.MeshLambertMaterial({ color: '#a97a4b' });
  const mesh = new THREE.InstancedMesh(geo, mat, positions.length);
  const dummy = new THREE.Object3D();
  positions.forEach(([x, z], i) => {
    dummy.position.set(x, HEIGHTS.BRIDGE / 2 + 1, z);
    dummy.updateMatrix();
    mesh.setMatrixAt(i, dummy.matrix);
  });
  return mesh;
}

function buildBuildingMesh(building) {
  const def = BUILDING_DEFINITIONS[building.type];
  const w = building.w * TILE_SIZE;
  const d = building.h * TILE_SIZE;
  const bodyH = HEIGHTS.BUILDING;
  const group = new THREE.Group();

  const body = new THREE.Mesh(
    new THREE.BoxGeometry(w, bodyH, d),
    new THREE.MeshLambertMaterial({ color: def.bodyColor })
  );
  body.position.y = bodyH / 2;
  group.add(body);

  const roof = new THREE.Mesh(
    new THREE.ConeGeometry(Math.max(w, d) * 0.72, HEIGHTS.ROOF, 4),
    new THREE.MeshLambertMaterial({ color: def.roofColor })
  );
  roof.rotation.y = Math.PI / 4;
  roof.position.y = bodyH + HEIGHTS.ROOF / 2 - TILE_SIZE * 0.05;
  group.add(roof);

  const label = makeLabelSprite(def.name, 40);
  label.position.y = bodyH + HEIGHTS.ROOF + TILE_SIZE * 0.5;
  group.add(label);

  group.position.set((building.x + building.w / 2) * TILE_SIZE, 0, (building.y + building.h / 2) * TILE_SIZE);
  return group;
}

function buildObjectMesh(obj) {
  const def = OBJECT_DEFINITIONS[obj.type];
  const ts = TILE_SIZE;
  const group = new THREE.Group();
  const color = def.color;

  switch (def.shape) {
    case 'signboard': {
      const post = new THREE.Mesh(new THREE.BoxGeometry(ts * 0.06, ts * 0.5, ts * 0.06), new THREE.MeshLambertMaterial({ color }));
      post.position.y = ts * 0.25;
      const board = new THREE.Mesh(new THREE.BoxGeometry(ts * 0.6, ts * 0.35, ts * 0.05), new THREE.MeshLambertMaterial({ color: '#e9dcb8' }));
      board.position.y = ts * 0.55;
      group.add(post, board);
      break;
    }
    case 'bench': {
      const seat = new THREE.Mesh(new THREE.BoxGeometry(ts * 0.75, ts * 0.12, ts * 0.3), new THREE.MeshLambertMaterial({ color }));
      seat.position.y = ts * 0.32;
      const legMat = new THREE.MeshLambertMaterial({ color });
      const legGeo = new THREE.BoxGeometry(ts * 0.08, ts * 0.3, ts * 0.08);
      const leg1 = new THREE.Mesh(legGeo, legMat);
      leg1.position.set(-ts * 0.3, ts * 0.15, 0);
      const leg2 = new THREE.Mesh(legGeo, legMat);
      leg2.position.set(ts * 0.3, ts * 0.15, 0);
      group.add(seat, leg1, leg2);
      break;
    }
    case 'streetlight': {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(ts * 0.03, ts * 0.03, ts * 0.9, 6), new THREE.MeshLambertMaterial({ color }));
      pole.position.y = ts * 0.45;
      const lamp = new THREE.Mesh(
        new THREE.SphereGeometry(ts * 0.14, 8, 8),
        new THREE.MeshStandardMaterial({ color: '#f4d35e', emissive: '#f4d35e', emissiveIntensity: 0.6 })
      );
      lamp.position.y = ts * 0.95;
      group.add(pole, lamp);
      break;
    }
    case 'mailbox': {
      const box = new THREE.Mesh(new THREE.BoxGeometry(ts * 0.35, ts * 0.4, ts * 0.3), new THREE.MeshLambertMaterial({ color }));
      box.position.y = ts * 0.3;
      const top = new THREE.Mesh(
        new THREE.CylinderGeometry(ts * 0.175, ts * 0.175, ts * 0.3, 10, 1, false, 0, Math.PI),
        new THREE.MeshLambertMaterial({ color })
      );
      top.rotation.z = Math.PI / 2;
      top.rotation.y = Math.PI / 2;
      top.position.y = ts * 0.5;
      group.add(box, top);
      break;
    }
    case 'vendingMachine': {
      const body = new THREE.Mesh(new THREE.BoxGeometry(ts * 0.6, ts * 0.85, ts * 0.4), new THREE.MeshLambertMaterial({ color }));
      body.position.y = ts * 0.42;
      const panel = new THREE.Mesh(
        new THREE.BoxGeometry(ts * 0.46, ts * 0.4, ts * 0.02),
        new THREE.MeshStandardMaterial({ color: '#ffffff', emissive: '#ffffff', emissiveIntensity: 0.25 })
      );
      panel.position.set(0, ts * 0.5, ts * 0.21);
      group.add(body, panel);
      break;
    }
    case 'treasureChest': {
      const base = new THREE.Mesh(new THREE.BoxGeometry(ts * 0.6, ts * 0.35, ts * 0.4), new THREE.MeshLambertMaterial({ color }));
      base.position.y = ts * 0.18;
      const lid = new THREE.Mesh(new THREE.BoxGeometry(ts * 0.62, ts * 0.18, ts * 0.42), new THREE.MeshLambertMaterial({ color: '#8a5a1c' }));
      lid.position.y = ts * 0.42;
      group.add(base, lid);
      break;
    }
    case 'flowerBed': {
      const bed = new THREE.Mesh(new THREE.BoxGeometry(ts * 0.8, ts * 0.15, ts * 0.8), new THREE.MeshLambertMaterial({ color }));
      bed.position.y = ts * 0.08;
      group.add(bed);
      const flowerMat = new THREE.MeshLambertMaterial({ color: '#e85d75' });
      for (const [ox, oz] of [[-0.2, -0.2], [0.2, -0.15], [0, 0.2]]) {
        const f = new THREE.Mesh(new THREE.SphereGeometry(ts * 0.08, 6, 6), flowerMat);
        f.position.set(ox * ts, ts * 0.2, oz * ts);
        group.add(f);
      }
      break;
    }
    default:
      break;
  }

  if (!ORIGINAL_OBJECT_SHAPES.has(def.shape)) {
    buildExtraObjectShape(def.shape, group, color, ts);
  }

  group.position.set(obj.x * ts + ts / 2, 0, obj.y * ts + ts / 2);
  return group;
}

/** 今回追加した新オブジェクトの形状。既存のswitchを肥大化させないよう別関数に分離。 */
function buildExtraObjectShape(shape, group, color, ts) {
  switch (shape) {
    case 'torii': {
      const postMat = new THREE.MeshLambertMaterial({ color });
      const postGeo = new THREE.CylinderGeometry(ts * 0.06, ts * 0.07, ts * 1.1, 8);
      const post1 = new THREE.Mesh(postGeo, postMat);
      post1.position.set(-ts * 0.32, ts * 0.55, 0);
      const post2 = new THREE.Mesh(postGeo, postMat);
      post2.position.set(ts * 0.32, ts * 0.55, 0);
      const topBeam = new THREE.Mesh(new THREE.BoxGeometry(ts * 0.9, ts * 0.1, ts * 0.12), postMat);
      topBeam.position.y = ts * 1.05;
      const subBeam = new THREE.Mesh(new THREE.BoxGeometry(ts * 0.74, ts * 0.07, ts * 0.09), postMat);
      subBeam.position.y = ts * 0.9;
      group.add(post1, post2, topBeam, subBeam);
      break;
    }
    case 'komainu': {
      const stoneMat = new THREE.MeshLambertMaterial({ color, flatShading: true });
      const body = new THREE.Mesh(new THREE.SphereGeometry(ts * 0.22, 8, 8), stoneMat);
      body.position.y = ts * 0.25;
      body.scale.set(1, 0.85, 1.3);
      const head = new THREE.Mesh(new THREE.SphereGeometry(ts * 0.15, 8, 8), stoneMat);
      head.position.set(0, ts * 0.45, ts * 0.12);
      const earGeo = new THREE.ConeGeometry(ts * 0.05, ts * 0.1, 6);
      const ear1 = new THREE.Mesh(earGeo, stoneMat);
      ear1.position.set(-ts * 0.08, ts * 0.56, ts * 0.12);
      const ear2 = new THREE.Mesh(earGeo, stoneMat);
      ear2.position.set(ts * 0.08, ts * 0.56, ts * 0.12);
      group.add(body, head, ear1, ear2);
      break;
    }
    case 'bell': {
      const frameMat = new THREE.MeshLambertMaterial({ color: '#6b4a2f' });
      const postGeo = new THREE.BoxGeometry(ts * 0.07, ts * 0.9, ts * 0.07);
      const post1 = new THREE.Mesh(postGeo, frameMat);
      post1.position.set(-ts * 0.3, ts * 0.45, 0);
      const post2 = new THREE.Mesh(postGeo, frameMat);
      post2.position.set(ts * 0.3, ts * 0.45, 0);
      const beam = new THREE.Mesh(new THREE.BoxGeometry(ts * 0.7, ts * 0.08, ts * 0.08), frameMat);
      beam.position.y = ts * 0.85;
      const bellShape = new THREE.Mesh(
        new THREE.CylinderGeometry(ts * 0.12, ts * 0.2, ts * 0.35, 10),
        new THREE.MeshStandardMaterial({ color, metalness: 0.3, roughness: 0.6 })
      );
      bellShape.position.y = ts * 0.55;
      group.add(post1, post2, beam, bellShape);
      break;
    }

    case 'swing': {
      const frameMat = new THREE.MeshLambertMaterial({ color });
      const legGeo = new THREE.BoxGeometry(ts * 0.06, ts * 0.9, ts * 0.06);
      for (const ox of [-0.35, 0.35]) {
        for (const oz of [-0.3, 0.3]) {
          const leg = new THREE.Mesh(legGeo, frameMat);
          leg.position.set(ox * ts, ts * 0.45, oz * ts);
          group.add(leg);
        }
      }
      const topBar = new THREE.Mesh(new THREE.BoxGeometry(ts * 0.8, ts * 0.06, ts * 0.06), frameMat);
      topBar.position.y = ts * 0.9;
      group.add(topBar);
      const seatMat = new THREE.MeshLambertMaterial({ color: '#8b5a2b' });
      for (const ox of [-0.2, 0.2]) {
        const rope1 = new THREE.Mesh(new THREE.CylinderGeometry(ts * 0.015, ts * 0.015, ts * 0.4, 4), frameMat);
        rope1.position.set(ox * ts, ts * 0.68, 0);
        const seat = new THREE.Mesh(new THREE.BoxGeometry(ts * 0.22, ts * 0.03, ts * 0.12), seatMat);
        seat.position.set(ox * ts, ts * 0.47, 0);
        group.add(rope1, seat);
      }
      break;
    }
    case 'slide': {
      const rampMat = new THREE.MeshLambertMaterial({ color });
      const ramp = new THREE.Mesh(new THREE.BoxGeometry(ts * 0.4, ts * 0.06, ts * 0.9), rampMat);
      ramp.rotation.x = -Math.PI / 5;
      ramp.position.set(0, ts * 0.35, ts * 0.05);
      const ladderMat = new THREE.MeshLambertMaterial({ color: '#8a8a8a' });
      const ladder = new THREE.Mesh(new THREE.BoxGeometry(ts * 0.35, ts * 0.75, ts * 0.06), ladderMat);
      ladder.position.set(0, ts * 0.38, -ts * 0.4);
      group.add(ramp, ladder);
      break;
    }
    case 'fountain': {
      const basinMat = new THREE.MeshLambertMaterial({ color });
      const basin = new THREE.Mesh(new THREE.CylinderGeometry(ts * 0.42, ts * 0.46, ts * 0.22, 14), basinMat);
      basin.position.y = ts * 0.11;
      const waterMat = new THREE.MeshStandardMaterial({ color: '#5fb6d9', transparent: true, opacity: 0.85 });
      const water = new THREE.Mesh(new THREE.CylinderGeometry(ts * 0.36, ts * 0.36, ts * 0.05, 14), waterMat);
      water.position.y = ts * 0.24;
      const spout = new THREE.Mesh(new THREE.CylinderGeometry(ts * 0.06, ts * 0.08, ts * 0.35, 8), basinMat);
      spout.position.y = ts * 0.35;
      group.add(basin, water, spout);
      break;
    }

    case 'bicycleRack': {
      const mat = new THREE.MeshLambertMaterial({ color });
      const rail = new THREE.Mesh(new THREE.BoxGeometry(ts * 0.9, ts * 0.05, ts * 0.06), mat);
      rail.position.y = ts * 0.3;
      group.add(rail);
      for (const ox of [-0.32, 0, 0.32]) {
        const loop = new THREE.Mesh(new THREE.TorusGeometry(ts * 0.13, ts * 0.02, 6, 12), mat);
        loop.position.set(ox * ts, ts * 0.3, 0);
        group.add(loop);
      }
      break;
    }
    case 'clockTower': {
      const bodyMat = new THREE.MeshLambertMaterial({ color });
      const tower = new THREE.Mesh(new THREE.BoxGeometry(ts * 0.4, ts * 1.6, ts * 0.4), bodyMat);
      tower.position.y = ts * 0.8;
      const clockMat = new THREE.MeshStandardMaterial({ color: '#f2ead9', emissive: '#f2ead9', emissiveIntensity: 0.15 });
      const clockFace = new THREE.Mesh(new THREE.CylinderGeometry(ts * 0.16, ts * 0.16, ts * 0.03, 16), clockMat);
      clockFace.rotation.x = Math.PI / 2;
      clockFace.position.set(0, ts * 1.4, ts * 0.21);
      const roof = new THREE.Mesh(new THREE.ConeGeometry(ts * 0.32, ts * 0.3, 4), new THREE.MeshLambertMaterial({ color: '#5b7fbd' }));
      roof.rotation.y = Math.PI / 4;
      roof.position.y = ts * 1.75;
      group.add(tower, clockFace, roof);
      break;
    }

    case 'cafeTable': {
      const mat = new THREE.MeshLambertMaterial({ color });
      const top = new THREE.Mesh(new THREE.CylinderGeometry(ts * 0.24, ts * 0.24, ts * 0.04, 12), mat);
      top.position.y = ts * 0.4;
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(ts * 0.03, ts * 0.03, ts * 0.4, 8), mat);
      leg.position.y = ts * 0.2;
      const parasol = new THREE.Mesh(new THREE.ConeGeometry(ts * 0.32, ts * 0.18, 10), new THREE.MeshLambertMaterial({ color: '#c0392b' }));
      parasol.position.y = ts * 0.72;
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(ts * 0.015, ts * 0.015, ts * 0.35, 6), mat);
      pole.position.y = ts * 0.55;
      group.add(top, leg, parasol, pole);
      break;
    }
    case 'lantern': {
      const frameMat = new THREE.MeshLambertMaterial({ color: '#6b4a2f' });
      const bar = new THREE.Mesh(new THREE.BoxGeometry(ts * 0.3, ts * 0.04, ts * 0.04), frameMat);
      bar.position.y = ts * 0.85;
      const lampMat = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.5 });
      const lamp = new THREE.Mesh(new THREE.SphereGeometry(ts * 0.14, 10, 10), lampMat);
      lamp.position.y = ts * 0.68;
      group.add(bar, lamp);
      break;
    }
    case 'shopBanner': {
      const poleMat = new THREE.MeshLambertMaterial({ color: '#6b4a2f' });
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(ts * 0.02, ts * 0.02, ts * 0.85, 6), poleMat);
      pole.position.y = ts * 0.65;
      const banner = new THREE.Mesh(new THREE.BoxGeometry(ts * 0.05, ts * 0.5, ts * 0.36), new THREE.MeshLambertMaterial({ color }));
      banner.position.set(ts * 0.2, ts * 0.5, 0);
      group.add(pole, banner);
      break;
    }

    case 'well': {
      const stoneMat = new THREE.MeshLambertMaterial({ color });
      const rim = new THREE.Mesh(new THREE.CylinderGeometry(ts * 0.28, ts * 0.3, ts * 0.35, 12), stoneMat);
      rim.position.y = ts * 0.18;
      const roofPostMat = new THREE.MeshLambertMaterial({ color: '#8b5a2b' });
      const postGeo = new THREE.BoxGeometry(ts * 0.05, ts * 0.5, ts * 0.05);
      const post1 = new THREE.Mesh(postGeo, roofPostMat);
      post1.position.set(-ts * 0.22, ts * 0.5, 0);
      const post2 = new THREE.Mesh(postGeo, roofPostMat);
      post2.position.set(ts * 0.22, ts * 0.5, 0);
      const roof = new THREE.Mesh(new THREE.ConeGeometry(ts * 0.35, ts * 0.2, 4), new THREE.MeshLambertMaterial({ color: '#8f2d2d' }));
      roof.rotation.y = Math.PI / 4;
      roof.position.y = ts * 0.85;
      group.add(rim, post1, post2, roof);
      break;
    }
    case 'trashCan': {
      const mat = new THREE.MeshLambertMaterial({ color });
      const body = new THREE.Mesh(new THREE.CylinderGeometry(ts * 0.16, ts * 0.14, ts * 0.4, 10), mat);
      body.position.y = ts * 0.2;
      const lid = new THREE.Mesh(new THREE.CylinderGeometry(ts * 0.17, ts * 0.17, ts * 0.04, 10), mat);
      lid.position.y = ts * 0.42;
      group.add(body, lid);
      break;
    }
    case 'fence': {
      const mat = new THREE.MeshLambertMaterial({ color });
      const rail = new THREE.Mesh(new THREE.BoxGeometry(ts * 0.9, ts * 0.06, ts * 0.04), mat);
      rail.position.y = ts * 0.35;
      group.add(rail);
      for (const ox of [-0.4, -0.13, 0.13, 0.4]) {
        const picket = new THREE.Mesh(new THREE.BoxGeometry(ts * 0.06, ts * 0.5, ts * 0.06), mat);
        picket.position.set(ox * ts, ts * 0.25, 0);
        group.add(picket);
      }
      break;
    }

    case 'planter': {
      const boxMat = new THREE.MeshLambertMaterial({ color });
      const box = new THREE.Mesh(new THREE.BoxGeometry(ts * 0.55, ts * 0.3, ts * 0.32), boxMat);
      box.position.y = ts * 0.15;
      const flowerMat = new THREE.MeshLambertMaterial({ color: '#e85d75' });
      for (const [ox, oz] of [[-0.15, 0], [0.05, -0.05], [0.18, 0.06]]) {
        const f = new THREE.Mesh(new THREE.SphereGeometry(ts * 0.07, 6, 6), flowerMat);
        f.position.set(ox * ts, ts * 0.35, oz * ts);
        group.add(f);
      }
      group.add(box);
      break;
    }
    case 'laundryPole': {
      const mat = new THREE.MeshLambertMaterial({ color });
      const postGeo = new THREE.CylinderGeometry(ts * 0.03, ts * 0.03, ts * 0.9, 6);
      const post1 = new THREE.Mesh(postGeo, mat);
      post1.position.set(-ts * 0.35, ts * 0.45, 0);
      const post2 = new THREE.Mesh(postGeo, mat);
      post2.position.set(ts * 0.35, ts * 0.45, 0);
      const bar = new THREE.Mesh(new THREE.CylinderGeometry(ts * 0.015, ts * 0.015, ts * 0.72, 6), mat);
      bar.rotation.z = Math.PI / 2;
      bar.position.y = ts * 0.85;
      const clothMat = new THREE.MeshLambertMaterial({ color: '#e8e2d0' });
      for (const ox of [-0.18, 0.15]) {
        const cloth = new THREE.Mesh(new THREE.BoxGeometry(ts * 0.14, ts * 0.18, ts * 0.02), clothMat);
        cloth.position.set(ox * ts, ts * 0.72, 0);
        group.add(cloth);
      }
      group.add(post1, post2, bar);
      break;
    }

    case 'jizoStatue': {
      const stoneMat = new THREE.MeshLambertMaterial({ color, flatShading: true });
      const body = new THREE.Mesh(new THREE.CylinderGeometry(ts * 0.1, ts * 0.16, ts * 0.5, 8), stoneMat);
      body.position.y = ts * 0.25;
      const head = new THREE.Mesh(new THREE.SphereGeometry(ts * 0.12, 8, 8), stoneMat);
      head.position.y = ts * 0.56;
      const bib = new THREE.Mesh(new THREE.BoxGeometry(ts * 0.18, ts * 0.16, ts * 0.04), new THREE.MeshLambertMaterial({ color: '#c0392b' }));
      bib.position.set(0, ts * 0.42, ts * 0.13);
      group.add(body, head, bib);
      break;
    }
    case 'trailSign': {
      const mat = new THREE.MeshLambertMaterial({ color });
      const post = new THREE.Mesh(new THREE.CylinderGeometry(ts * 0.04, ts * 0.05, ts * 0.7, 6), mat);
      post.position.y = ts * 0.35;
      const arrow = new THREE.Mesh(new THREE.BoxGeometry(ts * 0.55, ts * 0.18, ts * 0.03), new THREE.MeshLambertMaterial({ color: '#e9dcb8' }));
      arrow.position.set(ts * 0.1, ts * 0.65, 0);
      arrow.rotation.z = -0.15;
      group.add(post, arrow);
      break;
    }

    default: {
      const box = new THREE.Mesh(new THREE.BoxGeometry(ts * 0.4, ts * 0.4, ts * 0.4), new THREE.MeshLambertMaterial({ color }));
      box.position.y = ts * 0.2;
      group.add(box);
      break;
    }

/** プレイヤー・NPC共通の簡易キャラクターメッシュを作る */
function buildCharacterMesh({ bodyColor, skinColor, accentColor, height }) {
  const ts = TILE_SIZE;
  const group = new THREE.Group();

  const body = new THREE.Mesh(
    new THREE.CapsuleGeometry(ts * 0.22, height * 0.5, 4, 8),
    new THREE.MeshLambertMaterial({ color: bodyColor })
  );
  body.position.y = height * 0.42;
  group.add(body);

  if (accentColor) {
    const accent = new THREE.Mesh(
      new THREE.TorusGeometry(ts * 0.17, ts * 0.04, 6, 12),
      new THREE.MeshLambertMaterial({ color: accentColor })
    );
    accent.rotation.x = Math.PI / 2;
    accent.position.y = height * 0.58;
    group.add(accent);
  }

  const head = new THREE.Mesh(
    new THREE.SphereGeometry(ts * 0.2, 10, 10),
    new THREE.MeshLambertMaterial({ color: skinColor })
  );
  head.position.y = height * 0.82;
  group.add(head);

  return { group, headHeight: height * 0.82 };
}

function addFacingDot(group, facing, headHeight, color = '#222222') {
  const ts = TILE_SIZE;
  const [ox, oz] = FACING_OFFSETS[facing] || FACING_OFFSETS[Direction.DOWN];
  const dot = new THREE.Mesh(new THREE.SphereGeometry(ts * 0.05, 6, 6), new THREE.MeshBasicMaterial({ color }));
  dot.position.set(ox * ts * 0.22, headHeight, oz * ts * 0.22);
  group.add(dot);
  return dot;
}

function buildExitDebugMesh(exit) {
  const ts = TILE_SIZE;
  const w = exit.w * ts;
  const d = exit.h * ts;
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(w, d),
    new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.35, side: THREE.DoubleSide })
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.set(exit.x * ts + w / 2, TILE_SIZE * 0.05, exit.y * ts + d / 2);
  mesh.visible = false;
  return mesh;
}

function disposeObject3D(root) {
  root.traverse((child) => {
    if (child.geometry) child.geometry.dispose();
    if (child.material) {
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      for (const mat of materials) {
        if (mat.map) mat.map.dispose();
        mat.dispose();
      }
    }
  });
}

// ------------------------------------------------------------
// Rendererクラス本体
// ------------------------------------------------------------

export class Renderer {
  constructor(container) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#bfe3f2');
    this.scene.fog = new THREE.Fog('#bfe3f2', TILE_SIZE * 20, TILE_SIZE * 46);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(this.renderer.domElement);

    const ambient = new THREE.AmbientLight('#ffffff', 0.75);
    const sun = new THREE.DirectionalLight('#ffffff', 0.9);
    sun.position.set(TILE_SIZE * 6, TILE_SIZE * 10, TILE_SIZE * 4);
    this.scene.add(ambient, sun);

    this.mapGroup = new THREE.Group();
    this.scene.add(this.mapGroup);

    this.currentMapId = null;
    this.npcAnimEntries = [];
    this.debugMeshes = [];

    this._buildPlayerMesh();
  }

  /** ウィンドウサイズが変わったときに描画サイズを更新する */
  setSize(width, height) {
    this.renderer.setSize(width, height);
  }

  _buildPlayerMesh() {
    const { group, headHeight } = buildCharacterMesh({
      bodyColor: '#3d6fd0',
      skinColor: '#f2c199',
      accentColor: null,
      height: HEIGHTS.PLAYER,
    });
    this.playerFacingDot = addFacingDot(group, Direction.DOWN, headHeight, '#22335c');
    this.playerHeadHeight = headHeight;
    this.scene.add(group);
    this.playerMesh = group;
  }

  _updatePlayerMesh(player) {
    this.playerMesh.position.set(player.x, 0, player.y);
    const [ox, oz] = FACING_OFFSETS[player.facing] || FACING_OFFSETS[Direction.DOWN];
    this.playerFacingDot.position.set(ox * TILE_SIZE * 0.22, this.playerHeadHeight, oz * TILE_SIZE * 0.22);
  }

  _rebuildMap(mapData) {
    while (this.mapGroup.children.length) {
      const child = this.mapGroup.children.pop();
      disposeObject3D(child);
    }
    this.npcAnimEntries = [];
    this.debugMeshes = [];

    this.mapGroup.add(buildSurroundingGround(mapData));
    this.mapGroup.add(buildGroundMesh(mapData));

    const clusterBuilders = [
      [TileType.TREE, (pos) => buildTreeCluster(pos)],
      [TileType.FOREST, (pos) => buildTreeCluster(pos, { scale: 0.65, dark: true })],
      [TileType.ROCK, buildRockCluster],
      [TileType.MOUNTAIN, buildMountainCluster],
      [TileType.CLIFF, buildCliffCluster],
      [TileType.BRIDGE, buildBridgeDeckCluster],
    ];
    for (const [tileId, builder] of clusterBuilders) {
      const positions = collectTilePositions(mapData, tileId);
      const cluster = builder(positions);
      if (cluster) this.mapGroup.add(cluster);
    }

    for (const building of mapData.buildings) {
      this.mapGroup.add(buildBuildingMesh(building));
    }

    for (const obj of mapData.objects) {
      this.mapGroup.add(buildObjectMesh(obj));
    }

    for (const npc of mapData.npcs) {
      const def = NPC_DEFINITIONS[npc.type];
      const { group, headHeight } = buildCharacterMesh({
        bodyColor: def.bodyColor,
        skinColor: def.skinColor,
        accentColor: def.accentColor,
        height: HEIGHTS.NPC,
      });
      addFacingDot(group, npc.facing, headHeight);
      const label = makeLabelSprite(npc.name, 30);
      label.position.y = HEIGHTS.NPC + TILE_SIZE * 0.4;
      group.add(label);
      group.position.set(npc.x * TILE_SIZE + TILE_SIZE / 2, 0, npc.y * TILE_SIZE + TILE_SIZE / 2);
      this.mapGroup.add(group);
      this.npcAnimEntries.push({ mesh: group, baseY: 0, phase: npc.x * 3 + npc.y });
    }

    for (const exit of mapData.exits) {
      const debugMesh = buildExitDebugMesh(exit);
      this.mapGroup.add(debugMesh);
      this.debugMeshes.push(debugMesh);
    }
  }

  render(mapData, camera, player, options = {}) {
    if (mapData.id !== this.currentMapId) {
      this._rebuildMap(mapData);
      this.currentMapId = mapData.id;
    }

    this._updatePlayerMesh(player);

    const t = performance.now();
    for (const entry of this.npcAnimEntries) {
      entry.mesh.position.y = entry.baseY + Math.sin(t / 500 + entry.phase) * TILE_SIZE * 0.05;
    }

    for (const mesh of this.debugMeshes) mesh.visible = !!options.debug;

    camera.follow(player.x, player.y);
    this.renderer.render(this.scene, camera.threeCamera);
  }
}
