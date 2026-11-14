import React, { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import IconLink from "@components/common/icons/IconLink";
import IconPolygon from "@components/common/icons/IconPolygon";
import IconSettings from "@components/common/icons/IconSettings";
import SelectTab from "@components/common/select-tab/SelectTab";
import SettingMenuModal from "@components/common/setting-menu-modal/SettingMenuModal";
import { ENABLED_SWAP_CARD_TYPES } from "@constants/order.constant";
import { SWAP_CARD_TYPE, SwapCardType } from "@models/order/order-type";

import { CopyTooltip, SettingMenuButton, SwapCardHeaderWrapper } from "./SwapCardHeader.styles";

interface SwapCardHeaderProps {
  copied: boolean;
  copyURL: () => void;
  /** The slippage setting. Omitted where the order takes no user slippage (DCA). */
  slippage?: number;
  changeSlippage?: (value: number) => void;
  /** Highest tolerance (percent) the settings editor accepts. Defaults to the swap maximum. */
  maxSlippage?: number;
  themeKey: "dark" | "light";
  /** Shows the Swap | Limit | DCA tabs in place of the title when given. */
  swapType?: SwapCardType;
  changeSwapType?: (type: SwapCardType) => void;
  /** Tabs to offer. Defaults to the modes enabled by the configured order realms. */
  swapTypes?: SwapCardType[];
}
const SwapCardHeader: React.FC<SwapCardHeaderProps> = ({
  copied,
  copyURL,
  slippage,
  changeSlippage,
  maxSlippage,
  themeKey,
  swapType,
  changeSwapType,
  swapTypes = ENABLED_SWAP_CARD_TYPES,
}) => {
  const { t } = useTranslation();

  const swapTypeTabs = useMemo(
    () =>
      [
        { key: SWAP_CARD_TYPE.SWAP, display: t("Swap:tab.swap") },
        { key: SWAP_CARD_TYPE.LIMIT, display: t("Swap:tab.limit") },
        { key: SWAP_CARD_TYPE.DCA, display: t("Swap:tab.dca") },
      ].filter(tab => swapTypes.includes(tab.key)),
    [swapTypes, t],
  );
  const [openedSetting, setOpenedSetting] = useState(false);

  const openSetting = useCallback(() => {
    setOpenedSetting(true);
  }, []);

  const closeSetting = useCallback(() => {
    setOpenedSetting(false);
  }, []);

  return (
    <SwapCardHeaderWrapper>
      {swapType && changeSwapType && swapTypeTabs.length > 1 ? (
        <div className="swap-type-tab">
          <SelectTab
            selectType={swapType}
            list={swapTypeTabs}
            onClick={type => changeSwapType(type as SwapCardType)}
            buttonClassName="swap-type-button"
          />
        </div>
      ) : (
        <h2>{t("Swap:header")}</h2>
      )}
      <div className="button-wrap">
        <div className="setting-wrap" onClick={copyURL}>
          <IconLink className="setting-icon" />
          {copied && (
            <CopyTooltip>
              <div className={`box ${themeKey}-shadow`}>
                <span>{t("Swap:swapURLCopied")}</span>
              </div>
              <IconPolygon className="polygon-icon" />
            </CopyTooltip>
          )}
        </div>
        {slippage !== undefined && changeSlippage && (
          <SettingMenuButton>
            <div className="setting-wrap" onClick={openSetting}>
              <IconSettings className="setting-icon" />
            </div>
            {openedSetting && (
              <SettingMenuModal
                slippage={slippage}
                changeSlippage={changeSlippage}
                maxSlippage={maxSlippage}
                close={closeSetting}
              />
            )}
          </SettingMenuButton>
        )}
      </div>
    </SwapCardHeaderWrapper>
  );
};

export default SwapCardHeader;
