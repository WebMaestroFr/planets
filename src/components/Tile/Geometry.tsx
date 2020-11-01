import React, { FC } from "react";
import { useUpdate } from "react-three-fiber";
import { ConeGeometry, MathUtils } from "three";
import usePlanet from "../../contexts/planet";
import useSettings from "../../contexts/settings";
import { GeographicalCoordinates } from "../../contexts/planet/planet";

const TileGeometry: FC<{
  polygon: GeographicalCoordinates[];
}> = ({ polygon, ...props }) => {
  const { radius, noise } = usePlanet();
  const {
    planet: { elevationScale, elevationMin },
  } = useSettings();
  const ref = useUpdate<ConeGeometry>(
    (geometry) => {
      const origin = geometry.vertices[0];
      const center = geometry.vertices[polygon.length + 1];
      origin.set(0, 0, 0);
      center.set(0, 0, 0);
      for (let index = 0; index < polygon.length; index++) {
        const [lng, lat] = polygon[index];
        const vertex = geometry.vertices[index + 1];
        const phi = MathUtils.degToRad(90 - lat);
        const theta = MathUtils.degToRad(lng);
        vertex.setFromSphericalCoords(radius, phi, theta);
        center.add(vertex);
      }
      center.setLength(radius);
      const centerElevation = noise(center);
      const nextCenterElevation =
        radius + Math.max(elevationMin, centerElevation) * elevationScale;
      center.setLength(nextCenterElevation);
      for (let index = 1; index < geometry.vertices.length - 1; index++) {
        const vertex = geometry.vertices[index];
        const elevation = noise(vertex);
        const nextElevation =
          radius + Math.max(elevationMin, elevation) * elevationScale;
        vertex.setLength((nextElevation + nextCenterElevation) / 2);
      }
    },
    [polygon, radius, noise]
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
