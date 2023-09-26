import React, { useCallback, useRef, useState } from "react";
import { SelectTokenBalanceItemWrapper, SelectTokenBalanceModalWrapper, SelectTokenBalanceWrapper } from "./SelectTokenBalance.styles";
import IconArrowUp from "../icons/IconArrowUp";
import IconArrowDown from "../icons/IconArrowDown";
import useModalCloseEvent from "@hooks/common/use-modal-close-event";
import { TokenBalanceInfo } from "@models/token/token-balance-info";
import IconClose from "../icons/IconCancel";

export interface SelectTokenBalanceProps {
  current: TokenBalanceInfo | null;
  tokens: TokenBalanceInfo[];
  select: (path: string) => void;
}

const SelectTokenBalance: React.FC<SelectTokenBalanceProps> = ({
  current,
  tokens,
  select,
}) => {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const [opened, setOpened] = useState(false);

  const toggleModal = useCallback(() => setOpened(!opened), [opened]);
  const closeModal = useCallback(() => setOpened(false), []);

  useModalCloseEvent(boxRef, closeModal);

  const selected = current !== null;

  const onClickItem = useCallback((path: string) => {
    select(path);
    closeModal();
  }, [closeModal, select]);

  return (
    <SelectTokenBalanceWrapper>
      <div className="selected-wrapper" onClick={toggleModal}>
        {selected ? (
          <div className="current">
            <img className="logo" src={current.logoURI} alt="token logo" />
            <span className="name">{current.name}</span>
          </div>
        ) :
          <span className="current">Select</span>
        }

        {opened ?
          <IconArrowUp className="icon-arrow" /> :
          <IconArrowDown className="icon-arrow" />
        }
      </div>

      {opened && (
        <SelectTokenBalanceModalWrapper ref={boxRef}>
          <div className="modal-header">
            <h6 className="title">Select a Token</h6>
            <button className="close" onClick={closeModal}>
              <IconClose className="icon-close" />
            </button>
          </div>
          <div className="token-list-wrapper">
            {tokens.map((token, index) => (
              <SelectTokenBalanceItem
                key={index}
                token={token}
                onClick={() => onClickItem(token.path)}
              />
            ))}
          </div>
        </SelectTokenBalanceModalWrapper>
      )}
    </SelectTokenBalanceWrapper>
  );
};

export default SelectTokenBalance;

interface SelectTokenBalanceItemProps {
  token: TokenBalanceInfo;
  onClick: () => void;
}

const SelectTokenBalanceItem: React.FC<SelectTokenBalanceItemProps> = ({
  token,
  onClick
}) => {
  const { logoURI, name, symbol, balance } = token;

  return (
    <SelectTokenBalanceItemWrapper onClick={onClick}>
      <div className="info-wrapper">
        <img className="logo" src={logoURI} alt="token logo" />
        <span className="name">{name}</span>
        <span className="symbol">{symbol}</span>
      </div>

      <div className="balance-wrapper">
        <span className="balance">{balance}</span>
      </div>
    </SelectTokenBalanceItemWrapper>
  );
};