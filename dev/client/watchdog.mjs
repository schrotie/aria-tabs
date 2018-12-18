const sse = new EventSource('/events');

sse.addEventListener('testFailure', () => {
	open(`${location.origin}/dev/test`, 'test');
});

sse.addEventListener('update', () => location.reload());
