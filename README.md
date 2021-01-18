# Gaia.DB

Gaia.DB is an online database package.

## Usage
### Site
**/management-accounts.html**

Is for list of all accounts.

**/userinfo.html?user=xxxx**
- user `<string>` Username of an account.

See account's info.

**/register.html**

Register an account.

### Server

**Server(path, settings)** [Class]
- path `<string>` Database folder path
- settings `<object>` Server settings
  - secret `<string>` Server secret key.

Create a server.

**Server.setup()** [AsyncFunction]

Setup the server.

**Server.run(app)** [AsyncFunction]

- app `<number>/<httpServer>`

Run the server. Note: Only run this after you run **Server.setup** function.

### Client

**Client(settings)** [Class]
- settings `<object>` Client's settings
  - settings.ip `<string>` Server's IP you want to connect
  - settings.port `<number>` Server's Port you want to connect
  - settings.username `<string>` Account's username you try to log as
  - settings.password `<string>` Account's password you try to log as

Make client.

**Client.setup(callbacks)** [Function]
- callbacks `<object>`
  - success `<function>` Success callback
  - fail `<function>` Fail callback

Setup WebSocket connection.

**Client.login(callbacks)** [Function]
- callbacks `<object>`
  - success `<function>` Success callback
  - fail `<function>` Fail callback

Connect to the server. Note: Only fire this after `Client.setup(...)`.

**Client.setup.async()** [Function]
Setup WebSocket connection.

**Client.login.async()** [Function]
Connect to the server. Note: Only fire this after `Client.setup(...)`.

**Client.createDB(databaseName, callbacks)** [Function]
- databaseName `<string>` Database's name
- callbacks `<object>`
  - success `<function>` Success callback
  - fail `<function>` Fail callback

Create a database.

**Client.deleteDB(databaseName, callbacks)** [Function]
- databaseName `<string>` Database's name
- callbacks `<object>`
  - success `<function>` Success callback
  - fail `<function>` Fail callback

Delete a database.

**Client.createKey(databaseName, keyName, callbacks)** [Function]
- databaseName `<string>` Database's name
- keyName `<string>` Key's name
- callbacks `<object>`
  - success `<function>` Success callback
  - fail `<function>` Fail callback
 
Create a key.

**Client.deleteKey(databaseName, keyName, callbacks)** [Function]
- databaseName `<string>` Database's name
- keyName `<string>` Key's name
- callbacks `<object>`
  - success `<function>` Success callback
  - fail `<function>` Fail callback

Delete a key.

**Client.getKey(databaseName, keyName, keyPath, callbacks)** [Function]
- databaseName `<string>` Database's name
- keyName `<string>` Key's name
- keyPath `<string>` Key's path
- callbacks `<object>`
  - success `<function>` Success callback
  - fail `<function>` Fail callback

Get key's value.

**Client.setKey(databaseName, keyName, keyValue, keyPath, callbacks)** [Function]
- databaseName `<string>` Database's name
- keyName `<string>` Key's name
- keyValue Key's new value
- keyPath `<string>`
- callbacks `<object>`
  - success `<function>` Success callback
  - fail `<function>` Fail callback
  
Set key's value.
  
**Client.createDB.async(databaseName)** [AsyncFunction]
- databaseName `<string>` Database's name

Create a database.

**Client.deleteDB.async(databaseName)** [AsyncFunction]
- databaseName `<string>` Database's name

Delete a database.

**Client.createKey(databaseName, keyName)** [AsyncFunction]
- databaseName `<string>` Database's name
- keyName `<string>` Key's name
 
Create a key.

**Client.deleteKey(databaseName, keyName)** [AsyncFunction]
- databaseName `<string>` Database's name
- keyName `<string>` Key's name

Delete a key.

**Client.getKey(databaseName, keyName, keyPath)** [AsyncFunction]
- databaseName `<string>` Database's name
- keyName `<string>` Key's name
- keyPath `<string>` Key's path

Get key's value.

**Client.setKey(databaseName, keyName, keyValue, keyPath)** [AsyncFunction]
- databaseName `<string>` Database's name
- keyName `<string>` Key's name
- keyValue Key's new value
- keyPath `<string>`

Set key's value.

**Client.Database(databaseName, callbacks)** [Function]
- databaseName `<string>` Database Name
- callbacks `<object>`
  - success `<function>` Success callback
  - fail `<function>` Fail callback

Create database manager.

**Client.Database.createDB(callbacks)** [Function]
- callbacks `<object>`
  - success `<function>` Success callback
  - fail `<function>` Fail callback

Create the database.

**Client.Database.deleteDB(callbacks)** [Function]
- callbacks `<object>`
  - success `<function>` Success callback
  - fail `<function>` Fail callback

Delete the database.

**Client.Database.setKey(keyName, keyValue, keyPath, callbacks)** [Function]
- keyName `<string>` Key's name
- keyValue Key's new value
- keyPath `<string>`
- callbacks `<object>`
  - success `<function>` Success callback
  - fail `<function>` Fail callback
  
Set key's value.

**Client.Database.getKey(keyName, keyPath, callbacks)** [Function]
- keyName `<string>` Key's name
- keyPath `<string>`
- callbacks `<object>`
  - success `<function>` Success callback
  - fail `<function>` Fail callback
  
Get key's value.

**Client.Database.deleteKey(keyName, callbacks)** [Function]
- keyName `<string>` Key's name
- callbacks `<object>`
  - success `<function>` Success callback
  - fail `<function>` Fail callback
  
Delete a key.

**Client.Database.createDB.async()** [ASyncFunction]

Create the database.

**Client.Database.deleteDB.async()** [AsyncFunction]

Delete the database.

**Client.Database.setKey.async(keyName, keyValue, keyPath)** [AsyncFunction]
- keyName `<string>` Key's name
- keyValue Key's new value
- keyPath `<string>`
  
Set key's value.

**Client.Database.getKey.async(keyName, keyPath)** [AsyncFunction]
- keyName `<string>` Key's name
- keyPath `<string>`

Get key's value.

**Client.Database.deleteKey.async(keyName)** [AsyncFunction]
- keyName `<string>` Key's name

Delete a key.

**Client.on(event, callback)** [Function]
- event `<string>` Event's name
- callback `<function>`

Register a callback to an event. You can check all events in `events.txt`.

**Client.once(event, callback)** [Function]
- event `<string>` Event's name
- callback `<function>`

Register a callback to an event but only fired once. You can check all events in `events.txt`.

**Client.off(event,id)** [Function]
- event `<string>` Event's name
- id Callback's ID

Delete a callback from an event. You can check all events in `events.txt`.

## Example
Check test folder.

## Bugs

## Changelogs
v1.2.2
- Fixed cannot login to the server after created an account.

v1.2.3
- Updated socket.io and socket.io-client to new version.

v2.0.0
- Added site plugin.

v2.1.0
- Added async functions those return promises.

v2.1.1
- Added a few functions explanation into readme.

v2.1.2
- Updated README.md

## Developers
- Gaia#7541 [Discord] = Back-End/Markdown/Front-End
- RaeedDoesGaming#6489 [Discord] = Front-End
- Odd Stranger#7957 [Discord] = Back-End/Markdown

## Support Us
- [Gaia's PayPal](https://paypal.me/nekomaru76)

## Special Thanks To
- Microsoft
- aurdev#0001 (Discord)
- Ryan Dahl
- Brendan Eich

# Plugins
- Site [https://localhost:port/]

## License
MIT