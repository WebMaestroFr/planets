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
  const onChange = useCallback(
    (key: string) => ({
      currentTarget: { value },
    }: ChangeEvent<HTMLInputElement>) =>
      onUpdate((prevSettings) => ({ ...prevSettings, [key]: value })),
    [onUpdate]
  );
  const onValueChange = useCallback(
    (key: string) => (value: number) =>
      onUpdate((prevSettings) => ({ ...prevSettings, [key]: value })),
    [onUpdate]
  );
  return (
    <form className="PlanetForm">
      <FormGroup className="PlanetForm-seed" label="Seed">
        <InputGroup
          defaultValue={seed}
          fill={true}
          onChange={onChange("seed")}
        />
      </FormGroup>
      <FormGroup className="PlanetForm-radius" label="Radius">
        <NumericInput
          fill={true}
          min={0}
          onValueChange={onValueChange("radius")}
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
          onValueChange={onValueChange("minDistance")}
          stepSize={0.01}
          value={minDistance}
        />
      </FormGroup>
      <FormGroup className="PlanetForm-tries" label="Sampling tries">
        <NumericInput
          fill={true}
          min={2}
          minorStepSize={null}
          onValueChange={onValueChange("tries")}
          value={tries}
        />
      </FormGroup>
      <FormGroup className="PlanetForm-noiseRadius" label="Noise Radius">
        <NumericInput
          fill={true}
          min={0}
          minorStepSize={null}
          onValueChange={onValueChange("noiseRadius")}
          stepSize={0.1}
          value={noiseRadius}
        />
      </FormGroup>
      <FormGroup className="PlanetForm-noiseMin" label="Minimum Noise">
        <Slider
          labelStepSize={0.5}
          max={1}
          min={-1}
          onChange={onValueChange("noiseMin")}
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
          onChange={onValueChange("elevationOffset")}
          stepSize={0.01}
          value={elevationOffset}
        />
      </FormGroup>
      <FormGroup className="PlanetForm-elevationScale" label="Elevation Scale">
        <NumericInput
          fill={true}
          min={0}
          minorStepSize={null}
          onValueChange={onValueChange("elevationScale")}
          stepSize={0.1}
          value={elevationScale}
        />
      </FormGroup>
    </form>
  );
};

export default PlanetForm;
