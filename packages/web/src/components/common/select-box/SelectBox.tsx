import React, { useCallback, useMemo, useRef, useState } from "react";
import { SelectBoxModalWrapper, SelectBoxWrapper } from "./SelectBox.styles";
import IconArrowUp from "../icons/IconArrowUp";
import IconArrowDown from "../icons/IconArrowDown";
import useModalCloseEvent from "@hooks/common/use-modal-close-event";

export interface SelectBoxProps<ItemType = unknown> {
  current: string | React.ReactNode | null;
  items: ItemType[];
  select: (item: ItemType) => void;
  render: (item: ItemType) => React.ReactNode;
  className?: string;
}


const SelectBox: <ItemType>(p: SelectBoxProps<ItemType>) => JSX.Element = ({
  current,
  items,
  select,
  render,
  className,
}) => {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const [opened, setOpened] = useState(false);

  const toggleModal = useCallback(() => setOpened(!opened), [opened]);
  const closeModal = useCallback(() => setOpened(false), []);

  useModalCloseEvent(boxRef, closeModal);

  const selectedItemName = useMemo(() => {
    return current || "Select";
  }, [current]);

  return (
    <SelectBoxWrapper ref={boxRef} className={`select-box ${className}`} onClick={toggleModal}>
      <div className="selected-wrapper">
        <span className="current">{selectedItemName}</span>
        {opened ?
          <IconArrowUp className="icon-arrow" /> :
          <IconArrowDown className="icon-arrow" />
        }
      </div>

      <SelectBoxModalWrapper className={`${opened ? "open" : ""} select-item`}>
        {items.map((item, index) => (
          <div
            key={index}
            className="item-wrapper"
            onClick={() => {
              select(item);
              closeModal();
            }}
          >
            {render(item)}
          </div>
        ))}
      </SelectBoxModalWrapper>
    </SelectBoxWrapper>
  );
};

export default SelectBox;