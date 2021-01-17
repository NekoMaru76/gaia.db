const Events = require("@evodev/eventemitter");
const WSManager = require(`${__dirname}/lib/server/webSocketManager.js`);
const DBManager = require(`${__dirname}/lib/server/dbManager.js`);
const HTTP = require("http");
const Site = require(`${__dirname}/plugins/site/index`);

const lock = (obj, name, value) => {
	return Object.defineProperty(obj, name, {
		value: value, writable: false
	});
};

class Server extends Events {
	constructor(dbPath, settings = {}) {
		super();
		
		this.connections = {};
    
		if (typeof settings !== "object") throw TypeError(`settings must be an object!`);
		if (typeof settings.secret !== "string") throw TypeError(`settings.secret must be a string!`);
		
		lock(this, "package_data", require(`${__dirname}/package-data.json`));
		lock(this, "settings", settings);
		lock(this, "dbPath", dbPath);
	}
  
	async setup() {
		lock(this, `dbManager`, await DBManager.bind(this)());
	}
  
	async run() {
		this.site = Site(this);
		this.app = HTTP.Server(this.site);
		this.ws = WSManager.bind(this)(this.app);
		
		this.app.listen(...arguments);
		
		return this.app;
	}
};

module.exports = Server;