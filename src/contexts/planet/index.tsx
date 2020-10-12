import { createContext, useContext } from "react";
import { PlanetContext } from "./planet";

export const Planet = createContext<PlanetContext | null>(null);

export default () => useContext(Planet) as PlanetContext;
