import './mochaSetup.mjs';
import importTests from './importTests.mjs';
import puppeteer   from './puppeteer.mjs';

puppeteer.startCoverage()
	.then(importTests)
	.then(puppeteer.coverageTest)
	.then(() => {
		mocha.checkLeaks();
		mocha.run();
	});
