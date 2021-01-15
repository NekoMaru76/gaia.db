const Server = require(`${__dirname}/../server.js`);
const server = new Server(`${__dirname}/db`);

(async () => {
	await server.setup();
	await server.run(3000);
})();