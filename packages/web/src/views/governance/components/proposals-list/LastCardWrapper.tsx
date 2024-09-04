import React from "react";

import { useIntersectionObserver } from "@hooks/common/use-interaction-observer";

const withLastCheck = <P extends object>(
  ProposalCard: React.ComponentType<P>,
  callback: () => void,
) => {
  const LastCardWrapper: React.FC<P> = (props: P) => {
    const { ref, entry } = useIntersectionObserver();
    if (entry?.isIntersecting) callback();
    return (
      <div ref={ref} style={{ width: "100%" }}>
        <ProposalCard {...props} />
      </div>
    );
  };

  return LastCardWrapper;
};

export default withLastCheck;
