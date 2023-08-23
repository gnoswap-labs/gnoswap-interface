import React, { useEffect, useRef } from "react";
import {
  SearchModalBackground,
  SearchModal,
  InputStyle,
} from "./SelectTokenModal.styles";
import IconSearch from "@components/common/icons/IconSearch";
import IconClose from "@components/common/icons/IconCancel";
import { tokenInfo } from "@containers/swap-container/SwapContainer";

interface SelectTokenModalProps {
  onSelectTokenModal: () => void;
  search: (e: React.ChangeEvent<HTMLInputElement>) => void;
  keyword: string;
  coinList: tokenInfo[];
  changeToken: (token: tokenInfo, type: string) => void;
}

const SelectTokenModal: React.FC<SelectTokenModalProps> = ({
  onSelectTokenModal,
  search,
  keyword,
  coinList,
  changeToken,
}) => {
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const closeMenu = (e: MouseEvent) => {
      if (menuRef.current && menuRef.current.contains(e.target as Node)) {
        return;
      } else {
        e.stopPropagation();
        onSelectTokenModal();
      }
    };
    window.addEventListener("click", closeMenu, true);
    return () => {
      window.removeEventListener("click", closeMenu, true);
    };
  }, [menuRef, onSelectTokenModal]);

  return (
    <SearchModalBackground>
      <SearchModal ref={menuRef}>
        <div className="modal-body">
          <div className="modal-header">
            <span>Select a token</span>
            <div className="close-wrap" onClick={onSelectTokenModal}>
              <IconClose className="close-icon" />
            </div>
          </div>
          <div className="search-wrap">
            <InputStyle
              placeholder={"Search name or paste address"}
              value={keyword}
              onChange={search}
            />
            <IconSearch className="search-icon" />
          </div>
          <div className="coin-select">
            {coinList.map((data, idx) => (
              <div
                className="coin-button"
                key={idx}
                onClick={() => {
                  changeToken(data, "from");
                  onSelectTokenModal();
                }}
              >
                <img src={data.logo} alt="logo" className="coin-logo" />
                <span>{data.symbol}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="list-wrap">
          {coinList.map((data, idx) => (
            <div
              className="list"
              key={idx}
              onClick={() => {
                changeToken(data, "from");
                onSelectTokenModal();
              }}
            >
              <div className="coin-info">
                <img src={data.logo} alt="logo" className="coin-logo" />
                <span className="coin-name">{data.name}</span>
                <span className="coin-symbol">{data.symbol}</span>
              </div>
              <span className="coin-balance">{data.balance}</span>
            </div>
          ))}
        </div>
      </SearchModal>
    </SearchModalBackground>
  );
};

export default SelectTokenModal;
