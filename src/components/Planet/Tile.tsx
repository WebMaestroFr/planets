import React, { FC, useCallback, useMemo } from "react";
import { useUpdate } from "react-three-fiber";
import { BufferGeometry, Material, Mesh, Vector3 } from "three";
import useBiomes from "../../contexts/biomes";
import { usePlanet } from "../../contexts/planet";
import { useNoise } from "../../contexts/planet/noise";
import { PlanetTileProps } from "../../contexts/planet/planet";
import { useTileGeometry } from "../../contexts/planet/tileGeometry";

const PlanetTile: FC<PlanetTileProps> = ({ center, polygon, ...props }) => {
  const {
    elevationOffset,
    elevationScale,
    noiseMin,
    noiseRadius,
    radius,
    seed,
  } = usePlanet();
  const noiseLayers = useMemo(
    () => [
      { scalar: noiseRadius, weight: 1 },
      { scalar: noiseRadius * 2, weight: 1 / 2 },
      { scalar: noiseRadius * 4, weight: 1 / 4 },
      { scalar: noiseRadius * 8, weight: 1 / 8 },
    ],
    [noiseRadius]
  );
  const getNoise = useNoise(seed, noiseLayers);
  const biomes = useBiomes();

  const getElevation = useCallback(
    (noise: number) => radius + Math.max(noiseMin, noise) * elevationScale,
    [radius, noiseMin, elevationScale]
  );

  const centerNoise = useMemo(() => getNoise(center), [center, getNoise]);
  const polygonNoise = useMemo(() => polygon.map(getNoise), [
    getNoise,
    polygon,
  ]);

  const centerElevation = useMemo(() => getElevation(centerNoise), [
    centerNoise,
    getElevation,
  ]);

  const centerVertex = useMemo(() => {
    const vertex = new Vector3(...center);
    return vertex.setLength(centerElevation);
  }, [center, centerElevation]);
  const polygonVertices = useMemo(() => {
    return polygon.map((coordinates, index) => {
      const vertex = new Vector3(...coordinates);
      if (centerNoise <= noiseMin) {
        vertex.setLength(centerElevation);
      } else {
        const elevationNoise =
          centerNoise * elevationOffset +
          polygonNoise[index] * (1 - elevationOffset);
        const elevation = getElevation(elevationNoise);
        vertex.setLength(elevation);
      }
      return vertex;
    });
  }, [
    centerElevation,
    centerNoise,
    getElevation,
    elevationOffset,
    noiseMin,
    polygon,
    polygonNoise,
  ]);

  const { positions, normals, uvs } = useTileGeometry(
    centerVertex,
    polygonVertices
  );

  const ref = useUpdate<Mesh<BufferGeometry, Material>>(
    ({ geometry }) => {
      geometry.setAttribute("position", positions);
      geometry.setAttribute("normal", normals);
      geometry.setAttribute("uv", uvs);
    },
    [positions, normals, uvs]
  );

  const biome = useMemo(() => biomes && biomes.getColor(center, centerNoise), [
    biomes,
    center,
    centerNoise,
  ]);

  return (
    <mesh name="PlanetTile" ref={ref} {...props}>
      <bufferGeometry />
      <meshLambertMaterial color={biome} />
    </mesh>
  );
};

export default PlanetTile;
