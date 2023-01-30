const path = require("path");

module.exports = {
	stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
	addons: [
		"@storybook/addon-links",
		"@storybook/addon-essentials",
		"storybook-addon-styled-component-theme/dist/preset",
	],
	webpackFinal: async config => {
		config.module.rules.unshift({
			test: /\.svg$/,
			use: ["@svgr/webpack"],
		});

		config.resolve.modules = [
			path.resolve(__dirname, ".."),
			"node_modules",
			"styles",
		];

		return config;
	},
};
