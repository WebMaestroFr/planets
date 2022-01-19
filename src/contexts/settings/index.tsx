import { createContext, useContext } from "react";
import { DEFAULT_PLANET } from "../planet";
import { PlanetSettings } from "../planet/planet";

export const SettingsContext = createContext<{
  planet: PlanetSettings;
}>({ planet: DEFAULT_PLANET });

const useSettings = () => useContext(SettingsContext);
export default useSettings;
