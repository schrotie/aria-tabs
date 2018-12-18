import $ from '../node_modules/shadow-query/shadowQuery.mjs';

import {AriaTabs} from './aria-tabs.mjs';

import classicCss   from './classicCss.mjs';
import materialCss  from './materialCss.mjs';

window.customElements.define('aria-tabs', class extends AriaTabs {
	constructor() {
		super();
		$(this).on('attr:data-theme', this._css.bind(this));
		this._css();
	}

	renderTabs(labels) {
		this.tablist.append(
			($(this, ':host').attr('data-theme') === 'material') ?
				this._materialButtonTemplate(labels) :
				this._classicButtonTemplate(labels)
		);
	}

	_classicButtonTemplate(labels) {return {
		array: labels,
		template: '<button role="tab"> </button>',
		update: (tab, label, idx) =>
			tab.text(label).attr('id', `aria-tab-${idx}`),
	};}

	_materialButtonTemplate(labels) {return {
		array: labels,
		template: '<button role="tab"><span> </span></button>',
		update: (tab, label, idx) =>
			tab.attr('id', `aria-tab-${idx}`).query('span').text(label),
	};}

	_css() {
		const template = {
			'classic': classicCss,
			'material': materialCss,
			'custom':   ' ',
		}[$(this, ':host').attr('data-theme')] || classicCss;
		$(this, 'style').append({template});
		this.initialize();
	}
});
