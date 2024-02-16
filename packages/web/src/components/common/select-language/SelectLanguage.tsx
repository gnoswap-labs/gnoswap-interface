import React from "react";
import { SelectLanguageWrapper } from "./SelectLanguage.styles";
import IconStrokeArrowLeft from "../icons/IconStrokeArrowLeft";
import IconCircleInCheck from "@components/common/icons/IconCircleInCheck";
import { Overlay } from "../wallet-connector-menu/WalletConnectorMenu.styles";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

interface Props {
  onClickChangeLanguage: () => void;
}

const LAGUAGES = [
  {code: "en", name: "English"},
  {code: "af", name: "Afrikaans"},
  {code: "ar", name: "Arabic"},
  {code: "ca", name: "Catalan"},
];

const SelectLanguage: React.FC<Props> = ({
  onClickChangeLanguage,
}) => {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <>
    <SelectLanguageWrapper width={window?.innerWidth}>
      <div className="header">
        <div onClick={onClickChangeLanguage}><IconStrokeArrowLeft /></div>
        <p>{t("HeaderFooter:language")}</p>
        <div></div>
      </div>
      <div className="list">
        {LAGUAGES.map((item) => {
          return (
            <div key={item.code} onClick={() =>router.push("/", "/", { locale: item.code })}>
              <p>{item.name}</p>
              {router.locale === item.code && <IconCircleInCheck />}
            </div>
          );
        })

        }
      </div>
    </SelectLanguageWrapper>
    <Overlay onClick={onClickChangeLanguage} />
    </>

  );
};

export default SelectLanguage;
