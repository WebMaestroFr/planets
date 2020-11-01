import React, { ChangeEvent, FC, useState } from "react";
import { FormGroup, InputGroup, NumericInput, Slider } from "@blueprintjs/core";
import { defaultSettings, Settings } from "./index";
import { SettingsContext, SettingsProps } from "./settings";

export const SettingsProvider: FC<SettingsProps> = ({ children }) => {
  const [planet, setPlanet] = useState<SettingsContext["planet"]>(
    defaultSettings["planet"]
  );
  const onChange = (key: string) => ({
    currentTarget: { value },
  }: ChangeEvent<HTMLInputElement>) =>
    setPlanet((prevSettings) => ({ ...prevSettings, [key]: value }));
  // const onRangeChange = (keyMin: string, keyMax: string) => ([
  //   valueMin,
  //   valueMax,
  // ]: [number, number]) =>
  //   setPlanet((prevSettings) => ({
  //     ...prevSettings,
  //     [keyMax]: valueMax,
  //     [keyMin]: valueMin,
  //   }));
  const onValueChange = (key: string) => (value: number) =>
    setPlanet((prevSettings) => ({ ...prevSettings, [key]: value }));

  return (
    <Settings.Provider value={{ planet }}>
      {children}
      <form className="Settings">
        <FormGroup className="Settings-seed" label="Seed">
          <InputGroup
            defaultValue={planet.seed}
            fill={true}
            onChange={onChange("seed")}
          />
        </FormGroup>
        <FormGroup className="Settings-radius" label="Radius">
          <NumericInput
            fill={true}
            min={0.1}
            minorStepSize={null}
            onValueChange={onValueChange("radius")}
            stepSize={0.1}
            value={planet.radius}
          />
        </FormGroup>
        <FormGroup
          className="Settings-minDistance"
          label="Sampling Minimum Distance"
        >
          <Slider
            labelStepSize={0.02}
            max={0.08}
            min={0.02}
            onChange={onValueChange("minDistance")}
            stepSize={0.01}
            value={planet.minDistance}
          />
        </FormGroup>
        <FormGroup className="Settings-distance" label="Noise Distance">
          <NumericInput
            fill={true}
            minorStepSize={null}
            onValueChange={onValueChange("distance")}
            stepSize={0.1}
            value={planet.distance}
          />
        </FormGroup>
        <FormGroup className="Settings-scale" label="Noise Scale">
          <Slider
            labelStepSize={0.8}
            max={2.6}
            min={0.2}
            onChange={onValueChange("scale")}
            stepSize={0.1}
            value={planet.scale}
          />
        </FormGroup>
      </form>
    </Settings.Provider>
  );
};

export default SettingsProvider;
