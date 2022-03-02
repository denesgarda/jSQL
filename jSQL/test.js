const jSQL = require("./index");

const db = new jSQL.Database("./database", false);

db.execute("INSERT INTO main.accounts (username, password) VALUES (user1, pass1)");
