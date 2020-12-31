import { createContext, useContext } from "react";
import { ControlsContext } from "./controls";

export const Controls = createContext<ControlsContext | null>(null);

const useControls = () => useContext(Controls) as ControlsContext;
export default useControls;
