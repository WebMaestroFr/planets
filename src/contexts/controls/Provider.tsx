import React, { FC, useEffect, useRef } from "react";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Controls } from "./index";
import { ControlsProps } from "./controls";
import { extend, useFrame, useThree } from "react-three-fiber";

extend({ OrbitControls });

export const ControlsProvider: FC<ControlsProps> = ({ children, ...props }) => {
  const ref = useRef<OrbitControls>();
  const { camera, gl } = useThree();

  useFrame(() => {
    if (ref && ref.current) {
      ref.current.update();
    }
  });

  useEffect(() => {
    camera.position.set(0, 0, 2);
  }, [camera]);

  return (
    <Controls.Provider value={props}>
      <orbitControls args={[camera, gl.domElement]} ref={ref} />
      {children}
    </Controls.Provider>
  );
};

export default ControlsProvider;
