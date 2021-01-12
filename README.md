# Gaia.DB

Gaia.DB is an online database package.

## Usage
### Server
**Server(path)** [Class]
---
- path `<string>` {Database folder path}

Create a server.

**Server.setup()** [AsyncFunction]
---
Setup the server.

**Server.run(port)** [AsyncFunction]
---
- port `<number>` {Port you want to listen}

Run the server. Note: Only run this after you run **Server.setup** function.

### Client
**Client(settings)**
- settings `<object>` {Client's settings}
  - settings.ip `<string>` {Server's IP you want to connect}
  - settings.port `<number>` {Server's Port you want to connect}
  - settings.username `<string>` {Account's username you try to log as}
  - settings.password `<string>` {Account's password you try to log as}

Make client.

**Client.main(callbacks)** [SyncFunction]
- callbacks `<object>`
  - success `<function>` {Success callback}
  - fail `<function>` {Fail callback}

Prepare WebSocket connection then connect to the server.

**Client.login(callbacks)** [SyncFunction]
- callbacks `<object>`
  - success `<function>` {Success callback}
  - fail `<function>` {Fail callback}

Connect to the server.

**Client.createUser(callbacks)** [SyncFunction]
- callbacks `<object>`
  - success `<function>` {Success callback}
  - fail `<function>` {Fail callback}

Create the user account.

**Client.createAccount(...)** [SyncFunction]
<Same with `Client.createUser(...)`>

**Client.deleteUser(callbacks)** [SyncFunction]
- callbacks `<object>`
  - success `<function>` {Success callback}
  - fail `<function>` {Fail callback}
  
Delete user account.

**Client.createDB(databaseName, callbacks)** [SyncFunction]
- databaseName `<string>` {Database's name}
- callbacks `<object>`
  - success `<function>` {Success callback}
  - fail `<function>` {Fail callback}

Create a database.

**Client.deleteDB(databaseName, callbacks)** [SyncFunction]
- databaseName `<string>` {Database's name}
- callbacks `<object>`
  - success `<function>` {Success callback}
  - fail `<function>` {Fail callback}

Delete a database.

**Client.createKey(databaseName, keyName, callbacks)** [SyncFunction]
- databaseName `<string>` {Database's name}
- keyName `<string>` {Key's name}
- callbacks `<object>`
  - success `<function>` {Success callback}
  - fail `<function>` {Fail callback}
 
Create a key.

**Client.deleteKey(databaseName, keyName, callbacks)** [SyncFunction]
- databaseName `<string>` {Database's name}
- keyName `<string>` {Key's name}
- callbacks `<object>`
  - success `<function>` {Success callback}
  - fail `<function>` {Fail callback}

Delete a key.

**Client.getKey(databaseName, keyName, keyPath, callbacks)** [SyncFunction]
- databaseName `<string>` {Database's name}
- keyName `<string>` {Key's name}
- keyPath `<string>` {Key's path}
- callbacks `<object>`
  - success `<function>` {Success callback}
  - fail `<function>` {Fail callback}

Get key's value.

**Client.setKey(databaseName, keyName, keyValue, keyPath, callbacks)** [SyncFunction]
- databaseName `<string>` {Database's name}
- keyName `<string>` {Key's name}
- keyValue {Key's new value}
- keyPath `<string>`
- callbacks `<object>`
  - success `<function>` {Success callback}
  - fail `<function>` {Fail callback}

**Client.Database(databaseName, callbacks)** [SyncFunction]
- databaseName `<string>` {Database Name}
- callbacks `<object>`
  - success `<function>` {Success callback}
  - fail `<function>` {Fail callback}

Create database manager.

**Client.Database.createDB(callbacks)** [SyncFunction]
- callbacks `<object>`
  - success `<function>` {Success callback}
  - fail `<function>` {Fail callback}

Create the database.

**Client.Database.deleteDB(callbacks)** [SyncFunction]
- callbacks `<object>`
  - success `<function>` {Success callback}
  - fail `<function>` {Fail callback}

Delete the database.

**Client.Database.setKey(keyName, keyValue, keyPath, callbacks)** [SyncFunction]
- keyName `<string>` {Key's name}
- keyValue {Key's new value}
- keyPath `<string>`
- callbacks `<object>`
  - success `<function>` {Success callback}
  - fail `<function>` {Fail callback}
  
Set key's value.

**Client.Database.getKey(keyName, keyPath, callbacks)** [SyncFunction]
- keyName `<string>` {Key's name}
- keyPath `<string>`
- callbacks `<object>`
  - success `<function>` {Success callback}
  - fail `<function>` {Fail callback}
  
Get key's value.

**Client.Database.deleteKey(keyName, callbacks)** [SyncFunction]
- keyName `<string>` {Key's name}
- callbacks `<object>`
  - success `<function>` {Success callback}
  - fail `<function>` {Fail callback}
  
Delete a key.

**Client.on(event, callback)** [SyncFunction]
- event `<string>` {Event's name}
- callback `<function>`

Register a callback to an event. You can check all events in `events.txt`.

**Client.once(event, callback)** [SyncFunction]
- event `<string>` {Event's name}
- callback `<function>`

Register a callback to an event but only fired once. You can check all events in `events.txt`.

**Client.off(event,id)** [SyncFunction]
- event `<string>` {Event's name}
- id {Callback's ID}

Delete a callback from an event. You can check all events in `events.txt`.

## Example
Check test folder.

## Developers
- Gaia#7541 [Discord]

## Support Us
- [Gaia's PayPal](https://paypal.me/nekomaru76)

## Special Thanks To
- Microsoft
- aurdev#0001 (Discord)
- Ryan Dahl
- Brendan Eich

## License
MIT