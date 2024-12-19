import { EXT_URL } from "@constants/external-url.contant";

import { P } from "../common/common.styles";
import { StyledIconFile } from "../common/styled-icon-file/StyledIconFile";
import { Anchor, Flex } from "./LearnMore.styles";

export default function LearnMore() {
  return (
    <Anchor href={EXT_URL.DOCS.ROOT} target="_blank" rel="noreferrer">
      <Flex>
        <P as="span" color="text30">
          Learn More
        </P>
        <StyledIconFile />
      </Flex>
    </Anchor>
  );
}
