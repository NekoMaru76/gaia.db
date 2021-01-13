const fs = require("graceful-fs");
const Events = require("@evodev/eventemitter");
const WSManager = require(`${__dirname}/lib/client/webSocketManager`);
const DBManager = require(`${__dirname}/lib/client/dbManager`);

class Client extends Events {
	constructor(settings = {}) {
		super();
		
		this.settings = settings;
		this.package_data = {
			version: "1.2.0"
		};
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
	main() {
		return this.ws.db.auto.bind(this)(...arguments);
	}
	isAuthed() {
		if (!this.ws.db) return false;
		
		return this.ws.db.isAuthed;
	}
	isConnected() {
		if (!this.ws.db) return false;
		
		return this.ws.db.isConnected;
	}
	createUser() {
		return this.ws.db.createUser.bind(this)(...arguments);
	}
	createAccount() {
		return this.createUser();
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

module.exports = Client;