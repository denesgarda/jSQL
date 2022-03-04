const jSQL = require("../index");

const database = new jSQL.Database(__dirname + "/database");

const accounts = database.execute(".|'main'|'accounts'|{'username': [ [ 'user1' ], [ true ] ]}");

console.log(accounts)
