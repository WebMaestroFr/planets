import React, { FC, useRef } from "react";
import { useFrame } from "react-three-fiber";
import { Group } from "three";
import BiomesProvider from "../../contexts/biomes/Provider";
import { PlanetContext } from "../../contexts/planet";
import { PlanetProps } from "../../contexts/planet/planet";
import { useTiles } from "../../contexts/planet/tiles";
import Tile from "./Tile";

export const Planet: FC<PlanetProps> = ({ settings }) => {
  const ref = useRef<Group>();
  const tiles = useTiles(settings);

  useFrame(() => {
    if (ref && ref.current) {
      ref.current.rotation.y = Date.now() / 1000 / 5;
    }
  });

  return (
    <group name="Planet" ref={ref}>
      <PlanetContext.Provider value={settings}>
        <BiomesProvider>
          {tiles.map(({ key, ...tileProps }) => (
            <Tile key={key} {...tileProps} />
          ))}
        </BiomesProvider>
      </PlanetContext.Provider>
    </group>
  );
};

export default Planet;
