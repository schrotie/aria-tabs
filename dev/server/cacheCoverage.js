const fs = require('fs');

module.exports = function(req, res, next) {
	if(req.method !== 'POST') return next();
	fs.writeFile(
		`${__dirname}/coverage.json`,
		JSON.stringify(req.body, null, '\t'),
		'utf8',
		err => {if(err) throw err;}
	);
};
