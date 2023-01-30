import React from "react";
import styled, { ThemeProvider } from "styled-components";
import { ChildrenProps } from "@/common/types/global-prop-types";
import { theme } from "@/common/styles";

export const GlobalLayout = ({ children }: ChildrenProps) => {
	return (
		<ThemeProvider theme={theme}>
			<Wrapper>{children}</Wrapper>
		</ThemeProvider>
	);
};

const Wrapper = styled.div``;
