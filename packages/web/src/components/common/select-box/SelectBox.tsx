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
}


const SelectBox: <ItemType>(p: SelectBoxProps<ItemType>) => JSX.Element = ({
  current,
  items,
  select,
  render,
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
    <SelectBoxWrapper ref={boxRef}>
      <div className="selected-wrapper" onClick={toggleModal}>
        <span className="current">{selectedItemName}</span>
        {opened ?
          <IconArrowUp className="icon-arrow" /> :
          <IconArrowDown className="icon-arrow" />
        }
      </div>

      <SelectBoxModalWrapper className={opened ? "open" : ""}>
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