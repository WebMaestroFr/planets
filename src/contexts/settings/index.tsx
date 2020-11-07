import { createContext, useContext } from "react";
import { SettingsContext } from "./settings";

export const defaultSettings: SettingsContext = {
  planet: {
    biomes: [
      { color: "steelblue", noiseMax: 0 },
      { color: "lemonchiffon", noiseMax: 1 / 6 },
      { color: "yellowgreen", noiseMax: 2 / 6 },
      { color: "forestgreen", noiseMax: 3 / 6 },
      { color: "burlywood", noiseMax: 4 / 6 },
      { color: "darkgrey", noiseMax: 5 / 6 },
      { color: "snow", noiseMax: 1 },
    ],
    elevationOffset: 1 / 2,
    elevationScale: 1,
    noiseMin: 0,
    noiseRadius: 1,
    minDistance: 0.02,
    position: [0, 0, 0],
    radius: 8,
    seed: Date.now().toString(),
    tries: 8,
  },
};

export const Settings = createContext<SettingsContext>(defaultSettings);

const Context = () => useContext(Settings);
export default Context;
