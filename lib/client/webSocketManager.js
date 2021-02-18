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
	407 - That database already exists.
	408 - You haven't connected to the server.
	409 - That database does not exist.
	410 - Someone is using the user account right now.
	411 - That key already exists.
	412 - That key does not exist.
	413 - Invalid secret key.
*/

function translateCode(code) {
  switch (code) {
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
      return "That key does not exist.";
    case 413:
      return "Invalid secret key.";
  }
}

/*
 * Create a client.
 * @param {Object} settings
 * @param {string} settings.ip
 * @param {number} settings.port
 * @param {string} settings.username
 * @param {string} settings.password
 * @param {Object} settings.package_data
 */

function Client(settings) {
  const socket = Io(`${settings.ip}:${settings.port}`);
  
  socket.db = {
    isAuthed: false,
    isConnected: false,
    /*
     * Delete a database from a user.
     * @param {Object} callbacks
     * @param {Function} callbacks.success
     * @param {Function} callbacks.fail
     */
    deleteDatabase(name, callbacks = {}) {
      const id = cuid();

      socket.once(`response-${id}`, res => {
        switch(res.code) {
          case 200:
            this.emit(`successDeleteDatabase`, name);
            if (typeof callbacks.success === "function") callbacks.success();
            break;
          default:
            this.emit(`failDeleteDatabase`, translateCode(res.code), name);
            if (typeof callbacks.fail === "function")
              callbacks.fail(translateCode(res.code));
            break;
        }
      });
      socket.emit(`deleteDatabase`, name, id);
    },
    /*
     * Create a database for a user.
     * @param {string} name
     * @param {Object} callbacks
     * @param {Function} callbacks.success
     * @param {Function} callbacks.fail
     */
    createDatabase(name, callbacks = {}) {
      const id = cuid();

      socket.once(`response-${id}`, res => {
        switch (res.code) {
          case 200:
            this.emit(`successCreateDatabase`, name);
            if (typeof callbacks.success === "function") callbacks.success();
            break;
          default:
            this.emit(`failCreateDatabase`, translateCode(res.code), name);
            if (typeof callbacks.fail === "function")
              callbacks.fail(translateCode(res.code));
            break;
        }
      });
      socket.emit(`createDatabase`, name, id);
    },
    /*
     * Get database's keys.
     * @param {string} dbName
     * @param {Object} callbacks
     * @param {Function} callbacks.success
     * @param {Function} callbacks.fail
     */
    getKeys(dbName, callbacks = {}) {
      const id = cuid();
      
      socket.once(`response-${id}`, res => {
        switch (res.code) {
          case 200:
            this.emit(`successGetKeys`, { dbName });
            if (typeof callbacks.success === "function") callbacks.success();
            break;
          default:
            this.emit(`failGetKeys`, translateCode(res.code), {
              dbName
            });
            if (typeof callbacks.fail === "function")
              callbacks.fail(translateCode(res.code));
            break;
        }
      });
      socket.emit(`getKeys`, dbName, id);
    },
    /*
     * Set key's value from a database of a user.
     * @param {string} dbName
     * @param {string} keyName
     * @param {string} keyPath
     * @param {Object} callbacks
     * @param {Function} callbacks.success
     * @param {Function} callbacks.fail
     */
    setKey(dbName, keyName, keyValue, keyPath, callbacks = {}) {
      const id = cuid();

      socket.once(`response-${id}`, res => {
        switch (res.code) {
          case 200:
            this.emit(`successSetKey`, { dbName, keyName, keyValue, keyPath });
            if (typeof callbacks.success === "function") callbacks.success();
            break;
          default:
            this.emit(`failSetKey`, translateCode(res.code), {
              dbName,
              keyName,
              keyValue,
              keyPath
            });
            if (typeof callbacks.fail === "function")
              callbacks.fail(translateCode(res.code));
            break;
        }
      });
      socket.emit(`setKey`, dbName, keyName, keyValue, keyPath, id);
    },
    /*
     * Get key's value from database of a user.
     * @param {string} dbName
     * @param {string} keyName
     * @param {string} keyPath
     * @param {Object} callbacks
     * @param {Function} callbacks.success
     * @param {Function} callbacks.fail
     */
    getKey(dbName, keyName, keyPath, callbacks = {}) {
      const id = cuid();

      socket.once(`response-${id}`, res => {
        switch (res.code) {
          case 200:
            this.emit(`successGetKey`, {
              dbName,
              keyName,
              keyPath,
              keyValue: res.data
            });
            if (typeof callbacks.success === "function")
              callbacks.success(res.data);
            break;
          default:
            this.emit(`failSetKey`, translateCode(res.code), {
              dbName,
              keyName,
              keyPath
            });
            if (typeof callbacks.fail === "function")
              callbacks.fail(translateCode(res.code));
            break;
        }
      });
      socket.emit(`getKey`, dbName, keyName, keyPath, id);
    },
    /*
     * Create a key for a database of a user.
     * @param {string} dbName
     * @param {string} keyName
     * @param {Object} callbacks
     * @param {Function} callbacks.success
     * @param {Function} callbacks.fail
     */
    createKey(dbName, keyName, keyValue, callbacks = {}) {
      const id = cuid();

      socket.once(`response-${id}`, res => {
        switch (res.code) {
          case 200:
            this.emit(`successCreateKey`, { dbName, keyName });
            if (typeof callbacks.success === "function") callbacks.success();
            break;
          default:
            this.emit(`failCreateKey`, translateCode(res.code), {
              dbName,
              keyName
            });
            if (typeof callbacks.fail === "function")
              callbacks.fail(translateCode(res.code));
            break;
        }
      });
      socket.emit(`createKey`, dbName, keyName, keyValue, id);
    },
    /*
     * Delete a key from a database of user.
     * @param {string} dbName
     * @param {string} keyName
     * @param {Object} callbacks
     * @param {Function} callbacks.success
     * @param {Function} callbacks.fail
     */
    deleteKey(dbName, keyName, callbacks = {}) {
      const id = cuid();

      socket.once(`response-${id}`, res => {
        switch(res.code) {
          case 200:
            this.emit(`successDeleteKey`, { dbName, keyName });
            if (typeof callbacks.success === "function") callbacks.success();
            break;
          default:
            this.emit(`failDeleteKey`, translateCode(res.code), {
              dbName,
              keyName
            });
            if (typeof callbacks.fail === "function")
              callbacks.fail(translateCode(res.code));
            break;
        }
      });
      socket.emit(`deleteKey`, dbName, keyName, id);
    },
    /*
     * Login to the account.
     * @param {Object} callbacks
     * @param {Function} callbacks.success
     * @param {Function} callbacks.fail
     */
    login(callbacks = {}) {
      const id = cuid();

      socket.emit(
        "connectAccount",
        { username: this.settings.username, password: this.settings.password },
        id
      );
      socket.once(`response-${id}`, res => {
        switch (res.code) {
          case 200:
            this.ws.db.isConnected = true;
            if (typeof callbacks.success === "function") callbacks.success();
            this.emit(`successConnect`);
            break;
          default:
            if (typeof callbacks.fail === "function") callbacks.fail(translateCode(res.code));
            this.emit(`failConnect`, translateCode(res.code));
            break;
        }
      });
    },
    /*
     * Setup database connection.
     * @param {Object} callbacks
     * @param {Function} callbacks.success
     * @param {Function} callbacks.fail
     */
    setup(callbacks = {}) {
      socket.on("package-data", () => {
        const id = cuid();
		
        socket.once(`response-${id}`, res => {
          switch(res.code) {
            case 200:
              this.emit("successAuth");
              if (typeof callbacks.success === "function") callbacks.success();
              break;
            case 400:
              this.emit("failAuth", translateCode(res.code));
              if (typeof callbacks.fail === "function") callbacks.fail(translateCode(res.code));
              break;
          }
        });
        socket.emit("package-data", this.package_data, id);
      });
	  socket.emit("ready-package-data");
    }
  };

  return socket;
}

module.exports = Client;