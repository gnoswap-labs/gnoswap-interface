import React from "react";
import { SwitchWrapper, SwitchLabel, SwitchInput } from "./Switch.styles";

interface SwitchProps {
  checked: boolean;
  onChange: () => void;
  hasLabel?: boolean;
  labelText?: string;
}

const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  hasLabel = false,
  labelText = "Hide zero balances",
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
          />
        </SwitchWrapper>
      ) : (
        <SwitchInput type="checkbox" checked={checked} onChange={onChange} />
      )}
    </>
  );
};

export default Switch;
