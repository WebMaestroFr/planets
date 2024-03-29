import { Color, Vector3 } from "three";

export type GeographicalCoordinates = [number, number];
export type SphericalCoordinates = [number, number];
export type VectorCoordinates = [number, number, number];

export interface PlanetProps {
  settings: PlanetSettings;
}

export interface PlanetSettings {
  elevationOffset: number;
  elevationScale: number;
  minDistance: number;
  noiseMin: number;
  noiseRadius: number;
  position: VectorCoordinates;
  radius: number;
  seed: string;
  tries: number;
}

export interface PlanetTile {
  center: VectorCoordinates;
  polygon: VectorCoordinates[];
}

export interface PlanetTilePoint {
  coordinates: VectorCoordinates;
  noise: number;
}

export interface PlanetTileProps {
  key: string;
  biome: Color;
  center: PlanetTilePoint;
  polygon: PlanetTilePoint[];
}
