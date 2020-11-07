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
            min={0}
            onValueChange={onValueChange("radius")}
            value={planet.radius}
          />
        </FormGroup>
        <FormGroup
          className="Settings-minDistance"
          label="Sampling Minimum Distance"
        >
          <NumericInput
            fill={true}
            min={0.01}
            minorStepSize={null}
            onValueChange={onValueChange("minDistance")}
            stepSize={0.01}
            value={planet.minDistance}
          />
        </FormGroup>
        <FormGroup className="Settings-tries" label="Sampling tries">
          <NumericInput
            fill={true}
            min={2}
            minorStepSize={null}
            onValueChange={onValueChange("tries")}
            value={planet.tries}
          />
        </FormGroup>
        <FormGroup className="Settings-noiseRadius" label="Noise Radius">
          <NumericInput
            fill={true}
            min={0}
            minorStepSize={null}
            onValueChange={onValueChange("noiseRadius")}
            stepSize={0.1}
            value={planet.noiseRadius}
          />
        </FormGroup>
        <FormGroup className="Settings-noiseMin" label="Minimum Noise">
          <Slider
            labelStepSize={0.5}
            max={1}
            min={-1}
            onChange={onValueChange("noiseMin")}
            stepSize={0.1}
            value={planet.noiseMin}
          />
        </FormGroup>
        <FormGroup
          className="Settings-elevationOffset"
          label="Elevation Offset"
        >
          <Slider
            labelStepSize={0.25}
            max={1}
            min={0}
            onChange={onValueChange("elevationOffset")}
            stepSize={0.01}
            value={planet.elevationOffset}
          />
        </FormGroup>
        <FormGroup className="Settings-elevationScale" label="Elevation Scale">
          <NumericInput
            fill={true}
            min={0}
            minorStepSize={null}
            onValueChange={onValueChange("elevationScale")}
            value={planet.elevationScale}
          />
        </FormGroup>
      </form>
    </Settings.Provider>
  );
};

export default SettingsProvider;
