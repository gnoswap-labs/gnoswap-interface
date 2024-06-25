import { useScrollUp } from "@hooks/common/use-scroll-up";
import { PropsWithChildren } from "react";
import IconArrowUp from "../icons/IconArrowUp";
import { ScrollTopButton, ScrollTopContainer } from "./ScrollTopWrapper.styles";

export interface ScrollTopWrapperProps { }

function ScrollTopWrapper({
  children
}: PropsWithChildren<ScrollTopWrapperProps>) {
  const { scrollUp, canScrollUp } = useScrollUp();

  return (<ScrollTopContainer>
    {children}
    {canScrollUp && <ScrollTopButton onClick={scrollUp}>
      <IconArrowUp width="40" height="40" />
    </ScrollTopButton>}
  </ScrollTopContainer>);
}

export default ScrollTopWrapper;