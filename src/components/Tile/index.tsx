import React, { FC, useCallback, useState } from "react";
import { useUpdate } from "react-three-fiber";
import { Geometry, Mesh, Vector3 } from "three";
import usePlanet from "../../contexts/planet";
import useSettings from "../../contexts/settings";
import { SphericalCoordinates } from "../../contexts/planet/planet";
import TileGeometry from "./Geometry";

export type Tile = { center: Vector3; origin: Vector3; points: Vector3[] };
export const getTile = (vertices: Vector3[]): Tile => ({
  center: vertices[vertices.length - 1],
  origin: vertices[0],
  points: vertices.slice(1, vertices.length - 1),
});

const TileMesh: FC<{
  polygon: SphericalCoordinates[];
}> = ({ polygon, ...props }) => {
  const { noise } = usePlanet();
  const {
    planet: { biomes, noiseMin, noiseScale, radius },
  } = useSettings();
  const [color, setColor] = useState<string>();
  const sortedBiomes = biomes.sort((a, b) => a.noiseMax - b.noiseMax);

  const getVerticesNoise = useCallback(
    (vertices: Vector3[]) => {
      const { center, points } = getTile(vertices);
      return {
        center: noise(center),
        points: points.map(noise),
      };
    },
    [noise]
  );

  const applyElevation = useCallback(
    (points: Vector3[], center: Vector3, tileNoise: number) => {
      const elevationMin = radius + noiseMin * noiseScale;
      const getElevation = (n: number) =>
        n <= noiseMin ? elevationMin : radius + n * noiseScale;
      if (tileNoise <= noiseMin) {
        center.setLength(elevationMin);
        for (const point of points) {
          point.setLength(elevationMin);
        }
      } else {
        const centerElevation = getElevation(tileNoise);
        center.setLength(centerElevation);
        for (const point of points) {
          const pointNoise = noise(point);
          const pointElevation = getElevation(pointNoise);
          point.setLength(pointElevation);
        }
      }
    },
    [noise, noiseMin, noiseScale, radius]
  );

  const ref = useUpdate<Mesh<Geometry>>(
    ({ geometry: { vertices } }) => {
      const { center, points } = getTile(vertices);
      const tileNoise = noise(center);
      applyElevation(points, center, tileNoise);
      const biome = sortedBiomes.find((c) => tileNoise <= c.noiseMax);
      if (biome) {
        setColor(biome.color);
      }
    },
    [noise]
  );

  return (
    <mesh name="TileMesh" ref={ref} {...props}>
      <meshStandardMaterial color={color} />
      <TileGeometry polygon={polygon} />
    </mesh>
  );
};

export default TileMesh;
