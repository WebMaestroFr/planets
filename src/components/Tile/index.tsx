import React, { FC, useState } from "react";
import { useUpdate } from "react-three-fiber";
import { Geometry, Mesh } from "three";
import usePlanet from "../../contexts/planet";
import { GeographicalCoordinates } from "../../contexts/planet/planet";
import TileGeometry from "./Geometry";

const TileMesh: FC<{
  index: number;
  polygon: GeographicalCoordinates[];
}> = ({ index, polygon, ...props }) => {
  const { noise } = usePlanet();
  const [color, setColor] = useState<string>();
  const ref = useUpdate<Mesh<Geometry>>((mesh) => {
    const center = mesh.geometry.vertices[polygon.length + 1];
    const elevation = (noise(center) + 1) / 2;
    const hue = Math.ceil(elevation * 360);
    const luminosity = Math.ceil(elevation * 100);
    setColor(`hsl(${hue}, 50%, ${luminosity}%)`);
  }, []);

  return (
    <mesh name="TileMesh" ref={ref} {...props}>
      <meshStandardMaterial color={color} />
      <TileGeometry polygon={polygon} />
    </mesh>
  );
};

export default TileMesh;
