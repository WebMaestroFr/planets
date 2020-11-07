import React, { FC } from "react";
import { Canvas } from "react-three-fiber";
import Planet from "./components/Planet";
import ControlsProvider from "./contexts/controls/Provider";
import useSettings, { Settings } from "./contexts/settings";
import SettingsProvider from "./contexts/settings/Provider";

const Scene: FC = () => {
  const settings = useSettings();
  return (
    <Canvas className="Scene">
      <Settings.Provider value={settings}>
        <ambientLight />
        <ControlsProvider>
          <pointLight position={[16, 16, 16]} />
          <Planet />
        </ControlsProvider>
      </Settings.Provider>
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
