const path = require("path");

module.exports = function (environment) {
	const isDev = !!environment.development;

	console.log(
		`Development: ${JSON.stringify(environment.development || false)}`
	);

	process.env.NODE_ENV = isDev ? "development" : "production";

	return {
		mode: isDev ? "development" : "production",
		devtool: isDev ? false : "hidden-source-map",
		entry: path.resolve(__dirname, "./src/index.md"),
		output: {
			ecmaVersion: 2015,
			filename: isDev ? "[name].js" : "[name].[contenthash].js"
		},
		devServer: {
			inline: true,
			hot: true,
			stats: "minimal",
			contentBase: path.resolve(__dirname, "./dist"),
			overlay: true,
			historyApiFallback: true,
			compress: false,
			port: 3000
		},
		module: {
			rules: [
				{
					test: /\.md$/,
					loader: path.resolve("./src")
				}
			]
		},
		cache: {
			type: "filesystem",
			buildDependencies: {
				config: [__filename]
			}
		}
	};
};
