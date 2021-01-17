const Server = require(`${__dirname}/../server.js`);
const server = new Server(`${__dirname}/db`, {
  secret: "KEMAL123"
});

(async () => {
	await server.setup();
	await server.run(3000, () => console.log(`Listening at localhost:3000/`));
})();