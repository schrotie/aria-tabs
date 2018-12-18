const url = require('url');

module.exports = function(req) {
	const ref = req.headers && req.headers.referer;
	return ref && url.parse(ref).pathname;
};
