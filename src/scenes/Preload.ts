import Phaser from "phaser";

export default class Preload extends Phaser.Scene {
  constructor() {
    super("preload");
  }

  create() {
    console.log("zaczynamy");
    this.scene.start("play-game");
  }
}
