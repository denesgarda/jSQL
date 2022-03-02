const jSQL = require("./index");

const testDB = new jSQL.Database("./database", false);

testDB.execute("DROP TABLE test-schema.test-table");
