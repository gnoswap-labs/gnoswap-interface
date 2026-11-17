import React from "react";

import { pulseSkeletonStyle } from "@constants/skeleton.constant";

import { OrderCardSkeletonWrapper } from "./OrderForm.styles";

/** Placeholder shown while switching between Swap, DCA and Limit, or while a form's config loads. */
const OrderCardSkeleton: React.FC<{ sections?: number }> = ({ sections = 3 }) => (
  <OrderCardSkeletonWrapper data-testid="order-card-skeleton">
    {Array.from({ length: sections }).map((_, index) => (
      <div key={index} className={index === sections - 1 ? "skeleton-section short" : "skeleton-section"}>
        <span css={pulseSkeletonStyle({ w: "60%", h: 22 })} />
        <span css={pulseSkeletonStyle({ w: "30%", h: 14 })} />
      </div>
    ))}
    <span css={pulseSkeletonStyle({ w: "100%", h: 57 })} />
  </OrderCardSkeletonWrapper>
);

export default OrderCardSkeleton;
