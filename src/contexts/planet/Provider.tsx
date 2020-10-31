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

export const PlanetProvider: FC<PlanetProps> = ({ children, settings }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [tiles, setTiles] = useState<GeographicalCoordinates[][]>([]);

  const random = useCallback(seedrandom(settings.seed), [settings.seed]);
  const poisson = useMemo(
    () =>
      new PoissonDiskSampling(
        {
          shape: [1.0, 1.0],
          minDistance: settings.minDistance,
          tries: settings.tries,
        },
        random
      ),
    [settings, random]
  );

  const simplex = useMemo(() => new SimplexNoise(random), [random]);
  const noise = useCallback(
    ({ x, y, z }: Vector3, scale: number = 1, distance: number = 0) =>
      simplex.noise3D(
        (x + distance) * scale,
        (y + distance) * scale,
        (z + distance) * scale
      ),
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
        settings,
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
