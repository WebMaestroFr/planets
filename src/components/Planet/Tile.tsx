import React, { FC, useCallback, useMemo } from "react";
import { useUpdate } from "react-three-fiber";
import { ConeGeometry, Material, Mesh, Vector3 } from "three";
import { usePlanet } from ".";
import { getTile } from "../../objects/planet";
import {
  PlanetTilePoint,
  PlanetTilePolygon,
} from "../../objects/planet/planet";

const PlanetTile: FC<{
  center: PlanetTilePoint;
  polygon: PlanetTilePoint[];
}> = ({ center, polygon, ...props }) => {
  const {
    biomes,
    elevationOffset,
    elevationScale,
    noiseMin,
    radius,
  } = usePlanet();

  const biome = useMemo(() => biomes.find((b) => center.noise <= b.noiseMax), [
    biomes,
    center.noise,
  ]);

  const polygonNoises = useMemo(() => polygon.map((point) => point.noise), [
    polygon,
  ]);

  const polygonPositions = useMemo(
    () => polygon.map((point) => point.position),
    [polygon]
  );

  const applyNoise = useCallback(
    (vertex: Vector3, noise: number) => {
      const elevation = radius + Math.max(noiseMin, noise) * elevationScale;
      vertex.setLength(elevation);
      return elevation;
    },
    [elevationScale, noiseMin, radius]
  );

  const getElevationNoise = useCallback(
    (noise: number) =>
      center.noise * elevationOffset + noise * (1 - elevationOffset),
    [center.noise, elevationOffset]
  );

  const applyElevation = useCallback(
    (tile: PlanetTilePolygon) => {
      const centerElevation = applyNoise(tile.center, center.noise);
      if (center.noise <= noiseMin) {
        for (let index = 0; index < tile.polygon.length; index++) {
          tile.polygon[index].setLength(centerElevation);
        }
      } else {
        for (let index = 0; index < tile.polygon.length; index++) {
          const elevationNoise = getElevationNoise(polygonNoises[index]);
          applyNoise(tile.polygon[index], elevationNoise);
        }
      }
    },
    [applyNoise, center.noise, getElevationNoise, polygonNoises, noiseMin]
  );

  const applyPolygon = useCallback(
    (tile: PlanetTilePolygon) => {
      tile.origin.set(0, 0, 0);
      tile.center.copy(center.position);
      for (let index = 0; index < tile.polygon.length; index++) {
        tile.polygon[index].copy(polygonPositions[index]);
      }
    },
    [center.position, polygonPositions]
  );

  const ref = useUpdate<Mesh<ConeGeometry, Material>>(
    ({ geometry }) => {
      const tile = getTile(geometry.vertices);
      applyPolygon(tile);
      applyElevation(tile);
    },
    [applyElevation, applyPolygon]
  );

  return (
    <mesh name="PlanetTile" {...props} ref={ref}>
      <coneGeometry args={[1, 1, polygon.length]} />
      <meshLambertMaterial color={biome?.color} />
    </mesh>
  );
};

export default PlanetTile;
