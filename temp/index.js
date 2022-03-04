const jSQL = require("../index");

const database = new jSQL.Database(__dirname + "/database");

const account = database.execute(".|'main'|'accounts'");

console.log(account);
