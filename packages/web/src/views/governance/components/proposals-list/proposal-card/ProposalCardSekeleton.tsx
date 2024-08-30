import { ProposalDetailWrapper } from "./ProposalCard.styles";
import { pulseSkeletonStyle } from "@constants/skeleton.constant";

const ProposalCardSkeleton = () => {
  return (
    <ProposalDetailWrapper>
      <div className="header">
        <div className="title" css={pulseSkeletonStyle({ w: "60%" })} />
        <div className="status success" css={pulseSkeletonStyle({ w: "7%" })} />
      </div>
      <div className="active-wrapper" css={pulseSkeletonStyle({ w: "30%" })} />
      <div className="header">
        <div css={pulseSkeletonStyle({ w: "70%" })} />
        <div
          className="status success"
          css={pulseSkeletonStyle({ w: "10%" })}
        />
      </div>
    </ProposalDetailWrapper>
  );
};

export default ProposalCardSkeleton;
