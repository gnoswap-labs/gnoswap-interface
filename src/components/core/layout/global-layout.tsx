import React from "react";
import styled, { ThemeProvider } from "styled-components";
import { ChildrenProps } from "@/common/types/global-prop-types";
import { theme } from "@/common/styles";
import { useBackground } from "@/common/hooks/use-background";

export const GlobalLayout = ({ children }: ChildrenProps) => {
	useBackground();
	return (
		<ThemeProvider theme={theme}>
			<Wrapper>{children}</Wrapper>
		</ThemeProvider>
	);
};

const Wrapper = styled.div``;
