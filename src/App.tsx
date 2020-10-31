import React, { FC } from "react";
import { Canvas } from "react-three-fiber";
import Planet from "./components/Planet";
import ControlsProvider from "./contexts/controls/Provider";
import useSettings from "./contexts/settings";
import SettingsProvider from "./contexts/settings/Provider";

const Scene: FC = () => {
  const settings = useSettings();
  return (
    <Canvas className="Scene">
      <ambientLight />
      <ControlsProvider>
        <pointLight position={[10, 10, 10]} />
        <Planet settings={settings.planet} />
      </ControlsProvider>
    </Canvas>
  );
};

const App: FC = () => {
  return (
    <SettingsProvider>
      <Scene />
    </SettingsProvider>
  );
};

export default App;
