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
import { SphericalCoordinates } from "./planet";

// https://www.jasondavies.com/maps/random-points/

export const PlanetProvider: FC = ({ children }) => {
  const { planet } = useSettings();

  const [loading, setLoading] = useState<boolean>(true);
  const [polygons, setPolygons] = useState<SphericalCoordinates[][]>([]);

  // "Random" needs to be reseeded for any change on planet settings
  const random = useCallback(seedrandom(planet.seed), [planet]);

  const poisson = useMemo(
    () =>
      new PoissonDiskSampling(
        {
          shape: [1.0, 1.0],
          minDistance: planet.minDistance,
          tries: planet.tries,
        },
        random
      ),
    [planet.minDistance, planet.tries, random]
  );

  const simplex = useMemo(() => new SimplexNoise(random), [random]);
  const noise = useCallback(
    ({ x, y, z }: Vector3) =>
      simplex.noise3D(
        (x + planet.distance) * planet.scale,
        (y + planet.distance) * planet.scale,
        (z + planet.distance) * planet.scale
      ),
    [planet.distance, planet.scale, simplex]
  );

  useEffect(() => {
    const sphericalCoordinates = poisson.fill().map(toSphericalDistribution);
    const geographicalCoordinates = sphericalCoordinates.map(
      toGeographicalCoordinates
    );
    const delaunay = geoDelaunay(geographicalCoordinates);
    const sphericalCenters = delaunay.centers.map(toSphericalCoordinates);
    const polygons = delaunay.polygons.map((polygon: [number, number]) =>
      polygon.map((c) => sphericalCenters[c])
    );
    setPolygons(polygons);
    setLoading(false);
  }, [poisson]);

  return loading ? null : (
    <Planet.Provider
      value={{
        polygons,
        noise,
        random,
      }}
    >
      {children}
    </Planet.Provider>
  );
};

export default PlanetProvider;
