import { geoDelaunay } from "d3-geo-voronoi";
import PoissonDiskSampling from "poisson-disk-sampling";
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import seedrandom from "seedrandom";
import SimplexNoise from "simplex-noise";
import { Vector3 } from "three";
import { Planet } from "./index";
import {
  GeographicalCoordinates,
  PlanetProps,
  SphericalCoordinates,
} from "./planet";

// https://www.jasondavies.com/maps/random-points/

export const toGeographical = ([
  theta,
  phi,
]: SphericalCoordinates): GeographicalCoordinates => [
  (180.0 * theta) / Math.PI - 180,
  90 - (180.0 * phi) / Math.PI,
];
export const toSpherical = ([u, v]: [number, number]): SphericalCoordinates => [
  2 * Math.PI * u,
  Math.acos(2 * v - 1),
];

export const PlanetProvider: FC<PlanetProps> = ({
  children,
  minDistance = 0.02,
  radius = 1,
  seed,
  tries = 8,
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [tiles, setTiles] = useState<GeographicalCoordinates[][]>([]);

  const random = useCallback(seedrandom(seed), [seed]);
  const poisson = useMemo(
    () =>
      new PoissonDiskSampling(
        {
          shape: [1.0, 1.0],
          minDistance,
          tries,
        },
        random
      ),
    [minDistance, tries, random]
  );

  const simplex = useMemo(() => new SimplexNoise(seed), [seed]);
  const noise = useCallback(
    ({ x, y, z }: Vector3) => simplex.noise3D(x, y, z),
    [simplex]
  );

  useEffect(() => {
    const coordinates = poisson.fill().map(toSpherical).map(toGeographical);
    const delaunay = geoDelaunay(coordinates);
    const polygons = delaunay.polygons.map((polygon: number[]) =>
      polygon.map((c) => delaunay.centers[c])
    );
    setTiles(polygons);
    setLoading(false);
  }, [poisson]);

  return loading ? null : (
    <Planet.Provider
      value={{
        radius,
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
