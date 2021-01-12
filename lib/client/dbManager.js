module.exports = class DatabaseManager {
	constructor(client, databaseName) {
		this.client = client;
		this.name = databaseName;
	}
	createDB() {
		return this.client.createDB(this.name, ...arguments);
	}
	deleteDB() {
		return this.client.deleteDB(this.name, ...arguments);
	}
	createKey() {
		return this.client.createKey(this.name, ...arguments);
	}
	deleteKey() {
		return this.client.deleteKey(this.name, ...arguments);
	}
	setKey() {
		return this.client.setKey(this.name, ...arguments);
	}
	getKey() {
		return this.client.getKey(this.name, ...arguments);
	}
};