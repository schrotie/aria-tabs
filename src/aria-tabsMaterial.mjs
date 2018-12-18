import {AriaTabs} from './aria-tabs.mjs';
import {iniCss}   from './aria-tabs.mjs';
import {template}       from './aria-tabs.mjs';

import materialCss  from './materialCss.mjs';

const tmpl = template.replace('<style>', `<style>${materialCss}`);

iniCss(tmpl).then(ini => {
	window.customElements.define('aria-tabs', class extends AriaTabs {
		constructor() {
			super(tmpl);
			ini(this);
		}

		renderTabs(labels) {
			this.tablist.append({
				array: labels,
				template: '<button role="tab"><span> </span></button>',
				update: (tab, label, idx) =>
					tab.attr('id', `aria-tab-${idx}`).query('span').text(label),
			});
		}
	});
});
