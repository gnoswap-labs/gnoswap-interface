import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@emotion/react";

import { GNOT_TOKEN } from "@common/values/token-constant";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconClose from "@components/common/icons/IconCancel";
import { IconCircleExclamationMark } from "@components/common/icons/IconExclamationRound";
import IconInfo from "@components/common/icons/IconInfo";
import IconNewTab from "@components/common/icons/IconNewTab";
import { Overlay } from "@components/common/modal/Modal.styles";
import { QRCodeGenerator } from "@components/common/qr-code/QRCode";
import SelectPairButton from "@components/common/select-pair-button/SelectPairButton";
import Tooltip from "@components/common/tooltip/Tooltip";
import WarningCard from "@components/common/warning-card/WarningCard";
import { useCopy } from "@hooks/common/use-copy";
import useEscCloseModal from "@hooks/common/use-esc-close-modal";
import { usePositionModal } from "@hooks/common/use-position-modal";
import { useWallet } from "@hooks/wallet/use-wallet";
import { TokenModel } from "@models/token/token-model";
import { DEVICE_TYPE } from "@styles/media";

import {
  DepositBoxContent,
  DepositLabel,
  DepositModalBackground,
  AssetReceiveModalWrapper,
  AssetReceiveTooltipContent,
  DepositWarningContentWrapper,
} from "./AssetReceiveModal.styles";

export const DEFAULT_DEPOSIT_GNOT = GNOT_TOKEN;

const DEFAULT_DEPOSIT_GRC20s = {
  ...GNOT_TOKEN,
  symbol: "GRC20s",
};

interface Props {
  close: () => void;
  breakpoint: DEVICE_TYPE;
  depositInfo?: TokenModel;
  avgBlockTime: number;
  changeToken: (token: TokenModel) => void;
  callback?: (value: boolean) => void;
}

const AssetReceiveModal: React.FC<Props> = ({
  close,
  breakpoint,
  avgBlockTime,
  changeToken,
  callback,
}) => {
  const { t } = useTranslation();
  const modalRef = useRef<HTMLDivElement | null>(null);
  const { account } = useWallet();
  const [copied, copy] = useCopy();
  const theme = useTheme();

  useEscCloseModal(close);
  usePositionModal(modalRef);

  return (
    <>
      <DepositModalBackground>
        <AssetReceiveModalWrapper ref={modalRef}>
          <div className="modal-body">
            <div className="header">
              <h6>{t("Modal:assetReceive.title")}</h6>
              <div className="close-wrap" onClick={close}>
                <IconClose className="close-icon" />
              </div>
            </div>

            <DepositLabel>
              <div className="title">
                <label>{t("Modal:assetReceive.supToken.label")}</label>
                <DepositTooltip tooltip={t("Modal:assetReceive.supToken.tooltip")} />
              </div>

              <DepositBoxContent>
                <div className="supported-tokens-box">
                  <div className="token">
                    <SelectPairButton
                      token={DEFAULT_DEPOSIT_GNOT}
                      changeToken={changeToken}
                      callback={callback}
                      isHiddenArrow
                      disabled
                    />
                  </div>
                  <div className="token">
                    <SelectPairButton
                      token={DEFAULT_DEPOSIT_GRC20s}
                      changeToken={changeToken}
                      callback={callback}
                      isHiddenArrow
                      disabled
                    />
                  </div>
                </div>
              </DepositBoxContent>
            </DepositLabel>

            <DepositLabel>
              <div className="title">
                <label>{t("Modal:assetReceive.network.label")}</label>
                <DepositTooltip tooltip={t("Modal:assetReceive.network.tooltip")} />
              </div>

              <DepositBoxContent>
                <div className="normal-box">
                  <div className="network">
                    <img
                      src={DEFAULT_DEPOSIT_GNOT.logoURI}
                      alt="token logo"
                      className="token-logo"
                    />
                    <span className="token-symbol">Gnoland (GRC20)</span>
                  </div>

                  <div className="approximately">
                    {t("Modal:assetReceive.second", {
                      avgBlockTime: (
                        Math.floor(avgBlockTime * 10) / 10
                      ).toFixed(1),
                    })}
                  </div>
                </div>
              </DepositBoxContent>
            </DepositLabel>

            <DepositLabel>
              <div className="title">
                <label>{t("Modal:assetReceive.addr.label")}</label>
                <DepositTooltip tooltip={t("Modal:assetReceive.addr.tooltip")} />
              </div>

              <DepositBoxContent>
                <div className="normal-box">
                  <div className="address-box">
                    <QRCodeGenerator
                      text={account?.address ?? ""}
                      size={93}
                      logo={DEFAULT_DEPOSIT_GNOT.logoURI}
                    />
                    <div className="address">
                      <p>{account?.address}</p>
                      <Button
                        text={
                          copied ? t("common:copied") : t("common:action.copy")
                        }
                        className="btn-copy"
                        style={{
                          textColor: "text09",
                          hierarchy: copied
                            ? undefined
                            : ButtonHierarchy.Primary,
                          bgColor: copied ? "background17" : undefined,
                        }}
                        disabled={copied}
                        onClick={() => copy(account?.address)}
                      />
                    </div>
                  </div>
                </div>
              </DepositBoxContent>
            </DepositLabel>

            <WarningCard
              icon={<IconCircleExclamationMark />}
              title={t("Modal:assetReceive.warning.title")}
              content={
                <DepositWarningContentWrapper>
                  <ul>
                    <li>{t("Modal:assetReceive.warning.content1")}</li>
                    <li>{t("Modal:assetReceive.warning.content2")}</li>
                  </ul>

                  <a
                    href="https://beta.gnoswap.io/"
                    target="_blank"
                    className="learn-more-box"
                  >
                    <p>{t("common:learnMore")}</p>
                    <IconNewTab color={theme.color.icon21} />
                  </a>
                </DepositWarningContentWrapper>
              }
            />

            <Button
              onClick={close}
              text={t("common:action.close")}
              className="btn-deposit"
              style={{
                fullWidth: true,
                textColor: "text09",
                fontType: breakpoint !== DEVICE_TYPE.MOBILE ? "body7" : "body9",
              }}
            />
          </div>
        </AssetReceiveModalWrapper>
      </DepositModalBackground>
      <Overlay onClick={close} />
    </>
  );
};

export default AssetReceiveModal;

export const DepositTooltip: React.FC<{ tooltip: string }> = ({ tooltip }) => {
  const TooltipFloatingContent = (
    <AssetReceiveTooltipContent>{tooltip}</AssetReceiveTooltipContent>
  );

  return (
    <Tooltip placement="top" FloatingContent={TooltipFloatingContent}>
      <IconInfo size={16} />
    </Tooltip>
  );
};
