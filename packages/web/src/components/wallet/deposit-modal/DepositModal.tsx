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
import { useTheme } from "@emotion/react";
import { useCopy } from "@hooks/common/use-copy";
import useEscCloseModal from "@hooks/common/use-esc-close-modal";
import { usePositionModal } from "@hooks/common/use-postion-modal";
import { useWallet } from "@hooks/wallet/use-wallet";
import { TokenModel } from "@models/token/token-model";
import { DEVICE_TYPE } from "@styles/media";
import React, { useRef } from "react";
import {
  DepositBoxContent,
  DepositLabel,
  DepositModalBackground,
  DepositModalWrapper,
  DepositTooltipContent,
  DepositWarningContentWrapper,
} from "./DepositModal.styles";

export const DEFAULT_DEPOSIT_GNOT = GNOT_TOKEN;

const DEFAULT_DEPOSIT_GRC20s = {
  ...GNOT_TOKEN,
  symbol: "GRC20s",
};

interface Props {
  close: () => void;
  breakpoint: DEVICE_TYPE;
  depositInfo?: TokenModel;
  changeToken: (token: TokenModel) => void;
  callback?: (value: boolean) => void;
}

const DepositModal: React.FC<Props> = ({
  close,
  breakpoint,
  changeToken,
  callback,
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const { account } = useWallet();
  const [copied, copy] = useCopy();
  const theme = useTheme();

  useEscCloseModal(close);
  usePositionModal(modalRef);

  return (
    <>
      <DepositModalBackground>
        <DepositModalWrapper ref={modalRef}>
          <div className="modal-body">
            <div className="header">
              <h6>Deposit</h6>
              <div className="close-wrap" onClick={close}>
                <IconClose className="close-icon" />
              </div>
            </div>

            <DepositLabel>
              <div className="title">
                <label>Supported Tokens</label>
                <DepositTooltip tooltip="The only types of tokens that are available for deposits." />
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
                <label>Deposit Network</label>
                <DepositTooltip tooltip="The network of the token to be deposited." />
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

                  <div className="approximately">≈ 4 seconds</div>
                </div>
              </DepositBoxContent>
            </DepositLabel>

            <DepositLabel>
              <div className="title">
                <label>Deposit Address</label>
                <DepositTooltip tooltip="The address that is retrieved from your connected wallet for deposits. " />
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
                        text={copied ? "Copied!" : "Copy"}
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
              title={"Important Notes"}
              content={<DepositWarningContentWrapper>
                <ul>
                  <li>
                    Double-check to confirm that your deposit address above
                    matches the address in your connected wallet.
                  </li>
                  <li>
                    Only send supported tokens to this deposit address. Depositing
                    any other cryptocurrencies to this address will result in the
                    loss of your funds.
                  </li>
                </ul>

                <a
                  href="https://beta.gnoswap.io/"
                  target="_blank"
                  className="learn-more-box"
                >
                  <p>Learn More</p>
                  <IconNewTab color={theme.color.icon21} />
                </a>
              </DepositWarningContentWrapper>}
            />

            <Button
              onClick={close}
              text="Close"
              className="btn-deposit"
              style={{
                fullWidth: true,
                textColor: "text09",
                fontType: breakpoint !== DEVICE_TYPE.MOBILE ? "body7" : "body9",
              }}
            />
          </div>
        </DepositModalWrapper>
      </DepositModalBackground>
      <Overlay onClick={close} />
    </>
  );
};

export default DepositModal;

export const DepositTooltip: React.FC<{ tooltip: string }> = ({ tooltip }) => {
  const TooltipFloatingContent = (
    <DepositTooltipContent>{tooltip}</DepositTooltipContent>
  );

  return (
    <Tooltip placement="top" FloatingContent={TooltipFloatingContent}>
      <IconInfo size={16} />
    </Tooltip>
  );
};
