import React, { FC, useCallback, useMemo } from "react";
import { useUpdate } from "react-three-fiber";
import {
  BufferGeometry,
  Float32BufferAttribute,
  Material,
  Mesh,
  Vector3,
} from "three";
import { usePlanet } from "../../contexts/planet";
import { useNoise } from "../../contexts/planet/noise";
import {
  PlanetTileBiome,
  PlanetTileProps,
  VectorCoordinates,
} from "../../contexts/planet/planet";

const PlanetTile: FC<PlanetTileProps> = ({ center, polygon, ...props }) => {
  const planet = usePlanet();
  const noiseLayers = useMemo(
    () => [{ scalar: planet.noiseRadius, weight: 1 }],
    [planet.noiseRadius]
  );
  const getNoise = useNoise(planet.seed, noiseLayers);

  const getElevation = useCallback(
    (noise: number) =>
      planet.radius + Math.max(planet.noiseMin, noise) * planet.elevationScale,
    [planet.radius, planet.noiseMin, planet.elevationScale]
  );

  const centerNoise = useMemo(() => getNoise(center), [center, getNoise]);
  const polygonNoise = useMemo(() => polygon.map(getNoise), [
    getNoise,
    polygon,
  ]);

  const centerVertex = useMemo(() => {
    const elevation = getElevation(centerNoise);
    const vertex = new Vector3(...center);
    return vertex.setLength(elevation);
  }, [center, centerNoise, getElevation]);

  const polygonVertices = useMemo(() => {
    const centerElevation = getElevation(centerNoise);
    return polygon.map((coordinates, index) => {
      const vertex = new Vector3(...coordinates);
      if (centerNoise <= planet.noiseMin) {
        vertex.setLength(centerElevation);
      } else {
        const elevationNoise =
          centerNoise * planet.elevationOffset +
          polygonNoise[index] * (1 - planet.elevationOffset);
        const elevation = getElevation(elevationNoise);
        vertex.setLength(elevation);
      }
      return vertex;
    });
  }, [
    getElevation,
    centerNoise,
    planet.elevationOffset,
    planet.noiseMin,
    polygon,
    polygonNoise,
  ]);

  const computedVertices = useMemo(() => {
    return polygonVertices.reduce<
      {
        position: VectorCoordinates;
        normal: VectorCoordinates;
        uv: [number, number];
      }[]
    >((v, vertex, index, vertices) => {
      const nextVertex =
        index === vertices.length - 1 ? vertices[0] : vertices[index + 1];
      const normalBase = vertex
        .clone()
        .add(nextVertex)
        .divideScalar(2)
        .sub(centerVertex)
        .normalize();
      const normalTop = vertex
        .clone()
        .add(nextVertex)
        .add(centerVertex)
        .divideScalar(3)
        .normalize();
      return [
        ...v,
        {
          position: [0, 0, 0],
          normal: [normalBase.x, normalBase.y, normalBase.z],
          uv: [0, 0],
        },
        {
          position: [vertex.x, vertex.y, vertex.z],
          normal: [normalBase.x, normalBase.y, normalBase.z],
          uv: [0, 1],
        },
        {
          position: [nextVertex.x, nextVertex.y, nextVertex.z],
          normal: [normalBase.x, normalBase.y, normalBase.z],
          uv: [1, 0],
        },
        {
          position: [centerVertex.x, centerVertex.y, centerVertex.z],
          normal: [normalTop.x, normalTop.y, normalTop.z],
          uv: [1, 1],
        },
        {
          position: [nextVertex.x, nextVertex.y, nextVertex.z],
          normal: [normalTop.x, normalTop.y, normalTop.z],
          uv: [1, 0],
        },
        {
          position: [vertex.x, vertex.y, vertex.z],
          normal: [normalTop.x, normalTop.y, normalTop.z],
          uv: [0, 1],
        },
      ];
    }, []);
  }, [centerVertex, polygonVertices]);

  const biome = useMemo<PlanetTileBiome>(
    () =>
      planet.biomes.find(
        (b) =>
          centerNoise <= planet.noiseMin + b.noiseMax * (1 - planet.noiseMin)
      ) || planet.biomes[0],
    [planet.biomes, centerNoise, planet.noiseMin]
  );

  const ref = useUpdate<Mesh<BufferGeometry, Material>>(
    ({ geometry }) => {
      const positions = [];
      const normals = [];
      const uvs = [];
      for (const vertex of computedVertices) {
        positions.push(...vertex.position);
        normals.push(...vertex.normal);
        uvs.push(...vertex.uv);
      }
      geometry.setAttribute(
        "position",
        new Float32BufferAttribute(positions, 3)
      );
      geometry.setAttribute("normal", new Float32BufferAttribute(normals, 3));
      geometry.setAttribute("uv", new Float32BufferAttribute(uvs, 2));
    },
    [computedVertices]
  );

  return (
    <mesh name="PlanetTile" ref={ref} {...props}>
      <bufferGeometry />
      <meshStandardMaterial color={biome?.color} />
    </mesh>
  );
};

export default PlanetTile;
