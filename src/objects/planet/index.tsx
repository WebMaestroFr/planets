import _ from "lodash";
import {
  BufferGeometry,
  Float32BufferAttribute,
  MathUtils,
  Vector3,
} from "three";
import {
  GeographicalCoordinates,
  PlanetTilePolygon,
  SphericalCoordinates,
} from "./planet";

// TO DO: This doesn't work since vertices are not indexed as expected...

export const getTile = (geometry: BufferGeometry): PlanetTilePolygon => {
  const positionsArray = geometry.toNonIndexed().getAttribute("position").array;
  const vertices = _.chunk(positionsArray, 3);
  return {
    center: new Vector3(...vertices[vertices.length - 1]),
    origin: new Vector3(...vertices[0]),
    polygon: vertices
      .slice(1, vertices.length - 1)
      .map((position) => new Vector3(...position)),
  };
};

export const setTile = (geometry: BufferGeometry, tile: PlanetTilePolygon) => {
  const positions = [];
  positions.push(tile.origin.x, tile.origin.y, tile.origin.z);
  for (const { x, y, z } of tile.polygon) {
    positions.push(x, y, z);
  }
  positions.push(tile.center.x, tile.center.y, tile.center.z);
  const attribute = new Float32BufferAttribute(positions, 3);
  geometry.setAttribute("position", attribute);
};

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
