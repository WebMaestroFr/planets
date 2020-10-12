import React, { FC } from "react";
import { Canvas } from "react-three-fiber";
import Planet from "./components/Planet";

const App: FC = () => {
  return (
    <Canvas>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Planet radius={1} resolution={128} seed="mona" />
    </Canvas>
  );
};

export default App;
