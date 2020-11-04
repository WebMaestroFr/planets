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
  SphericalCoordinates,
} from "./planet";

// https://www.jasondavies.com/maps/random-points/

export const PlanetProvider: FC = ({ children }) => {
  const settings = useSettings().planet;

  const [loading, setLoading] = useState<boolean>(true);
  const [tiles, setTiles] = useState<PlanetTile[]>([]);

  // "Random" needs to be reseeded for any change on planet settings
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
    [settings.minDistance, settings.tries, random]
  );

  const simplex = useMemo(() => new SimplexNoise(random), [random]);
  const noise = useCallback(
    ({ x, y, z }: Vector3) =>
      simplex.noise3D(
        (x + settings.noiseDistanceX) * settings.noiseScaleX,
        (y + settings.noiseDistanceY) * settings.noiseScaleY,
        (z + settings.noiseDistanceZ) * settings.noiseScaleZ
      ),
    [
      settings.noiseDistanceX,
      settings.noiseDistanceY,
      settings.noiseDistanceZ,
      settings.noiseScaleX,
      settings.noiseScaleY,
      settings.noiseScaleZ,
      simplex,
    ]
  );

  const toNoiseVertex = useCallback(
    ([phi, theta]: SphericalCoordinates): Vector3 => {
      const vertex = new Vector3();
      return vertex.setFromSphericalCoords(settings.noiseRadius, phi, theta);
    },
    [settings.noiseRadius]
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
      .map(toNoiseVertex);
    const nextTiles = delaunay.polygons.map((polygon, c) => ({
      center: toNoiseVertex(sphericalCoordinates[c]),
      polygon: polygon.map((p) => points[p]),
    }));
    setTiles(nextTiles);
    setLoading(false);
  }, [poisson, toNoiseVertex]);

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
