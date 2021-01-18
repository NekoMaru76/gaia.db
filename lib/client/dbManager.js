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
};

DatabaseManager.prototype.createDB.async = function() {
  return new Promise((resolve, reject) => {
    this.createDB({ success: resolve, fail: reject });
  });
};

DatabaseManager.prototype.deleteDB.async = function() {
  return new Promise((resolve, reject) => {
    this.deleteDB({ success: resolve, fail: reject });
  });
};

DatabaseManager.prototype.createKey.async = function(keyName) {
  return new Promise((resolve, reject) => {
    this.createKey(keyName, { success: resolve, fail: reject });
  });
};

DatabaseManager.prototype.deleteKey.async = function(keyName) {
  return new Promise((resolve, reject) => {
    this.deleteKey(keyName, { success: resolve, fail: reject });
  });
};

DatabaseManager.prototype.setKey.async = function(keyName, keyValue, keyPath) {
  return new Promise((resolve, reject) => {
    this.setKey(keyName, keyValue, keyPath, { success: resolve, fail: reject });
  });
};

DatabaseManager.prototype.getKey.async = function(keyName, keyPath) {
  return new Promise((resolve, reject) => {
    this.createKey(keyName, keyPath, { success: resolve, fail: reject });
  });
};

module.exports = DatabaseManager;