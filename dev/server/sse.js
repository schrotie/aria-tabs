const {exec}  = require('child_process');
const TDD     = require('minimist')(process.argv.slice(2)).ttd === 'true';
const referer = require('./referer.js');

class EventHandler {
	constructor() {
		this._id     = 0;
		this._appUI  = [];
		this._testUI = [];
		this.connect = this._connect   .bind(this);
		this.src     = this._notifySrc .bind(this);
		this.test    = this._notifyTest.bind(this);
	}
	_connect(req, res, next) {
		const path = referer(req);
		res.writeHead(200, {
			'Connection': 'keep-alive',
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache',
		});
		res.write(`id: ${this._id++}\nevent: connect\ndata:\n\n`);
		if(/^\/(index.html)?$/          .test(path)) this._appUI .push(res);
		if(/^\/dev\/test\/(index.html)$/.test(path)) this._testUI.push(res);
	}
	_notifySrc() {
		if(!this._appUI.length && !this._testUI.length) return;
		if(!TDD) return this._notify(this._appUI);
		exec('npm run run-test', (err, stdout, stderr) => {
			this._notify(this._testUI);
			if(err) this._notify(this._appUI, 'testFailure');
			this._notify(this._appUI);
		});
	}
	_notifyTest() {
		if(!this._testUI.length) return;
		if(!TDD) this._notify(this._testUI);
		else exec('npm run run-test', () => this._notify(this._testUI));
	}
	_notify(arr, event='update') {
		for(let i = arr.length; i > 0; --i) {
			try {arr[i].write(`id: ${this._id}\nevent: ${event}\ndata:\n\n`);}
			catch(e) {arr.splice(i, 1);}
		}
		this._id++;
	}
}

module.exports = new EventHandler();
