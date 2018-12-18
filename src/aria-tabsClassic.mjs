import {defineAriaTabs} from './aria-tabs.mjs';
import {template}       from './aria-tabs.mjs';

import classicCss       from './classicCss.mjs';

defineAriaTabs(template.replace('<style>', `<style>${classicCss}`));
