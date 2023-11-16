import { Divider, OneClickStakingWrapper } from "./OneClickStaking.styles";
import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import IconStrokeArrowRight from "@components/common/icons/IconStrokeArrowRight";
import { useAtom } from "jotai";
import { SwapState } from "@states/index";
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
  const [swapValue] = useAtom(SwapState.swap);
  const { tokenA = null, tokenB = null} = swapValue;
  
  return (
    <OneClickStakingWrapper>
      <div className="one-click-info">
        {tempDATA.map((item, index) => {
          return (
            <div key={index}>
              <div className="label">{item.label}</div>
              <div className="value">{item.value}%</div>
            </div>
          );
        })}
        <div>
          <div className="label">Rewards</div>
          <div className="value">
          <DoubleLogo
            left={tokenA?.logoURI || ""}
            right={tokenB?.logoURI || ""}
            size={24}
          />
          </div>
        </div>
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
                left={tokenA?.logoURI || ""}
                right={tokenB?.logoURI || ""}
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
                left={tokenA?.logoURI || ""}
                right={tokenB?.logoURI || ""}
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
