const Events = require("@evodev/eventemitter");
const WSManager = require(`${__dirname}/lib/server/webSocketManager.js`);
const DBManager = require(`${__dirname}/lib/server/dbManager.js`);

const lock = (obj, name, value) => {
	return Object.defineProperty(obj, name, {
		value: value, writable: false
	});
};

class Server extends Events {
	constructor(dbPath, settings = {}) {
		super();
		
		this.connections = {};
		
		lock(this, "package_data", require(`${__dirname}/package-data.json`));
		lock(this, "settings", settings);
		lock(this, "dbPath", dbPath);
	}
	async setup() {
		lock(this, `dbManager`, await DBManager.bind(this)());
	}
	async run(app) {
		this.ws = await WSManager.bind(this)(app);
		
		return this.ws;
	}
};

module.exports = Server;