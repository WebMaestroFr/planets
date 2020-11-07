import React, { FC, useCallback, useState } from "react";
import { useUpdate } from "react-three-fiber";
import { Geometry, Mesh, Vector3 } from "three";
import usePlanet from "../../contexts/planet";
import { PlanetTile } from "../../contexts/planet/planet";
import useSettings from "../../contexts/settings";
import TileGeometry from "./Geometry";

export type Tile = { center: Vector3; origin: Vector3; polygon: Vector3[] };
export const getTile = (vertices: Vector3[]): Tile => ({
  center: vertices[vertices.length - 1],
  origin: vertices[0],
  polygon: vertices.slice(1, vertices.length - 1),
});

const TileMesh: FC<PlanetTile> = ({ center, polygon, ...props }) => {
  const {
    biomes,
    elevationOffset,
    elevationScale,
    noiseMin,
  } = useSettings().planet;
  const { noise } = usePlanet();
  const [color, setColor] = useState<string>();

  const applyNoise = useCallback(
    (vertex: Vector3, noise: number = -Infinity) => {
      const elevation = 1 + Math.max(noiseMin, noise) * elevationScale;
      vertex.setLength(elevation);
      return elevation;
    },
    [elevationScale, noiseMin]
  );

  const applyElevation = useCallback(
    (tile: Tile): number => {
      const centerNoise = noise(center);
      const centerElevation = applyNoise(tile.center, centerNoise);
      if (centerNoise <= noiseMin) {
        for (let index = 0; index < polygon.length; index++) {
          tile.polygon[index].setLength(centerElevation);
        }
      } else {
        for (let index = 0; index < polygon.length; index++) {
          const pointNoise = noise(polygon[index]);
          const elevationNoise =
            centerNoise * elevationOffset + pointNoise * (1 - elevationOffset);
          applyNoise(tile.polygon[index], elevationNoise);
        }
      }
      return centerNoise;
    },
    [applyNoise, center, elevationOffset, noise, noiseMin, polygon]
  );

  const ref = useUpdate<Mesh<Geometry>>(
    ({ geometry: { vertices } }) => {
      const tile = getTile(vertices);
      const centerNoise = applyElevation(tile);
      const biome = biomes.find((c) => centerNoise <= c.noiseMax);
      if (biome) {
        setColor(biome.color);
      }
    },
    [applyElevation]
  );

  return (
    <mesh name="TileMesh" ref={ref} {...props}>
      <meshStandardMaterial color={color} />
      <TileGeometry center={center} polygon={polygon} />
    </mesh>
  );
};

export default TileMesh;
