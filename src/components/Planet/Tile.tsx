import React, { FC, useMemo } from "react";
import { useUpdate } from "react-three-fiber";
import {
  BufferGeometry,
  Float32BufferAttribute,
  Material,
  Mesh,
  Vector3,
} from "three";
import { usePlanet } from "../../contexts/planet";
import { PlanetTileBiome, PlanetTileProps } from "../../contexts/planet/planet";

const PlanetTile: FC<PlanetTileProps> = ({
  center,
  key,
  polygon,
  ...props
}) => {
  const planet = usePlanet();

  const computedCenter = useMemo(() => {
    const length =
      planet.radius +
      Math.max(planet.noiseMin, center.noise) * planet.elevationScale;
    return center.position.clone().setLength(length);
  }, [center, planet.radius, planet.noiseMin, planet.elevationScale]);
  const computedPolygon = useMemo(() => {
    const centerLength = computedCenter.length();
    return polygon
      .map(({ noise, position }) => {
        const vertex = position.clone();
        if (center.noise <= planet.noiseMin) {
          vertex.setLength(centerLength);
        } else {
          const elevationNoise =
            center.noise * planet.elevationOffset +
            noise * (1 - planet.elevationOffset);
          const elevation =
            planet.radius +
            Math.max(planet.noiseMin, elevationNoise) * planet.elevationScale;
          vertex.setLength(elevation);
        }
        return vertex;
      })
      .reduce<
        {
          position: [number, number, number];
          normal: [number, number, number];
          uv: [number, number];
        }[]
      >((v, { x, y, z }, index, vertices) => {
        const next =
          index === vertices.length - 1 ? vertices[0] : vertices[index + 1];
        const normalBase = new Vector3(x, y, z);
        normalBase.add(next).divideScalar(2).sub(computedCenter).normalize();
        const normalTop = new Vector3(x, y, z);
        normalTop.add(next).add(computedCenter).divideScalar(3).normalize();
        return [
          ...v,
          {
            position: [0, 0, 0],
            normal: [normalBase.x, normalBase.y, normalBase.z],
            uv: [0, 0],
          },
          {
            position: [x, y, z],
            normal: [normalBase.x, normalBase.y, normalBase.z],
            uv: [0, 1],
          },
          {
            position: [next.x, next.y, next.z],
            normal: [normalBase.x, normalBase.y, normalBase.z],
            uv: [1, 0],
          },
          {
            position: [computedCenter.x, computedCenter.y, computedCenter.z],
            normal: [normalTop.x, normalTop.y, normalTop.z],
            uv: [1, 1],
          },
          {
            position: [next.x, next.y, next.z],
            normal: [normalTop.x, normalTop.y, normalTop.z],
            uv: [1, 0],
          },
          {
            position: [x, y, z],
            normal: [normalTop.x, normalTop.y, normalTop.z],
            uv: [0, 1],
          },
        ];
      }, []);
  }, [
    center.noise,
    computedCenter,
    planet.elevationOffset,
    planet.elevationScale,
    planet.noiseMin,
    planet.radius,
    polygon,
  ]);

  const biome = useMemo<PlanetTileBiome>(
    () =>
      planet.biomes.find(
        (b) =>
          center.noise <= planet.noiseMin + b.noiseMax * (1 - planet.noiseMin)
      ) || planet.biomes[0],
    [planet.biomes, center.noise, planet.noiseMin]
  );

  const ref = useUpdate<Mesh<BufferGeometry, Material>>(({ geometry }) => {
    const positions = [];
    const normals = [];
    const uvs = [];
    for (const vertex of computedPolygon) {
      positions.push(...vertex.position);
      normals.push(...vertex.normal);
      uvs.push(...vertex.uv);
    }
    geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
    geometry.setAttribute("normal", new Float32BufferAttribute(normals, 3));
    geometry.setAttribute("uv", new Float32BufferAttribute(uvs, 2));
  }, []);

  return (
    <mesh key={key} name="PlanetTile" ref={ref} {...props}>
      <bufferGeometry />
      <meshStandardMaterial color={biome?.color} />
    </mesh>
  );
};

export default PlanetTile;
