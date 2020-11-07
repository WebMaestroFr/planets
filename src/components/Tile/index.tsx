import React, { FC, useCallback, useState } from "react";
import { useUpdate } from "react-three-fiber";
import { Geometry, Mesh, Vector3 } from "three";
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
  const { biomes } = useSettings().planet;
  const [color, setColor] = useState<string>();

  const applyBiome = useCallback(() => {
    const biome = biomes.find((c) => center.noise <= c.noiseMax);
    if (biome) {
      setColor(biome.color);
    }
  }, []);

  const ref = useUpdate<Mesh<Geometry>>(() => {
    applyBiome();
  }, [applyBiome]);

  return (
    <mesh name="TileMesh" ref={ref} {...props}>
      <meshStandardMaterial color={color} />
      <TileGeometry center={center} polygon={polygon} />
    </mesh>
  );
};

export default TileMesh;
