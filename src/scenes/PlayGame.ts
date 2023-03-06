import Phaser from "phaser";
import gameOptions from "../gameOptions";

const {
  tileSize,
  tileSpacing,
  boardSize,
  tweenSpeed,
  swipeMaxTime,
  swipeMinDistance,
  swipeMinNormal,
} = gameOptions;

enum Directions {
  LEFT = 0,
  RIGHT = 1,
  UP = 2,
  DOWN = 3,
}

export default class PlayGame extends Phaser.Scene {
  private boardArray: any[][] = [];
  private canMove = false;

  constructor() {
    super("play-game");
  }

  create() {
    this.canMove = false;
    for (let i = 0; i < boardSize.rows; i++) {
      this.boardArray[i] = [];
      for (let j = 0; j < boardSize.cols; j++) {
        const tilePosition = this.getTilePosition(i, j);
        this.add.image(tilePosition.x, tilePosition.y, "emptytile");
        const tile = this.add.sprite(
          tilePosition.x,
          tilePosition.y,
          "tiles",
          i
        );
        tile.visible = false;
        this.boardArray[i][j] = {
          tileValue: 0,
          tileSprite: tile,
        };
      }
    }
    this.addTile();
    this.addTile();

    this.input.keyboard.on("keydown", this.handleKey, this);
    this.input.on("pointerup", this.handleSwipe, this);
  }

  handleKey(e: KeyboardEvent) {
    if (this.canMove) {
      switch (e.code) {
        case "KeyA":
        case "ArrowLeft":
          this.makeMove(Directions.LEFT);
          break;
        case "KeyD":
        case "ArrowRight":
          this.makeMove(Directions.RIGHT);
          break;
        case "KeyW":
        case "ArrowUp":
          this.makeMove(Directions.UP);
          break;
        case "KeyS":
        case "ArrowDown":
          this.makeMove(Directions.DOWN);
          break;
      }
    }
  }

  makeMove(d: number) {
    const dRow =
      d == Directions.LEFT || d == Directions.RIGHT
        ? 0
        : d == Directions.UP
        ? -1
        : 1;
    const dCol =
      d == Directions.UP || d == Directions.DOWN
        ? 0
        : d == Directions.LEFT
        ? -1
        : 1;
    this.canMove = false;
    for (let i = 0; i < boardSize.rows; i++) {
      for (let j = 0; j < boardSize.cols; j++) {
        const curRow = dRow == 1 ? boardSize.rows - 1 - i : i;
        const curCol = dCol == 1 ? boardSize.cols - 1 - j : j;
        const tileValue = this.boardArray[curRow][curCol].tileValue;
        if (tileValue != 0) {
          const newPos = this.getTilePosition(curRow + dRow, curCol + dCol);
          this.boardArray[curRow][curCol].tileSprite.x = newPos.x;
          this.boardArray[curRow][curCol].tileSprite.y = newPos.y;
        }
      }
    }
  }

  handleSwipe(e: Phaser.Input.Pointer) {
    if (this.canMove) {
      const swipeTime = e.upTime - e.downTime;
      const fastEnough = swipeTime < swipeMaxTime;
      const swipe = new Phaser.Geom.Point(e.upX - e.downX, e.upY - e.downY);
      const swipeMagnitude = Phaser.Geom.Point.GetMagnitude(swipe);
      const longEnough = swipeMagnitude > swipeMinDistance;
      if (longEnough && fastEnough) {
        Phaser.Geom.Point.SetMagnitude(swipe, 1);
        if (swipe.x > swipeMinNormal) {
          this.makeMove(Directions.RIGHT);
        }
        if (swipe.x < -swipeMinNormal) {
          this.makeMove(Directions.LEFT);
        }
        if (swipe.y > swipeMinNormal) {
          this.makeMove(Directions.DOWN);
        }
        if (swipe.y < -swipeMinNormal) {
          this.makeMove(Directions.UP);
        }
      }
    }
  }

  getTilePosition(row: number, col: number) {
    const posX = tileSpacing * (col + 1) + tileSize * (col + 0.5);
    const posY = tileSpacing * (row + 1) + tileSize * (row + 0.5);
    return new Phaser.Geom.Point(posX, posY);
  }

  addTile() {
    const emptyTiles = [];
    for (let i = 0; i < boardSize.rows; i++) {
      for (let j = 0; j < boardSize.cols; j++) {
        if (this.boardArray[i][j].tileValue == 0) {
          emptyTiles.push({
            row: i,
            col: j,
          });
        }
      }
    }
    if (emptyTiles.length > 0) {
      const chosenTile = Phaser.Utils.Array.GetRandom(emptyTiles);
      this.boardArray[chosenTile.row][chosenTile.col].tileValue = 1;
      this.boardArray[chosenTile.row][chosenTile.col].tileSprite.visible = true;
      this.boardArray[chosenTile.row][chosenTile.col].tileSprite.setFrame(0);
      this.boardArray[chosenTile.row][chosenTile.col].tileSprite.alpha = 0;
      this.tweens.add({
        targets: [this.boardArray[chosenTile.row][chosenTile.col].tileSprite],
        alpha: 1,
        duration: tweenSpeed,
        callbackScope: this,
        onComplete: () => {
          this.canMove = true;
        },
      });
    }
  }
}
