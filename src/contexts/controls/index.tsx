import { createContext, useContext } from "react";

export const ControlsContext = createContext({});

const useControls = () => useContext(ControlsContext);
export default useControls;
