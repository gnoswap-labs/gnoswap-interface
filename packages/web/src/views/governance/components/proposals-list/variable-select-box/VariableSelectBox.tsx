
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ReactDOM from "react-dom";

import IconArrowDown from "@components/common/icons/IconArrowDown";
import IconArrowUp from "@components/common/icons/IconArrowUp";

import {
  VariableSelectBoxWrapper,
  VariableSelectOptionsWrapper,
} from "./VariableSelectBox.styles";

export interface VariableSelectBoxProps {
  modalBodyRef?: React.RefObject<HTMLDivElement>;
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
  errorText?: string;
  disabled?: boolean;
}

const VariableSelectBox: React.FC<VariableSelectBoxProps> = ({
  modalBodyRef,
  items,
  currentItem,
  placeholder,
  disabled,
  errorText,
  onChange,
}) => {
  const selectRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef(null);
  const [opened, setOpened] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({
    width: 0,
    top: 0,
    left: 0,
  });

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

  const renderSelectOptions = () => {
    const portalElement = document?.getElementById("portal-dropdown");
    if (!portalElement) {
      return <React.Fragment />;
    }

    return ReactDOM.createPortal(
      <VariableSelectOptionsWrapper
        ref={dropdownRef}
        width={dropdownPosition.width}
        top={dropdownPosition.top}
        left={dropdownPosition.left}
      >
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
      </VariableSelectOptionsWrapper>,
      portalElement,
    );
  };

  useEffect(() => {
    const handlePosition = () => {
      if (selectRef.current && opened) {
        const rect = selectRef.current.getBoundingClientRect();
        setDropdownPosition({
          width: rect.width,
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
        });
      }
    };

    const handleScroll = () => {
      setOpened(false);
    };

    handlePosition();
    modalBodyRef?.current?.addEventListener("scroll", handleScroll);
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      modalBodyRef?.current?.removeEventListener("scroll", handleScroll);
    };
  }, [modalBodyRef, opened]);

  return (
    <VariableSelectBoxWrapper className={disabled ? "disabled" : ""}>
      <div
        className="selected-item-wrapper"
        ref={selectRef}
        onClick={toggleOpenSelectBox}
      >
        <span className="display-text">{displayText}</span>
        {opened ? (
          <IconArrowUp className="icon-arrow" />
        ) : (
          <IconArrowDown className="icon-arrow" />
        )}
      </div>

      {errorText && <div className="error-text">{errorText}</div>}
      {opened && renderSelectOptions()}
    </VariableSelectBoxWrapper>
  );
};

export default VariableSelectBox;
