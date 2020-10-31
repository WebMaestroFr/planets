import React, { FC } from "react";
import { useUpdate } from "react-three-fiber";
import { ConeGeometry, MathUtils } from "three";
import usePlanet from "../../contexts/planet";
import { GeographicalCoordinates } from "../../contexts/planet/planet";

const ELEVATION = 1 / 8;

const TileGeometry: FC<{
  polygon: GeographicalCoordinates[];
}> = ({ polygon, ...props }) => {
  const { noise, settings } = usePlanet();
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
        vertex.setFromSphericalCoords(settings.radius, phi, theta);
        center.add(vertex);
      }
      center.setLength(settings.radius);
      const centerElevation = noise(center) * ELEVATION;
      center.setLength(settings.radius + centerElevation);
      for (let index = 1; index < geometry.vertices.length - 1; index++) {
        const vertex = geometry.vertices[index];
        const elevation = noise(vertex) * ELEVATION;
        vertex.setLength(settings.radius + (elevation + centerElevation) / 2);
      }
    },
    [polygon, settings.radius, noise]
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
