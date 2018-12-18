import '../src/aria-tabs.mjs';

describe('<my-app>', () => {
	let node;
	beforeEach(() => {
		const test = document.querySelector('#test');
		test.innerHTML = '<my-app></my-app>';
		node = test.children[0];
	});
	it('should attach shadow', () => {
		(node.shadowRoot instanceof ShadowRoot).should.equal(false);
	});
});
