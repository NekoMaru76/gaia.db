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
	getKeys() {
		return this.ws.db.getKeys.bind(this)(...arguments);
	}
	setupAsyncfunction() {
		return new Promise((resolve, reject) => {
			this.ws.db.setup.bind(this)({ success: resolve, fail: reject });
		});
	}
	createDBAsync(dbName) {
		return new Promise((resolve, reject) => {
			this.ws.db.createDatabase.bind(this)(dbName, { success: resolve, fail: reject });
		});
	}
	deleteDBAsync(dbName) {
		return new Promise((resolve, reject) => {
			this.ws.db.deleteDatabase.bind(this)(dbName, { success: resolve, fail: reject });
		});
	}
	createKeyAsync(dbName, keyName) {
		return new Promise((resolve, reject) => {
			this.ws.db.createKey.bind(this)(dbName, keyName, { success: resolve, fail: reject });
		});
	}
	deleteKeyAsync(dbName, keyName) {
		return new Promise((resolve, reject) => {
			this.ws.db.deleteKey.bind(this)(dbName, keyName, { success: resolve, fail: reject });
		});
	}
	setKeyAsync(dbName, keyName, keyValue, keyPath) {
		return new Promise((resolve, reject) => {
			this.ws.db.setKey.bind(this)(dbName, keyName, keyValue, keyPath, { success: resolve, fail: reject });
		});
	}
	getKeyAsync(dbName, keyName, keyPath) {
		return new Promise((resolve, reject) => {
			this.ws.db.getKey.bind(this)(dbName, keyName, keyPath, { success: resolve, fail: reject });
		});
	}
	getKeysAsync(dbName) {
		return new Promise((resolve, reject) => {
			this.ws.db.getKeys.bind(this)(dbName, { success: resolve, fail: reject });
		});
	}
	loginAsync() {
		return new Promise((resolve, reject) => {
			this.ws.db.login.bind(this)({ success: resolve, fail: reject });
		});
    }
};

module.exports = Client;