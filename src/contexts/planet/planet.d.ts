import { Vector3 } from "three";

export type GeographicalCoordinates = [number, number];
export type SphericalCoordinates = [number, number];

export interface PlanetTile {
  center: Vector3;
  polygon: Vector3[];
}

export interface PlanetContext {
  noise: (vertex: Vector3) => number;
  tiles: PlanetTile[];
}

export interface PlanetSettings {
  biomes: { color: string; noiseMax: number }[];
  elevationOffset: number;
  elevationScale: number;
  noiseDistanceX: number;
  noiseDistanceY: number;
  noiseDistanceZ: number;
  noiseMin: number;
  noiseRadius: number;
  noiseScaleX: number;
  noiseScaleY: number;
  noiseScaleZ: number;
  minDistance: number;
  position: [number, number, number];
  radius: number;
  seed: string;
  tries: number;
}

export interface PlanetProps {
  settings: PlanetSettings;
}
