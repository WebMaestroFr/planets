import React, {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { defaultSettings, Settings } from "./index";
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

export const SettingsProvider: FC = ({ children }) => {
  const [debouncedPlanet, planet, setPlanet] = useDebounce<PlanetSettings>(
    defaultSettings["planet"],
    400
  );

  return (
    <Settings.Provider value={{ planet: debouncedPlanet }}>
      {children}
      <div className="Settings">
        <PlanetForm onUpdate={setPlanet} settings={planet} />
      </div>
    </Settings.Provider>
  );
};

export default SettingsProvider;
