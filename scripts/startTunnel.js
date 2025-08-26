const localtunnel = require('localtunnel');

(async () => {
	const port = Number(process.env.PORT || 3001);
	try {
		const tunnel = await localtunnel({ port });
		// Do not write URL to disk or print it to avoid auto-inserting a public URL
		// keep process alive until killed
		tunnel.on('close', () => {
			process.exit(0);
		});
	} catch (err) {
		console.error('Tunnel error:', err && err.message ? err.message : err);
		process.exit(1);
	}
})();



