import './sq-coverage.mjs';

export default {
	startCoverage: () => (
		window.puppeteerStartCoverage && window.puppeteerStartCoverage()
	) || Promise.resolve(),
	coverageTest: describeCoverage,
};

function describeCoverage() {
	if(!window.puppeteerStopCoverage) return cachedCoverage();

	describe('coverage', () => {
		let coverage;
		before(() => {
			coverage = window.puppeteerStopCoverage().then(processCoverage);
			coverage.then(cov => fetch('/coverage', {
				method:      'POST',
				cache:       'no-cache',
				credentials: 'same-origin',
				headers:    {'Content-Type': 'application/json; charset=utf-8'},
				redirect:    'follow',
				referrer:    'no-referrer',
				body:        JSON.stringify(cov),
			}));
		});

		it('should cover the whole code', done => {
			coverage.then(cov => {
				cov.ratio.should.equal(1);
				coverage = cov;
				done();
			});
		});

		it('should cover all files', () => {
			coverage.missing.should.be.empty;
		});
	});
}

function cachedCoverage() {
	fetch('/dev/server/coverage.json')
		.then(response => response.json())
		.then(coverage =>
			document.querySelector('sq-coverage').coverage = coverage
		);
	return Promise.resolve();
}

function processCoverage(coverage) {
	return fetch('/src/')
		.then(res => res.json())
		.then(src => calculateCoverage(filterCoverage(coverage, src), src));
}

function filterCoverage(coverage, src) {
	for(const el of coverage.js) {
		el.url = el.url.replace(`${location.origin}/`, '');
	}
	return coverage.js.filter(el => src.indexOf(el.url) !== -1);
}

function calculateCoverage(coverage, src) {
	const out = {missing: src, file:[]};
	for(const file of coverage) {
		const fc = {totalBytes: file.text.length, ranges: file.ranges,
			usedBytes: 0, url: file.url};
		out.file.push(fc);
		src.splice(src.indexOf(file.url), 1);
		for(const range of file.ranges) fc.usedBytes += range.end - range.start;
		fc.uncoveredWhiteSpaces = uncoveredWhiteSpaces(file);
	}
	return summarizeCoverage(out);
}

function summarizeCoverage(coverage) {
	const files = coverage.file;
	for(const file of files) {
		file.coveredBytes = file.usedBytes    + file.uncoveredWhiteSpaces;
		file.ratio        = file.coveredBytes / file.totalBytes;
	}
	const reducer = property => (sum, file) => sum + file[property];
	const usedBytes  = files.reduce(reducer('coveredBytes'), 0);
	const totalBytes = files.reduce(reducer('totalBytes'),   0);
	coverage.ratio = usedBytes / totalBytes;
	return coverage;
}

function uncoveredWhiteSpaces(file) {
	let lastPosition = 0;
	let count = 0;
	for(const range of file.ranges) {
		for(let position = lastPosition; position < range.start; position++) {
			if(/\s|}/.test(file.text[position])) count++;
			//	console.log(
			// 	`"${file.text[position]}"`, /\s|}/.test(file.text[position])
			// );
		}
		lastPosition = range.end;
	}
	for(let position = lastPosition; position < file.text.length; position++) {
		if(/\s|}/.test(file.text[position])) count++;
		//	console.log(
		// 	`"${file.text[position]}"`, /\s|}/.test(file.text[position])
		// );
	}
	return count;
}
