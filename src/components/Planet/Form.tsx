import React, {
  ChangeEvent,
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
} from "react";
import { FormGroup, InputGroup, NumericInput, Slider } from "@blueprintjs/core";
import { PlanetSettings } from "../../objects/planet/planet";

export const PlanetForm: FC<{
  onUpdate: Dispatch<SetStateAction<PlanetSettings>>;
  settings: PlanetSettings;
}> = ({
  onUpdate,
  settings: {
    elevationOffset,
    elevationScale,
    minDistance,
    noiseMin,
    noiseRadius,
    radius,
    seed,
    tries,
  },
}) => {
  const handleChange = useCallback(
    (key: string) => ({
      currentTarget: { value },
    }: ChangeEvent<HTMLInputElement>) => {
      onUpdate((prevSettings) => ({ ...prevSettings, [key]: value }));
    },
    [onUpdate]
  );
  const handleValueChange = useCallback(
    (key: string) => (value: number) => {
      onUpdate((prevSettings) => ({ ...prevSettings, [key]: value }));
    },
    [onUpdate]
  );
  return (
    <form className="PlanetForm">
      <FormGroup className="PlanetForm-seed" label="Seed">
        <InputGroup
          defaultValue={seed}
          fill={true}
          onChange={handleChange("seed")}
        />
      </FormGroup>
      <FormGroup className="PlanetForm-radius" label="Radius">
        <NumericInput
          fill={true}
          min={0}
          onValueChange={handleValueChange("radius")}
          value={radius}
        />
      </FormGroup>
      <FormGroup
        className="PlanetForm-minDistance"
        label="Sampling Minimum Distance"
      >
        <NumericInput
          fill={true}
          min={0.01}
          minorStepSize={null}
          onValueChange={handleValueChange("minDistance")}
          stepSize={0.01}
          value={minDistance}
        />
      </FormGroup>
      <FormGroup className="PlanetForm-tries" label="Sampling tries">
        <NumericInput
          fill={true}
          min={2}
          minorStepSize={null}
          onValueChange={handleValueChange("tries")}
          value={tries}
        />
      </FormGroup>
      <FormGroup className="PlanetForm-noiseRadius" label="Noise Radius">
        <NumericInput
          fill={true}
          min={0}
          minorStepSize={null}
          onValueChange={handleValueChange("noiseRadius")}
          stepSize={0.1}
          value={noiseRadius}
        />
      </FormGroup>
      <FormGroup className="PlanetForm-noiseMin" label="Minimum Noise">
        <Slider
          labelStepSize={0.5}
          max={1}
          min={-1}
          onChange={handleValueChange("noiseMin")}
          stepSize={0.1}
          value={noiseMin}
        />
      </FormGroup>
      <FormGroup
        className="PlanetForm-elevationOffset"
        label="Elevation Offset"
      >
        <Slider
          labelStepSize={0.25}
          max={1}
          min={0}
          onChange={handleValueChange("elevationOffset")}
          stepSize={0.01}
          value={elevationOffset}
        />
      </FormGroup>
      <FormGroup className="PlanetForm-elevationScale" label="Elevation Scale">
        <NumericInput
          fill={true}
          min={0}
          minorStepSize={null}
          onValueChange={handleValueChange("elevationScale")}
          stepSize={0.1}
          value={elevationScale}
        />
      </FormGroup>
    </form>
  );
};

export default PlanetForm;
