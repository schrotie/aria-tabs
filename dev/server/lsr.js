const lsr = require('lsr').lsrAsync;
const url = require('url');

module.exports = function(dir) {return function(req, res, next) {
	if(url.parse(req.url).path !== '/') return next();
	lsr(dir).then(ls => {
		ls = ls.filter(el => /\.(m)?js$/.test(el.name)).map(el => el.fullPath);
		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify(ls));
	});
};};
