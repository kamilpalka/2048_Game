import Phaser from "phaser";

import gameOptions from "../gameOptions";

const { tileSize } = gameOptions;

export default class Preload extends Phaser.Scene {
  constructor() {
    super("preload");
  }

  preload() {
    this.load.image("emptytile", "./assets/sprites/emptytile.png");
    this.load.spritesheet("tiles", "./assets/sprites/tiles.png", {
      frameWidth: tileSize,
      frameHeight: tileSize,
    });
    this.load.audio("move", [
      "assets/sounds/move.ogg",
      "assets/sounds/move.mp3",
    ]);
    this.load.audio("grow", [
      "assets/sounds/grow.ogg",
      "assets/sounds/grow.mp3",
    ]);
  }

  create() {
    this.scene.start("play-game");
  }
}
