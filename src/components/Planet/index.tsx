import React, { FC, useRef } from "react";
import TileMesh from "../Tile";
import usePlanet from "../../contexts/planet";
import PlanetProvider from "../../contexts/planet/Provider";
import { PlanetProps } from "../../contexts/planet/planet";
import { Group } from "three";

export interface PlanetTilesProps {
  position?: [number, number, number];
}

const PlanetTiles: FC<PlanetTilesProps> = ({ position }) => {
  const ref = useRef<Group>();
  const { tiles } = usePlanet();

  return (
    <group name="PlanetTiles" position={position} ref={ref}>
      {tiles.map((polygon, index) => (
        <TileMesh key={index} index={index} polygon={polygon} />
      ))}
    </group>
  );
};

const Planet: FC<PlanetProps & PlanetTilesProps> = ({ position, ...props }) => (
  <PlanetProvider {...props}>
    <PlanetTiles position={position} />
  </PlanetProvider>
);

export default Planet;
