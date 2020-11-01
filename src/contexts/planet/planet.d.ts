import { Vector3 } from "three";

export type GeographicalCoordinates = [number, number];
export type SphericalCoordinates = [number, number];

export interface PlanetContext extends PlanetSettings {
  tiles: GeographicalCoordinates[][];
  noise: (vertex: Vector3) => number;
  random: () => number;
}

export interface PlanetSettings {
  biomes: { color: string; elevationMax: number }[];
  distance: number;
  elevationMin: number;
  elevationScale: number;
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