import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import IconArrowDown from "@components/common/icons/IconArrowDown";
import IconArrowUp from "@components/common/icons/IconArrowUp";

import { VariableSelectBoxWrapper, VariableSelectOptionsWrapper } from "./VariableSelectBox.styles";

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
  dropdownId: string;
  isOpen: boolean;
  onToggle: (dropdownId: string, isOpen: boolean) => void;
}

const VariableSelectBox: React.FC<VariableSelectBoxProps> = ({
  modalBodyRef,
  items,
  currentItem,
  placeholder,
  disabled,
  errorText,
  onChange,
  dropdownId,
  isOpen,
  onToggle,
}) => {
  const selectRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    onToggle(dropdownId, !isOpen);
  }, [disabled, onToggle, dropdownId, isOpen]);

  const selectItem = useCallback(
    (value: string) => {
      onToggle(dropdownId, false);
      onChange(value);
    },
    [onChange, onToggle, dropdownId],
  );

  useEffect(() => {
    const isClickOutsideDropdown = (event: MouseEvent): boolean => {
      const target = event.target as Node;
      const isInsideSelect = selectRef.current?.contains(target) ?? false;
      const isInsideDropdown = dropdownRef.current?.contains(target) ?? false;

      return !isInsideSelect && !isInsideDropdown;
    };

    const hasRequiredRefs = (): boolean => {
      return !!(selectRef.current && dropdownRef.current);
    };

    const shouldCloseDropdown = (event: MouseEvent): boolean => {
      return isOpen && hasRequiredRefs() && isClickOutsideDropdown(event);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (shouldCloseDropdown(event)) {
        onToggle(dropdownId, false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onToggle, dropdownId]);

  const adjustTextSize = useCallback((element: HTMLElement, container: HTMLElement, padding: number) => {
    const maxWidth = container.offsetWidth - padding;
    const scaleFactor = maxWidth / element.scrollWidth;

    if (scaleFactor < 1) {
      element.style.setProperty("--scale-factor", scaleFactor.toString());
    } else {
      element.style.setProperty("--scale-factor", "1");
    }
  }, []);

  useEffect(() => {
    if (selectRef.current) {
      const textElement = selectRef.current.querySelector(".display-text");
      if (textElement instanceof HTMLElement) {
        adjustTextSize(textElement, selectRef.current, 40);
      }
    }
  }, [adjustTextSize, displayText, selectRef.current]);

  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const options = dropdownRef.current.querySelectorAll<HTMLElement>(".display-value");

      options.forEach((option: HTMLElement) => {
        const clone = option.cloneNode(true) as HTMLElement;
        clone.style.visibility = "hidden";
        clone.style.position = "absolute";
        clone.style.width = `${dropdownPosition.width - 20}px`;
        clone.style.setProperty("--scale-factor", "1");
        document.body.appendChild(clone);

        const scaleFactor = (dropdownPosition.width - 20) / clone.scrollWidth;

        document.body.removeChild(clone);

        if (scaleFactor < 1) {
          option.style.setProperty("--scale-factor", scaleFactor.toString());
        } else {
          option.style.removeProperty("--scale-factor");
        }
      });
    }
  }, [adjustTextSize, isOpen, items, dropdownPosition.width]);

  const renderSelectOptions = () => {
    const portalElement = document?.getElementById("portal-dropdown");
    if (!portalElement) {
      return <React.Fragment />;
    }

    return createPortal(
      (
        <React.Fragment>
          <VariableSelectOptionsWrapper
            ref={dropdownRef}
            width={dropdownPosition.width}
            top={dropdownPosition.top}
            left={dropdownPosition.left}
          >
            <div className="select-list">
              {items.map((item, index) => (
                <span key={index} className={"display-value"} onClick={() => selectItem(item.value)}>
                  {item.displayValue}
                </span>
              ))}
            </div>
          </VariableSelectOptionsWrapper>
        </React.Fragment> // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ) as any,
      portalElement,
    );
  };

  useEffect(() => {
    const handlePosition = () => {
      if (selectRef.current && isOpen) {
        const rect = selectRef.current.getBoundingClientRect();
        setDropdownPosition({
          width: rect.width,
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
        });
      }
    };

    const handleScroll = () => {
      onToggle(dropdownId, false);
    };

    handlePosition();
    modalBodyRef?.current?.addEventListener("scroll", handleScroll);
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      modalBodyRef?.current?.removeEventListener("scroll", handleScroll);
    };
  }, [modalBodyRef, isOpen, onToggle, dropdownId]);

  return (
    <VariableSelectBoxWrapper className={disabled ? "disabled" : ""}>
      <div className="selected-item-wrapper" ref={selectRef} onClick={toggleOpenSelectBox}>
        <span className={"display-text"}>{displayText}</span>
        {isOpen ? <IconArrowUp className="icon-arrow" /> : <IconArrowDown className="icon-arrow" />}
      </div>

      {errorText && <div className="error-text">{errorText}</div>}
      {isOpen && renderSelectOptions()}
    </VariableSelectBoxWrapper>
  );
};

export default VariableSelectBox;
