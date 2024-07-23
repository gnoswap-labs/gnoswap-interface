import React, { useEffect, useRef, useState } from "react";
import LoadMoreButton, {
  TEXT_TYPE,
} from "@components/common/load-more-button/LoadMoreButton";
import { cx } from "@emotion/css";
import { wrapper } from "./TokenDescriptionContent.styles";
import { useTranslation } from "react-i18next";

interface TokenDescriptionContentProps {
  content: string;
}

const TokenDescriptionContent: React.FC<TokenDescriptionContentProps> = ({
  content,
}) => {
  const [isMaxHeightOver, setIsMaxHeightOver] = useState(false);
  const [showMore, setShowMore] = useState(true);
  const contentRef = useRef<HTMLParagraphElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (!contentRef.current) return;
    contentRef.current.clientHeight >= 180
      ? setIsMaxHeightOver(true)
      : setIsMaxHeightOver(false);
  }, [contentRef]);

  const onClickShowMore = () => {
    return setShowMore((prev: boolean) => !prev);
  };

  return (
    <div css={wrapper}>
      <p ref={contentRef} className={cx({ "auto-height": !showMore })}>
        {content ? content : t("TokenDetails:description.empty")}
      </p>
      {isMaxHeightOver && (
        <LoadMoreButton
          show={showMore}
          onClick={onClickShowMore}
          text={TEXT_TYPE.SHOW}
        />
      )}
    </div>
  );
};

export default TokenDescriptionContent;
