const fs = require('fs');
const path = require('path');
const localtunnel = require('localtunnel');

(async () => {
	const port = Number(process.env.PORT || 3001);
	try {
		const tunnel = await localtunnel({ port });
		const url = tunnel.url;
		const outPath = path.resolve(process.cwd(), '.tunnel-url');
		fs.writeFileSync(outPath, url, 'utf8');
		console.log('PUBLIC_URL=' + url);
		// keep process alive until killed
		tunnel.on('close', () => {
			try { fs.unlinkSync(outPath); } catch (_) {}
			process.exit(0);
		});
	} catch (err) {
		console.error('Tunnel error:', err && err.message ? err.message : err);
		process.exit(1);
	}
})();



