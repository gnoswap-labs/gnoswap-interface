import React from "react";
import styled from "styled-components";
import mixins from "@/common/styles/mixins";
import { ChildrenProps } from "@/common/types/global-prop-types";

export const GlobalLayout = ({ children }: ChildrenProps) => {
	return (
		<>
			<Wrapper>{children}</Wrapper>
		</>
	);
};

const Wrapper = styled.div`
	${mixins.flexbox("column", "center", "center")}
`;
