const fs = require("graceful-fs");
const path = require("path");
const bson = require("bson");
const cuid = require("cuid");
const del = require("del");
const $ = require("lodash");

const createFolder = path => {
  return new Promise(resolve => {
    fs.access(path, err => {
      if (err)
        fs.mkdir(path, err => {
          if (err) resolve(403);
          else resolve(200);
        });
      else resolve(403);
    });
  });
};
const createFile = (path, content) => {
  return new Promise(resolve => {
    fs.access(path, err => {
      if (err)
        fs.writeFile(path, content, err => {
          if (err) resolve(403);
          else resolve(200);
        });
      else resolve(403);
    });
  });
};
const writeFile = (path, content) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, content, err => {
      if (err) reject(403);
      else resolve(200);
    });
  });
};
const deleteFile = path => {
  return new Promise((resolve, reject) => {
    fs.unlink(path, err => {
      if (err) reject(403);
      else resolve(200);
    });
  });
};
const deleteFolder = path => {
  return new Promise((resolve, reject) => {
    del([path]).then(res => {
      if (!res.includes(path)) reject(403);
      else resolve(200);
    });
  });
};
const readFile = (path, buffer = false) => {
  return new Promise((resolve, reject) => {
    const callback = (err, data) => {
      if (err) reject(err);
      else resolve(data);
    };

    fs.readFile(
      path,
      buffer ? callback : "utf8",
      buffer ? undefined : callback
    );
  });
};

async function DBManager() {
  const db = {
    folder: this.dbPath,
    main: path.join(this.dbPath, `index.bson`),
    users: path.join(this.dbPath, `users`),
    async getDBKeyPath(user, dbName, keyName) {
      try {
        for (const check of [user, dbName, keyName])
          if (typeof check !== "string") return 401;

        const id = await db.getDBKeyID(user, dbName, keyName);

        if (typeof id === "number") return id;

        const dbPath = await db.getDBFolder(user, dbName);

        if (typeof dbPath === "number") return dbPath;

        return path.join(dbPath, `datas`, `${id}.bson`);
      } catch {
        return 403;
      }
    },
    async getDBKeyData(user, dbName, keyName) {
      try {
        const keyPath = await db.getDBKeyPath(user, dbName, keyName);

        if (typeof keyPath === "number") return keyPath;

        return bson.deserialize(await readFile(keyPath, true));
      } catch {
        return 403;
      }
    },
    async getDBKeyID(user, dbName, keyName) {
      for (const check of [user, dbName, keyName])
        if (typeof check !== "string") return 401;

      try {
        const dbPath = await db.getDBFolder(user, dbName);
        const dbData = await db.getMainDataDB(user, dbName);
        const dataPath = await db.getMainPathDB(user, dbName);

        for (const check of [dbPath, dbData, dataPath])
          if (typeof check === "number") return check;

        return Object.keys(dbData.datas)[
          Object.values(dbData.datas).indexOf(keyName)
        ];
      } catch (e) {
        return typeof e === "number" ? e : 403;
      }
    },
    async getDBFolder(user, name) {
      for (const check of [user, name])
        if (typeof check !== "string") return 401;

      try {
        const userPath = await db.getUserPath(user);

        if (!userPath) return 405;

        const data = await db.getMainDataUser(user);

        if (!data.datas[name]) return 409;

        const folderPath = path.join(userPath, `datas`, data.datas[name]);

        return folderPath;
      } catch {
        return 403;
      }
    },
    async getKey(user, dbName, keyName, keyPath) {
      try {
        for (const check of [user, dbName, keyName])
          if (typeof check !== "string") throw 401;

        if (typeof keyPath !== "string" && keyPath) throw 401;

        const dbData = await db.getDBKeyData(user, dbName, keyName);

        if (typeof dbData === "number") throw dbData;
        if (!keyPath) return dbData.datas;

        return $.get(dbData.datas, keyPath);
      } catch {
        return 403;
      }
    },
    async setKey(user, dbName, keyName, keyValue, keyPath) {
      for (const check of [user, dbName, keyName])
        if (typeof check !== "string") return 401;

      try {
        if (typeof keyPath !== "string" && keyPath) return 401;

        const dbPath = await db.getDBKeyPath(user, dbName, keyName);
        const dbData = await db.getDBKeyData(user, dbName, keyName);

        if (typeof dbPath !== 200 && typeof dbPath === "number") return dbPath;
        if (typeof dbData === "number") return dbData;
        if (keyPath) {
          $.set(dbData.datas, keyPath, keyValue);
        } else {
          dbData.datas = keyValue;
        }

        const r = await writeFile(dbPath, bson.serialize(dbData));

        if (r !== 200) return r;

        return 200;
      } catch {
        return 403;
      }
    },
    async createKey(user, dbName, keyName, keyValue) {
      for (const check of [user, dbName, keyName])
        if (typeof check !== "string") return 401;

      try {
        const mainPath = await db.getMainPathDB(user, dbName);
        const dbPath = await db.getDBFolder(user, dbName);
        const id = cuid();
        const mainData = await db.getMainDataDB(user, dbName);

        if (typeof mainData === "number") return mainData;

        mainData.datas[id] = keyName;
        const r = [];

        r.push(
          await writeFile(
            path.join(dbPath, `datas`, `${id}.bson`),
            bson.serialize({ datas: keyValue })
          )
        );
        r.push(await writeFile(mainPath, bson.serialize(mainData)));

        for (const check of r) if (typeof check === "number") return check;

        return 200;
      } catch {
        return 403;
      }
    },
    async deleteKey(user, dbName, keyName) {
      for (const check of [user, dbName, keyName])
        if (typeof check !== "string") return 401;

      try {
        const mainPath = await db.getMainPathDB(user, dbName);
        const dbPath = await db.getDBFolder(user, dbName);
        const mainData = await db.getMainDataDB(user, dbName);

        if (typeof mainData === "number") return mainData;

        const id = await db.getDBKeyID(user, dbName, keyName);

        delete mainData.datas[id];
        const r = [];

        r.push(await deleteFile(path.join(dbPath, `${id}.bson`)));
        r.push(await writeFile(mainPath, bson.serialize(mainData)));

        for (const check of r) if (check !== 200) return check;

        return 200;
      } catch {
        return 403;
      }
    },
    async getMainPathDB(user, name) {
      for (const check of [user, name])
        if (typeof check !== "string") return 401;

      try {
        const folderPath = await db.getDBFolder(user, name);

        if (typeof folderPath === "number") return folderPath;

        const mainPath = path.join(folderPath, `index.bson`);

        return mainPath;
      } catch {
        return 403;
      }
    },
    async getMainDataDB(user, name) {
      for (const check of [user, name])
        if (typeof check !== "string") return 401;

      try {
        const path = await db.getMainPathDB(user, name);

        if (typeof path === "number") return path;

        return bson.deserialize(await readFile(path, true));
      } catch {
        return 403;
      }
    },
    async isDatabaseExist(user, name) {
      for (const check of [user, name])
        if (typeof check !== "string") return 401;

      try {
        const userPath = await db.getUserPath(user);

        if (!userPath) return 405;

        const data = await db.getMainDataUser(user);
        const id = data.datas[name];

        return !!id;
      } catch {
        return 403;
      }
    },
    async createDatabase(user, name) {
      for (const check of [user, name])
        if (typeof check !== "string") return 401;

      try {
        const userPath = await db.getUserPath(user);

        if (!userPath) return 405;

        const id = cuid();
        const folderPath = path.join(userPath, `datas`, id);
        const mainPath = path.join(folderPath, `index.bson`);
        const datasPath = path.join(folderPath, `datas`);
        const data = await db.getMainDataUser(user);
        const main = bson.serialize({
          datas: {}
        });

        if (data.datas[name]) return 407;

        data.datas[name] = id;
        const res = [];

        res.push(await createFolder(folderPath));
        res.push(await createFile(mainPath, main));
        res.push(await createFolder(datasPath));
        res.push(
          await writeFile(
            path.join(userPath, `index.bson`),
            bson.serialize(data)
          )
        );
        res.push(await writeFile(mainPath, main));

        for (let r of res) if (r !== 200) return r;

        return 200;
      } catch {
        return 403;
      }
    },
    async deleteDatabase(user, name) {
      for (const check of [user, name])
        if (typeof check !== "string") return 401;

      try {
        const userPath = await db.getUserPath(user);

        if (!userPath) return 405;

        const data = await db.getMainDataUser(user);
        const id = data.datas[name];

        if (!id) return 409;

        delete data.datas[
          Object.keys(data.datas)[Object.values(data.datas).indexOf(id)]
        ];

        const folderPath = path.join(userPath, `datas`, id);

        try {
          const res_ = await writeFile(
            path.join(await db.getUserPath(user), "index.bson"),
            bson.serialize(data)
          );
          const res = await deleteFolder(folderPath);

          if (res !== 200) return res;
          if (res_ !== 200) return res_;
        } catch {
          return 403;
        }

        return 200;
      } catch {
        return 403;
      }
    },
    async getUserPath(user) {
      try {
        if (typeof user !== "string") return 401;

        const main = await db.getMainData();
        const id = main.users[user];

        if (!id) return;

        return path.join(db.users, id);
      } catch {
        return 403;
      }
    },
    async isExistUser(user) {
      if (typeof user !== "string") return 401;

      try {
        if (typeof (await db.getMainDataUser(user)) === "number") return false;

        return true;
      } catch (e) {
        return false;
      }
    },
    async doesQualify(data) {
      if (typeof data !== "object") return 401;

      try {
        if (!(await db.isExistUser(data.username))) return 405;
        const dataUser = await db.getMainDataUser(data.username);

        return dataUser.password === data.password;
      } catch {
        return false;
      }
    },
    async getMainDataUser(user) {
      if (typeof user !== "string") return 401;

      try {
        const main = await db.getMainData();

        return bson.deserialize(
          await readFile(
            path.join(await db.getUserPath(user), `index.bson`),
            true
          )
        );
      } catch {
        return 403;
      }
    },
    async createUser(user, password) {
      for (const check of [user, password])
        if (typeof check !== "string") return 401;

      try {
        const id = cuid();
        const fullPath = path.join(db.users, id);
        const main = await db.getMainData();

        if (main.users[user]) return 402;

        main.users[user] = id;
        const r1 = await createFolder(fullPath);
        const r2 = await createFolder(path.join(fullPath, "datas"));

        if (r1 === 403 || r2 === 403) return 403;

        await writeFile(db.main, bson.serialize(main));
        return await writeFile(
          path.join(fullPath, `index.bson`),
          bson.serialize({
            datas: {},
            password: password,
            createdAt: Date.now()
          })
        );
      } catch {
        return 403;
      }
    },
    async deleteUser(user) {
      if (typeof user !== "string") return 401;

      try {
        const main = await db.getMainData();
        const id = main.users[user];

        if (!id) return 405;

        delete main.users[user];
        await writeFile(db.main, bson.serialize(main));
        await deleteFolder(path.join(db.users, id));

        return 200;
      } catch {
        return 403;
      }
    },
    getMainData() {
      return new Promise((resolve, reject) => {
        fs.readFile(db.main, (err, content) => {
          if (err) return reject(403);

          resolve(bson.deserialize(content));
        });
      });
    }
  };

  await createFolder(db.folder);
  await createFolder(db.users);
  await createFile(
    db.main,
    bson.serialize({
      users: {}
    })
  );

  return db;
}

module.exports = DBManager;
