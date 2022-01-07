import React, { FC } from "react";
import { PlanetComponent } from "../../components/Planet";
import BiomesProvider from "../biomes/Provider";
import { PlanetProps } from "../planet/planet";
import { PlanetContext } from "./index";

export const PlanetProvider: FC<PlanetProps> = ({ settings }) => {
  return (
    <PlanetContext.Provider value={settings}>
      <BiomesProvider>
        <PlanetComponent />
      </BiomesProvider>
    </PlanetContext.Provider>
  );
};

export default PlanetProvider;
