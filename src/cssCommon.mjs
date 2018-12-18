/* CSS vars */
const cv = 'var(--aria-tabs-';
export const bgOff        = `${cv}bg-off,           #eee)`;
export const bgOn         = `${cv}bg-on ,           #fbfcfe)`;
export const fgOff        = `${cv}fg-off,           #666)`;
export const fgOn         = `${cv}fg-on ,           #000)`;
export const flex         = `${cv}flex  ,           space-around)`;
export const highlightOn  = `${cv}highlight-on,     #055bf0)`;
export const highlightSel = `${cv}highlight-sel,    #f05305)`;
export const border       = `${cv}border, 1px solid #b7b7b8)`;
export const shadow       = `${cv}shadow, 0 0 .2em  #b7b7b8)`;

/* CSS selectors */
export const hidden       = '[aria-hidden]';
export const nav          = '[role="navigation"]';
export const selected     = '[aria-selected="true"]';
export const tab          = '[role="tab"]';
export const tablist      = '[role="tablist"]';

export const cssCommon = /* css */`
:host {
	display:flex;
	flex-direction: column;
	font-family: "lucida grande", sans-serif;
	position: relative;
}

:host > * {flex: 0 0 auto;}
:host slot {flex: 1 1 auto;}


/*** Tab Bar ***/

${tablist} {
	margin: 0 0 -.1em;
	overflow: hidden;
	white-space: nowrap;
	scroll-behavior: smooth;
}


/*** Tab Buttons ***/

${tab}, ${nav} {
	position: relative;
	margin: 0;
	font-family: inherit;
	font-size: inherit;
	color: ${fgOff};
}

${tab}${selected} {
	border-radius: 0;
	background: ${bgOn};
	color: ${fgOn};
	outline: 0;
}


/*** Tab Delete Buttons ***/

${tab} [aria-label="delete"] {
	border: 0 none transparent;
	background: transparent;
	margin: 0 0 0 0.3em;
	border-radius: 50%;
	padding: 0;
	width: 1em;
	height: 1em;
	font-size: 1.2em;
	opacity: 0;
	transition: 0.3s;
}
${tab}:active [aria-label="delete"],
${tab}:focus  [aria-label="delete"],
${tab}:hover  [aria-label="delete"] {
	opacity: 1;
}


/*** Scroll Buttons ***/

${nav} {
	display: block;
	position: absolute;
	left: 0;
	top: 0;
	color: ${fgOn};
}

${nav} ~ ${nav} {
	right: 0;
	left: unset;
}

${nav}${hidden} {display: none;}


/*** Tab Panels ***/

::slotted(*) {
	background: ${bgOn};
}
`;
