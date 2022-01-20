import React, { FC, useCallback, useMemo } from "react";
import { Vector3 } from "three";
import { usePlanet } from "../../contexts/planet";
import { PlanetTileProps } from "../../contexts/planet/planet";
import GeometryTile from "../Geometry/Tile";

const PlanetTile: FC<PlanetTileProps> = ({
  center,
  polygon,
  biome,
  ...props
}) => {
  const { elevationOffset, elevationScale, noiseMin, radius } = usePlanet();

  const getElevation = useCallback(
    (noise: number) => radius + Math.max(noiseMin, noise) * elevationScale,
    [radius, noiseMin, elevationScale]
  );

  const centerElevation = useMemo(
    () => getElevation(center.noise),
    [center.noise, getElevation]
  );

  const centerVertex = useMemo(() => {
    const vertex = new Vector3(...center.coordinates);
    return vertex.setLength(centerElevation);
  }, [center, centerElevation]);
  const polygonVertices = useMemo(() => {
    return polygon.map((point, index) => {
      const vertex = new Vector3(...point.coordinates);
      if (center.noise <= noiseMin) {
        vertex.setLength(centerElevation);
      } else {
        const elevationNoise =
          center.noise * elevationOffset +
          polygon[index].noise * (1 - elevationOffset);
        const elevation = getElevation(elevationNoise);
        vertex.setLength(elevation);
      }
      return vertex;
    });
  }, [
    centerElevation,
    center.noise,
    getElevation,
    elevationOffset,
    noiseMin,
    polygon,
  ]);

  return (
    <mesh name="PlanetTile" {...props}>
      <GeometryTile tileCenter={centerVertex} tilePolygon={polygonVertices} />
      <meshLambertMaterial color={biome} />
    </mesh>
  );
};

export default PlanetTile;
