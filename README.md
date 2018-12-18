# aria-tabs
Accessible, responsive, themeable, small footprint tabs web component

[Demonstration](https://codepen.io/schrotie/pen/margpb?editors=1111)

`<aria-tabs>` is a customizable tabs web-component/custom-element. Simply load the script, e.g. in your document's `<head>` and add checkboxes to your document.

Okay, it's probably not _that_ simple. `AriaTabs` is a class that handles the _ARIA_ (i.e. accessibility) aspect of tabs. `<aria-tabs>` comes with two themes:
* __classic__  
looks basically like a classical tabs, just themed and with some gradients
* __material__  
is a material design tabs variant

Each comes with a simple theming interface. Decide which one to use. If you are happy with the look and feel just include the respective file, add you colors and enjoy:
* `aria-tabsClassic.mjs`
* `aria-tabsMaterial.mjs`

# What File to Load
You only need to load one file. Which one that is depends on your specific needs. As noted above, `<aria-tabs>` comes with two pre-built themes. Thus first you should decide which theme to choose or if you want to build your own customized variant.

The pre-built dist (distribution) files are in the NPM package but not in the GitHub sources. If you loaded the latter you need to do `npm i; npm run build` to get them.

If you build your own, you should `import AriaTabs from '.../src/aria-tabs.mjs'` and do your own build. If you build a web application with static source code (as opposed to a page that is dynamically assembled by server side rendering) you should import the source version of your chosen themed tabs and have a custom build for your app.

If you want to use a pre-build tabs decide which and next decide which build to load. Each theme comes with three builds. `<aria-tabs>` uses the [ShadowQuery](https://github.com/schrotie/shadow-query) micro library to simplify web component implementation. Two builds bundle it, one doesn't. If you use more stuff that also needs ShadowQuery use the version where it's not bundled. That way you don't have to load it multiple times.
* __*.min.mjs__ minified EcmaScript Module without ShadowQuery
* __*.min.js__ minified ES6 script file with ShadowQuery bundled - use for all modern browsers except Edge
* __*.IE.min.js__ babel-transpiled ES5 for IE (and possibly Edge?) with ShadowQuery bundled

File sizes (gzipped): the minified tabs without ShadowQuery are ~4K, with ShadowQuery ~6K and transpiled with ShadowQuery ~16K.

## Deployment & Polyfills
Older versions of current browsers and IE don't fully support web components and may miss modern language features. For the former you need to load a polyfill, for the latter you need to load the transpiled `<aria-tabs>`.

In addition I strongly recommend that you load the polyfills only where required _and don't load transpiled code for browsers that don't need it!_ Transpiled means that the code went through babel. The code is twice as big and slower than the native ES6 ... and simply won't work in at least some modern browsers.

# Theming & Customization
If you want to theme/customize `aria-tabs` you'll need to write your own component and inherit from the `AriaTabs` base class. In your constructor you can - and should - pass a template to the `AriaTabs` contructor. That way you can generate the custom DOM you need, along with your styles. Please check the default template exported by `aria-tabs.mjs` and check the (really simple) implementation of `aria-tabsClassic.mjs` and `aria-tabsMaterial.mjs` to learn how this is done.

In addition the are some methods you may want to override in order to get you custom style for all aspects of the tabs:
* 	`get deleteButtonTemplate()` to create a custom delete button on the tabs
* `get tabTemplate()` to customize tab DOM
* `renderTabs(labels)` chances are, if you want a custom tab template, that template also requires custom initialization. Check the implementation of `aria-tabsMaterial.mjs` for an example. You don't need `get tabTemplate()` if you implement `rendeTabs(labels)`

## Note on IE
If you want to support IE you will need to coax the ShadyCSS polyfill to actually handle your component. If you just need a custom main template, just define your component as shown in `aria-tabsClassic.mjs` and you're fine. If you need more, check `aria-tabsMaterial.mjs`. It uses the `iniCss` export from `aria-tabs.mjs` to handle that.


# API

## Attributes
* __data-deletable__  
makes all tabs deletable if attribute is present
* __data-persistent__  
will show last opened tab (index!) when re-opening page. Pass a string that will be used as an ID for the persistent data. Uses `localStorage`.
__data-manual__  
when present, arrow key navigation will not activate but just focus tabs, activation then happens with space or enter key (useful for tabs that load additional content like whole sub-applcations)
__data-delay__  
optional delay when navigating with arrow keys - ignored when `data-manual`
__data-label__  
on the tab-panels, sets the title of the tab-button

Several attributes on the associated DOM are set automatically for accessibility support.

## property
`aria-tabs` automatically initializes several properties - for its own use and for inheriting (customized) tabs.

### DOM accessors
* tablist
* scrollButton
* tabs
* panels

### Attribute readers for the respective `data-...` attributes
* delay
* manual

## events
None so far.

## CSS custom properties
These are specific to the theme you use for the box. The shipped themes support the following:
* __--aria-tabs-bg-off__  
background color of inactive tab button
* __--aria-tabs-bg-on__  
background color of active tab button
* __--aria-tabs-fg-off__  
text color of inactive tab button
* __--aria-tabs-fg-on__  
text color of active tab button
* __--aria-tabs-flex__  
flex mode of tablist when not scrolling (space-between, space-around, start, end, center ...)
* __--aria-tabs-highlight-on__  
highlight color for active tab
* __--aria-tabs-highlight-sel__  
highlight color for focussed tab
* __--aria-tabs-border__  
border around tab buttons and panels
* __--aria-tabs-shadow__  
shadow of tab buttons and panels


## Method
Public methods should be considered `protected` - they are there to allow inheriting classes to customize certain aspects of `aria-tabs`.
* __initialize()__  
On first rendering and on the change of certain attributes, initialize is called. If you overwrite this method in an inherited class you'll most likely need to call `super.initialize()` in your `initialize` - before, after, or in between your initialization code
* __get tabTemplate()__  
returns the template (string) for the tab-buttons
* __renderTabs(labels)__
if you want a custom `tabTemplate` you likely need custom initialization of the tab buttons. Check aria-tabsMaterial.mjs on how to do this.
* __get deleteButtonTemplate()__  
returns the template for tab-delete buttons
* __delete(tab)__
delete a tab


# Accessibility features
See [W3C example](https://www.w3.org/TR/wai-aria-practices/examples/tabs/tabs-1/tabs.html).
