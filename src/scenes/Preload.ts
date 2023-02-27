import Phaser from "phaser";

import gameOptions from "../gameOptions";

const { tileSize, tileSpacing, boardSize } = gameOptions;

export default class Preload extends Phaser.Scene {
  constructor() {
    super("preload");
  }

  preload() {
    this.load.image("emptytile", "./assets/emptytile.png");
    this.load.spritesheet("tiles", "./assets/tiles.png", {
      frameWidth: tileSize,
      frameHeight: tileSize,
    });
  }

  create() {
    this.scene.start("play-game");
  }
}
