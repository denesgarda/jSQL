const jSQL = require("../index");

const database = new jSQL.Database(__dirname + "/database");

const server = new jSQL.Server(database, 1540);

server.start();
