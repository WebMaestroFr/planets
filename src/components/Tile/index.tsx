import React, { FC } from "react";
import { PlanetSettings, PlanetTile } from "../../objects/planet/planet";
import TileGeometry from "./Geometry";

const TileMesh: FC<{ tile: PlanetTile; settings: PlanetSettings }> = ({
  tile,
  settings,
  ...props
}) => {
  return (
    <mesh name="TileMesh" {...props}>
      <meshStandardMaterial color={tile.color} />
      <TileGeometry
        center={tile.center}
        polygon={tile.polygon}
        settings={settings}
      />
    </mesh>
  );
};

export default TileMesh;
