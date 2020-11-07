import { createContext, useContext } from "react";
import { MathUtils } from "three";
import {
  GeographicalCoordinates,
  PlanetContext,
  SphericalCoordinates,
} from "./planet";

export const Planet = createContext<PlanetContext | null>(null);

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
export const toSphericalDistribution = ([u, v]: [
  number,
  number
]): SphericalCoordinates => [
  Math.PI - Math.acos(2 * v - 1),
  2 * Math.PI * u - Math.PI,
];

const Context = () => useContext(Planet) as PlanetContext;
export default Context;
