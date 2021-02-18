class DatabaseManager {
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
	getKeys() {
		return this.client.getKeys(this.name, ...arguments);
	}
	createDBAsync() {
		return new Promise((resolve, reject) => {
			this.client.createDB(this.name, { success: resolve, fail: reject });
		});
	}
	deleteDBAsync() {
		return new Promise((resolve, reject) => {
			this.client.deleteDB(this.name, { success: resolve, fail: reject });
		});
	}
	createKeyAsync(keyName, keyValue = {}) {
		return new Promise((resolve, reject) => {
			this.client.createKey(this.name, keyName, keyValue, { success: resolve, fail: reject });
		});
	}
	deleteKeyAsync(keyName) {
		return new Promise((resolve, reject) => {
			this.client.deleteKey(this.name, keyName, { success: resolve, fail: reject });
		});
	}
	setKeyAsync(keyName, keyValue, keyPath) {
		return new Promise((resolve, reject) => {
			this.client.setKey(this.name, keyName, keyValue, keyPath, { success: resolve, fail: reject });
		});
	}
	getKeyAsync(keyName, keyPath) {
		return new Promise((resolve, reject) => {
			this.client.getKey(this.name, keyName, keyPath, { success: resolve, fail: reject });
		});
	}
	getKeysAsync() {
		return new Promise((resolve, reject) => {
			this.client.getKeys(this.name, { success: resolve, fail: reject });
		});
	}
};

module.exports = DatabaseManager;