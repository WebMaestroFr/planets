import { createContext, useContext } from "react";
import { MathUtils } from "three";
import {
  GeographicalCoordinates,
  PlanetSettings,
  SphericalCoordinates,
} from "./planet";

export const DEFAULT_PLANET: PlanetSettings = {
  biomes: [
    { color: "steelblue", noiseMax: 0 },
    { color: "lemonchiffon", noiseMax: 1 / 6 },
    { color: "yellowgreen", noiseMax: 2 / 6 },
    { color: "forestgreen", noiseMax: 3 / 6 },
    { color: "burlywood", noiseMax: 4 / 6 },
    { color: "darkgrey", noiseMax: 5 / 6 },
    { color: "snow", noiseMax: 1 },
  ],
  elevationOffset: 1 / 2,
  elevationScale: 1,
  minDistance: 0.02,
  noiseMin: 0,
  noiseRadius: 1,
  position: [0, 0, 0],
  radius: 8,
  seed: Date.now().toString(),
  tries: 8,
};

export const PlanetContext = createContext<PlanetSettings>(DEFAULT_PLANET);
export const usePlanet = () => useContext(PlanetContext);

export const toGeographicalCoordinates = ([
  phi,
  theta,
]: SphericalCoordinates): GeographicalCoordinates => [
  MathUtils.radToDeg(theta),
  90 - MathUtils.radToDeg(phi),
];
export const toSphericalCoordinates = ([
  lng,
  lat,
]: GeographicalCoordinates): SphericalCoordinates => [
  MathUtils.degToRad(90 - lat),
  MathUtils.degToRad(lng),
];
// https://www.jasondavies.com/maps/random-points/
export const toSphericalDistribution = ([u, v]: [
  number,
  number
]): SphericalCoordinates => [
  Math.PI - Math.acos(2 * v - 1),
  2 * Math.PI * u - Math.PI,
];
