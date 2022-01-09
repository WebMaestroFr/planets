import { useCallback, useMemo } from "react";
import SimplexNoise from "simplex-noise";
import { PlanetSettings, VectorCoordinates } from "./planet";

export default function useNoise(
  seed: PlanetSettings["seed"],
  layers: { scalar: number; weight: number }[]
) {
  const simplex = useMemo(() => new SimplexNoise(seed), [seed]);
  const weightSum = useMemo(
    () => layers.reduce((sum, { weight }) => sum + weight, 0),
    [layers]
  );
  return useCallback(
    ([x, y, z]: VectorCoordinates) => {
      return layers.reduce(
        (noise, { scalar, weight }) =>
          noise +
          simplex.noise3D(x * scalar, y * scalar, z * scalar) *
            (weight / weightSum),
        0
      );
    },
    [layers, simplex, weightSum]
  );
}
