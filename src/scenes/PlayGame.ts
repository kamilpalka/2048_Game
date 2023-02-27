import Phaser from "phaser";

export default class PlayGame extends Phaser.Scene {
  constructor() {
    super("play-game");
  }

  create() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        this.add.image(120 + j * 220, 120 + i * 220, "emptytile");
      }
    }
  }
}
