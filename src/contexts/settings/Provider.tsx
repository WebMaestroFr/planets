import React, {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import PlanetForm from "../../components/Planet/Form";
import { PlanetSettings } from "../planet/planet";
import { DEFAULT_PLANET } from "../planet";
import { SettingsContext } from "./index";

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
    DEFAULT_PLANET,
    400
  );

  return (
    <SettingsContext.Provider value={{ planet: debouncedPlanet }} {...props}>
      {children}
      <div className="Settings">
        <PlanetForm onUpdate={setPlanet} settings={planet} />
      </div>
    </SettingsContext.Provider>
  );
};

export default SettingsProvider;
