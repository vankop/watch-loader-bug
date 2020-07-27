const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const DefinePlugin = require('webpack/lib/DefinePlugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const babelOptions = require('./.babelrc')

module.exports = function (environment) {
	const configPath = environment.config || './config.local.js'
	const isDev = !!environment.development

	console.log(`Config: ${path.resolve(configPath)}`)
	console.log(`Debug: ${JSON.stringify(environment.debug || false)}`)
	console.log(`Development: ${JSON.stringify(environment.development || false)}`)

	process.env.NODE_ENV = isDev ? 'development' : 'production'

	return {
		mode: isDev ? 'development' : 'production',
		devtool: isDev ? false : 'hidden-source-map',
		output: {
			ecmaVersion: 2015,
			filename: isDev ? '[name].js' : '[name].[contenthash].js',
		},
		experiments: {
			asset: true,
		},
		devServer: {
			compress: false,
			port: 3000,
		},
		module: {
			rules: [
				{
					test: /\.vue$/,
					loader: 'vue-loader',
				},
				{
					test: /\.(svg|png|ttf|woff2?)$/,
					oneOf: [
						{
							loader: 'glyph-size-loader',
							issuer: /fontUtils\.ts$/,
							options: {
								ranges: [
									'cyrillic',
									[0, 0x00A0],
								],
							},
						},
						{
							type: 'asset',
						},
					],
				},
				{
					test: /\.(j|t)sx?$/,
					loader: 'babel-loader',
					options: babelOptions,
				},
				{
					test: /\.css$/,
					oneOf: [
						{
							include: path.resolve('./src'),
							resourceQuery: /module/,
							use: [
								MiniCssExtractPlugin.loader,
								{
									loader: 'css-loader',
									options: {
										modules: {
											localIdentName: isDev
											? '[path][name]__[local]'
											: '[hash:base64:4]',
										},
									},
								},
							],
						},
						{
							include: path.resolve('./src'),
							use: [
								MiniCssExtractPlugin.loader,
								{
									loader: 'css-loader',
								},
							],
						},
						{
							use: [
								MiniCssExtractPlugin.loader,
								{
									loader: 'css-loader',
								},
							],
						},
					],
				},
				{
					test: /\.md$/,
					use: [
						{ loader: 'html-loader' },
						{ loader: 'markdown-loader' },
					],
				},
			],
		},
		cache: false,
		resolve: {
			alias: {
				'~': path.resolve(__dirname, 'src'),
				'@': path.resolve(__dirname),
			},
			extensions: ['.vue', '.ts', '.js', '.tsx'],
		},
		optimization: {
			minimize: !environment.development,
			runtimeChunk: 'single',
			splitChunks: {
				chunks: 'all',
				cacheGroups: {
					defaultVendors: {
						test: /[\\/]node_modules[\\/]/,
						priority: -10,
						enforce: true,
						name: 'vendors',
					},
					default: {
						priority: -20,
						reuseExistingChunk: true,
					},
				},
			},
		},
		plugins: [
			new VueLoaderPlugin(),
			new DefinePlugin({
				__DEV__: isDev,
				__DEBUG__: !!environment.debug,
			}),
			new MiniCssExtractPlugin({
				filename: isDev ? '[name].css' : '[name].[contenthash].css',
				chunkFilename: isDev ? '[id].css' : '[contenthash].css',
				ignoreOrder: false,
			}),
			new HtmlWebpackPlugin({
				inject: 'body',
				template: path.resolve(__dirname, './assets/index.html')
			})
		]
	}
}
