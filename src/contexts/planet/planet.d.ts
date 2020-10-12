import { Vector3 } from "three";

export type GeographicalCoordinates = [number, number];
export type SphericalCoordinates = [number, number];

export interface PlanetContext {
  radius: number;
  resolution: number;
  seed: string;
  tiles: GeographicalCoordinates[][];
  noise: (vertex: Vector3) => number;
  random: () => number;
}

export interface PlanetProps {
  radius: number;
  resolution: number;
  seed: string
}