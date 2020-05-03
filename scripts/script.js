/** stageの情報を表す */
const FIELD_W = 300,
  FIELD_H = 600,
  COLS = 10,
  ROWS = 20;
const BLOCK_W = FIELD_W / COLS,
  BLOCK_H = FIELD_H / ROWS;

let canvas = document.getElementById("stage");
let ctx = canvas.getContext("2d");

// const FIELD_W_NEXT = 200,
//   FIELD_H_NEXT = 200;
// const BLOCK_W_NEXT = FIELD_W_NEXT / 5,
//   BLOCK_H_NEXT = FIELD_H_NEXT / 5;

let canvas_next = document.getElementById("next");
let ctx_next = canvas_next.getContext("2d");

/* レンダリングする関数 */
const render = (c_mino, next_block) => {
  ctx.clearRect(0, 0, FIELD_W, FIELD_H);
  ctx.strokeStyle = "white";

  // その時点でのfieldを描画する
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      drawBlock(x, y, field[y][x]);
    }
  }

  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 4; x++) {
      drawBlock(c_mino.x + x, c_mino.y + y, c_mino.block[y][x]);
    }
  }

  if (next_block == null) {
    return;
  }
  drawNextBlock(next_block);
};

/* msごとにブロックが落ちていく関数 */
const fall = (c_mino, next_block, c_field, ms) => {
  render(c_mino, next_block);
  let id = setInterval(() => {
    if (canMove(c_mino, 0, 1)) {
      c_mino.y++;
    } else {
      updateField(c_mino, c_field);
      clearRows(c_field);
      c_mino = new Mino(3, 0, next_block.block_index);
      next_block = new Mino(3, 0);
    }
    // keycodeが押された際の処理をしてからレンダリング
    keydown(c_mino);
    // nextパネルの画面をクリア
    ctx_next.clearRect(0, 0, canvas_next.clientWidth, canvas_next.clientHeight);
    if (GameOver(c_field)) {
      clearInterval(id);
      alert("GAME OVER");
    }
    render(c_mino, next_block);
  }, ms);
};

/* ブロックを描画する関数 */
const drawBlock = (x, y, block) => {
  if (block) {
    ctx.fillStyle = COLORS[block - 1];
    ctx.fillRect(x * BLOCK_W, y * BLOCK_H, BLOCK_W - 1, BLOCK_H - 1);
    ctx.strokeStyle = "black";
    ctx.strokeRect(x * BLOCK_W, y * BLOCK_H, BLOCK_W - 1, BLOCK_H - 1);
  }
};

/* Nextパネル内のブロックを描画する関数 */
const drawNextBlock = (next_block) => {
  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 4; x++) {
      // nextパネルに表示する部分
      if (next_block.block[y][x]) {
        ctx_next.fillStyle = COLORS[next_block.block[y][x] - 1];
        ctx_next.fillRect(
          (x + 1) * BLOCK_W,
          (y + 2) * BLOCK_H,
          BLOCK_W - 1,
          BLOCK_H - 1
        );
        ctx_next.strokeStyle = "black";
        ctx_next.strokeRect(
          (x + 1) * BLOCK_W,
          (y + 2) * BLOCK_H,
          BLOCK_W - 1,
          BLOCK_H - 1
        );
      }
    }
  }
};

/* 次に今動いているブロックが動けるかを返す関数*/
const canMove = (c_mino, move_x, move_y, move_block) => {
  let next_x = c_mino.getX + move_x;
  let next_y = c_mino.getY + move_y;
  let next_mino = move_block || c_mino.block;

  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 4; x++) {
      if (!next_mino[y][x]) {
        continue;
      }
      // 次に動くブロックの位置が一番下かそこにブロックが存在すればfalse
      if (
        next_y + y >= ROWS ||
        next_x + x < 0 ||
        next_x + x >= COLS ||
        field[next_y + y][next_x + x]
      ) {
        return false;
      }
    }
  }
  return true;
};

/* 揃った行を消す関数 */
const clearRows = (c_field) => {
  for (let y = ROWS - 1; y >= 0; y--) {
    let fill = true;
    for (let x = 0; x < COLS; x++) {
      if (c_field[y][x] == 0) {
        fill = false;
        break;
      }
    }
    if (!fill) {
      continue;
    }
    for (let v = y - 1; v >= 0; v--) {
      for (let x = 0; x < COLS; x++) {
        c_field[v + 1][x] = c_field[v][x];
      }
    }
    y++;
  }
};

/* Fieldを初期化するための関数 */
const initField = () => {
  let field = [];
  for (let y = 0; y < ROWS; y++) {
    field[y] = [];
    for (let x = 0; x < COLS; x++) {
      field[y][x] = 0;
    }
  }
  return field;
};

/* fieldの値を更新する関数 */
const updateField = (c_mino, c_field) => {
  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 4; x++) {
      if (c_mino.block[y][x]) {
        c_field[c_mino.y + y][c_mino.x + x] = c_mino.block[y][x];
      }
    }
  }
};

const startGame = () => {
  let element = document.getElementById("start");
  element.onclick = (e) => {
    fall(current_block, next_block, field, 500);
  };
};

const GameOver = (c_field) => {
  for (let y = ROWS - 1; y >= 0; y--) {
    let ok = false;
    for (let x = 0; x < COLS; x++) {
      if (c_field[y][x]) {
        ok = true;
        break;
      }
    }
    if (!ok) {
      return false;
    }
  }
  console.log("Game over");
  return true;
};

// 初めの位置を真ん中にするため
let current_x = 3,
  current_y = 0;

// 適当なテトリミノを生成
let current_block = new Mino(current_x, current_y);
// console.log("current_block = " + current_block.string());
let next_block = new Mino(current_x, current_y);

// ブロックが積み上がっていく情報を格納するためのオブジェクトを用意
// グローバル変数fieldはよく変更されるので注意
// let field = initField();

let field;

let start = () => {
  field = initField();
  fall(current_block, next_block, field, 500);
};

start();
