import { Vector3 } from "three";

export type GeographicalCoordinates = [number, number];
export type SphericalCoordinates = [number, number];

export interface PlanetContext {
  polygons: SphericalCoordinates[][];
  noise: (vertex: Vector3) => number;
  random: () => number;
}

export interface PlanetSettings {
  biomes: { color: string; noiseMax: number }[];
  distance: number;
  noiseMin: number;
  noiseScale: number;
  minDistance: number;
  position: [number, number, number];
  radius: number;
  scale: number;
  seed: string;
  tries: number;
}

export interface PlanetProps {
  settings: PlanetSettings;
}