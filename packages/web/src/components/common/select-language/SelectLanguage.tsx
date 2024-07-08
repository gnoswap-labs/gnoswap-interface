import React from "react";
import { SelectLanguageWrapper } from "./SelectLanguage.styles";
import IconStrokeArrowLeft from "../icons/IconStrokeArrowLeft";
import IconCircleInCheck from "@components/common/icons/IconCircleInCheck";
import { Overlay } from "../wallet-connector-menu/WalletConnectorMenu.styles";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "zh", name: "Chinese" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "hi", name: "Hindi" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "ru", name: "Russian" },
  { code: "es", name: "Spanish" },
];

interface Props {
  onClickChangeLanguage: () => void;
}

const SelectLanguage: React.FC<Props> = ({ onClickChangeLanguage }) => {
  const { i18n } = useTranslation();
  const router = useRouter();

  return (
    <>
      <SelectLanguageWrapper width={window?.innerWidth}>
        <div className="header">
          <div onClick={onClickChangeLanguage}>
            <IconStrokeArrowLeft />
          </div>
          <p>Language</p>
          <div></div>
        </div>
        <div className="list">
          {LANGUAGES.map(item => (
            <div
              onClick={() => {
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
