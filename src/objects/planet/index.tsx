import { MathUtils, Vector3 } from "three";
import {
  GeographicalCoordinates,
  PlanetTilePolygon,
  SphericalCoordinates,
} from "./planet";

export const getTile = (vertices: Vector3[]): PlanetTilePolygon => ({
  center: vertices[vertices.length - 1],
  origin: vertices[0],
  polygon: vertices.slice(1, vertices.length - 1),
});

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
