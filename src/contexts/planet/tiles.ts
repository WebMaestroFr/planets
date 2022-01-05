import { geoDelaunay } from "d3-geo-voronoi";
import PoissonDiskSampling from "poisson-disk-sampling";
import { useEffect, useMemo, useState } from "react";
import seedrandom from "seedrandom";
import {
  toCartesianCoordinates,
  toGeographicalCoordinates,
  toSphericalCoordinates,
  toSphericalDistribution,
} from ".";
import {
  GeographicalCoordinates,
  PlanetSettings,
  PlanetTileProps,
} from "./planet";

export function useTiles({ minDistance, seed, tries }: PlanetSettings) {
  const [tiles, setTiles] = useState<PlanetTileProps[]>([]);

  const poisson = useMemo(
    () =>
      new PoissonDiskSampling(
        {
          shape: [1.0, 1.0],
          minDistance: Math.max(minDistance, 0.01),
          tries: Math.max(tries, 2),
        },
        seedrandom(seed)
      ),
    [minDistance, seed, tries]
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
      .map(toCartesianCoordinates);
    const timeKey = Date.now();
    const nextTiles = delaunay.polygons.map((polygon, index) => {
      const center = toCartesianCoordinates(sphericalCoordinates[index]);
      return {
        center,
        key: `${timeKey}-${index}`,
        polygon: polygon.map((p) => points[p]),
      };
    });
    setTiles(nextTiles);
  }, [poisson]);

  return tiles;
}
