const Client = require(`${__dirname}/../client.js`);
const client = new Client({
	ip: "http://localhost",
	port: 3000,
	username: "root",
	password: "1234567"
});
const db = client.Database("TestDB");

client.setup();
client.on("failAuth", console.log);
client.on("failConnect", err => {
	if (err === 'That user does not exist.') client.createUser();
	else console.error(err);
});
client.on("successConnect", () => {
	console.log(`Connected.`);
	createDB();
});
client.on("successAuth", () => {
  console.log(`Authed.`);
  client.login();
});
client.on("failCreateUser", e => {
	if (e === "That user already exists.") client.login();
	else console.log(e);
});
client.on("successCreateUser", () => {
	console.log(`Created an account named \`root\`!`);
	client.login();
});

const _getKey = (key, path) => new Promise((resolve, reject) => {
	db.getKey(key, path, {
		success(data) {
			resolve(data);
		},
		fail(e) {
			reject(e);
		}
	});
});

const _setKey = (key, value, path) => new Promise((resolve, reject) => {
	db.setKey(key, value, path, {
		success(data) {
			resolve(data);
		},
		fail(e) {
			reject(e);
		}
	});
});

const increaseCount = async () => {
	let val = await _getKey(`count`);
	
	console.log(`Current count: ${val}`);
	
	val++;
	
	await _setKey(`count`, val);
	
	console.log(`Increased count to ${val}.`);
};

const createDB = () => db.createDB({
	success() {
		console.log(`Successfully to create TestDB database!`);
		createKey();
	},
	fail() {
		deleteDB();
	}
});

const createKey = () => db.createKey("count", 0, {
	async success() {
		console.log(`Successfully to create count key in TestDB database!`);
		try {
			for (let i = 0; i < 10; i++) await increaseCount();
		} catch(e) {
			console.log(e);
		}
		deleteDB();
	},
	fail(e) {
		console.log(`Failed to create count key in TestDB database with error:`, e);
		deleteDB();
	}
});

const deleteKey = () => db.deleteKey("count", {
	success() {
		console.log(`Successfully to delete count key in TestDB database!`);
		deleteDB();
	},
	fail(e) {
		console.log(`Failed to delete count key in TestDB database with error:`, e);
		deleteDB();
	}
});

const deleteDB = () => db.deleteDB({
	success() {
		console.log(`Successfully to delete TestDB database!`);
	},
	fail(e) {
		console.log(`Failed to delete TestDB database with error:`, e);
	}
});