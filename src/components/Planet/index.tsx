import React, { FC, useMemo } from "react";
import TileMesh from "../Tile";
import usePlanet from "../../contexts/planet";
import useSettings from "../../contexts/settings";
import PlanetProvider from "../../contexts/planet/Provider";
import { Vector3 } from "three";

const PlanetTiles: FC = () => {
  const { tiles } = usePlanet();
  const { radius } = useSettings().planet;
  // HACK key to force rerender
  // TO DO : Test out how to clean this up
  const time = Date.now().toString();

  const scale = useMemo(() => new Vector3(radius, radius, radius), [radius]);

  return (
    <group name="PlanetTiles" scale={scale}>
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
