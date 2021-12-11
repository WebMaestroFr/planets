import React, {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { DEFAULT_SETTINGS, Settings } from "./index";
import PlanetForm from "../../components/Planet/Form";
import { PlanetSettings } from "../../objects/planet/planet";

function useDebounce<T>(
  initialValue: T,
  time: number
): [T, T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(initialValue);
  const [debouncedValue, setDebouncedValue] = useState<T>(initialValue);

  useEffect(() => {
    const debounce = setTimeout(() => {
      setDebouncedValue(value);
    }, time);
    return () => {
      clearTimeout(debounce);
    };
  }, [value, time]);

  return [debouncedValue, value, setValue];
}

export const SettingsProvider: FC = ({ children, ...props }) => {
  const [debouncedPlanet, planet, setPlanet] = useDebounce<PlanetSettings>(
    DEFAULT_SETTINGS["planet"],
    400
  );

  return (
    <Settings.Provider value={{ planet: debouncedPlanet }} {...props}>
      {children}
      <div className="Settings">
        <PlanetForm onUpdate={setPlanet} settings={planet} />
      </div>
    </Settings.Provider>
  );
};

export default SettingsProvider;
