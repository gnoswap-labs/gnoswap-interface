import { StyledIconFile } from "../common/styled-icon-file/StyledIconFile";
import { Anchor, Flex, Text30 } from "./LearnMore.styles";

export default function LearnMore() {
  return (
    <Anchor href={"https://docs.gnoswap.io/"} target="_blank" rel="noreferrer">
      <Flex>
        <Text30>Learn More</Text30>
        <StyledIconFile />
      </Flex>
    </Anchor>
  );
}
