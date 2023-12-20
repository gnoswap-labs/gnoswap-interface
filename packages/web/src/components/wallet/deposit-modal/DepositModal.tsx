import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconClose from "@components/common/icons/IconCancel";
import IconFailed from "@components/common/icons/IconFailed";
import IconInfo from "@components/common/icons/IconInfo";
import IconNewTab from "@components/common/icons/IconNewTab";
import { Overlay } from "@components/common/modal/Modal.styles";
import { QRCodeGenerator } from "@components/common/qr-code/QRCode";
import SelectPairButton from "@components/common/select-pair-button/SelectPairButton";
import Tooltip from "@components/common/tooltip/Tooltip";
import { useCopy } from "@hooks/common/use-copy";
import useEscCloseModal from "@hooks/common/use-esc-close-modal";
import { usePositionModal } from "@hooks/common/use-postion-modal";
import { useWallet } from "@hooks/wallet/use-wallet";
import { TokenModel } from "@models/token/token-model";
import { DEVICE_TYPE } from "@styles/media";
import React, { useRef } from "react";
import {
  BoxDescription,
  DepositBoxContent,
  DepositLabel,
  DepositModalBackground,
  DepositModalWrapper,
  DepositTooltipContent,
} from "./DepositModal.styles";

export const DEFAULT_DEPOSIT_GNOT = {
  type: "native",
  chainId: "dev.gnoswap",
  createdAt: "0001-01-01T00:00:00Z",
  name: "Gnoland",
  path: "gnot",
  decimals: 6,
  symbol: "GNOT",
  logoURI:
    "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/gno-native/images/gnot.svg",
  priceId: "gnot",
  description:
    "Gno.land is a platform to write smart contracts in Gnolang (Gno). Using an interpreted version of the general-purpose programming language Golang (Go), developers can write smart contracts and other blockchain apps without having to learn a language that’s exclusive to a single ecosystem. Web2 developers can easily contribute to web3 and start building a more transparent, accountable world.\n\nThe Gno transaction token, GNOT, and the contributor memberships power the platform, which runs on a variation of Proof of Stake. Proof of Contribution rewards contributors from technical and non-technical backgrounds, fairly and for life with GNOT. This consensus mechanism also achieves higher security with fewer validators, optimizing resources for a greener, more sustainable, and enduring blockchain ecosystem.\n\nAny blockchain using Gnolang achieves succinctness, composability, expressivity, and completeness not found in any other smart contract platform. By observing a minimal structure, the design can endure over time and challenge the regime of information censorship we’re living in today.",
  websiteURL: "https://gno.land/",
  displayPath: "Native",
  wrappedPath: "gno.land/r/demo/wugnot",
  balance: 9989743.152257,
} as const;

const DEFAULT_DEPOSIT_GRC20s = {
  type: "native",
  chainId: "dev.gnoswap",
  createdAt: "0001-01-01T00:00:00Z",
  name: "Gnoland",
  path: "gnot",
  decimals: 6,
  symbol: "GRC20s",
  logoURI:
    "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/gno-native/images/gnot.svg",
  priceId: "gnot",
  description:
    "Gno.land is a platform to write smart contracts in Gnolang (Gno). Using an interpreted version of the general-purpose programming language Golang (Go), developers can write smart contracts and other blockchain apps without having to learn a language that’s exclusive to a single ecosystem. Web2 developers can easily contribute to web3 and start building a more transparent, accountable world.\n\nThe Gno transaction token, GNOT, and the contributor memberships power the platform, which runs on a variation of Proof of Stake. Proof of Contribution rewards contributors from technical and non-technical backgrounds, fairly and for life with GNOT. This consensus mechanism also achieves higher security with fewer validators, optimizing resources for a greener, more sustainable, and enduring blockchain ecosystem.\n\nAny blockchain using Gnolang achieves succinctness, composability, expressivity, and completeness not found in any other smart contract platform. By observing a minimal structure, the design can endure over time and challenge the regime of information censorship we’re living in today.",
  websiteURL: "https://gno.land/",
  displayPath: "Native",
  wrappedPath: "gno.land/r/demo/wugnot",
  balance: 9989743.152257,
} as const;

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

            <BoxDescription>
              <div className="title">
                <IconFailed className="fail-icon" />
                <p>Important Notes</p>
              </div>
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

              <a href="https://beta.gnoswap.io/" target="_blank" className="learn-more-box">
                <p>Learn More</p>
                <IconNewTab color="#788feb" />
              </a>
            </BoxDescription>

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
