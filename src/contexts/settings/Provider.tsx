import React, { ChangeEvent, FC, useState } from "react";
import {
  ControlGroup,
  FormGroup,
  InputGroup,
  NumericInput,
  Slider,
} from "@blueprintjs/core";
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
        <FormGroup className="Settings-tries" label="Sampling tries">
          <Slider
            labelStepSize={8}
            max={24}
            min={0}
            onChange={onValueChange("tries")}
            stepSize={1}
            value={planet.tries}
          />
        </FormGroup>
        <FormGroup className="Settings-noiseRadius" label="Noise Radius">
          <Slider
            labelStepSize={0.8}
            max={3.4}
            min={0.2}
            onChange={onValueChange("noiseRadius")}
            stepSize={0.01}
            value={planet.noiseRadius}
          />
        </FormGroup>
        <FormGroup className="Settings-noiseDistance" label="Noise Distance">
          <ControlGroup fill={true} vertical={false}>
            <NumericInput
              fill={true}
              onValueChange={onValueChange("noiseDistanceX")}
              stepSize={0.1}
              value={planet.noiseDistanceX}
            />
            <NumericInput
              fill={true}
              onValueChange={onValueChange("noiseDistanceY")}
              stepSize={0.1}
              value={planet.noiseDistanceY}
            />
            <NumericInput
              fill={true}
              onValueChange={onValueChange("noiseDistanceZ")}
              stepSize={0.1}
              value={planet.noiseDistanceZ}
            />
          </ControlGroup>
        </FormGroup>
        <FormGroup className="Settings-noiseScale" label="Noise Scale">
          <ControlGroup fill={true} vertical={false}>
            <NumericInput
              fill={true}
              min={0.2}
              onValueChange={onValueChange("noiseScaleX")}
              stepSize={0.1}
              value={planet.noiseScaleX}
            />
            <NumericInput
              fill={true}
              min={0.2}
              onValueChange={onValueChange("noiseScaleY")}
              stepSize={0.1}
              value={planet.noiseScaleY}
            />
            <NumericInput
              fill={true}
              min={0.2}
              onValueChange={onValueChange("noiseScaleZ")}
              stepSize={0.1}
              value={planet.noiseScaleZ}
            />
          </ControlGroup>
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
