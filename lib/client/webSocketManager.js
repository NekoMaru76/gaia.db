const Io = require("socket.io-client");
const cuid = require("cuid");

/*
	Response Code
	
	200 - Success
	
	400 - Invalid package version.
	401 - Invalid type.
	402 - That user already exists.
	403 - Server error.
	404 - Invalid password.
	405 - That user does not exist.
	406 - Server is busy.
	407 - That Database already exists.
	408 - You haven't connected to the server.
	409 - That database does not exist.
	410 - Someone is using the user account right now.
	411 - That key already exists.
	412 - That key does not exist.
*/

/*
 * Create a client.
 * @param {Object} settings
 * @param {string} settings.ip
 * @param {number} settings.port
 * @param {string} settings.username
 * @param {string} settings.password
 * @param {Object} settings.package_data
 */
 
function translateCode(code) {
	switch(code) {
		case 400:
			return "Invalid package version.";
		case 401:
			return "Invalid type.";
		case 402:
			return "That user already exists.";
		case 403:
			return "Server error.";
		case 404:
			return "Invalid password.";
		case 405:
			return "That user does not exist.";
		case 406:
			return "Server is busy.";
		case 407:
			return "That database already exists.";
		case 408:
			return "You haven't connected to the server.";
		case 409:
			return "That database does not exist.";
		case 410:
			return "Someone is using the user account right now.";
		case 411:
			return "That key already exists.";
		case 412:
			return 'That key does not exist.';
	}
}

function Client(settings) {
	const socket = Io(`${settings.ip}:${settings.port}`);
	socket.db = {
		isAuthed: false,
		isConnected: false,
		deleteDatabase(name, callback = {}) {
			const id = cuid();
			
			socket.once(`response-${id}`, res => {
				switch(res.code) {
					case 200:
						this.emit(`successDeleteDatabase`, name);
						if (typeof callback.success === "function") callback.success();
						break;
					default:
						this.emit(`failDeleteDatabase`, translateCode(res.code), name);
						if (typeof callback.fail === "function") callback.fail(translateCode(res.code));
						break;
				}
			});
			socket.emit(`deleteDatabase`, name, id);
		},
		createDatabase(name, callback = {}) {
			const id = cuid();
			
			socket.once(`response-${id}`, res => {
				switch(res.code) {
					case 200:
						this.emit(`successCreateDatabase`, name);
						if (typeof callback.success === "function") callback.success();
						break;
					default:
						this.emit(`failCreateDatabase`, translateCode(res.code), name);
						if (typeof callback.fail === "function") callback.fail(translateCode(res.code));
						break;
				}
			});
			socket.emit(`createDatabase`, name, id);
		},
		setKey(dbName, keyName, keyValue, keyPath, callback = {}) {
			const id = cuid();
			
			socket.once(`response-${id}`, res => {
				switch(res.code) {
					case 200:
						this.emit(`successSetKey`, { dbName, keyName, keyValue, keyPath });
						if (typeof callback.success === "function") callback.success();
						break;
					default:
						this.emit(`failSetKey`, translateCode(res.code), { dbName, keyName, keyValue, keyPath });
						if (typeof callback.fail === "function") callback.fail(translateCode(res.code));
						break;
				}
			});
			socket.emit(`setKey`, dbName, keyName, keyValue, keyPath, id);
		},
		getKey(dbName, keyName, keyPath, callback = {}) {
			const id = cuid();
			
			socket.once(`response-${id}`, res => {
				switch(res.code) {
					case 200:
						this.emit(`successGetKey`, { dbName, keyName, keyPath, keyValue: res.data });
						if (typeof callback.success === "function") callback.success(res.data);
						break;
					default:
						this.emit(`failSetKey`, translateCode(res.code), { dbName, keyName, keyPath });
						if (typeof callback.fail === "function") callback.fail(translateCode(res.code));
						break;
				}
			});
			socket.emit(`getKey`, dbName, keyName, keyPath, id);
		},
		createKey(dbName, keyName, keyValue, callback = {}) {
			const id = cuid();
			
			socket.once(`response-${id}`, res => {
				switch(res.code) {
					case 200:
						this.emit(`successCreateKey`, { dbName, keyName });
						if (typeof callback.success === "function") callback.success();
						break;
					default:
						this.emit(`failCreateKey`, translateCode(res.code), { dbName, keyName });
						if (typeof callback.fail === "function") callback.fail(translateCode(res.code));
						break;
				}
			});
			socket.emit(`createKey`, dbName, keyName, keyValue, id);
		},
		deleteKey(dbName, keyName,  callback = {}) {
			const id = cuid();
			
			socket.once(`response-${id}`, res => {
				switch(res.code) {
					case 200:
						this.emit(`successDeleteKey`, { dbName, keyName });
						if (typeof callback.success === "function") callback.success();
						break;
					default:
						this.emit(`failDeleteKey`, translateCode(res.code), { dbName, keyName });
						if (typeof callback.fail === "function") callback.fail(translateCode(res.code));
						break;
				}
			});
			socket.emit(`deleteKey`, dbName, keyName, id);
		},
		createUser(callback = {}) {
			const id = cuid();
			
			socket.once(`response-${id}`, res => {
				switch(res.code) {
					case 200:
						this.emit(`successCreateUser`);
						if (typeof callback.success === "function") callback.success();
						break;
					default:
						this.emit(`failCreateUser`, translateCode(res.code));
						if (typeof callback.fail === "function") callback.fail();
						break;
				}
			});
			socket.emit(`makeUser`, { username: this.settings.username, password: this.settings.password }, id);
		},
		login(callback = {}) {
			const id = cuid();
			
			socket.once(`response-${id}`, res => {
				switch(res.code) {
					case 200:
						this.emit("successAuth");
						if (typeof callback.success === "function") callback.success();
						this.ws.db.isConnected = true;
						break;
					case 400:
						this.emit("failAuth", translateCode(res.code));
						if (typeof callback.fail === "function") callback.fail();
						break;
				}
			});
			socket.emit("package-data", this.package_data, id);
		},
		auto(callback = {}) {
			this.on("successAuth", () => {
				const id = cuid();
				
				socket.emit("connectAccount", { username: this.settings.username, password: this.settings.password }, id);
				socket.once(`response-${id}`, res => {
					switch(res.code) {
						case 200:
							if (typeof callback.success === "function") callback.success();
							this.emit(`successConnect`);
							break;
						default:
							if (typeof callback.fail === "function") callback.fail();
							this.emit(`failConnect`, translateCode(res.code));
							break;
					}
				});
			});
			socket.on("package-data", () => {
				socket.db.login.bind(this)(callback);
			});
		}
	};
	
	return socket;
};

module.exports = Client;