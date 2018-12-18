import $   from '../node_modules/shadow-query/shadowQuery.mjs';
/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 */

// For easy reference
const keys = {
	end: 35,
	home: 36,
	left: 37,
	up: 38,
	right: 39,
	down: 40,
	delete: 46,
	enter: 13,
	space: 32,
};

// Add or substract depending on key pressed
const direction = {
	37: -1,
	38: -1,
	39: 1,
	40: 1,
};

export const template = `
<style></style>
	<button
		role="navigation"
		aria-label="scroll left"
		aria-controls="tablist"
		aria-keyshortcuts="ArrowLeft"
		tabindex="-1"
	>&lang;</button>
	<div role="tablist" id="tablist">
		<slot name="tab"></slot>
	</div>
	<button
		role="navigation"
		aria-label="scroll right"
		aria-controls="tablist"
		aria-keyshortcuts="ArrowRight"
		tabindex="-1"
	>&rang;</button>
<slot></slot>
`;

export class AriaTabs extends HTMLElement {
	constructor(tmpl = template) {
		super();
		this._template = tmpl;
		this._bindCallbacks();
		this._iniTouch();
		if(this.childElementCount) this._iniDom();
		else {
			const observer = new MutationObserver(() => {
				observer.disconnect();
				this._iniDom();
			});
			observer.observe(this, {childList: true});
		}
	}

	_bindCallbacks() {
		this._boundDelTab       = this._delTab      .bind(this);
		this._boundOnClick      = this._onClick     .bind(this);
		this._boundOnFocus      = this._onFocus     .bind(this);
		this._boundOnKeydown    = this._onKeydown   .bind(this);
		this._boundOnKeyup      = this._onKeyup     .bind(this);
		this._boundOnLeft       = this._onLeft      .bind(this);
		this._boundOnRight      = this._onRight     .bind(this);
		this._boundOnScroll     = this._onScroll    .bind(this);
		this._boundOnTouchstart = this._onTouchstart.bind(this);
		this._boundUnnest       = this._unnest      .bind(this);
	}

	_iniTouch() {
		document.addEventListener('touchend',    this._onTouchend. bind(this));
		document.addEventListener('touchcancel', this._onTouchend. bind(this));
		document.addEventListener('touchmove',   this._onTouchmove.bind(this));
	}

	_iniDom() {
		if(this.hasAttribute('data-light-dom')) return this.initialize();
		$(this).shadow(this._template);
		this.initialize();
		this._iniDelButtons();
	}

	_iniDelButtons() {
		$(this, '[role="tab"]').append({
			condition: $(this, ':host').attr('data-deletable') !== null,
			template: this.deleteButtonTemplate,
		}).attr('data-deletable', true);
		$(this, '[role="tab"] [aria-label="delete"]')
			.on('click', this._boundDelTab);
		this._updateScroll();
	}

	get deleteButtonTemplate() {return /* html */`<button
		aria-keyshortcuts="Delete"
		tabindex="-1"
		aria-label="delete"
	>&#x274C;</button>`;}

	initialize() {
		this._iniDomAccessors();
		this.tabs.forEach((tab, index) => tab.index = index);
		this._iniTabEventHandlers();
		this._iniAria();
		this._iniScroll();
	}

	_iniDomAccessors() {
		if(this.shadowRoot) this._iniShadowAria();
		this.tablist = this._dom('[role="tablist"]');
		const id = this.tablist.attr('id');
		this.scrollButton = this._dom(
			`[role="navigation"][aria-controls="${id}"]`
		);
		this.tabs = this._dom('[role="tab"]');
		this.panels = this._dom('[role="tabpanel"]');
		if(this.shadowRoot && (this.panels.length !== this.tabs.length)) {
			this._iniTabs();
		}
	}

	_iniTabs() {
		const labels = this.panels.map(el => el.getAttribute('data-label'));
		this.renderTabs(labels);
		this.panels.forEach(
			(panel, idx) => panel.setAttribute('id', `aria-tab-${idx}-tab`)
		);
		this.tabs = this._dom('[role="tab"]');
	}

	renderTabs(labels) {
		this.tablist.append({
			array: labels,
			template: this.tabTemplate,
			update: (tab, label, idx) =>
				tab.text(label).attr('id', `aria-tab-${idx}`),
		});
	}

	get tabTemplate() {return /* html */`<button
		role="tab"
		aria-keyshortcuts="ArrowLeft ArrowRight Space Enter"
	> </button>`;}

	_iniTabEventHandlers() {
		this.tabs
			.off('click',      this._boundOnClick     )
			.on( 'click',      this._boundOnClick     )
			.off('focus',      this._boundOnFocus     )
			.on( 'focus',      this._boundOnFocus     )
			.off('keydown',    this._boundOnKeydown   )
			.on( 'keydown',    this._boundOnKeydown   )
			.off('keyup',      this._boundOnKeyup     )
			.on( 'keyup',      this._boundOnKeyup     )
			.off('touchstart', this._boundOnTouchstart)
			.on( 'touchstart', this._boundOnTouchstart);
	}

	_iniAria() {
		this._dom('[role="tab"] ~ [role="tab"]').attr('tabindex', -1);
		this.panels.attr('tabindex', 0);
		for(let tab of this.tabs) {
			tab = $(tab);
			const id = tab.attr('id');
			tab.attr('aria-controls', `${id}-tab`);
			this._dom(`#${id}-tab`).attr('aria-labelledby', id);
		}
		this._iniActiveTab();
	}

	_iniActiveTab() {
		const tabLen = this.tabs.length;
		if(!tabLen || this._dom('[role="tab"][aria-selected]').length) return;
		const last = this._lastPersisted;
		const idx = (last && (last.active < tabLen)) ? last.active : 0;
		this._activateTab(this.tabs[idx]);
	}

	get _lastPersisted() {
		const persistent = $(this, ':host').attr('data-persistent');
		if(persistent === null) return undefined;
		const last = localStorage.getItem(`aria-tabs-${persistent}`);
		if(last) return JSON.parse(last);
		return undefined;
	}
	set _lastPersisted(v) {
		const persistent = $(this, ':host').attr('data-persistent');
		if(persistent === null) return undefined;
		localStorage.setItem(`aria-tabs-${persistent}`, v);
	}

	_iniShadowAria() {
		$(this.children).attr('role', 'tabpanel');
		$(this, ':host [slot="tab"]').attr('role', 'tab');
	}

	_iniScroll() {
		this._updateScroll();
		if(this.scrollButton[0]) {$(this.scrollButton[0])
			.off('click', this._boundOnLeft)
			.on( 'click', this._boundOnLeft);}
		if(this.scrollButton[1]) {$(this.scrollButton[1])
			.off('click', this._boundOnRight)
			.on( 'click', this._boundOnRight);}
		this.tablist.on('scroll', this._boundOnScroll);
		window.addEventListener('resize', this._updateScroll.bind(this));
	}

	_updateScroll() {
		const scrolling =
			this.tablist.prop('scrollWidth') > this.tablist.prop('clientWidth');
		this.tablist.concat(this.scrollButton)
			.toggleClass('scrolling', scrolling);
		this._onScroll();
	}

	_dom(sel) {
		if(!this.shadowRoot) return $(this, sel).filter(this._boundUnnest);
		else return $(this, `${sel}, :host ${sel}`).filter(this._boundUnnest);
	}

	_unnest(el) {
		while(
			(el !== this.shadowRoot) &&
			(el !== this) &&
			(el.nodeName !== 'ARIA-TABS')
		) el = el.parentNode;
		return (el === this) || (el === this.shadowRoot);
	}

	// When a tab is clicked, activateTab is fired to activate it
	_onClick(event) {
		this._activateTab(event.currentTarget);
		event.preventDefault();
	}

	// Handle keydown on tabs
	_onKeydown(event) {
		switch (event.keyCode) {
		case keys.end:
			event.preventDefault();
			// Activate last tab
			if(this.manual) this.tabs[this.tabs.length - 1].focus();
			else this._activateTab(this.tabs[this.tabs.length - 1]);
			break;
		case keys.home:
			event.preventDefault();
			// Activate first tab
			if(this.manual) this.tabs[0].focus();
			else this._activateTab(this.tabs[0]);
			break;

		// Up and down are in keydown
		// because we need to prevent page scroll >:)
		case keys.up:
		case keys.down:
			this._determineOrientation(event);
			break;
		}
	}

	// Handle keyup on tabs
	_onKeyup(event) {
		switch (event.keyCode) {
		case keys.left:
		case keys.right:
			this._determineOrientation(event);
			break;
		case keys.delete:
			this._determineDeletable(event);
			break;
		case keys.enter:
		case keys.space:
			this._activateTab(event.target);
			break;
		}
	}

	_onFocus(event) {
		const target = event.target;
		this._scrollIntoView(target);
		if(this.manual) return;
		if(this._activationTimeout) clearTimeout(this._activationTimeout);
		this._activationTimeout = setTimeout(
			() => ($(target).attr('aria-selected') !== 'true') &&
			this._activateTabOnFocus(target),
			this.delay
		);
	}

	_activateTabOnFocus(target) {
		delete this._activationTimeout;
		if($(target).attr('aria-selected') !== 'true') this._activateTab(target);
	}

	_scrollIntoView(node) {
		const scroll = this._scroll;
		const offset = node.offsetLeft;
		const viewWidth = this.tablist.prop('clientWidth');
		const nodeWidth = node.offsetWidth;
		if((offset < scroll) || (((offset - scroll) + nodeWidth) > viewWidth)) {
			const viewCenter = viewWidth / 2;
			this._scroll = offset - viewCenter + nodeWidth / 2;
		}
	}

	get _scroll( ) {return this.tablist.prop('scrollLeft'   );}
	set _scroll(v) {return this.tablist.prop('scrollLeft', v);}

	_onLeft( ) {this._scroll = this._scroll - this._scrollIncrement;}
	_onRight() {this._scroll = this._scroll + this._scrollIncrement;}

	get _scrollIncrement() {
		return this.tabs.reduce((sum, tab) => sum + tab.offsetWidth, 0) /
			this.tabs.length;
	}

	_onScroll() {
		const scrolled = this._scroll;
		const clientWidth = this.tablist.prop('clientWidth');
		const scrollWidth =  this.tablist.prop('scrollWidth');
		const maxScrolled = (clientWidth + scrolled) >= scrollWidth;
		this.scrollButton
			.filter(el => el.getAttribute('aria-keyshortcuts') === 'ArrowLeft')
			.attr('aria-hidden', !scrolled);
		this.scrollButton
			.filter(el => el.getAttribute('aria-keyshortcuts') === 'ArrowRight')
			.attr('aria-hidden', maxScrolled);
	}

	_onTouchstart(event) {
		this._touch = {x:event.touches[0].screenX, scroll: this._scroll};
	}
	_onTouchmove(event) {
		if(!this._touch) return;
		const touch = event.touches[0];
		setTimeout(() =>
			this._scroll = this._touch.scroll + this._touch.x - touch.screenX
		);
	}
	_onTouchend() {delete this._touch;}

	// When a tablistâ€™s aria-orientation is set to vertical,
	// only up and down arrow should function.
	// In all other cases only left and right arrow function.
	_determineOrientation(event) {
		const key = event.keyCode;
		let proceed = false;

		if (this.tablist.attr('aria-orientation') == 'vertical') {
			if (key === keys.up || key === keys.down) {
				event.preventDefault();
				proceed = true;
			}
		}
		else if(key === keys.left || key === keys.right) proceed = true;
		if(proceed) this._switchTabOnArrowPress(event);
	}

	// Either focus the next, previous, first, or last tab
	// depening on key pressed
	_switchTabOnArrowPress(event) {
		const pressed = event.keyCode;

		if (direction[pressed]) {
			const target = event.target;
			if (target.index !== undefined) {
				if (this.tabs[target.index + direction[pressed]]) {
					this.tabs[target.index + direction[pressed]].focus();
				}
				else if (pressed === keys.left || pressed === keys.up) {
					this.tabs[0] && this.tabs[this.tabs.length - 1].focus();
				}
				else if (pressed === keys.right || pressed == keys.down) {
					this.tabs[0] && this.tabs[0].focus();
				}
			}
		}
	}

	// Activates any given tab panel
	_activateTab(tab) {
		if(!tab) return;
		// Deactivate all other tabs
		this._deactivateTabs();
		this._dom(`#${$(tab).attr('id')} ~ [role="tab"]`).addClass('afterActive');
		const controls = $(tab)
			.attr('tabindex', false)
			.attr('aria-selected', 'true')
			.attr('aria-controls');
		// Remove hidden attribute from tab panel to make it visible
		this._dom(`#${controls}`)
			.attr('aria-hidden', false)
			.attr('disabled', false)
			.attr('tabindex', '0');
		this._dom(`#${controls} ~ [role="tabpanel"]`).addClass('afterActive');
		this._lastPersisted = `{"active": ${tab.index}}`;
		if(tab !== document.activeElement) tab.focus();
	}

	// Deactivate all tabs and tab panels
	_deactivateTabs() {
		this.tabs
			.attr('tabindex', '-1')
			.attr('aria-selected', 'false')
			.removeClass('afterActive');
		this.panels.attr('aria-hidden', true)
			.attr('disabled', true)
			.attr('tabindex', '-1')
			.removeClass('afterActive');
	}

	// Detect if a tab is deletable
	_determineDeletable(event) {this.delete(event.target);}

	_delTab(event) {
		for(const el of event.composedPath()) {
			if(el.hasAttribute('role') && (el.getAttribute('role') === 'tab')) {
				event.stopPropagation();
				return this.delete(el);
			}
		}
	}
	delete(tab) {
		if (tab.getAttribute('data-deletable') !== null) {
			this._deleteTab({target: tab});
			this.initialize();
			if (tab.index - 1 < 0) this._activateTab(this.tabs[0]);
			else this._activateTab(this.tabs[tab.index - 1]);
		}
	}

	// Deletes a tab and its panel
	_deleteTab(event) {
		const target = event.target;
		const panel = this._dom(`#${target.getAttribute('aria-controls')}`)[0];
		target.parentElement.removeChild(target);
		panel.parentElement.removeChild(panel);
	}

	// Determine whether there should be a delay
	// when user navigates with the arrow keys
	get delay() {
		const delayAttr = $(this, ':host').attr('data-delay');
		return ((delayAttr !== null) && (delayAttr || 300)) || 0;
	}

	get manual() {return this.hasAttribute('data-manual');}
}

export function iniCss(template, element='aria-tabs') {
	window.ShadyCSS && iniShadyCss(template, element);
	return Promise.resolve(
		that => window.ShadyCSS && window.ShadyCSS.styleElement(that)
	);
}

export function defineAriaTabs(template, element='aria-tabs') {
	iniCss(template, element).then(ini =>
		window.customElements.define(element, class extends AriaTabs {
			constructor() {
				super(template);
				ini(this);
			}
		})
	);
}

function iniShadyCss(template, element) {
	const templateElement = document.createElement('template');
	templateElement.innerHTML = templateElement;
	window.ShadyCSS && window.ShadyCSS.prepareTemplate(templateElement, element);
}
