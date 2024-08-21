import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import React from "react";

import IconCircleInCheck from "@components/common/icons/IconCircleInCheck";
import IconStrokeArrowLeft from "@components/common/icons/IconStrokeArrowLeft";
import { LANGUAGES } from "@constants/common.constant";

import { Overlay } from "../wallet-connector-menu/WalletConnectorMenu.styles";
import { SelectLanguageWrapper } from "./SelectLanguage.styles";

interface Props {
  onClickChangeLanguage: () => void;
}

const SelectLanguage: React.FC<Props> = ({ onClickChangeLanguage }) => {
  const { i18n, t } = useTranslation();
  const router = useRouter();

  return (
    <>
      <SelectLanguageWrapper width={window?.innerWidth}>
        <div className="header">
          <div onClick={onClickChangeLanguage}>
            <IconStrokeArrowLeft />
          </div>
          <p>{t("HeaderFooter:language")}</p>
          <div></div>
        </div>
        <div className="list">
          {[...LANGUAGES].map(item => (
            <div
              onClick={() => {
                onClickChangeLanguage();
                const { pathname, asPath, query } = router;
                router.push({ pathname, query }, asPath, {
                  locale: item.code,
                });
              }}
              key={item.code}
            >
              <p>{item.name}</p>
              {i18n.language === item.code && <IconCircleInCheck />}
            </div>
          ))}
        </div>
      </SelectLanguageWrapper>
      <Overlay onClick={onClickChangeLanguage} />
    </>
  );
};

export default SelectLanguage;
