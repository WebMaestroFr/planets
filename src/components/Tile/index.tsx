import React, { FC, useRef } from "react";
import { useFrame } from "react-three-fiber";
import { Mesh } from "three";

import { GeographicalCoordinates } from "../../App";
import TileGeometry from "./Geometry";

const TileMesh: FC<{ index: number; polygon: GeographicalCoordinates[] }> = ({
  index,
  polygon,
  ...props
}) => {
  // This reference will give us direct access to the mesh
  const ref = useRef<Mesh>(null);

  // Rotate mesh every frame, this is outside of React without overhead
  useFrame(() => {
    if (ref && ref.current) {
      ref.current.rotation.x = ref.current.rotation.y += 0.02;
    }
  });

  return (
    <mesh {...props} ref={ref}>
      <TileGeometry polygon={polygon} />
      <meshStandardMaterial color={Math.random() * 0xffffff} />
    </mesh>
  );
};

export default TileMesh;
