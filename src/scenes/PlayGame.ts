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
    let movedTiles = 0;
    const firstRow = d == Directions.UP ? 1 : 0;
    const lastRow = boardSize.rows - (d == Directions.DOWN ? 1 : 0);
    const firstCol = d == Directions.LEFT ? 1 : 0;
    const lastCol = boardSize.cols - (d == Directions.RIGHT ? 1 : 0);
    for (let i = firstRow; i < lastRow; i++) {
      for (let j = firstCol; j < lastCol; j++) {
        const curRow = dRow == 1 ? lastRow - 1 - i : i;
        const curCol = dCol == 1 ? lastCol - 1 - j : j;
        const tileValue = this.boardArray[curRow][curCol].tileValue;
        if (tileValue != 0) {
          let newRow = curRow;
          let newCol = curCol;
          while (
            this.isLegalPosition(newRow + dRow, newCol + dCol, tileValue)
          ) {
            newRow += dRow;
            newCol += dCol;
          }
          movedTiles++;
          // Phaser.GameObjects.Components.Depth
          // making tiles with higher z-index render on scene
          this.boardArray[curRow][curCol].tileSprite.depth = movedTiles;
          const newPos = this.getTilePosition(newRow, newCol);
          this.boardArray[curRow][curCol].tileSprite.x = newPos.x;
          this.boardArray[curRow][curCol].tileSprite.y = newPos.y;
          this.boardArray[curRow][curCol].tileValue = 0;
          if (this.boardArray[newRow][newCol].tileValue == tileValue) {
            this.boardArray[newRow][newCol].tileValue++;
            this.boardArray[curRow][curCol].tileSprite.setFrame(tileValue);
          } else {
            this.boardArray[newRow][newCol].tileValue = tileValue;
          }
        }
      }
    }
    this.refreshBoard();
  }

  refreshBoard() {
    for (let i = 0; i < boardSize.rows; i++) {
      for (let j = 0; j < boardSize.cols; j++) {
        const spritePosition = this.getTilePosition(i, j);
        this.boardArray[i][j].tileSprite.x = spritePosition.x;
        this.boardArray[i][j].tileSprite.y = spritePosition.y;
        const tileValue = this.boardArray[i][j].tileValue;
        if (tileValue > 0) {
          this.boardArray[i][j].tileSprite.visible = true;
          this.boardArray[i][j].tileSprite.setFrame(tileValue - 1);
        } else {
          this.boardArray[i][j].tileSprite.visible = false;
        }
      }
    }
    this.addTile();
  }

  isLegalPosition(row: number, col: number, value: number) {
    const rowInside = row >= 0 && row < boardSize.rows;
    const colInside = col >= 0 && col < boardSize.cols;
    if (!rowInside || !colInside) {
      return false;
    }
    const emptySpot = this.boardArray[row][col].tileValue == 0;
    const sameValue = this.boardArray[row][col].tileValue == value;
    return emptySpot || sameValue;
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
