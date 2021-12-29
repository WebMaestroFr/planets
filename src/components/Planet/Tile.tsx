import React, { FC, useCallback, useMemo } from "react";
import { useUpdate } from "react-three-fiber";
import { BufferGeometry, Material, Mesh, Vector3 } from "three";
import { usePlanet } from ".";
import { getTile, setTile } from "../../objects/planet";
import {
  PlanetBiome,
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
    origin,
    radius,
  } = usePlanet();

  const biome = useMemo<PlanetBiome>(
    () =>
      biomes.find(
        (b) => center.noise <= noiseMin + b.noiseMax * (1 - noiseMin)
      ) || biomes[0],
    [biomes, center.noise, noiseMin]
  );

  const polygonNoises = useMemo<number[]>(
    () => polygon.map((point) => point.noise),
    [polygon]
  );

  const polygonPositions = useMemo<Vector3[]>(
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
      tile.origin.set(...origin);
      tile.center.copy(center.position);
      for (
        let index = 0;
        index < tile.polygon.length && index < polygonPositions.length;
        index++
      ) {
        tile.polygon[index].copy(polygonPositions[index]);
      }
    },
    [center.position, polygonPositions]
  );

  const ref = useUpdate<Mesh<BufferGeometry, Material>>(
    ({ geometry }) => {
      const tile = getTile(origin, center, polygon);
      applyPolygon(tile);
      applyElevation(tile);
      setTile(geometry, tile);
    },
    [applyElevation, applyPolygon]
  );

  return (
    <mesh name="PlanetTile" {...props} ref={ref}>
      <bufferGeometry />
      <meshLambertMaterial color={biome?.color} />
    </mesh>
  );
};

export default PlanetTile;
