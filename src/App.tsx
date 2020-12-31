import React, { FC, useEffect } from "react";
import { Canvas, useThree } from "react-three-fiber";
import Planet from "./components/Planet";
import ControlsProvider from "./contexts/controls/Provider";
import useSettings, { Settings } from "./contexts/settings";
import SettingsProvider from "./contexts/settings/Provider";

export const AppScene: FC = () => {
  const settings = useSettings();
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 0, -settings.planet.radius * 2);
  }, [camera.position, settings.planet.radius]);

  return (
    <ControlsProvider>
      <pointLight
        position={[
          -settings.planet.radius,
          -settings.planet.radius,
          -settings.planet.radius,
        ]}
      />
      <Planet settings={settings.planet} />
    </ControlsProvider>
  );
};

const AppCanvas: FC = () => {
  const settings = useSettings();
  return (
    <Canvas className="AppCanvas">
      <Settings.Provider value={settings}>
        <AppScene />
      </Settings.Provider>
    </Canvas>
  );
};

const App: FC = () => {
  return (
    <SettingsProvider>
      <AppCanvas />
    </SettingsProvider>
  );
};

export default App;
