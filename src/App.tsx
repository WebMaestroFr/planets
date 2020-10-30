import React, { FC } from "react";
import { Canvas } from "react-three-fiber";
import Planet from "./components/Planet";
import ControlsProvider from "./contexts/controls/Provider";

const App: FC = () => {
  return (
    <Canvas>
      <ambientLight />
      <ControlsProvider>
        <pointLight position={[10, 10, 10]} />
        <Planet position={[0, 0, 0]} />
      </ControlsProvider>
    </Canvas>
  );
};

export default App;
