import React, { FC } from "react";
import TileMesh from "../Tile";
import usePlanet from "../../contexts/planet";
import PlanetProvider from "../../contexts/planet/Provider";
import { PlanetProps } from "../../contexts/planet/planet";

const PlanetTiles: FC = () => {
  const { settings, tiles } = usePlanet();
  return (
    <group name="PlanetTiles">
      {tiles.map((polygon, index) => (
        <TileMesh key={`${settings.seed}-${index}`} polygon={polygon} />
      ))}
    </group>
  );
};

const Planet: FC<PlanetProps> = (props) => {
  return (
    <PlanetProvider {...props}>
      <PlanetTiles />
    </PlanetProvider>
  );
};

export default Planet;
