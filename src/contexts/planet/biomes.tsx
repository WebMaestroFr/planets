import { useCallback, useEffect, useMemo, useState } from "react";
import { Color, MathUtils } from "three";
import biomesSrc from "../../assets/biomes.png";
import { PlanetTilePoint } from "./planet";

export default function useBiomes(noiseMin: number) {
  const [context, setContext] = useState<CanvasRenderingContext2D | undefined>(
    undefined
  );
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  useEffect(() => {
    const canvas = document.createElement("canvas");
    const bitmap = new Image();
    bitmap.src = biomesSrc;
    bitmap.onload = () => {
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      setWidth(bitmap.width);
      setHeight(bitmap.height);
      const nextContext = canvas.getContext("2d");
      if (nextContext) {
        nextContext.drawImage(bitmap, 0, 0);
        setContext(nextContext);
      }
    };
  }, []);
  const oceanColor = useMemo(
    () => new Color(70 / 255, 130 / 255, 180 / 255),
    []
  );
  const biomesColors = useMemo(() => {
    if (context) {
      const colors: Color[][] = [];
      for (let sx = 0; sx < width; sx += 1) {
        colors[sx] = [];
        for (let sy = 0; sy < height; sy += 1) {
          const { data } = context.getImageData(sx, sy, 1, 1);
          colors[sx][sy] = new Color(
            data[0] / 255,
            data[1] / 255,
            data[2] / 255
          );
        }
      }
      return colors;
    }
    return undefined;
  }, [context, width, height]);

  return useCallback(
    ({ coordinates, noise }: PlanetTilePoint) => {
      if (noise <= noiseMin) {
        return oceanColor;
      }
      const phi = Math.acos(MathUtils.clamp(coordinates[1], -1, 1));
      const u = (Math.abs(phi - Math.PI / 2) / Math.PI) * 2;
      const vNoise = (noise + 1) / 2;
      const vMin = (noiseMin + 1) / 2;
      const v = 1 - (vNoise - vMin) / (1 - vMin);
      const sx = Math.floor(u * width);
      const sy = Math.floor(v * height);
      return (
        (biomesColors && biomesColors[sx] && biomesColors[sx][sy]) || oceanColor
      );
    },
    [biomesColors, oceanColor, noiseMin, width, height]
  );
}
