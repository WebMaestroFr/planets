import React, { FC } from "react";
import { useUpdate } from "react-three-fiber";
import { ConeGeometry } from "three";
import { getTile } from ".";
import { SphericalCoordinates } from "../../contexts/planet/planet";

const TileGeometry: FC<{
  polygon: SphericalCoordinates[];
}> = ({ polygon, ...props }) => {
  const ref = useUpdate<ConeGeometry>(
    ({ vertices }) => {
      const { center, origin, points } = getTile(vertices);
      center.set(0, 0, 0);
      origin.set(0, 0, 0);
      for (let index = 0; index < points.length; index++) {
        const vertex = points[index];
        vertex.setFromSphericalCoords(1, ...polygon[index]);
        center.add(vertex);
      }
      center.setLength(1);
    },
    [polygon]
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
