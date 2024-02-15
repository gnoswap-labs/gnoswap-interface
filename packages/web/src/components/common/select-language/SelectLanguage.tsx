import React from "react";
import { SelectLanguageWrapper } from "./SelectLanguage.styles";
import IconStrokeArrowLeft from "../icons/IconStrokeArrowLeft";
import IconCircleInCheck from "@components/common/icons/IconCircleInCheck";
import { Overlay } from "../wallet-connector-menu/WalletConnectorMenu.styles";

interface Props {
  onClickChangeLanguage: () => void;
}

const SelectLanguage: React.FC<Props> = ({
  onClickChangeLanguage,
}) => {

  return (
    <>
    <SelectLanguageWrapper width={window?.innerWidth}>
      <div className="header">
        <div onClick={onClickChangeLanguage}><IconStrokeArrowLeft /></div>
        <p>Language</p>
        <div></div>
      </div>
      <div className="list">
        <div>
          <p>English</p>
          <IconCircleInCheck />
        </div>
        <div>
          <p>Afrikaans</p>
        </div>
        <div>
          <p>العربية</p>
        </div>
        <div>
          <p>Català</p>
        </div>
      </div>
    </SelectLanguageWrapper>
    <Overlay onClick={onClickChangeLanguage} />
    </>

  );
};

export default SelectLanguage;
