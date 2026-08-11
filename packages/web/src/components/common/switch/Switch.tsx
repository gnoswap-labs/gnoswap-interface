import React from "react";
import { SwitchWrapper, SwitchLabel, SwitchInput } from "./Switch.styles";

interface SwitchProps {
  checked: boolean;
  onChange: () => void;
  hasLabel?: boolean;
  labelText?: string;
  labelExtra?: React.ReactNode;
  disabled?: boolean;
  id?: string;
}

const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  hasLabel = false,
  labelText = "Hide zero balances",
  labelExtra,
  disabled = false,
  id = "switch",
}) => {
  return (
    <>
      {hasLabel ? (
        <SwitchWrapper className="switch-button">
          <SwitchLabel htmlFor={id}>{labelText}</SwitchLabel>
          {labelExtra}
          <SwitchInput type="checkbox" id={id} checked={checked} onChange={onChange} disabled={disabled} />
        </SwitchWrapper>
      ) : (
        <SwitchInput type="checkbox" checked={checked} onChange={onChange} disabled={disabled} />
      )}
    </>
  );
};

export default Switch;
