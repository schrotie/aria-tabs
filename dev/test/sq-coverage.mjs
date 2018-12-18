import $ from '../../node_modules/shadow-query/shadowQuery.mjs';

const template = `
<style>
:host {
	display: block;
	margin: 0 50px;
	font: 12px/1 "Helvetica Neue", Helvetica, Arial, sans-serif;
	position: relative;
}
h1 {font-weight: 200;}
#total {
	color: white;
	padding: 0 5px;
	border-radius: 3px;
}
#i {
	font-size: 0.7em;
	margin-left: 1em;
}
p {
	margin: 0;
	font-size: 0.8em;
	max-width: 40em;
	position: absolute;
	top: -2px;
	background: rgba(255, 255, 255, 0.8);
	padding: 3px;
	opacity: 0;
	transition: 0.5s;
}
h1:hover p {opacity: 1;}
.code {
	display: inline-block;
	font-family: monospace;
	background: lightgray;
	border-radius: 3px;
	padding: 1px 3px;
}
#coverage span  {display: inline-block; width: 3em; text-align: right;}
#coverage label {display: inline-block; margin-left: 1em;}
section.hidden {display: none;}
</style>
<h1>Coverage <span id="total"> </span><span id="i">(Cached! &#8505;)
<p>This data is cached! To update: <span class='code'>npm test</span> and
reload this page. This mostly happens automatically, when you enable
<span class='code'>tdd</span> (test driven development) in package.json.</p>
</span></h1>
<ul id="coverage"></ul>
`;
customElements.define('sq-coverage', class extends HTMLElement {
	constructor() {
		super();
		$(this).on('prop:coverage', this._update.bind(this)).shadow(template);
	}
	_update() {
		$(this, '#total').text(this._percent).attr('style', this._coverageBar);
		$(this, 'ul').append({
			array: this._coverageArray,
			condition: this._showCoverage,
			template: '<li><span> </span>%<label> </label></li>',
			update: this._updateFileCoverage,
		});
	}
	get _percent() {
		const covered = this.coverage.file.length;
		const missing = this.coverage.missing.length;
		const total = covered + missing;
		return `${((covered / total) * this.coverage.ratio * 100).toFixed(2)}%`;
	}
	get _coverageBar() {
		const stop = `green ${this._percent}, red ${this._percent}`;
		return `background: linear-gradient(90deg, green, ${stop}, red);`;
	}
	get _showCoverage() {
		return this.coverage.missing.length || (
			this.coverage.file.length && (this.coverage.ratio !== 1)
		);
	}
	get _coverageArray() {
		return this.coverage.file.concat(
			this.coverage.missing.map(el => {return {ratio: 0, url: el};})
		);
	}
	_updateFileCoverage(li, coverage) {
		li.query('label').text(coverage.url);
		li.query('span' ).text((coverage.ratio * 100).toFixed(2));
	}
});
