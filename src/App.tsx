import { geoDelaunay } from "d3-geo-voronoi";
import React, { FC, useEffect, useState } from "react";
import { Canvas } from "react-three-fiber";
import seedrandom from "seedrandom";
import TileMesh from "./components/Tile";

export const RADIUS = 2;
export const RESOLUTION = 128;

export type GeographicalCoordinates = [number, number];
export type SphericalCoordinates = [number, number];

const getRandomSphericalCoordinates = (
  length: number,
  seed?: string
): SphericalCoordinates[] => {
  const random = seedrandom(seed);
  const getCoordinates = (): SphericalCoordinates => {
    const u = random();
    const v = random();
    return [2 * Math.PI * u, Math.acos(2 * v - 1)];
  };
  return Array.from({ length }, getCoordinates);
};

const getRandomGeographicalCoordinates = (
  length: number,
  seed?: string
): GeographicalCoordinates[] => {
  const sphericalCoordinates = getRandomSphericalCoordinates(length, seed);
  return sphericalCoordinates.map(([theta, phi]) => [
    (180.0 * theta) / Math.PI - 180,
    90 - (180.0 * phi) / Math.PI,
  ]);
};

const getPolygons = (
  coordinates: GeographicalCoordinates[]
): GeographicalCoordinates[][] => {
  const delaunay = geoDelaunay(coordinates);
  return delaunay.polygons.map((polygon: number[]) =>
    polygon.map((c) => delaunay.centers[c])
  );
};

const App: FC = () => {
  const [tiles, setTiles] = useState<GeographicalCoordinates[][]>([]);

  useEffect(() => {
    const coordinates = getRandomGeographicalCoordinates(RESOLUTION);
    const polygons = getPolygons(coordinates);
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
