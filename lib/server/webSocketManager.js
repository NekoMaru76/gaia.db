const Io = require("socket.io");
const equal = require("deep-equal");
const $ = require("lodash");

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

function Server(app) {
    const io = Io(app);

    io.db = {};

    io.on("connection", socket => {
        const user = {
            username: null,
            password: null,
            processi: false
        };

        socket.once("package-data", (data, id) => {
            if (typeof data !== "object" || !data) return socket.emit(`response-${id}`, {
                code: 401
            });
            if (!equal(this.package_data, data)) return socket.emit(`response-${id}`, {
                code: 400
            });

            socket.once("connectAccount", (data, id) => {
                if (typeof data !== "object" || !data || user.processi) return socket.emit(`response-${id}`, {
                    code: 401
                });

                user.processi = true;

                this.dbManager.doesQualify(data).then(res => {
                    user.processi = false;

                    if (!res || typeof res === "number") return socket.emit(`response-${id}`, {
                        code: typeof res === "number" ? res : 404
                    });
                    if (io.db[user.username]) return socket.emit(`response-${id}`, {
                        code: 410
                    });

                    user.username = data.username;
                    user.password = data.password;

                    socket.emit(`response-${id}`, {
                        code: 200
                    });

                    io.db[user.username] = true;
                });
            });
            socket.on("makeUser", (data, id) => {
                if (typeof data !== "object" || !data || typeof data.username !== "string" || typeof data.password !== "string") return socket.emit(`response-${id}`, {
                    code: 401
                });

                this.dbManager.isExistUser(data.username).then(res => {
                    if (res) return socket.emit(`response-${id}`, {
                        code: 402
                    });

                    try {
                        this.dbManager.createUser(data.username, data.password).then(res => {
                            socket.emit(`response-${id}`, {
                                code: res
                            });
                        }).catch(e => {
                            return socket.emit(`response-${id}`, {
                                code: e
                            });
                        });
                    } catch (e) {
                        return socket.emit(`response-${id}`, {
                            code: e
                        });
                    }
                });
            });
            socket.once("disconnect", () => {
                delete io.db[user.username];
            });
            socket.on("createDatabase", (name, id) => {
                if (typeof name !== "string") return socket.emit(`response-${id}`, {
                    code: 401
                });
                if (!user.username) return socket.emit(`response-${id}`, {
                    code: 408
                });

                this.dbManager.createDatabase(user.username, name).then(res => {
                    socket.emit(`response-${id}`, {
                        code: res
                    });
                });
            });
            socket.on("deleteDatabase", (name, id) => {
                if (typeof name !== "string") return socket.emit(`response-${id}`, {
                    code: 401
                });
                if (!user.username) return socket.emit(`response-${id}`, {
                    code: 408
                });

                this.dbManager.deleteDatabase(user.username, name).then(res => {
                    socket.emit(`response-${id}`, {
                        code: res
                    });
                });
            });
            socket.on("createKey", (dbName, keyName, keyValue, id) => {
                for (const name of [dbName, keyName])
                    if (typeof name !== "string") return socket.emit(`response-${id}`, {
                        code: 401
                    });

				this.dbManager.createKey(user.username, dbName, keyName, keyValue).then(res => {
					socket.emit(`response-${id}`, {
                        code: res
                    });
				});
            });
			socket.on("deleteKey", (dbName, keyName, id) => {
                for (const name of [dbName, keyName])
                    if (typeof name !== "string") return socket.emit(`response-${id}`, {
                        code: 401
                    });

				this.dbManager.deleteKey(user.username, dbName, keyName).then(res => {
					socket.emit(`response-${id}`, {
                        code: res
                    });
				});
            });
			socket.on("setKey", (dbName, keyName, keyValue, keyPath, id) => {
                for (const name of [dbName, keyName])
                    if (typeof name !== "string") return socket.emit(`response-${id}`, {
                        code: 401
                    });
				
				if (typeof keyPath !== "string" && keyPath) return 401;
				
				this.dbManager.setKey(user.username, dbName, keyName, keyValue, keyPath).then(res => {
					socket.emit(`response-${id}`, {
                        code: res
                    });
				});
            });
			socket.on("getKey", (dbName, keyName, keyPath, id) => {
                for (const name of [dbName, keyName])
                    if (typeof name !== "string") return socket.emit(`response-${id}`, {
                        code: 401
                    });
				
				if (typeof keyPath !== "string" && keyPath) return 401;
				
				this.dbManager.getKey(user.username, dbName, keyName, keyPath)
					.then(res => {
						socket.emit(`response-${id}`, {
							code: 200,
							data: res
						});
					})
					.catch(res => {
						socket.emit(`response-${id}`, {
							code: res,
							data: null
						});
					});
            });
            socket.emit(`response-${id}`, {
                code: 200
            });
        });
        socket.emit("package-data");
    });

    return io;
};

module.exports = Server;