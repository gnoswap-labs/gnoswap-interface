import React, { useId } from "react";
import { useTranslation } from "react-i18next";

import IconInfo from "@components/common/icons/IconInfo";
import IconNewTab from "@components/common/icons/IconNewTab";
import Switch from "@components/common/switch/Switch";
import Tooltip from "@components/common/tooltip/Tooltip";
import { useWindowSize } from "@hooks/common/use-window-size";
import { DEVICE_TYPE } from "@styles/media";

import {
  UnverifiedTokensInfoWrapper,
  UnverifiedTokensSwitchWrapper,
  UnverifiedTokensTooltipContent,
} from "./ShowUnverifiedTokensSwitch.styles";

export interface ShowUnverifiedTokensSwitchProps {
  checked: boolean;
  onChange: () => void;
  compact?: boolean;
}

const ShowUnverifiedTokensSwitch: React.FC<ShowUnverifiedTokensSwitchProps> = ({ checked, onChange, compact = false }) => {
  const { t } = useTranslation();
  const id = useId();
  const { breakpoint } = useWindowSize();
  const isCompactMobile = compact && breakpoint === DEVICE_TYPE.MOBILE;

  const unverifiedTokensTooltip = (
    <UnverifiedTokensTooltipContent>
      <p>
        {t("common:tokenList.unverifiedTokensTooltip", {
          defaultValue: "Tokens unregistered on Gno.land Token Resources are filtered.",
        })}
      </p>
      <a href="https://github.com/onbloc/gno-token-resource" target="_blank" rel="noreferrer">
        {t("common:tokenList.verifyToken", { defaultValue: "Verify your token" })}
        <IconNewTab />
      </a>
    </UnverifiedTokensTooltipContent>
  );

  const unverifiedTokensInfo = (
    <Tooltip placement="top" FloatingContent={unverifiedTokensTooltip}>
      <UnverifiedTokensInfoWrapper>
        <IconInfo size={16} />
      </UnverifiedTokensInfoWrapper>
    </Tooltip>
  );

  return (
    <UnverifiedTokensSwitchWrapper compact={compact}>
      <Switch
        id={`show-unverified-tokens-${id}`}
        checked={checked}
        onChange={onChange}
        hasLabel={true}
        labelText={
          isCompactMobile
            ? t("common:tokenList.unverified", { defaultValue: "Unverified" })
            : t("common:tokenList.showUnverifiedTokens", { defaultValue: "Show unverified tokens" })
        }
        labelExtra={unverifiedTokensInfo}
        labelExtraPosition="before"
      />
    </UnverifiedTokensSwitchWrapper>
  );
};

export default ShowUnverifiedTokensSwitch;
