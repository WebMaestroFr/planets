import React, { FC, useEffect, useRef, useState } from "react";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Controls } from "./index";
import { ControlsProps } from "./controls";
import { extend, useFrame, useThree } from "react-three-fiber";

extend({ OrbitControls });

export const ControlsProvider: FC<ControlsProps> = ({ children, ...props }) => {
  const [loading, setLoading] = useState<boolean>(true);

  const ref = useRef<OrbitControls>();
  const { camera, gl } = useThree();

  useFrame(() => {
    if (ref && ref.current) {
      ref.current.update();
    }
  });

  useEffect(() => {
    setLoading(false);
  }, []);

  return loading ? null : (
    <Controls.Provider value={{}}>
      <orbitControls args={[camera, gl.domElement]} ref={ref} {...props} />
      {children}
    </Controls.Provider>
  );
};

export default ControlsProvider;
