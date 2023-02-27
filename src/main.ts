import Phaser from "phaser";

import PlayGame from "./scenes/PlayGame";
import Preload from "./scenes/Preload";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "app",
  width: 900,
  height: 900,
  backgroundColor: 0xecf0f1,
  scene: [Preload, PlayGame],
};

export default new Phaser.Game(config);
