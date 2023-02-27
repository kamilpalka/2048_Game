import Phaser from "phaser";

export default class PlayGame extends Phaser.Scene {
  constructor() {
    super("play-game");
  }

  preload() {}

  create() {
    console.log("my game");
  }
}
