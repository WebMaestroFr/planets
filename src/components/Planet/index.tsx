import React, { FC, useRef } from "react";
import { useFrame } from "react-three-fiber";
import { Group } from "three";
import BiomesProvider from "../../contexts/biomes/Provider";
import { PlanetContext } from "../../contexts/planet";
import { PlanetProps } from "../../contexts/planet/planet";
import { useTiles } from "../../contexts/planet/tiles";
import Tile from "./Tile";

export const PlanetComponent: FC = () => {
  const ref = useRef<Group>();
  const tiles = useTiles();

  useFrame(() => {
    if (ref && ref.current) {
      ref.current.rotation.y = Date.now() / 1000 / 5;
    }
  });

  return (
    <BiomesProvider>
      <group name="Planet" ref={ref}>
        {tiles.map(({ key, ...tileProps }) => (
          <Tile key={key} {...tileProps} />
        ))}
      </group>
    </BiomesProvider>
  );
};

export const Planet: FC<PlanetProps> = ({ settings }) => {
  return (
    <PlanetContext.Provider value={settings}>
      <PlanetComponent />
    </PlanetContext.Provider>
  );
};

export default Planet;
