import { StyledIconFile } from "../common/styled-icon-file/StyledIconFile";
import { Anchor, Flex, Text30 } from "./LearnMore.styles";

export default function LearnMore() {
  return (
    <Flex>
      <Text30>
        <Anchor
          href={"https://docs.gnoswap.io/"}
          target="_blank"
          rel="noreferrer"
        >
          Learn More
        </Anchor>
      </Text30>
      <StyledIconFile />
    </Flex>
  );
}
