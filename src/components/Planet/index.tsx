import React, { FC, useRef } from "react";
import { useFrame } from "react-three-fiber";
import { Group } from "three";
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
        {tiles.map((tileProps) => (
          <Tile {...tileProps} />
        ))}
      </PlanetContext.Provider>
    </group>
  );
};

export default Planet;
