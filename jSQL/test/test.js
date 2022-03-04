const jSQL = require("../index");

const database = new jSQL.Database(__dirname + "/database");

database.execute("^|'main'|'accounts'|{'username': 'user1'}|{'password': [ [ 'pass1' ], [ true ] ]}");
