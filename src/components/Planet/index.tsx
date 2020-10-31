import React, { FC } from "react";
import TileMesh from "../Tile";
import usePlanet from "../../contexts/planet";
import PlanetProvider from "../../contexts/planet/Provider";

const PlanetTiles: FC = () => {
  const { tiles } = usePlanet();
  const time = Date.now().toString();
  return (
    <group name="PlanetTiles">
      {tiles.map((polygon, index) => (
        <TileMesh key={`${time}-${index}`} polygon={polygon} />
      ))}
    </group>
  );
};

const Planet: FC = () => {
  return (
    <PlanetProvider>
      <PlanetTiles />
    </PlanetProvider>
  );
};

export default Planet;
