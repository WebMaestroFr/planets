import React, { FC, useCallback, useMemo } from "react";
import { GroupProps } from "@react-three/fiber";
import { PlanetContext, usePlanet } from "../../contexts/planet";
import useBiomes from "../../contexts/planet/biomes";
import useNoise from "../../contexts/planet/noise";
import {
  PlanetProps,
  PlanetTileProps,
  VectorCoordinates,
} from "../../contexts/planet/planet";
import { useTiles } from "../../contexts/planet/tiles";
import Tile from "./Tile";

export const PlanetComponent: FC<GroupProps> = (props) => {
  const { minDistance, noiseMin, noiseRadius, seed, tries } = usePlanet();
  const tiles = useTiles(seed, minDistance, tries);

  const noiseLayers = useMemo(
    () => [
      { scale: noiseRadius, weight: 1 },
      { scale: noiseRadius * 2, weight: 1 / 2 },
      { scale: noiseRadius * 4, weight: 1 / 4 },
      { scale: noiseRadius * 8, weight: 1 / 8 },
    ],
    [noiseRadius]
  );
  const getNoise = useNoise(seed, noiseLayers);
  const getBiome = useBiomes(noiseMin);

  const getTilePoint = useCallback(
    (coordinates: VectorCoordinates) => ({
      coordinates,
      noise: getNoise(coordinates),
    }),
    [getNoise]
  );

  const tilesProps = useMemo<PlanetTileProps[]>(() => {
    const timeKey = Date.now().toString();
    return tiles.map(({ center, polygon }, index) => {
      const centerPoint = getTilePoint(center);
      return {
        biome: getBiome(centerPoint),
        center: centerPoint,
        key: `${timeKey}-${index}`,
        polygon: polygon.map(getTilePoint),
      };
    });
  }, [getBiome, getTilePoint, tiles]);

  return (
    <group name="Planet" {...props}>
      {tilesProps.map(({ key, ...tileProps }) => (
        <Tile key={key} {...tileProps} />
      ))}
    </group>
  );
};

export const Planet: FC<PlanetProps> = ({ settings }) => {
  return (
    <PlanetContext.Provider value={settings}>
      <PlanetComponent />
    </PlanetContext.Provider>
  );
};

export default Planet;
