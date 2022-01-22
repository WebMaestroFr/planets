import React, { FC, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import Planet from "./components/Planet";
import ControlsProvider from "./contexts/controls/Provider";
import useSettings, { SettingsContext } from "./contexts/settings";
import SettingsProvider from "./contexts/settings/Provider";

export const AppScene: FC = () => {
  const settings = useSettings();
  const camera = useThree((state) => state.camera);

  useEffect(() => {
    camera.position.set(0, 0, -settings.planet.radius * 2);
  }, [camera.position, settings.planet.radius]);

  return (
    <ControlsProvider>
      <directionalLight
        intensity={0.67}
        position={[-settings.planet.radius, settings.planet.radius, 0]}
      />
      <ambientLight intensity={0.33} />
      <Planet settings={settings.planet} />
    </ControlsProvider>
  );
};

const AppCanvas: FC = () => {
  const settings = useSettings();
  return (
    <Canvas className="AppCanvas">
      <SettingsContext.Provider value={settings}>
        <AppScene />
      </SettingsContext.Provider>
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
