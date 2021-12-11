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

export function useTiles(settings: PlanetSettings) {
  const [tiles, setTiles] = useState<PlanetTile[]>([]);

  const poisson = useMemo(
    () =>
      new PoissonDiskSampling(
        {
          shape: [1.0, 1.0],
          minDistance: settings.minDistance,
          tries: settings.tries,
        },
        seedrandom(settings.seed)
      ),
    [settings]
  );

  const simplex = useMemo(() => new SimplexNoise(settings.seed), [settings]);
  const noise = useCallback(
    (point: Vector3) => {
      const { x, y, z } = point.clone().setLength(settings.noiseRadius);
      return simplex.noise3D(x, y, z);
    },
    [settings, simplex]
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
    const timeKey = Date.now().toString();
    const nextTiles = delaunay.polygons.map((polygon, index) => {
      const center = toTilePoint(sphericalCoordinates[index]);
      return {
        center,
        key: `${timeKey}-${index}`,
        polygon: polygon.map((p) => points[p]),
      };
    });
    setTiles(nextTiles);
  }, [poisson, toTilePoint]);

  return tiles;
}
