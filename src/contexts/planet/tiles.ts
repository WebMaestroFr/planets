import { geoDelaunay } from "d3-geo-voronoi";
import PoissonDiskSampling from "poisson-disk-sampling";
import { useMemo } from "react";
import seedrandom from "seedrandom";
import {
  toCartesianCoordinates,
  toGeographicalCoordinates,
  toSphericalCoordinates,
  toSphericalDistribution,
} from ".";
import { GeographicalCoordinates, PlanetTile } from "./planet";

export function useTiles(seed: string, minDistance: number, tries: number) {
  const random = useMemo(() => seedrandom(seed), [seed]);
  const poisson = useMemo(
    () =>
      new PoissonDiskSampling(
        {
          shape: [1.0, 1.0],
          minDistance: Math.max(minDistance, 0.01),
          tries: Math.max(tries, 2),
        },
        random
      ),
    [minDistance, tries, random]
  );

  return useMemo<PlanetTile[]>(() => {
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
    return delaunay.polygons.map((polygon, index) => {
      const center = toCartesianCoordinates(sphericalCoordinates[index]);
      return {
        center,
        polygon: polygon.map((p) => points[p]),
      };
    });
  }, [poisson]);
}
