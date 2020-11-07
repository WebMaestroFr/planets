import { Vector3 } from "three";

export type GeographicalCoordinates = [number, number];
export type SphericalCoordinates = [number, number];

export interface PlanetTilePoint {
  noise: number;
  position: Vector3;
}

export interface PlanetTile {
  center: PlanetTilePoint;
  polygon: PlanetTilePoint[];
}

export interface PlanetContext {
  noise: (vertex: Vector3) => number;
  tiles: PlanetTile[];
}

export interface PlanetSettings {
  biomes: { color: string; noiseMax: number }[];
  elevationOffset: number;
  elevationScale: number;
  noiseMin: number;
  noiseRadius: number;
  minDistance: number;
  position: [number, number, number];
  radius: number;
  seed: string;
  tries: number;
}

export interface PlanetProps {
  settings: PlanetSettings;
}
