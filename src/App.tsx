import { geoDelaunay } from "d3-geo-voronoi";
import React, { FC, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useUpdate } from "react-three-fiber";
import seedrandom from "seedrandom";
import { ConeGeometry, MathUtils, Mesh } from "three";

const RADIUS = 2;
const RESOLUTION = 64;

type Coordinates = [number, number];

const getRandomCoordinates = (length: number, seed?: string): Coordinates[] => {
  const random = seedrandom(seed);
  const getCoordinates = (): Coordinates => [
    random() * 360 - 180,
    random() * 180 - 90,
  ];
  return Array.from({ length }, getCoordinates);
};

const getPolygons = (coordinates: Coordinates[]): Coordinates[][] => {
  const delaunay = geoDelaunay(coordinates);
  return delaunay.polygons.map((polygon: number[]) =>
    polygon.map((c) => delaunay.centers[c])
  );
};

const TileGeometry: FC<{ polygon: Coordinates[] }> = ({
  polygon,
  ...props
}) => {
  const ref = useUpdate<ConeGeometry>((geometry) => {
    const origin = geometry.vertices[0];
    const center = geometry.vertices[polygon.length + 1];
    origin.set(0, 0, 0);
    center.set(0, 0, 0);
    for (let index = 0; index < polygon.length; index++) {
      const [lon, lat] = polygon[index];
      const vertex = geometry.vertices[index + 1];
      const phi = MathUtils.degToRad(90 - lat);
      const theta = MathUtils.degToRad(lon);
      vertex.setFromSphericalCoords(RADIUS, phi, theta);
      center.add(vertex);
    }
    center.setLength(RADIUS);
    geometry.verticesNeedUpdate = true;
    geometry.elementsNeedUpdate = true;
    geometry.uvsNeedUpdate = true;
    geometry.normalsNeedUpdate = true;
    geometry.colorsNeedUpdate = true;
  }, []);

  return <coneGeometry args={[1, 1, polygon.length]} {...props} ref={ref} />;
};

const TileMesh: FC<{ index: number; polygon: Coordinates[] }> = ({
  index,
  polygon,
  ...props
}) => {
  // This reference will give us direct access to the mesh
  const ref = useRef<Mesh>(null);

  // Rotate mesh every frame, this is outside of React without overhead
  useFrame(() => {
    if (ref && ref.current) {
      ref.current.rotation.x += 0.02;
    }
  });

  return (
    <mesh {...props} ref={ref}>
      <TileGeometry polygon={polygon} />
      <meshStandardMaterial color={Math.random() * 0xffffff} />
    </mesh>
  );
};

const App: FC = () => {
  const [tiles, setTiles] = useState<Coordinates[][]>([]);

  useEffect(() => {
    const points = getRandomCoordinates(RESOLUTION);
    const polygons = getPolygons(points);
    setTiles(polygons);
  }, []);

  return (
    <Canvas>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      {tiles.map((polygon, index) => (
        <TileMesh key={index} index={index} polygon={polygon} />
      ))}
    </Canvas>
  );
};

export default App;
