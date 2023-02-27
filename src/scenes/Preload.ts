import Phaser from "phaser";

export default class Preload extends Phaser.Scene {
  constructor() {
    super("preload");
  }

  preload() {
    this.load.image("emptytile", "./assets/emptytile.png");
  }

  create() {
    this.scene.start("play-game");
  }
}
