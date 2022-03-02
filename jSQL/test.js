const jSQL = require("./index");

const db = new jSQL.Database("./database", false);

db.execute("DELETE FROM main.accounts");
