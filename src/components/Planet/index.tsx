import React, { FC } from "react";
import useSettings from "../../contexts/settings";
import { useTiles } from "../../hooks/tiles";
import Tile from "./Tile";

export const Planet: FC = () => {
  const { planet } = useSettings();
  const tiles = useTiles(planet);

  const timeKey = Date.now().toString();

  return (
    <group name="Planet">
      {tiles.map((tile, index) => (
        <Tile
          key={`${timeKey}-${index}`}
          center={tile.center}
          polygon={tile.polygon}
        />
      ))}
    </group>
  );
};

export default Planet;
