import React, { FC } from "react";
import TileMesh from "../Tile";
import usePlanet from "../../contexts/planet";
import PlanetProvider from "../../contexts/planet/Provider";
import { PlanetProps } from "../../contexts/planet/planet";

const PlanetTiles = () => {
  const { tiles } = usePlanet();

  return (
    <>
      {tiles.map((polygon, index) => (
        <TileMesh key={index} index={index} polygon={polygon} />
      ))}
    </>
  );
};

const Planet: FC<PlanetProps> = (props) => (
  <PlanetProvider {...props}>
    <PlanetTiles />
  </PlanetProvider>
);

export default Planet;
