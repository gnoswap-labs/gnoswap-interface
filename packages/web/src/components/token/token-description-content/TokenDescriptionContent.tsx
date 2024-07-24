import React from "react";
import { wrapper } from "./TokenDescriptionContent.styles";
import { useTranslation } from "react-i18next";

interface TokenDescriptionContentProps {
  content: string;
}

const TokenDescriptionContent: React.FC<TokenDescriptionContentProps> = ({
  content,
}) => {
  const { t } = useTranslation();

  return (
    <div css={wrapper}>
      <p>{content ? content : t("TokenDetails:description.empty")}</p>
    </div>
  );
};

export default TokenDescriptionContent;
