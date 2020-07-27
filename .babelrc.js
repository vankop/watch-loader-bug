module.exports = {
  "presets": [
		["@babel/preset-typescript", {
			"isTSX": true,
			"allExtensions": true
		}],
		"@vue/babel-preset-jsx",
		["@babel/preset-env", {
			modules: false
		}]
  ],
	"plugins": [
		["@babel/plugin-proposal-decorators", {
			"legacy": true
		}],
		"@babel/plugin-proposal-class-properties"
	]
}
