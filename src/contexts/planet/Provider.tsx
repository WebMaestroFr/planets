import { geoDelaunay } from "d3-geo-voronoi";
import PoissonDiskSampling from "poisson-disk-sampling";
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import seedrandom from "seedrandom";
import SimplexNoise from "simplex-noise";
import { Vector3 } from "three";
import useSettings from "../settings";
import {
  Planet,
  toGeographicalCoordinates,
  toSphericalCoordinates,
  toSphericalDistribution,
} from "./index";
import {
  GeographicalCoordinates,
  PlanetTile,
  PlanetTilePoint,
  SphericalCoordinates,
} from "./planet";

export const PlanetProvider: FC = ({ children }) => {
  const { minDistance, noiseRadius, seed, tries } = useSettings().planet;

  const [loading, setLoading] = useState<boolean>(true);
  const [tiles, setTiles] = useState<PlanetTile[]>([]);

  const poisson = useMemo(
    () =>
      new PoissonDiskSampling(
        {
          shape: [1.0, 1.0],
          minDistance,
          tries,
        },
        seedrandom(seed)
      ),
    [minDistance, tries, seed]
  );

  const simplex = useMemo(() => new SimplexNoise(seed), [seed]);
  const noise = useCallback(
    (point: Vector3) => {
      const { x, y, z } = point.clone().setLength(noiseRadius);
      return simplex.noise3D(x, y, z);
    },
    [simplex, noiseRadius]
  );

  const toTilePoint = useCallback(
    ([phi, theta]: SphericalCoordinates): PlanetTilePoint => {
      const position = new Vector3();
      position.setFromSphericalCoords(1, phi, theta);
      return { noise: noise(position), position };
    },
    [noise]
  );

  useEffect(() => {
    const sphericalCoordinates = poisson.fill().map(toSphericalDistribution);
    const geographicalCoordinates = sphericalCoordinates.map(
      toGeographicalCoordinates
    );
    const delaunay: {
      centers: GeographicalCoordinates[];
      polygons: number[][];
    } = geoDelaunay(geographicalCoordinates);
    const points = delaunay.centers
      .map(toSphericalCoordinates)
      .map(toTilePoint);
    const nextTiles = delaunay.polygons.map((polygon, c) => ({
      center: toTilePoint(sphericalCoordinates[c]),
      polygon: polygon.map((p) => points[p]),
    }));
    setTiles(nextTiles);
    setLoading(false);
  }, [poisson, toTilePoint]);

  return loading ? null : (
    <Planet.Provider
      value={{
        noise,
        tiles,
      }}
    >
      {children}
    </Planet.Provider>
  );
};

export default PlanetProvider;
