import { geoDelaunay } from "d3-geo-voronoi";
import PoissonDiskSampling from "poisson-disk-sampling";
import { useCallback, useEffect, useMemo, useState } from "react";
import seedrandom from "seedrandom";
import SimplexNoise from "simplex-noise";
import { Vector3 } from "three";
import {
  toGeographicalCoordinates,
  toSphericalCoordinates,
  toSphericalDistribution,
} from "../objects/planet";
import {
  GeographicalCoordinates,
  PlanetSettings,
  PlanetTile,
  PlanetTilePoint,
  SphericalCoordinates,
} from "../objects/planet/planet";

export function useTiles({
  minDistance,
  noiseRadius,
  seed,
  tries,
}: PlanetSettings) {
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
    [minDistance, seed, tries]
  );

  const simplex = useMemo(() => new SimplexNoise(seed), [seed]);
  const noise = useCallback(
    (point: Vector3) => {
      const { x, y, z } = point.clone().setLength(noiseRadius);
      return simplex.noise3D(x, y, z);
    },
    [noiseRadius, simplex]
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
    const nextTiles = delaunay.polygons.map((polygon, c) => {
      const center = toTilePoint(sphericalCoordinates[c]);
      return {
        center,
        polygon: polygon.map((p) => points[p]),
      };
    });
    setTiles(nextTiles);
  }, [poisson, toTilePoint]);

  return tiles;
}
