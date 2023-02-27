import Phaser from "phaser";

import PlayGame from "./scenes/PlayGame";
import Preload from "./scenes/Preload";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "app",
  width: 480,
  height: 640,
  backgroundColor: 0xff0000,
  scene: [Preload, PlayGame],
};

export default new Phaser.Game(config);
