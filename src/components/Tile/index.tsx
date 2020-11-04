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
  const { biomes, elevationScale, noiseMin, radius } = useSettings().planet;
  const { noise } = usePlanet();
  const [color, setColor] = useState<string>();
  const sortedBiomes = biomes.sort((a, b) => a.noiseMax - b.noiseMax);

  const applyElevation = useCallback(
    (tile: Tile): number => {
      const centerNoise = noise(center);
      if (centerNoise <= noiseMin) {
        const minElevation = radius + noiseMin * elevationScale;
        tile.center.setLength(minElevation);
        for (let index = 0; index < polygon.length; index++) {
          tile.polygon[index].setLength(minElevation);
        }
      } else {
        const applyElevation = (noise: number, vertex: Vector3) => {
          const elevation = radius + Math.max(noiseMin, noise) * elevationScale;
          vertex.setLength(elevation);
        };
        applyElevation(centerNoise, tile.center);
        for (let index = 0; index < polygon.length; index++) {
          const pointNoise = noise(polygon[index]);
          applyElevation((centerNoise + pointNoise) / 2, tile.polygon[index]);
        }
      }
      return centerNoise;
    },
    [center, elevationScale, noise, noiseMin, polygon, radius]
  );

  const ref = useUpdate<Mesh<Geometry>>(
    ({ geometry: { vertices } }) => {
      const tile = getTile(vertices);
      const centerNoise = applyElevation(tile);
      const biome = sortedBiomes.find((c) => centerNoise <= c.noiseMax);
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
