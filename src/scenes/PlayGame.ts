import Phaser from "phaser";
import gameOptions from "../gameOptions";

const { tileSize, tileSpacing, boardSize, tweenSpeed } = gameOptions;

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
    const keyPressed = e.code;
    console.log(keyPressed);
  }

  handleSwipe(e: Phaser.Input.Pointer) {
    const swipeTime = e.upTime - e.downTime;
    const swipe = new Phaser.Geom.Point(e.upX - e.downX, e.upY - e.downY);
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
