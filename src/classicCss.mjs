/* CSS vars */
import {bgOff}         from './cssCommon.mjs';
import {bgOn}          from './cssCommon.mjs';
import {fgOn}          from './cssCommon.mjs';
import {highlightOn}   from './cssCommon.mjs';
import {highlightSel}  from './cssCommon.mjs';
import {border}        from './cssCommon.mjs';
import {shadow}        from './cssCommon.mjs';

/* CSS selectors */
import {hidden}        from './cssCommon.mjs';
import {nav}           from './cssCommon.mjs';
import {selected}      from './cssCommon.mjs';
import {tab}           from './cssCommon.mjs';
import {tablist}       from './cssCommon.mjs';

import {cssCommon}     from './cssCommon.mjs';

export default /* css */`
${cssCommon}

/*** Tab Buttons ***/

${tab}, ${nav} {
	padding: .3em .5em .4em;
	border: ${border};
	border-radius: .2em .2em 0 0;
	box-shadow: ${shadow};
	overflow: visible;
	background: ${bgOff};
}

${tab} ~ ${tab} {margin-left: 0.5em;}


/*** Tab Button Highlighting ***/

${nav}:hover::before, ${tab}:hover::before, ${tab}:focus::before,
${tab}${selected}::before {
	position: absolute;
	bottom: 100%;
	right: -1px;
	left: -1px;
	border-radius: 0.2em 0.2em 0 0;
	border-top: 3px solid ${highlightSel};
	content: '';
}

${tab}${selected}:not(:focus):not(:hover)::before {
	border-top: 5px solid ${highlightOn};
}

${tab}${selected}::after {
	position: absolute;
	z-index: 3;
	bottom: -1px;
	right: 0;
	left: 0;
	height: .3em;
	background: ${bgOn};
	color: ${fgOn};
	box-shadow: none;
	content: '';
}

${tab}:hover, ${tab}:focus, ${tab}:active {
	outline: 0;
	border-radius: 0;
}

${tab}:hover::before, ${tab}:focus::before {
	border-color: ${highlightSel};
}


/*** Scroll Buttons ***/

${nav} {
	box-shadow:  5px 0px 4px -1px rgba(100, 100, 100, 0.5);
	height: calc(2em + 2px);
	z-index: 4;
}

${nav} ~ ${nav} {
	box-shadow: -5px 0px 4px -1px rgba(100, 100, 100, 0.5);
}

${tablist}.scrolling {padding: 0 1.6em;}


/*** Tab Panels ***/

::slotted(*) {
	position: relative;
	z-index: 2;
	border: ${border};
	border-radius: 0 .2em .2em .2em;
	box-shadow: ${shadow};
}

::slotted(${hidden}) {display: none;}

::slotted(:focus) {
	border-color: ${highlightSel};
	box-shadow: 0 0 .2em ${highlightSel};
	outline: 0;
}

::slotted(:focus)::after {
	position: absolute;
	bottom: 0;
	right: -1px;
	left: -1px;
	border-bottom: 3px solid ${highlightSel};
	border-radius: 0 0 0.2em 0.2em;
	content: '';
}
`;
