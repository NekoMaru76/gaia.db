const Io = require("socket.io-client");
const cuid = require("cuid");

/*
	Response Code
	
	1000 - Success
	
	4000 - Invalid package version.
	4001 - Invalid type.
	4002 - That user already exists.
	4003 - Server error.
	4004 - Invalid password.
	4005 - That user does not exist.
	4006 - Server is busy.
	4007 - That Database already exists.
	4008 - You haven't connected to the server.
	4009 - That database does not exist.
	4010 - Someone is using the user account right now.
	4011 - That key already exists.
	4012 - That key does not exist.
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
		case 4000:
			return "Invalid package version.";
		case 4001:
			return "Invalid type.";
		case 4002:
			return "That user already exists.";
		case 4003:
			return "Server error.";
		case 4004:
			return "Invalid password.";
		case 4005:
			return "That user does not exist.";
		case 4006:
			return "Server is busy.";
		case 4007:
			return "That database already exists.";
		case 4008:
			return "You haven't connected to the server.";
		case 4009:
			return "That database does not exist.";
		case 4010:
			return "Someone is using the user account right now.";
		case 4011:
			return "That key already exists.";
		case 4012:
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
					case 1000:
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
					case 1000:
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
					case 1000:
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
					case 1000:
						this.emit(`successGetKey`, { dbName, keyName, keyPath, keyValue: res.data });
						if (typeof callback.success === "function") callback.success(res.data);
						break;
					default:
						this.emit(`failSetKey`, translateCode(res.code), { dbName, keyName, keyValue, keyPath });
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
					case 1000:
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
					case 1000:
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
					case 1000:
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
					case 1000:
						this.emit("successAuth");
						if (typeof callback.success === "function") callback.success();
						this.ws.db.isConnected = true;
						break;
					case 4000:
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
						case 1000:
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