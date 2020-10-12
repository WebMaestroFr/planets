import { geoDelaunay } from "d3-geo-voronoi";
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import SimplexNoise from "simplex-noise";
import seedrandom from "seedrandom";

import { Planet } from "./index";
import {
  GeographicalCoordinates,
  PlanetProps,
  SphericalCoordinates,
} from "./planet";
import { Vector3 } from "three";

export const toGeographical = ([
  theta,
  phi,
]: SphericalCoordinates): GeographicalCoordinates => [
  (180.0 * theta) / Math.PI - 180,
  90 - (180.0 * phi) / Math.PI,
];

export const PlanetProvider: FC<PlanetProps> = ({
  children,
  radius,
  resolution,
  seed,
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [tiles, setTiles] = useState<GeographicalCoordinates[][]>([]);

  const simplex = useMemo(() => new SimplexNoise(seed), [seed]);

  const noise = useCallback(
    ({ x, y, z }: Vector3) => simplex.noise3D(x, y, z),
    [simplex]
  );
  const random = useCallback(seedrandom(seed), [seed]);

  useEffect(() => {
    const getCoordinates = (): SphericalCoordinates => {
      const u = random();
      const v = random();
      return [2 * Math.PI * u, Math.acos(2 * v - 1)];
    };
    const coordinates = Array.from({ length: resolution }, getCoordinates).map(
      toGeographical
    );
    const delaunay = geoDelaunay(coordinates);
    const polygons = delaunay.polygons.map((polygon: number[]) =>
      polygon.map((c) => delaunay.centers[c])
    );
    setTiles(polygons);
    setLoading(false);
  }, [random, resolution]);

  return loading ? null : (
    <Planet.Provider
      value={{
        radius,
        resolution,
        seed,
        tiles,
        noise,
        random,
      }}
    >
      {children}
    </Planet.Provider>
  );
};

export default PlanetProvider;
