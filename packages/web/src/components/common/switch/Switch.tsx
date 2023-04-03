import React from "react";
import { SwitchWrapper, SwitchLabel, SwitchInput } from "./Switch.styles";

interface SwitchProps {
  checked: boolean;
  onChange: () => void;
  hasLabel?: boolean;
  labelText?: string;
  disabled?: boolean;
}

const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  hasLabel = false,
  labelText = "Hide zero balances",
  disabled = false,
}) => {
  return (
    <>
      {hasLabel ? (
        <SwitchWrapper>
          <SwitchLabel htmlFor="switch">{labelText}</SwitchLabel>
          <SwitchInput
            type="checkbox"
            id="switch"
            checked={checked}
            onChange={onChange}
            disabled={disabled}
          />
        </SwitchWrapper>
      ) : (
        <SwitchInput
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
        />
      )}
    </>
  );
};

export default Switch;
