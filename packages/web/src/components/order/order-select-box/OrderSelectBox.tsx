import { cx } from "@emotion/css";
import React, { useCallback, useRef, useState } from "react";

import IconArrowDown from "@components/common/icons/IconArrowDown";
import IconArrowUp from "@components/common/icons/IconArrowUp";
import useModalCloseEvent from "@hooks/common/use-modal-close-event";

import { OrderSelectBoxWrapper } from "./OrderSelectBox.styles";

export interface OrderSelectOption<T> {
  value: T;
  label: string;
}

interface OrderSelectBoxProps<T> {
  value: T;
  options: OrderSelectOption<T>[];
  onChange: (value: T) => void;
  disabled?: boolean;
  className?: string;
}

/** Compact pill dropdown used for the DCA interval unit and the limit expiry. */
function OrderSelectBox<T extends string | number>({
  value,
  options,
  onChange,
  disabled = false,
  className,
}: OrderSelectBoxProps<T>) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [opened, setOpened] = useState(false);
  const close = useCallback(() => setOpened(false), []);

  useModalCloseEvent(wrapperRef, close);

  const current = options.find(option => option.value === value);

  return (
    <OrderSelectBoxWrapper ref={wrapperRef} className={className}>
      <button
        type="button"
        className="select-trigger"
        onClick={() => setOpened(prev => !prev)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={opened}
      >
        <span>{current?.label ?? "-"}</span>
        {opened ? <IconArrowUp className="icon-arrow" /> : <IconArrowDown className="icon-arrow" />}
      </button>
      {opened && (
        <div className="select-list" role="listbox">
          {options.map(option => (
            <button
              type="button"
              key={option.value}
              role="option"
              aria-selected={option.value === value}
              className={cx("select-item", { selected: option.value === value })}
              onClick={() => {
                onChange(option.value);
                close();
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </OrderSelectBoxWrapper>
  );
}

export default OrderSelectBox;
