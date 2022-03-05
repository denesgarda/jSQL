const jSQL = require("../index");

const connector = new jSQL.Connector("localhost", 1540, "root", "root");

connector.execute(".|'main'|'accounts'").then((account) => {
    console.log(account);
});
