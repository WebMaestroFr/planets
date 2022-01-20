import { useCallback, useMemo } from "react";
import SimplexNoise from "simplex-noise";
import { PlanetSettings, VectorCoordinates } from "./planet";

export default function useNoise(
  seed: PlanetSettings["seed"],
  layers: { scale: number; weight: number }[]
) {
  const simplex = useMemo(() => new SimplexNoise(seed), [seed]);
  const weightSum = useMemo(
    () => layers.reduce((sum, { weight }) => sum + weight, 0),
    [layers]
  );
  return useCallback(
    ([x, y, z]: VectorCoordinates) => {
      return layers.reduce(
        (noise, { scale, weight }) =>
          noise +
          simplex.noise3D(x * scale, y * scale, z * scale) *
            (weight / weightSum),
        0
      );
    },
    [layers, simplex, weightSum]
  );
}
