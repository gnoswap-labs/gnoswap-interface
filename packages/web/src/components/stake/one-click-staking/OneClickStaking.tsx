import { Divider, OneClickStakingWrapper } from "./OneClickStaking.styles";
import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import IconStrokeArrowRight from "@components/common/icons/IconStrokeArrowRight";

interface Props {
  handleClickGotoStaking: () => void;
}

const tempDATA = [
  {
    label: "Total APR",
    value: 108.85,
  },
  {
    label: "Fee APR",
    value: 108.85,
  },
  {
    label: "Staking APR",
    value: 108.85,
  },
  {
    label: "Rewards",
    value: (
      <DoubleLogo
        left="https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png"
        right="https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png"
        size={24}
      />
    ),
  },
];

const UNSTAKE_DATA = [
  {
    label: "ID 14450",
    value: 65541.51,
  },
  {
    label: "ID 14450",
    value: 65541.51,
  },
  {
    label: "ID 14450",
    value: 65541.51,
  },
];

const OneClickStaking: React.FC<Props> = ({ handleClickGotoStaking }) => {
  return (
    <OneClickStakingWrapper>
      <div className="one-click-info">
        {tempDATA.map((item, index) => {
          return (
            <div key={index}>
              <div className="label">{item.label}</div>
              <div className="value">{item.value}{index !== 3 ? "%" : ""}</div>
            </div>
          );
        })}
      </div>
      <Divider />
      <div className="unstake-info">
        <div className="title">
          <div className="label">My Unstaked Positions</div>
          <div className="value" onClick={handleClickGotoStaking}>
            Go to Staking <IconStrokeArrowRight />
          </div>
        </div>
        {UNSTAKE_DATA.map((item, index) => (
          <div className="content" key={index}>
            <div className="label">
              <DoubleLogo
                left="https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png"
                right="https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png"
                size={24}
              />
              {item.label}
            </div>
            <div className="value">${item.value}</div>
          </div>
        ))}
      </div>
      <div className="stake-info">
        <div className="title">
          <div className="label">My Staked Positions</div>
        </div>
        {UNSTAKE_DATA.map((item, index) => (
          <div className="content" key={index}>
            <div className="label">
              <DoubleLogo
                left="https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png"
                right="https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png"
                size={24}
              />
              {item.label}
            </div>
            <div className="value">${item.value}</div>
          </div>
        ))}
      </div>
    </OneClickStakingWrapper>
  );
};

export default OneClickStaking;
