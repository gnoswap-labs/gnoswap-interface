import React from "react";
import { SelectLanguageWrapper } from "./SelectLanguage.styles";
import IconStrokeArrowLeft from "../icons/IconStrokeArrowLeft";
import IconCircleInCheck from "@components/common/icons/IconCircleInCheck";
import { Overlay } from "../wallet-connector-menu/WalletConnectorMenu.styles";
import { useRouter } from "next/router";

interface Props {
  onClickChangeLanguage: () => void;
}

const LAGUAGES = [
  {code: "en", name: "English"},
  {code: "af", name: "Afrikaans"},
  {code: "sq", name: "Albanian"},
  {code: "vi", name: "Vietnamese"},
];

const SelectLanguage: React.FC<Props> = ({
  onClickChangeLanguage,
}) => {
  const router = useRouter();
  console.log(router.locale);
  return (
    <>
    <SelectLanguageWrapper width={window?.innerWidth}>
      <div className="header">
        <div onClick={onClickChangeLanguage}><IconStrokeArrowLeft /></div>
        <p>Language</p>
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
