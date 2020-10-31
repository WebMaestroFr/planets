import { Vector3 } from "three";

export type GeographicalCoordinates = [number, number];
export type SphericalCoordinates = [number, number];

export interface PlanetContext {
  settings: PlanetSettings;
  tiles: GeographicalCoordinates[][];
  noise: (vertex: Vector3) => number;
  random: () => number;
}

export interface PlanetSettings {
  distance: number;
  minDistance?: number;
  position: [number, number, number]
  radius: number;
  scale: number;
  seed: string
  tries: number;
}

export interface PlanetProps {
  settings: PlanetSettings 
}