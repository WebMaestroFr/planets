import React, { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { FormGroup, InputGroup } from "@blueprintjs/core";
import { defaultSettings, Settings } from "./index";
import { SettingsContext, SettingsProps } from "./settings";

export const SettingsProvider: FC<SettingsProps> = ({ children, ...props }) => {
  const [planet, setPlanet] = useState<SettingsContext["planet"]>(
    defaultSettings["planet"]
  );
  const { handleSubmit, register, errors } = useForm<
    SettingsContext["planet"]
  >();
  const onSubmit = handleSubmit((nextSettings) =>
    setPlanet((prevSettings) => ({ ...prevSettings, ...nextSettings }))
  );

  return (
    <Settings.Provider value={{ planet }}>
      {children}
      <form className="Settings" {...props}>
        <FormGroup
          className="Settings-seed"
          helperText={errors.seed && errors.seed.message}
          label="Seed"
          labelFor="seed"
        >
          <InputGroup
            defaultValue={planet.seed}
            id="seed"
            name="seed"
            onChange={onSubmit}
            inputRef={register}
          />
        </FormGroup>
      </form>
    </Settings.Provider>
  );
};

export default SettingsProvider;
