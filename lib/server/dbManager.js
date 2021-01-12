const fs = require("graceful-fs");
const path = require("path");
const bson = require("bson");
const cuid = require("cuid");
const del = require("del");
const $ = require("lodash");

const createFolder = path => {
	return new Promise(resolve => {
		fs.access(path, err => {
			if (err) fs.mkdir(path, err => {
				if (err) resolve(4003);
				else resolve(1000);
			});
			else resolve(4003);
		});
	});
};
const createFile = (path, content) => {
	return new Promise(resolve => {
		fs.access(path, err => {
			if (err) fs.writeFile(path, content, err => {
				if (err) resolve(4003);
				else resolve(1000);
			});
			else resolve(4003);
		});
	});
};
const writeFile = (path, content) => {
	return new Promise((resolve, reject) => {
		fs.writeFile(path, content, err => {
			if (err) reject(4003);
			else resolve(1000);
		});
	});
};
const deleteFile = path => {
	return new Promise((resolve, reject) => {
		fs.unlink(path, err => {
			if (err) reject(4003);
			else resolve(1000);
		});
	});
};
const deleteFolder = path => {
	return new Promise((resolve, reject) => {
		del([path]).then(res => {
			if (!res.includes(path)) reject(4003);
			else resolve(1000);
		});
	});
};
const readFile = (path, buffer = false) => {
	return new Promise((resolve, reject) => {
		const callback = (err, data) => {
			if (err) reject(err);
			else resolve(data);
		};
		
		fs.readFile(path, buffer ? callback : "utf8", buffer ? undefined : callback);
	});
};

async function DBManager() {
	const db = {
		folder: this.dbPath,
		main: path.join(this.dbPath, `index.bson`),
		users: path.join(this.dbPath, `users`),
		async getDBKeyPath(user, dbName, keyName) {
			for (const check of [user, dbName, keyName]) if (typeof check !== "string") return 4001;
			
			const id = await db.getDBKeyID(user, dbName, keyName);
			
			if (typeof id === "number") return id;
			
			const dbPath = await db.getDBFolder(user, dbName);
			
			if (typeof dbPath === "number") return dbPath;
			
			return path.join(dbPath, `datas`, `${id}.bson`);
		},
		async getDBKeyData(user, dbName, keyName) {
			const keyPath = await db.getDBKeyPath(user, dbName, keyName);
			
			if (typeof keyPath === "number") return keyPath;
			
			return bson.deserialize(await readFile(keyPath, true));
		},
		async getDBKeyID(user, dbName, keyName) {
			for (const check of [user, dbName, keyName]) if (typeof check !== "string") return 4001;
			
			try {
				const dbPath = await db.getDBFolder(user, dbName);
				const dbData = await db.getMainDataDB(user, dbName);
				const dataPath = await db.getMainPathDB(user, dbName);
				
				for (const check of [dbPath, dbData, dataPath]) if (typeof check === "number") return check;
				
				return Object.keys(dbData.datas)[Object.values(dbData.datas).indexOf(keyName)];
			} catch(e) {
				return typeof e === "number" ? e : 4003;
			}
		},
		async getDBFolder(user, name) {
			for (const check of [user, name]) if (typeof check !== "string") return 4001;
			
			const userPath = await db.getUserPath(user);
			
			if (!userPath) return 4005;
			
			const data = await db.getMainDataUser(user);
			
			if (!data.datas[name]) return 4009;
			
			const folderPath = path.join(userPath, `datas`, data.datas[name]);
			
			return folderPath;
		},
		async getKey(user, dbName, keyName, keyPath) {
			for (const check of [user, dbName, keyName]) if (typeof check !== "string") throw 4001;
			
			if (typeof keyPath !== "string" && keyPath) throw 4001;
			
			const dbData = await db.getDBKeyData(user, dbName, keyName);
			
			if (typeof dbData === "number") throw dbData;
			if (!keyPath) return dbData.datas;
			
			return $.get(dbData.datas, keyPath);
		},
		async setKey(user, dbName, keyName, keyValue, keyPath) {
			for (const check of [user, dbName, keyName]) if (typeof check !== "string") return 4001;
			
			if (typeof keyPath !== "string" && keyPath) return 4001;
			
			const dbPath = await db.getDBKeyPath(user, dbName, keyName);
			const dbData = await db.getDBKeyData(user, dbName, keyName);
			
			if (typeof dbPath !== 1000 && typeof dbPath === "number") return dbPath;
			if (typeof dbData === "number") return dbData;
			if (keyPath) {
				$.set(dbData.datas, keyPath, keyValue);
			} else {
				dbData.datas = keyValue;
			}
			
			const r = await writeFile(dbPath, bson.serialize(dbData));
			
			if (r !== 1000) return r;
			
			return 1000;
		},
		async createKey(user, dbName, keyName, keyValue) {
			for (const check of [user, dbName, keyName]) if (typeof check !== "string") return 4001;
			
			const mainPath = await db.getMainPathDB(user, dbName);
			const dbPath = await db.getDBFolder(user, dbName);
			const id = cuid();
			const mainData = await db.getMainDataDB(user, dbName);
			
			if (typeof mainData === "number") return mainData;
			
			mainData.datas[id] = keyName;
			const r = [];
			
			r.push(await writeFile(path.join(dbPath, `datas`, `${id}.bson`), bson.serialize({ datas: keyValue })));
			r.push(await writeFile(mainPath, bson.serialize(mainData)));
			
			for (const check of r) if (typeof check === "number") return check;
			
			return 1000;
		},
		async deleteKey(user, dbName, keyName) {
			for (const check of [user, dbName, keyName]) if (typeof check !== "string") return 4001;
			
			const mainPath = await db.getMainPathDB(user, dbName);
			const dbPath = await db.getDBFolder(user, dbName);
			const mainData = await db.getMainDataDB(user, dbName);
			
			if (typeof mainData === "number") return mainData;
			
			const id = await db.getDBKeyID(user, dbName, keyName);
			
			delete mainData.datas[id];
			const r = [];
			
			r.push(await deleteFile(path.join(dbPath, `${id}.bson`)));
			r.push(await writeFile(mainPath, bson.serialize(mainData)));
			
			for (const check of r) if (check !== 1000) return check;
			
			return 1000;
		},
		async getMainPathDB(user, name) {
			for (const check of [user, name]) if (typeof check !== "string") return 4001;
			
			const folderPath = await db.getDBFolder(user, name);
			
			if (typeof folderPath === "number") return folderPath;
			
			const mainPath = path.join(folderPath, `index.bson`);
			
			return mainPath;
		},
		async getMainDataDB(user, name) {
			for (const check of [user, name]) if (typeof check !== "string") return 4001;
			
			const path = await db.getMainPathDB(user, name);
			
			if (typeof path === "number") return path;
			
			return bson.deserialize(await readFile(path, true));
		},
		async isDatabaseExist(user, name) {
			for (const check of [user, name]) if (typeof check !== "string") return 4001;
			
			const userPath = await db.getUserPath(user);
			
			if (!userPath) return 4005;
			
			const data = await db.getMainDataUser(user);
			const id = data.datas[name];
			
			return !!id;
		},
		async createDatabase(user, name) {
			for (const check of [user, name]) if (typeof check !== "string") return 4001;
			
			const userPath = await db.getUserPath(user);
			
			if (!userPath) return 4005;
			
			const id = cuid();
			const folderPath = path.join(userPath, `datas`, id);
			const mainPath = path.join(folderPath, `index.bson`);
			const datasPath = path.join(folderPath, `datas`);
			const data = await db.getMainDataUser(user);
			const main = bson.serialize({
				datas: {}
			});
			
			if (data.datas[name]) return 4007;
				
			data.datas[name] = id;
			const res = [];
			
			res.push(await createFolder(folderPath));
			res.push(await createFile(mainPath, main));
			res.push(await createFolder(datasPath));
			res.push(await writeFile(path.join(userPath, `index.bson`), bson.serialize(data)));
			res.push(await writeFile(mainPath, main));
			
			for (let r of res) if (r !== 1000) return r;
			
			return 1000;
		},
		async deleteDatabase(user, name) {
			for (const check of [user, name]) if (typeof check !== "string") return 4001;
			
			const userPath = await db.getUserPath(user);
			
			if (!userPath) return 4005;
			
			const data = await db.getMainDataUser(user);
			const id = data.datas[name];
			
			if (!id) return 4009;
			
			delete data.datas[Object.keys(data.datas)[Object.values(data.datas).indexOf(id)]];
			
			const folderPath = path.join(userPath, `datas`, id);
				
			try {
				const res_ = await writeFile(path.join(await db.getUserPath(user), 'index.bson'), bson.serialize(data));
				const res = await deleteFolder(folderPath);
				
				if (res !== 1000) return res;
				if (res_ !== 1000) return res_;
			} catch {
				return 4003;
			}
			
			return 1000;
		},
		async getUserPath(user) {
			if (typeof user !== "string") return 4001;
			
			const main = await db.getMainData();
			const id = main.users[user];
			
			if (!id) return;
			
			return path.join(db.users, id);
		},
		async isExistUser(user) {
			if (typeof user !== "string") return 4001;
			
			try {
				if (typeof (await db.getMainDataUser(user)) === "number") return false;
				
				return true;
			} catch(e) {
				return false;
			}
		},
		async doesQualify(data) {
			if (typeof data !== "object") return 4001;
			
			try {
				if (!(await db.isExistUser(data.username))) return 4005;
				const dataUser = await db.getMainDataUser(data.username);
				
				return dataUser.password === data.password;
			} catch {
				return false;
			}
		},
		async getMainDataUser(user) {
			if (typeof user !== "string") return 4001;
			
			try {
				const main = await db.getMainData();
				
				return bson.deserialize(await readFile(path.join(await db.getUserPath(user), `index.bson`), true));
			} catch {
				return 4003;
			}
		},
		async createUser(user, password) {
			for (const check of [user, password]) if (typeof check !== "string") return 4001;
			
			try {
				const id = cuid();
				const fullPath = path.join(db.users, id);
				
				const main = await db.getMainData();
				
				if (main.users[user]) return 4002;
				
				main.users[user] = id;
				const r1 = await createFolder(fullPath);
				const r2 = await createFolder(path.join(fullPath, "datas"));
				
				if (r1 === 4003 || r2 === 4003) return 4003;
				
				await writeFile(db.main, bson.serialize(main));
				return await writeFile(path.join(fullPath, `index.bson`), bson.serialize({
					datas: {},
					password: password
				}));
			} catch {
				return 4003;
			}
		},
		async deleteUser(user) {
			if (typeof user !== "string") return 4001;
			
			try {
				const main = await db.getMainData();
				const id = main.users[user];
					
				if (!id) return false;
					
				main.users.splice(Object.keys(main.users).indexOf(user), 1);
				await writeFile(db.main, bson.serialize(main));
				await deleteFolder(path.join(db.users, id));
					
				return true;
			} catch {
				throw 4003;
			}
		},
		getMainData() {
			return new Promise((resolve, reject) => {
				fs.readFile(db.main, (err, content) => {
					if (err) return reject(4003);
					
					resolve(bson.deserialize(content));
				});
			});
		}
	};
	
	await createFolder(db.folder);
	await createFolder(db.users);
	fs.openSync(db.folder);
	await createFile(db.main, bson.serialize({
		users: {}
	}));
	
	return db;
}

module.exports = DBManager;