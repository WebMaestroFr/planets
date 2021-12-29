import _ from "lodash";
import {
  BufferGeometry,
  Float32BufferAttribute,
  MathUtils,
  Vector3,
} from "three";
import {
  GeographicalCoordinates,
  PlanetTilePoint,
  PlanetTilePolygon,
  SphericalCoordinates,
} from "./planet";

// TO DO: This doesn't work since vertices are not indexed as expected...

export const getTile = (
  origin: [number, number, number],
  center: PlanetTilePoint,
  polygon: PlanetTilePoint[]
): PlanetTilePolygon => {
  return {
    center: center.position,
    origin: new Vector3(...origin),
    polygon: polygon.map(({ position }) => position),
  };
};

export const setTile = (geometry: BufferGeometry, tile: PlanetTilePolygon) => {
  const vertices = tile.polygon.reduce<
    {
      position: [number, number, number];
      normal: [number, number, number];
      uv: [number, number];
    }[]
  >((v, { x, y, z }, index) => {
    const next =
      index === tile.polygon.length - 1
        ? tile.polygon[0]
        : tile.polygon[index + 1];
    const normalTop = new Vector3(x, y, z);
    normalTop.add(next).add(tile.center).divideScalar(3).normalize();
    const normalBase = new Vector3(x, y, z);
    normalBase.add(next).divideScalar(2).sub(tile.center).normalize();
    return [
      ...v,
      {
        position: [tile.origin.x, tile.origin.y, tile.origin.z],
        normal: [normalBase.x, normalBase.y, normalBase.z],
        uv: [0, 0],
      },
      {
        position: [x, y, z],
        normal: [normalBase.x, normalBase.y, normalBase.z],
        uv: [0, 1],
      },
      {
        position: [next.x, next.y, next.z],
        normal: [normalBase.x, normalBase.y, normalBase.z],
        uv: [1, 0],
      },
      {
        position: [tile.center.x, tile.center.y, tile.center.z],
        normal: [normalTop.x, normalTop.y, normalTop.z],
        uv: [1, 1],
      },
      {
        position: [next.x, next.y, next.z],
        normal: [normalTop.x, normalTop.y, normalTop.z],
        uv: [1, 0],
      },
      {
        position: [x, y, z],
        normal: [normalTop.x, normalTop.y, normalTop.z],
        uv: [0, 1],
      },
    ];
  }, []);
  const positions = [];
  const normals = [];
  const uvs = [];
  for (const vertex of vertices) {
    positions.push(...vertex.position);
    normals.push(...vertex.normal);
    uvs.push(...vertex.uv);
  }
  geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  geometry.setAttribute("normal", new Float32BufferAttribute(normals, 3));
  geometry.setAttribute("uv", new Float32BufferAttribute(positions, 2));
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
