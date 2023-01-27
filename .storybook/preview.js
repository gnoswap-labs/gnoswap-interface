import { withThemesProvider } from "storybook-addon-styled-component-theme";
import { ThemeProvider } from "styled-components";
import { theme } from "../src/common/styles/theme";
import { GlobalStyle } from "../src/common/styles/global-style";

export const parameters = {
	actions: { argTypesRegex: "^on[A-Z].*" },
	controls: {
		matchers: {
			color: /(background|color)$/i,
			date: /Date$/,
		},
	},
};

export const decorators = [
	Story => (
		<>
			<GlobalStyle />
			<Story />
		</>
	),
];

const Themes = [theme];

addDecorator(withThemesProvider(Themes), ThemeProvider);
