import React, { FC } from "react";
import { useUpdate } from "react-three-fiber";
import { ConeGeometry } from "three";
import { getTile } from ".";
import { PlanetTile } from "../../contexts/planet/planet";

const TileGeometry: FC<PlanetTile> = ({ center, polygon, ...props }) => {
  const ref = useUpdate<ConeGeometry>(
    ({ vertices }) => {
      const tile = getTile(vertices);
      tile.center.set(0, 0, 0);
      tile.origin.set(0, 0, 0);
      for (let index = 0; index < polygon.length; index++) {
        tile.polygon[index].copy(polygon[index]);
        tile.center.add(polygon[index]);
      }
      tile.center.divideScalar(polygon.length);
    },
    [center, polygon]
  );
  return (
    <coneGeometry
      args={[1, 1, polygon.length]}
      name="TileGeometry"
      ref={ref}
      {...props}
    />
  );
};

export default TileGeometry;
