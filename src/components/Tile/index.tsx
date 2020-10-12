import React, { FC, useRef } from "react";
import { useFrame } from "react-three-fiber";
import { Mesh } from "three";
import usePlanet from "../../contexts/planet";
import { GeographicalCoordinates } from "../../contexts/planet/planet";
import TileGeometry from "./Geometry";

const TileMesh: FC<{ index: number; polygon: GeographicalCoordinates[] }> = ({
  index,
  polygon,
  ...props
}) => {
  const ref = useRef<Mesh>(null);
  const { random } = usePlanet();

  useFrame(() => {
    if (ref && ref.current) {
      ref.current.rotation.x = ref.current.rotation.y += 0.02;
    }
  });

  return (
    <mesh {...props} ref={ref}>
      <TileGeometry polygon={polygon} />
      <meshStandardMaterial color={random() * 0xffffff} />
    </mesh>
  );
};

export default TileMesh;
