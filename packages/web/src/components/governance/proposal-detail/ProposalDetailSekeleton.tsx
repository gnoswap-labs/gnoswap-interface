import { ProposalDetailWrapper } from "./ProposalDetail.styles";
import { SHAPE_TYPES, skeletonTokenDetail } from "@constants/skeleton.constant";

const ProposalDetailSkeleton = () => {
  return (
    <ProposalDetailWrapper>
      <div className="header">
        <div
          className="title"
          css={skeletonTokenDetail("60%", SHAPE_TYPES.ROUNDED_SQUARE)}
        />
        <div
          className="status success"
          css={skeletonTokenDetail("7%", SHAPE_TYPES.ROUNDED_SQUARE)}
        />
      </div>
      <div
        className="active-wrapper"
        css={skeletonTokenDetail("30%", SHAPE_TYPES.ROUNDED_SQUARE)}
      />
      <div className="header">
        <div css={skeletonTokenDetail("70%", SHAPE_TYPES.ROUNDED_SQUARE)} />
        <div
          className="status success"
          css={skeletonTokenDetail("10%", SHAPE_TYPES.ROUNDED_SQUARE)}
        />
      </div>
    </ProposalDetailWrapper>
  );
};

export default ProposalDetailSkeleton;
