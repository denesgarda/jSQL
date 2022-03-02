const fs = require("fs");
const path = require("path");
const util = require("./util");

const SQLException = require("./err/SQLException");

class Database {
    constructor(path, async) {
        this.path = path;
        this.async = async;
    }

    create() {
        if (this.async) {
            fs.mkdir(this.path, { recursive: true });
        } else {
            fs.mkdirSync(this.path, { recursive: true });
        }
    }

    delete() {
        if (this.async) {
            fs.rmdir(this.path, { recursive: true });
        } else {
            fs.rmdirSync(this.path, { recursive: true });
        }
    }

    getSchema(name) {
        const schema = new Schema(this, name);
        schema.create();
        return schema;
    }

    execute(query) {
        if (query) {
            const args = query.split(" ");
            if(util.equalsIgnoreCase(args[0], "CREATE")) {
                if (args.length == 1) {
                    throw new SQLException(util.sqlSyntaxError, query, 8);
                } else {
                    if (util.equalsIgnoreCase(args[1], "TABLE")) {
                        if (args.length != 3) {
                            let location = 14;
                            if (args.length > 3) {
                                location += args[2].length + 1;
                            }
                            throw new SQLException(util.sqlSyntaxError, query, location);
                        } else {
                            const schemaArgs = args[2].split(".");
                            if (schemaArgs.length != 2) {
                                throw new SQLException(util.sqlSyntaxError, query, 14);
                            } else {
                                let files;
                                if (this.async) {
                                    files = fs.readdir(this.path);
                                } else {
                                    files = fs.readdirSync(this.path);
                                }
                                if (files.includes(schemaArgs[0] + ".json")) {
                                    let schema;
                                    if (this.async) {
                                        schema = JSON.parse(fs.readFile(path.join(this.path, schemaArgs[0] + ".json")), "utf8");
                                    } else {
                                        schema = JSON.parse(fs.readFileSync(path.join(this.path, schemaArgs[0] + ".json")), "utf8");
                                    }
                                    if (schema.hasOwnProperty(schemaArgs[1])) {
                                        throw new SQLException("Table " + schemaArgs[1] + " already exists in schema " + schemaArgs[0] + ".");
                                    } else {
                                        schema[schemaArgs[1]] = [];
                                        if (this.async) {
                                            fs.writeFile(path.join(this.path, schemaArgs[0] + ".json"), JSON.stringify(schema), "utf8");
                                        } else {
                                            fs.writeFileSync(path.join(this.path, schemaArgs[0] + ".json"), JSON.stringify(schema), "utf8");
                                        }
                                    }
                                } else {
                                    throw new SQLException("Schema " + schemaArgs[0] + " does not exist.");
                                }
                            }
                        }
                    } else {
                        throw new SQLException(util.sqlSyntaxError, query, 6);
                    }
                }
            } else if (util.equalsIgnoreCase(args[0], "DROP")) {
                if (args.length == 1) {
                    throw new SQLException(util.sqlSyntaxError, query, 6);
                } else {
                    if (util.equalsIgnoreCase(args[1], "TABLE")) {
                        if (args.length != 3) {
                            let location = 12;
                            if (args.length > 3) {
                                location += args[2].length + 1;
                            }
                            throw new SQLException(util.sqlSyntaxError, query, location);
                        } else {
                            const schemaArgs = args[2].split(".");
                            if (schemaArgs.length != 2) {
                                throw new SQLException(util.sqlSyntaxError, query, 12);
                            } else {
                                let files;
                                if (this.async) {
                                    files = fs.readdir(this.path);
                                } else {
                                    files = fs.readdirSync(this.path);
                                }
                                if (files.includes(schemaArgs[0] + ".json")) {
                                    let schema;
                                    if (this.async) {
                                        schema = JSON.parse(fs.readFile(path.join(this.path, schemaArgs[0] + ".json")), "utf8");
                                    } else {
                                        schema = JSON.parse(fs.readFileSync(path.join(this.path, schemaArgs[0] + ".json")), "utf8");
                                    }
                                    if (schema.hasOwnProperty(schemaArgs[1])) {
                                        delete schema[schemaArgs[1]];
                                        if (this.async) {
                                            fs.writeFile(path.join(this.path, schemaArgs[0] + ".json"), JSON.stringify(schema), "utf8");
                                        } else {
                                            fs.writeFileSync(path.join(this.path, schemaArgs[0] + ".json"), JSON.stringify(schema), "utf8");
                                        }
                                    } else {
                                        throw new SQLException("Table " + schemaArgs[1] + " doesn't exist in schema " + schemaArgs[0] + ".");
                                    }
                                } else {
                                    throw new SQLException("Schema " + schemaArgs[0] + " does not exist.");
                                }
                            }
                        }
                    } else {
                        throw new SQLException(util.sqlSyntaxError, query, 6);
                    }
                }
            } else if (util.equalsIgnoreCase(args[0], "INSERT")) {
                if (args.length == 1) {
                    throw new SQLException(util.sqlSyntaxError, query, 8);
                } else {
                    if (util.equalsIgnoreCase(args[1], "INTO")) {
                        if (args.length == 2) {
                            throw new SQLException(util.sqlSyntaxError, query, 13);
                        } else {
                            const schemaArgs = args[2].split(".");
                            if (schemaArgs.length != 2) {
                                throw new SQLException(util.sqlSyntaxError, query, 13);
                            } else {
                                let files;
                                if (this.async) {
                                    files = fs.readdir(this.path);
                                } else {
                                    files = fs.readdirSync(this.path);
                                }
                                if (files.includes(schemaArgs[0] + ".json")) {
                                    let schema;
                                    if (this.async) {
                                        schema = JSON.parse(fs.readFile(path.join(this.path, schemaArgs[0] + ".json")), "utf8");
                                    } else {
                                        schema = JSON.parse(fs.readFileSync(path.join(this.path, schemaArgs[0] + ".json")), "utf8");
                                    }
                                    if (schema.hasOwnProperty(schemaArgs[1])) {
                                        const cs = util.getPosition(query, "(", 1);
                                        const ce = util.getPosition(query, ")", 1);
                                        if (cs == -1 || ce == -1) {
                                            throw new SQLException(util.sqlSyntaxError, query, 13 + args[2].length + 1);
                                        } else {
                                            const rawColumns = query.substring(cs + 1, ce);
                                            const columns = util.parseColumns(query, rawColumns);
                                            const vs = util.getPosition(query, "(", 2);
                                            const ve = util.getPosition(query, ")", 2);
                                            if (!util.equalsIgnoreCase(query.substring(ce + 1, vs).trim(), "VALUES")) {
                                                throw new SQLException(util.sqlSyntaxError, query, 13 + args[2].length + rawColumns.length + 4);
                                            }
                                            else {
                                                if (vs == -1 || ve == -1) {
                                                    throw new SQLException(util.sqlSyntaxError, query, query.indexOf("VALUES") + 8);
                                                } else {
                                                    const values = util.parseValues(query);
                                                    let failed = false;
                                                    values.forEach(function(set) {
                                                        if (columns.length != set.length) {
                                                            throw new SQLException("Number of columns does not match number of values.");
                                                            failed = true;
                                                        }
                                                    });
                                                    if (!failed) {
                                                        values.forEach(function(set) {
                                                            const toPush = {};
                                                            columns.forEach((key, i) => toPush[key] = set[i]);
                                                            schema[schemaArgs[1]].push(toPush);
                                                        });
                                                        if (this.async) {
                                                            fs.writeFile(path.join(this.path, schemaArgs[0] + ".json"), JSON.stringify(schema), "utf8");
                                                        } else {
                                                            fs.writeFileSync(path.join(this.path, schemaArgs[0] + ".json"), JSON.stringify(schema), "utf8");
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    } else {
                                        throw new SQLException("Table " + schemaArgs[1] + " doesn't exist in schema " + schemaArgs[0] + ".");
                                    }
                                } else {
                                    throw new SQLException("Schema " + schemaArgs[0] + " does not exist.");
                                }
                            }
                        }
                    } else {
                        throw new SQLException(util.sqlSyntaxError, query, 8);
                    }
                }
            }
        } else {
            throw new SQLException(util.sqlSyntaxError);
        }
    }
}

class Schema {
    constructor(database, name) {
        this.database = database;
        this.name = name;
    }

    create() {
        if (this.database.async) {
            fs.writeFile(path.join(this.database.path, this.name + ".json"), "{}");
        } else {
            fs.writeFileSync(path.join(this.database.path, this.name + ".json"), "{}");
        }
    }

    delete() {
        if (this.database.async) {
            fs.unlink((path.join(this.database.path, this.name + ".json")));
        } else {
            fs.unlinkSync((path.join(this.database.path, this.name + ".json")));
        }
    }
}

module.exports = { Database };
