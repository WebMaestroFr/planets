import { createContext, useContext } from "react";
import { SettingsContext } from "./settings";

export const defaultSettings: SettingsContext = {
  planet: {
    biomes: [
      { color: "steelblue", elevationMax: 0 },
      { color: "lemonchiffon", elevationMax: 0.2 },
      { color: "yellowgreen", elevationMax: 0.4 },
      { color: "forestgreen", elevationMax: 0.6 },
      { color: "burlywood", elevationMax: 0.8 },
      { color: "snow", elevationMax: 1 },
    ],
    distance: 0,
    elevationScale: 0.2,
    elevationMin: 0,
    minDistance: 0.04,
    position: [0, 0, 0],
    radius: 1,
    scale: 1,
    seed: Date.now().toString(),
    tries: 8,
  },
};

export const Settings = createContext<SettingsContext>(defaultSettings);

export default () => useContext(Settings);
