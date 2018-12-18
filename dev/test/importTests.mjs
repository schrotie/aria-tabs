export default function importTests() {
	let error = 'none';
	describe('Test Scripts', () => {
		it('should load without error', () => error.should.equal('none'));
	});
	return fetch('/test/')
	.then(res => res.json())
	.then(test => Promise.all(test.map(file => import(`/${file}`))))
	.catch(e => error = e);
}
