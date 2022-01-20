import React, {
  ChangeEvent,
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
} from "react";
import { FormGroup, InputGroup, NumericInput, Slider } from "@blueprintjs/core";
import { PlanetSettings } from "../../contexts/planet/planet";

type ValidationParams = { min?: number; max?: number; step?: number };
export const validateNumberInput = (
  value: number,
  { min, max, step }: ValidationParams
) => {
  if (min && (value < min || isNaN(value))) {
    return min;
  } else if (max && (value > max || isNaN(value))) {
    return max;
  } else if (isNaN(value)) {
    return 0;
  } else if (step && value % step !== 0) {
    const factor = Math.round(value / step);
    return factor * step;
  }
  return value;
};

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
    (key: string) =>
      ({ currentTarget: { value } }: ChangeEvent<HTMLInputElement>) => {
        onUpdate((prevSettings) => ({ ...prevSettings, [key]: value }));
      },
    [onUpdate]
  );
  const handleValueChange = useCallback(
    (key: string, validation: ValidationParams) => (input: number) => {
      const value = validateNumberInput(input, validation);
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
          onValueChange={handleValueChange("radius", { min: 0 })}
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
          onValueChange={handleValueChange("minDistance", { min: 0.01 })}
          stepSize={0.01}
          value={minDistance}
        />
      </FormGroup>
      <FormGroup className="PlanetForm-tries" label="Sampling tries">
        <NumericInput
          fill={true}
          min={2}
          minorStepSize={null}
          onValueChange={handleValueChange("tries", { min: 2 })}
          value={tries}
        />
      </FormGroup>
      <FormGroup className="PlanetForm-noiseRadius" label="Noise Radius">
        <NumericInput
          fill={true}
          min={0}
          minorStepSize={null}
          onValueChange={handleValueChange("noiseRadius", { min: 0 })}
          stepSize={0.1}
          value={noiseRadius}
        />
      </FormGroup>
      <FormGroup className="PlanetForm-noiseMin" label="Sea Level">
        <Slider
          labelStepSize={0.5}
          max={1}
          min={-1}
          onChange={handleValueChange("noiseMin", { min: -1, max: 1 })}
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
          onChange={handleValueChange("elevationOffset", { min: 0, max: 1 })}
          stepSize={0.01}
          value={elevationOffset}
        />
      </FormGroup>
      <FormGroup className="PlanetForm-elevationScale" label="Elevation Scale">
        <NumericInput
          fill={true}
          min={0}
          minorStepSize={null}
          onValueChange={handleValueChange("elevationScale", { min: 0 })}
          stepSize={0.1}
          value={elevationScale}
        />
      </FormGroup>
    </form>
  );
};

export default PlanetForm;
