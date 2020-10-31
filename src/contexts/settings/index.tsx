import { createContext, useContext } from "react";
import { SettingsContext } from "./settings";

export const defaultSettings: SettingsContext = {
  planet: {
    distance: 0,
    minDistance: 0.08,
    position: [0, 0, 0],
    radius: 1,
    scale: 1,
    seed: Date.now().toString(),
    tries: 8,
  },
};

export const Settings = createContext<SettingsContext>(defaultSettings);

export default () => useContext(Settings);
