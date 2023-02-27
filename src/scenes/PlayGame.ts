import Phaser from "phaser";
import gameOptions from "../gameOptions";

const { tileSize, tileSpacing, boardSize } = gameOptions;

export default class PlayGame extends Phaser.Scene {
  constructor() {
    super("play-game");
  }

  create() {
    for (let i = 0; i < boardSize.rows; i++) {
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
      }
    }
  }

  getTilePosition(row: number, col: number) {
    const posX = tileSpacing * (col + 1) + tileSize * (col + 0.5);
    const posY = tileSpacing * (row + 1) + tileSize * (row + 0.5);
    return new Phaser.Geom.Point(posX, posY);
  }
}
