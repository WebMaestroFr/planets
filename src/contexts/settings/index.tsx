import { createContext, useContext } from "react";
import { SettingsContext } from "./settings";

export const defaultSettings: SettingsContext = {
  planet: {
    biomes: [
      { color: "steelblue", noiseMax: 0 },
      { color: "lemonchiffon", noiseMax: 0.2 },
      { color: "yellowgreen", noiseMax: 0.4 },
      { color: "forestgreen", noiseMax: 0.6 },
      { color: "burlywood", noiseMax: 0.8 },
      { color: "snow", noiseMax: 1 },
    ],
    elevationOffset: 0.5,
    elevationScale: 0.5 / 3,
    noiseDistanceX: 0,
    noiseDistanceY: 0,
    noiseDistanceZ: 0,
    noiseMin: 0,
    noiseRadius: 1,
    noiseScaleX: 1,
    noiseScaleY: 1,
    noiseScaleZ: 1,
    minDistance: 0.04,
    position: [0, 0, 0],
    radius: 1,
    seed: Date.now().toString(),
    tries: 8,
  },
};

export const Settings = createContext<SettingsContext>(defaultSettings);

const Context = () => useContext(Settings);
export default Context;
