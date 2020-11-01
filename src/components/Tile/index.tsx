import React, { FC, useState } from "react";
import { useUpdate } from "react-three-fiber";
import { Geometry, Mesh } from "three";
import usePlanet from "../../contexts/planet";
import useSettings from "../../contexts/settings";
import { GeographicalCoordinates } from "../../contexts/planet/planet";
import TileGeometry from "./Geometry";

const TileMesh: FC<{
  polygon: GeographicalCoordinates[];
}> = ({ polygon, ...props }) => {
  const { noise } = usePlanet();
  const {
    planet: { biomes },
  } = useSettings();
  const [color, setColor] = useState<string>();
  const sortedBiomes = biomes.sort((a, b) => a.elevationMax - b.elevationMax);
  const ref = useUpdate<Mesh<Geometry>>(
    (mesh) => {
      const center = mesh.geometry.vertices[polygon.length + 1];
      const elevation = noise(center);
      const biome = sortedBiomes.find((c) => elevation <= c.elevationMax);
      if (biome) {
        setColor(biome.color);
      }
    },
    [polygon, noise]
  );

  return (
    <mesh name="TileMesh" ref={ref} {...props}>
      <meshStandardMaterial color={color} />
      <TileGeometry polygon={polygon} />
    </mesh>
  );
};

export default TileMesh;
