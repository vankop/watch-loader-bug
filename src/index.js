const path = require("path");
const { getRemainingRequest, stringifyRequest } = require("loader-utils");
const loader = path.resolve(__dirname, "./loader");

module.exports = function () {
	const remaining = getRemainingRequest(this);

// 	return `
// import {render} from ${stringifyRequest(this, `!${loader}!${remaining}`)};
//
// export default {
// 	functional: true,
// 	render
// };`;

	return `
import content from ${stringifyRequest(this, `!${loader}!${remaining}`)};

export default {
	functional: true,
	render: () => content
};`;
};
