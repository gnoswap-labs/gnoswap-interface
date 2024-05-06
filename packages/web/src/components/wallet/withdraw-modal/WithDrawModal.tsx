import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconClose from "@components/common/icons/IconCancel";
import IconFailed from "@components/common/icons/IconFailed";
import IconInfo from "@components/common/icons/IconInfo";
import IconNewTab from "@components/common/icons/IconNewTab";
import { Overlay } from "@components/common/modal/Modal.styles";
import SelectPairButton from "@components/common/select-pair-button/SelectPairButton";
import Tooltip from "@components/common/tooltip/Tooltip";
import useEscCloseModal from "@hooks/common/use-esc-close-modal";
import { usePositionModal } from "@hooks/common/use-postion-modal";
import { useTokenData } from "@hooks/token/use-token-data";
import { useWallet } from "@hooks/wallet/use-wallet";
import { TokenModel } from "@models/token/token-model";
import { DEVICE_TYPE } from "@styles/media";
import { convertToMB } from "@utils/stake-position-utils";
import { addressValidationCheck } from "@utils/validation-utils";
import BigNumber from "bignumber.js";
import React, { useCallback, useRef, useState, useMemo } from "react";
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
  handleSubmit: (amount: string, address: string) => void;
  setIsConfirm: () => void;
  isConfirm: boolean;
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
  handleSubmit,
  setIsConfirm,
  isConfirm,
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");

  const { account } = useWallet();

  const { tokens, tokenPrices, displayBalanceMap } = useTokenData();

  useEscCloseModal(close);
  usePositionModal(modalRef);

  const onChangeAmount = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      if (value !== "" && !isAmount(value)) return;
      setAmount(value.replace(/^0+(?=\d)|(\.\d*)$/g, "$1"));
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

    setIsConfirm();
    handleSubmit(amount, address);
  };

  const getNativeToken = () => {
    if (!tokens || tokens.length === 0) return null;
    return tokens.find(token => token.type === "native");
  };

  const currentAvailableBalance =
    displayBalanceMap?.[withdrawInfo?.path ?? ""] ?? null;

  const isDisabledWithdraw =
    !Number(amount ?? 0) ||
    !address ||
    !withdrawInfo ||
    !addressValidationCheck(address) ||
    BigNumber(amount || "0").isGreaterThan(BigNumber(currentAvailableBalance || "0"));
  const estimateFee = 0.000001;
  const nativeToken = getNativeToken();
  const estimateFeeUSD =
    0.000001 *
    (Number(tokenPrices?.[nativeToken?.wrappedPath ?? ""]?.usd) || 0);
  const estimatePrice =
    withdrawInfo?.wrappedPath && !!amount && amount !== "0"
      ? convertToMB(
        BigNumber(+amount)
          .multipliedBy(
            Number(tokenPrices?.[withdrawInfo?.wrappedPath]?.usd ?? "0"),
          )
          .toString(),
      )
      : undefined;


  const handleEnterAllBalanceAvailable = () => {
    if (currentAvailableBalance) {
      setAmount(`${currentAvailableBalance}`);
    }
  };
  const text = useMemo(() => {

    if (!withdrawInfo) {
      return "Select a Token";
    }
    if (amount === "") {
      return "Enter Amount";
    }
    if (Number(amount) < 0.000001) {
      return "Amount Too Low";
    }
    if ((currentAvailableBalance && BigNumber(amount).isGreaterThan(BigNumber(currentAvailableBalance))) || !Number(amount || 0)) {
      return "Insufficient Balance";
    }
    if (address === "") return "Enter an Address";
    if (!addressValidationCheck(address)) return "Invalid Address";
    return "Withdraw";

  }, [address, amount, currentAvailableBalance, withdrawInfo]);

  if (isConfirm) {
    return null;
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
                    />
                  </div>
                </div>
                <div className="info">
                  <span className="price-text">
                    {estimatePrice ? `$${estimatePrice}` : "-"}
                  </span>
                  <span
                    className="balance-text"
                    onClick={handleEnterAllBalanceAvailable}
                  >{`Available: ${currentAvailableBalance
                      ? BigNumber(currentAvailableBalance)
                        .decimalPlaces(2)
                        .toFormat()
                      : "-"
                    }`}</span>
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

              <a href="https://beta.gnoswap.io/" target="_blank" className="learn-more-box">
                <p>Learn More</p>
                <IconNewTab color="#788feb" />
              </a>
            </BoxDescription>

            <WithdrawContent>
              <div className="estimate-box">
                <p className="estimate-fee">Estimated Network Fee</p>
                <p className="tokens-fee">{`${estimateFee} GNOT${estimateFeeUSD !== 0 ? ` ($${estimateFeeUSD})` : ""
                  }`}</p>
              </div>
            </WithdrawContent>

            <Button
              disabled={isDisabledWithdraw}
              onClick={onSubmit}
              text={text}
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
