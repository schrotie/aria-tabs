const http        = require('http');

// connect stuff
const app           = require('connect')();
const bodyParser    = require('body-parser');
const serveStatic   = require('serve-static');

const chokidar      = require('chokidar');
const argv          = require('minimist')(process.argv.slice(2));

const events        = require('./dev/server/sse.js');
const lsr           = require('./dev/server/lsr.js');
const cacheCoverage = require('./dev/server/cacheCoverage.js');

const SERVER_PORT   = argv.port || 8080;

app.use(bodyParser.json());
app.use('/coverage', cacheCoverage);
app.use(serveStatic(__dirname));
app.use('/events', events.connect);
app.use('/src/',  lsr('src' ));
app.use('/test/', lsr('test'));

chokidar.watch('src',  {ignored: /(^|[/\\])\../}).on('change',  events.src);
chokidar.watch('test', {ignored: /(^|[/\\])\../}).on('change', events.test);

http.createServer(app).listen(SERVER_PORT, onStartup);
function onStartup() {
	if(argv.test === 'true') {
		const {exec} = require('child_process');
		exec('npm run run-test', (err, stdout, stderr) => {
			// eslint-disable-next-line no-console
			console.log(stdout);
			process.exit(err ? 1 : 0);
		});
	}
	// eslint-disable-next-line no-console
	else console.log(`Server running on ${SERVER_PORT}...`);
}
