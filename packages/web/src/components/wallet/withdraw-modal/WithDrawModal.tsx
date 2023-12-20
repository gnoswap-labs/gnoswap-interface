import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconClose from "@components/common/icons/IconCancel";
import IconFailed from "@components/common/icons/IconFailed";
import IconInfo from "@components/common/icons/IconInfo";
import IconNewTab from "@components/common/icons/IconNewTab";
import { Overlay } from "@components/common/modal/Modal.styles";
import SelectPairButton from "@components/common/select-pair-button/SelectPairButton";
import Tooltip from "@components/common/tooltip/Tooltip";
import useEscCloseModal from "@hooks/common/use-esc-close-modal";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { usePositionModal } from "@hooks/common/use-postion-modal";
import { useWallet } from "@hooks/wallet/use-wallet";
import { TokenModel } from "@models/token/token-model";
import { DEVICE_TYPE } from "@styles/media";
import React, { useCallback, useRef, useState } from "react";
import WithdrawStatus from "./confirm-swap-modal/WithdrawStatusModal";
import useWithdrawTokens from "./useWithdrawTokens";
import {
  BoxDescription,
  WithDrawModalBackground,
  WithDrawModalWrapper,
  WithdrawContent,
  WithdrawTooltipContent,
} from "./WithDrawModal.styles";

const DEFAULT_WITHDRAW_GNOT = {
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

interface Props {
  close: () => void;
  breakpoint: DEVICE_TYPE;
  withdrawInfo?: TokenModel;
  connected: boolean;
  changeToken: (token: TokenModel) => void;
  callback?: (value: boolean) => void;
}

function isAmount(str: string) {
  const regex = /^\d+(\.\d*)?$/;
  return regex.test(str);
}

const WithDrawModal: React.FC<Props> = ({
  close,
  breakpoint,
  withdrawInfo,
  connected,
  changeToken,
  callback,
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [amount, setAmount] = useState("0");
  const [address, setAddress] = useState("");

  const {
    isConfirm,
    setIsConfirm,
    onSubmit: handleSubmit,
    result,
    setResult,
  } = useWithdrawTokens();

  const { account } = useWallet();

  useEscCloseModal(close);
  usePositionModal(modalRef);

  const onChangeAmount = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      if (value !== "" && !isAmount(value)) return;
      setAmount(value);
      // TODO
      // - mapT0AmountToT0Price
      // - mapT0AmpuntT1Amount
      // - mapT1AmpuntT1Price
    },
    [],
  );

  const onChangeAddress = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setAddress(value);
    },
    [],
  );

  const onSubmit = () => {
    if (!withdrawInfo || !account?.address) return;

    setIsConfirm(true);
    handleSubmit(
      {
        fromAddress: account?.address,
        toAddress: address,
        token: withdrawInfo,
        tokenAmount: Number(amount),
      },
      withdrawInfo.type,
    );
  };

  const onCancelConfirm = useCallback(() => {
    setIsConfirm(false);
    setResult(null);
  }, [setIsConfirm, setResult]);

  const isDisabledWithdraw = !Number(amount ?? 0) || !address || !withdrawInfo;
  const estimateFee = 0.000001;

  if (isConfirm) {
    return <WithdrawStatus swapResult={result} close={onCancelConfirm} />;
  }

  return (
    <>
      <WithDrawModalBackground>
        <WithDrawModalWrapper ref={modalRef}>
          <div className="modal-body">
            <div className="header">
              <h6>Withdraw</h6>
              <div className="close-wrap" onClick={close}>
                <IconClose className="close-icon" />
              </div>
            </div>

            <WithdrawContent>
              <p className="label">Select Token</p>
              <div className="withdraw">
                <div className="amount">
                  <input
                    className="amount-text"
                    value={amount}
                    onChange={onChangeAmount}
                    placeholder="0"
                  />
                  <div className="token">
                    <SelectPairButton
                      token={withdrawInfo ?? null}
                      changeToken={changeToken}
                      callback={callback}
                      // isHiddenArrow
                      // disabled
                    />
                  </div>
                </div>
                <div className="info">
                  <span className="price-text">
                    {!Number(amount) ? "-" : `$${amount}`}
                  </span>
                  <span className="balance-text">Available: -</span>
                </div>
              </div>
            </WithdrawContent>

            <WithdrawContent>
              <div className="title">
                <label>Withdrawal Network</label>
                <WithdrawTooltip tooltip="The network of the token to be withdrawn." />
              </div>

              <div className="withdraw">
                <div className="withdrawal-network">
                  <div className="network">
                    <img
                      src={DEFAULT_WITHDRAW_GNOT.logoURI}
                      alt="token logo"
                      className="token-logo"
                    />
                    <span className="token-symbol">Gnoland (GRC20)</span>
                  </div>

                  <div className="approximately">≈ 4 seconds</div>
                </div>
              </div>
            </WithdrawContent>

            <WithdrawContent>
              <div className="title">
                <label>Withdrawal Address</label>
                <WithdrawTooltip tooltip="The withdrawal address that funds will be sent to." />
              </div>

              <div className="withdraw">
                <div className="withdraw-address">
                  <input
                    className="address-input"
                    value={address}
                    onChange={onChangeAddress}
                    placeholder="Enter Address"
                  />
                </div>
              </div>
            </WithdrawContent>

            <BoxDescription>
              <div className="title">
                <IconFailed className="fail-icon" />
                <p>Important Notes</p>
              </div>
              <ul>
                <li>
                  Double-check to confirm that your withdrawal address above is
                  correct and on the Gnoland Mainnet blockchain.
                </li>
                <li>
                  DO NOT send tokens to contract addresses. Sending tokens to a
                  contract address may result in the loss of your funds.
                </li>
                <li>The transaction CANNOT be cancelled once sent.</li>
              </ul>

              <div className="learn-more-box">
                <p>Learn More</p>
                <IconNewTab color="#788feb" />
              </div>
            </BoxDescription>

            <WithdrawContent>
              <div className="withdraw">
                <p className="estimate-fee">Estimated Network Fee</p>
                <p className="tokens-fee">{estimateFee} GNOT ($0.12)</p>
              </div>
            </WithdrawContent>

            <Button
              disabled={isDisabledWithdraw}
              onClick={onSubmit}
              text="Withdraw"
              className="btn-withdraw"
              style={{
                fullWidth: true,
                textColor: "text09",
                fontType: breakpoint !== DEVICE_TYPE.MOBILE ? "body7" : "body9",
                hierarchy:
                  connected && !isDisabledWithdraw
                    ? ButtonHierarchy.Primary
                    : undefined,
                bgColor:
                  !connected || isDisabledWithdraw ? "background17" : undefined,
              }}
            />
          </div>
        </WithDrawModalWrapper>
      </WithDrawModalBackground>
      <Overlay onClick={close} />
    </>
  );
};

export default WithDrawModal;

export const WithdrawTooltip: React.FC<{ tooltip: string }> = ({ tooltip }) => {
  const TooltipFloatingContent = (
    <WithdrawTooltipContent>{tooltip}</WithdrawTooltipContent>
  );

  return (
    <Tooltip placement="top" FloatingContent={TooltipFloatingContent}>
      <IconInfo size={16} />
    </Tooltip>
  );
};
