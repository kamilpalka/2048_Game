import Phaser from "phaser";

import PlayGame from "./scenes/PlayGame";
import Preload from "./scenes/Preload";
import gameOptions from "./gameOptions";

const { tileSize, tileSpacing, boardSize } = gameOptions;

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "app",
  scale: {
    mode: Phaser.Scale.FIT,
  },
  width: boardSize.cols * (tileSize + tileSpacing) + tileSpacing,
  height: boardSize.rows * (tileSize + tileSpacing) + tileSpacing,
  backgroundColor: 0xecf0f1,
  scene: [Preload, PlayGame],
};

export default new Phaser.Game(config);
