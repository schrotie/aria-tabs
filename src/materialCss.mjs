/* CSS vars */
import {bgOn}          from './cssCommon.mjs';
import {flex}          from './cssCommon.mjs';
import {highlightOn}   from './cssCommon.mjs';

/* CSS selectors */
import {hidden}        from './cssCommon.mjs';
import {nav}           from './cssCommon.mjs';
import {selected}      from './cssCommon.mjs';
import {tab}           from './cssCommon.mjs';
import {tablist}       from './cssCommon.mjs';

import {cssCommon}     from './cssCommon.mjs';

export default /* css */`
${cssCommon}
:host {
	overflow: hidden;
	white-space: nowrap;
}


/*** Tab Bar ***/

${tablist} {
	background: ${bgOn};
	box-shadow: 0 2px 4px rgba(0,0,0,.5);
	position: relative;
	z-index: 1;
	display: flex;
	justify-content: ${flex};
}


/*** Tab Buttons ***/

${tab} {flex: 1 0 auto;}
${tab}, ${nav} {
	padding: 1em;
	font-weight: bold;
	text-transform: uppercase;
	border: none;
	background: ${bgOn};
	line-height: 1em;
	outline: none;
}

${[':active', ':focus', ':hover'].map(el => tab + el).join(',\n')} {
	outline: 0;
	border-radius: 0;
}


/*** Tab Button Highlighting ***/

${tab} span,
${tab} [aria-label="delete"]  {position: relative;}

${tab}::after {
	position: absolute;
	bottom: 0;
	right: 0;
	left: 100%;
	border-bottom: 2px solid ${highlightOn};
	content: '';
	transition: .2s;
}

${tab}${selected }::after {right:   0 ; left: 0;}
${tab}.afterActive::after {right: 100%; left: 0;}

${
	[':focus', ':hover'].map(el =>
		tab + el + '::before,\n' + nav + el + '::before'
	).join(',\n')
} {
	position: absolute;
	bottom: 0;
	right: 0;
	left: 0;
	top: 0;
	content: '';
	background: ${highlightOn};
}

${tab}:hover::before, ${nav}:hover::before {opacity: 0.2;}
${tab}:focus::before, ${nav}:focus::before {opacity: 0.3;}

/* Ripple */
${tab} span::before {
	content: '';
	position: absolute;
	display: block;
	width: 128px;
	height: 128px;
	background: var(--aria-tabs-highlight-on, #055bf0);
	border-radius: 50%;
	transform: scale(0);
	opacity: 1;
	pointer-events: none;
	top: calc(50% - 64px);
	left: calc(50% - 64px);
}
${tab}${selected} span::before {
	transform: scale(1);
	opacity: 0;
	transition: 0.2s;
}


/*** Scroll Buttons ***/

${nav} {
	z-index: 2;
	height: calc(3em + 4px);
}

${tablist}.scrolling {justify-content: flex-start;}
${tablist}.scrolling ${tab}          {margin-left: 2em;}
${tablist}.scrolling ${tab} ~ ${tab} {margin-left: 0;}


/*** Tab Panels ***/

::slotted(*) {
	position: absolute;
	width: 100%;
	height: 100%;
	left: -100%;
	top: 2.9em;
	visibility: hidden;
	display: inline-block;
	white-space: normal;
	vertical-align: top;
	transition: left .2s, visibility 0s .2s, top 0s 0s;
}

::slotted(:not(${hidden})) {
	position: relative;
	visibility: visible;
	left: 0;
	top: 0;
	transition: left .2s, visibility 0s 0s, top 0s 0s;
}

::slotted(.afterActive) {left: 100%;}
::slotted(:focus) {outline: 0;}
`;
