import { createContext, useContext } from "react";
import { Color } from "three";
import { VectorCoordinates } from "../planet/planet";

export const BiomesContext = createContext<
  | {
      getColor: (
        center: VectorCoordinates,
        centerNoise: number
      ) => Color | undefined;
    }
  | undefined
>(undefined);

const useBiomes = () => useContext(BiomesContext);
export default useBiomes;
