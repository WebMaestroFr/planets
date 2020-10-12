import React, { FC } from "react";
import { useUpdate } from "react-three-fiber";
import { ConeGeometry, MathUtils } from "three";

import { GeographicalCoordinates, RADIUS } from "../../App";

const TileGeometry: FC<{ polygon: GeographicalCoordinates[] }> = ({
  polygon,
  ...props
}) => {
  const ref = useUpdate<ConeGeometry>((geometry) => {
    const origin = geometry.vertices[0];
    const center = geometry.vertices[polygon.length + 1];
    origin.set(0, 0, 0);
    center.set(0, 0, 0);
    for (let index = 0; index < polygon.length; index++) {
      const [lng, lat] = polygon[index];
      const vertex = geometry.vertices[index + 1];
      const phi = MathUtils.degToRad(90 - lat);
      const theta = MathUtils.degToRad(lng);
      vertex.setFromSphericalCoords(RADIUS, phi, theta);
      center.add(vertex);
    }
    center.setLength(RADIUS);
  }, []);

  return <coneGeometry args={[1, 1, polygon.length]} {...props} ref={ref} />;
};

export default TileGeometry;
