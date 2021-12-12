import React, { createContext, FC, useContext, useRef } from "react";
import { useFrame } from "react-three-fiber";
import { Group } from "three";
import { useTiles } from "../../hooks/tiles";
import { PlanetSettings } from "../../objects/planet/planet";
import Tile from "./Tile";

const PlanetContext = createContext<PlanetSettings>({} as PlanetSettings);
export const usePlanet = () => useContext(PlanetContext);

export const Planet: FC<{ settings: PlanetSettings }> = ({ settings }) => {
  const ref = useRef<Group>();
  const tiles = useTiles(settings);

  useFrame(() => {
    if (ref && ref.current) {
      ref.current.rotation.y -= 0.005;
    }
  });

  return (
    <group name="Planet" ref={ref}>
      <PlanetContext.Provider value={settings}>
        {tiles.map((tile) => (
          <Tile key={tile.key} center={tile.center} polygon={tile.polygon} />
        ))}
      </PlanetContext.Provider>
    </group>
  );
};

export default Planet;
