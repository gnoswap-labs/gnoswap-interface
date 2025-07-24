import { useTranslation } from "react-i18next";

import Tooltip from "@components/common/tooltip/Tooltip";
import { Flex, FontSize16, Hover, TooltipContent } from "../common/common.styles";
import { StyledIconInfo } from "../common/styled-icon-info/StyledIconInfo";

const HideMe = ({ isMobile }: { isMobile: boolean }) => {
  const { t } = useTranslation();
  return (
    <Flex>
      <Hover>
        <Tooltip
          placement="top"
          FloatingContent={<TooltipContent>{t("Leaderboard:list.tooltip.hideToggleButton")}</TooltipContent>}
        >
          <StyledIconInfo />
        </Tooltip>
      </Hover>
      <FontSize16>
        {isMobile ? t("Leaderboard:list.mobile.hideToggleButton") : t("Leaderboard:list.hideToggleButton")}
      </FontSize16>
    </Flex>
  );
};

export default HideMe;
