import React, { FC, useRef } from "react";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { ControlsContext } from "./index";
import { extend, useFrame, useThree } from "react-three-fiber";

extend({ OrbitControls });

export const ControlsProvider: FC = ({ children, ...props }) => {
  const ref = useRef<OrbitControls>();
  const { camera, gl } = useThree();

  useFrame(() => {
    if (ref && ref.current) {
      ref.current.update();
    }
  });

  return (
    <ControlsContext.Provider value={props}>
      <orbitControls args={[camera, gl.domElement]} ref={ref} />
      {children}
    </ControlsContext.Provider>
  );
};

export default ControlsProvider;
