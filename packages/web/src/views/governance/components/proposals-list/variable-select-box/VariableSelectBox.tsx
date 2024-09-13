import IconArrowDown from "@components/common/icons/IconArrowDown";
import IconArrowUp from "@components/common/icons/IconArrowUp";
import React, { useCallback, useMemo, useState } from "react";
import { VariableSelectBoxWrapper } from "./VariableSelectBox.styles";

export interface VariableSelectBoxProps {
  items: {
    displayValue: string;
    value: string;
  }[];
  currentItem: {
    displayValue: string;
    value: string;
  } | null;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const VariableSelectBox: React.FC<VariableSelectBoxProps> = ({
  items,
  currentItem,
  placeholder,
  disabled,
  onChange,
}) => {
  const [opened, setOpened] = useState(false);

  const displayText = useMemo(() => {
    if (!currentItem) {
      return placeholder || "";
    }

    return currentItem.displayValue;
  }, [currentItem, placeholder]);

  const toggleOpenSelectBox = useCallback(() => {
    if (disabled === true) {
      return;
    }
    setOpened(prev => !prev);
  }, [disabled]);

  const selectItem = useCallback(
    (value: string) => {
      setOpened(false);
      onChange(value);
    },
    [onChange],
  );

  return (
    <VariableSelectBoxWrapper className={disabled ? "disabled" : ""}>
      <div className="selected-item-wrapper" onClick={toggleOpenSelectBox}>
        <span className="display-text">{displayText}</span>
        {opened ? (
          <IconArrowUp className="icon-arrow" />
        ) : (
          <IconArrowDown className="icon-arrow" />
        )}
      </div>

      {opened && (
        <div className="select-list-wrapper">
          <div className="select-list">
            {items.map((item, index) => (
              <span
                key={index}
                className="display-value"
                onClick={() => selectItem(item.value)}
              >
                {item.displayValue}
              </span>
            ))}
          </div>
        </div>
      )}
    </VariableSelectBoxWrapper>
  );
};

export default VariableSelectBox;
