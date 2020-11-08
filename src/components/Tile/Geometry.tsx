import React, { FC, useCallback, useMemo } from "react";
import { useUpdate } from "react-three-fiber";
import { ConeGeometry, Vector3 } from "three";
import { getTile } from "../../objects/planet";
import {
  PlanetSettings,
  PlanetTilePoint,
  PlanetTilePolygon,
} from "../../objects/planet/planet";

const TileGeometry: FC<{
  center: PlanetTilePoint;
  polygon: PlanetTilePoint[];
  settings: PlanetSettings;
}> = ({ center, polygon, settings, ...props }) => {
  const polygonNoises = useMemo(() => polygon.map((point) => point.noise), [
    polygon,
  ]);

  const polygonPositions = useMemo(
    () => polygon.map((point) => point.position),
    [polygon]
  );

  const applyNoise = useCallback(
    (vertex: Vector3, noise: number) => {
      const elevation =
        settings.radius +
        Math.max(settings.noiseMin, noise) * settings.elevationScale;
      vertex.setLength(elevation);
      return elevation;
    },
    [settings.elevationScale, settings.noiseMin, settings.radius]
  );

  const getElevationNoise = useCallback(
    (noise: number) =>
      center.noise * settings.elevationOffset +
      noise * (1 - settings.elevationOffset),
    [center.noise, settings.elevationOffset]
  );

  const applyElevation = useCallback(
    (tile: PlanetTilePolygon) => {
      const centerElevation = applyNoise(tile.center, center.noise);
      if (center.noise <= settings.noiseMin) {
        for (let index = 0; index < tile.polygon.length; index++) {
          tile.polygon[index].setLength(centerElevation);
        }
      } else {
        for (let index = 0; index < tile.polygon.length; index++) {
          const elevationNoise = getElevationNoise(polygonNoises[index]);
          applyNoise(tile.polygon[index], elevationNoise);
        }
      }
    },
    [
      applyNoise,
      center.noise,
      getElevationNoise,
      polygonNoises,
      settings.noiseMin,
    ]
  );

  const applyPolygon = useCallback(
    (tile: PlanetTilePolygon) => {
      tile.origin.set(0, 0, 0);
      tile.center.copy(center.position);
      for (let index = 0; index < tile.polygon.length; index++) {
        tile.polygon[index].copy(polygonPositions[index]);
      }
    },
    [center.position, polygonPositions]
  );

  const ref = useUpdate<ConeGeometry>(
    ({ vertices }) => {
      const tile = getTile(vertices);
      applyPolygon(tile);
      applyElevation(tile);
    },
    [applyElevation, applyPolygon]
  );

  return (
    <coneGeometry
      args={[1, 1, polygon.length]}
      name="TileGeometry"
      ref={ref}
      {...props}
    />
  );
};

export default TileGeometry;
