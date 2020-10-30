import { createContext, useContext } from "react";
import { ControlsContext } from "./controls";

export const Controls = createContext<ControlsContext | null>(null);

export default () => useContext(Controls) as ControlsContext;
