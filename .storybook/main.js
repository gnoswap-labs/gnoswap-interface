const path = require("path");

module.exports = {
	stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
	addons: [
		"@storybook/addon-links",
		"@storybook/addon-essentials",
		"@storybook/addon-interactions",
		"storybook-addon-styled-component-theme/dist/preset",
	],
	webpackFinal: async config => {
		config.resolve.modules = [
			path.resolve(__dirname, ".."),
			"node_modules",
			"/src/common/styles",
		];

		config.resolve.alias = {
			...config.resolve.alias,
			"@/components": path.resolve(__dirname, "../src/components"),
			"@/assets": path.resolve(__dirname, "../src/assets"),
		};

		return config;
	},
};
