import React, { FC } from "react";
import TileMesh from "../Tile";
import usePlanet from "../../contexts/planet";
import PlanetProvider from "../../contexts/planet/Provider";

const PlanetTiles: FC = () => {
  const { tiles } = usePlanet();
  // HACK key to force rerender
  // TO DO : Test out how to clean this up
  const time = Date.now().toString();

  return (
    <group name="PlanetTiles">
      {tiles.map(({ center, polygon }, index) => (
        <TileMesh key={`${time}-${index}`} center={center} polygon={polygon} />
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
