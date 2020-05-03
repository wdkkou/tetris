const MINOS = [
  [
    // I テトリミノ
    [1, 1, 1, 1],
    [0, 0, 0, 0],
  ],
  [
    // O テトリミノ
    [0, 1, 1, 0],
    [0, 1, 1, 0],
  ],
  [
    // S テトリミノ
    [0, 1, 1, 0],
    [1, 1, 0, 0],
  ],
  [
    // Z テトリミノ
    [1, 1, 0, 0],
    [0, 1, 1, 0],
  ],
  [
    // J テトリミノ
    [1, 0, 0, 0],
    [1, 1, 1, 0],
  ],
  [
    // L テトリミノ
    [0, 0, 1, 0],
    [1, 1, 1, 0],
  ],
  [
    // T テトリミノ
    [0, 1, 0, 0],
    [1, 1, 1, 0],
  ],
];

const COLORS = ["cyan", "yellow", "green", "red", "blue", "orange", "magenta"];
/** Minoクラス
 *  座標, ブロックの種類
 */
class Mino {
  constructor(x, y, index = Math.floor(Math.random() * MINOS.length)) {
    this.x = x;
    this.y = y;
    // index = Math.floor(Math.random() * MINOS.length);
    this.block_index = index;
    this.block = createMino(index);
    // console.log(this.block);
  }

  get getX() {
    return this.x;
  }
  get getY() {
    return this.y;
  }

  string() {
    return `x = ${this.x}, y = ${this.y}, block = ${this.block}, id = ${this.block_index}`;
  }
}

/* ブロックを生成する関数 値が色を表す indexは種類を表す*/
const createMino = (index) => {
  let mino = [];
  for (let y = 0; y < 4; y++) {
    mino[y] = [];
    for (let x = 0; x < 4; x++) {
      mino[y][x] = 0;
      if (MINOS[index][y] && MINOS[index][y][x]) {
        mino[y][x] = index + 1;
      }
    }
  }
  return mino;
};

/* ブロックを回転する関数 */
const rotate = (c_mino) => {
  let rotated = [];
  for (let y = 0; y < 4; y++) {
    rotated[y] = [];
    for (let x = 0; x < 4; x++) {
      rotated[y][x] = c_mino.block[x][-y + 3];
    }
  }
  //   console.log(`rotated = ${rotated}`);
  return rotated;
};

/* keyが押された際にブロックを移動する関数 */
const keydown = (c_mino) => {
  document.body.onkeydown = (e) => {
    switch (e.keyCode) {
      case 37:
        // left move
        if (canMove(c_mino, -1, 0)) {
          c_mino.x--;
        }
        break;
      case 39:
        // right move
        if (canMove(c_mino, 1, 0)) {
          c_mino.x++;
        }
        break;
      case 40:
        // down move
        if (canMove(c_mino, 0, 1)) {
          c_mino.y++;
        }
        break;
      case 32:
        // rotate
        let rotated_block = rotate(c_mino);
        if (canMove(c_mino, 0, 0, rotated_block)) {
          c_mino.block = rotated_block;
        }
        break;
    }
    render(c_mino, null);
  };

  document.getElementById("tetris-move-left-button").onmousedown = (e) => {
    if (canMove(c_mino, -1, 0)) {
      c_mino.x--;
    }
  };
  document.getElementById("tetris-fall-button").onmousedown = (e) => {
    if (canMove(c_mino, 0, 1)) {
      c_mino.y++;
    }
  };
  document.getElementById("tetris-move-right-button").onmousedown = (e) => {
    if (canMove(c_mino, 1, 0)) {
      c_mino.x++;
    }
  };
  document.getElementById("tetris-rotate-button").onmousedown = (e) => {
    let rotated_block = rotate(c_mino);
    if (canMove(c_mino, 0, 0, rotated_block)) {
      c_mino.block = rotated_block;
    }
  };
};
