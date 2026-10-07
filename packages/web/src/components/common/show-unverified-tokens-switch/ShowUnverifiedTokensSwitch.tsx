import React from "react";
import { useTranslation } from "react-i18next";

import IconInfo from "@components/common/icons/IconInfo";
import IconNewTab from "@components/common/icons/IconNewTab";
import Switch from "@components/common/switch/Switch";
import Tooltip from "@components/common/tooltip/Tooltip";

import { UnverifiedTokensInfoWrapper, UnverifiedTokensTooltipContent } from "./ShowUnverifiedTokensSwitch.styles";

export interface ShowUnverifiedTokensSwitchProps {
  checked: boolean;
  onChange: () => void;
}

const ShowUnverifiedTokensSwitch: React.FC<ShowUnverifiedTokensSwitchProps> = ({ checked, onChange }) => {
  const { t } = useTranslation();

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
    <Switch
      id="show-unverified-tokens"
      checked={checked}
      onChange={onChange}
      hasLabel={true}
      labelText={t("common:tokenList.showUnverifiedTokens", { defaultValue: "Show unverified tokens" })}
      labelExtra={unverifiedTokensInfo}
      labelExtraPosition="before"
    />
  );
};

export default ShowUnverifiedTokensSwitch;
