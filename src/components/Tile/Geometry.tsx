import React, { FC, useCallback, useMemo } from "react";
import { useUpdate } from "react-three-fiber";
import { ConeGeometry, Vector3 } from "three";
import { getTile, Tile } from ".";
import { PlanetTile } from "../../contexts/planet/planet";
import useSettings from "../../contexts/settings";

const TileGeometry: FC<PlanetTile> = ({ center, polygon, ...props }) => {
  const {
    elevationOffset,
    elevationScale,
    noiseMin,
    radius,
  } = useSettings().planet;

  const polygonNoises = useMemo(() => polygon.map((point) => point.noise), [
    polygon,
  ]);

  const polygonPositions = useMemo(
    () => polygon.map((point) => point.position),
    [polygon]
  );

  const applyNoise = useCallback(
    (vertex: Vector3, noise: number) => {
      const elevation = radius + Math.max(noiseMin, noise) * elevationScale;
      vertex.setLength(elevation);
      return elevation;
    },
    [elevationScale, noiseMin, radius]
  );

  const getElevationNoise = useCallback(
    (noise: number) =>
      center.noise * elevationOffset + noise * (1 - elevationOffset),
    [center.noise, elevationOffset]
  );

  const applyElevation = useCallback(
    (tile: Tile) => {
      const centerElevation = applyNoise(tile.center, center.noise);
      if (center.noise <= noiseMin) {
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
    [applyNoise, center.noise, noiseMin, polygonNoises]
  );

  const applyPolygon = useCallback(
    (tile: Tile) => {
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
