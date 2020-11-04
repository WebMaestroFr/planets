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
        <FormGroup className="Settings-noiseDistance" label="Noise Distance">
          <NumericInput
            fill={true}
            minorStepSize={null}
            onValueChange={onValueChange("noiseDistanceX")}
            stepSize={0.1}
            value={planet.noiseDistanceX}
          />
          <NumericInput
            fill={true}
            minorStepSize={null}
            onValueChange={onValueChange("noiseDistanceY")}
            stepSize={0.1}
            value={planet.noiseDistanceY}
          />
          <NumericInput
            fill={true}
            minorStepSize={null}
            onValueChange={onValueChange("noiseDistanceZ")}
            stepSize={0.1}
            value={planet.noiseDistanceZ}
          />
        </FormGroup>
        <FormGroup className="Settings-noiseScale" label="Noise Scale">
          <Slider
            labelStepSize={0.8}
            max={2.6}
            min={0.2}
            onChange={onValueChange("noiseScaleX")}
            stepSize={0.1}
            value={planet.noiseScaleX}
          />
          <Slider
            labelStepSize={0.8}
            max={2.6}
            min={0.2}
            onChange={onValueChange("noiseScaleY")}
            stepSize={0.1}
            value={planet.noiseScaleY}
          />
          <Slider
            labelStepSize={0.8}
            max={2.6}
            min={0.2}
            onChange={onValueChange("noiseScaleZ")}
            stepSize={0.1}
            value={planet.noiseScaleZ}
          />
        </FormGroup>
        <FormGroup className="Settings-elevationScale" label="Elevation Scale">
          <Slider
            labelStepSize={0.25}
            max={0.5}
            min={0}
            onChange={onValueChange("elevationScale")}
            stepSize={0.01}
            value={planet.elevationScale}
          />
        </FormGroup>
      </form>
    </Settings.Provider>
  );
};

export default SettingsProvider;
