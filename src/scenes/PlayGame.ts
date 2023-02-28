import Phaser from "phaser";
import gameOptions from "../gameOptions";

const { tileSize, tileSpacing, boardSize } = gameOptions;

export default class PlayGame extends Phaser.Scene {
  private boardArray: any[][] = [];

  constructor() {
    super("play-game");
  }

  create() {
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
    }
  }
}
