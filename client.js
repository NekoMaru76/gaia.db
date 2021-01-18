const Events = require("@evodev/eventemitter");
const WSManager = require(`${__dirname}/lib/client/webSocketManager`);
const DBManager = require(`${__dirname}/lib/client/dbManager`);

class Client extends Events {
	constructor(settings = {}) {
		super();
		
		this.settings = settings;
		this.package_data = require(`${__dirname}/package-data.json`);
		this.ws = WSManager.bind(this)(this.settings);
		
		this.ws.on("disconnect", () => {
			if (this.isConnected()) {
				this.ws.db.isConnected = false;
				this.emit("disconnect");
			}
		});
	}
	Database(name) {
		return new DBManager(this, name);
	}
	setup() {
		return this.ws.db.setup.bind(this)(...arguments);
	}
	isAuthed() {
		if (!this.ws.db) return false;
		
		return this.ws.db.isAuthed;
	}
	isConnected() {
		if (!this.ws.db) return false;
		
		return this.ws.db.isConnected;
	}
	createDB() {
		return this.ws.db.createDatabase.bind(this)(...arguments);
	}
	deleteDB() {
		return this.ws.db.deleteDatabase.bind(this)(...arguments);
	}
	createKey() {
		return this.ws.db.createKey.bind(this)(...arguments);
	}
	deleteKey() {
		return this.ws.db.deleteKey.bind(this)(...arguments);
	}
	setKey() {
		return this.ws.db.setKey.bind(this)(...arguments);
	}
	getKey() {
		return this.ws.db.getKey.bind(this)(...arguments);
	}
	login() {
		return this.ws.db.login.bind(this)(...arguments);
	}
};

Client.prototype.setup.async = function() {
  return new Promise((resolve, reject) => {
    this.setup({ success: resolve, fail: reject });
  });
};

Client.prototype.createDB.async = function(dbName) {
  return new Promise((resolve, reject) => {
    this.createDB(dbName, { success: resolve, fail: reject });
  });
};

Client.prototype.deleteDB.async = function(dbName) {
  return new Promise((resolve, reject) => {
    this.deleteDB(dbName, { success: resolve, fail: reject });
  });
};

Client.prototype.createKey.async = function(dbName, keyName) {
  return new Promise((resolve, reject) => {
    this.createKey(dbName, keyName, { success: resolve, fail: reject });
  });
};

Client.prototype.deleteKey.async = function(dbName, keyName) {
  return new Promise((resolve, reject) => {
    this.deleteKey(dbName, keyName, { success: resolve, fail: reject });
  });
};

Client.prototype.setKey.async = function(dbName, keyName, keyValue, keyPath) {
  return new Promise((resolve, reject) => {
    this.setKey(dbName, keyName, keyValue, keyPath, { success: resolve, fail: reject });
  });
};

Client.prototype.getKey.async = function(dbName, keyName, keyPath) {
  return new Promise((resolve, reject) => {
    this.getKey(dbName, keyName, keyPath, { success: resolve, fail: reject });
  });
};

Client.prototype.login.async = function() {
  return new Promise((resolve, reject) => {
    this.login({ success: resolve, fail: reject });
  });
};

module.exports = Client;