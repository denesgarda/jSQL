const fs = require("fs");
const path = require("path");

const SQLException = require("./err/SQLException");

class Database {
    constructor(path, async) {
        this.path = path;
        this.async = async;
    }

    execute(query) {
        if (query) {
            const rawArgs = query.split("|");
            let args = [];
            rawArgs.forEach(function(arg) {
                if (arg != "") {
                    args.push(arg);
                }
            });
            if (args[0] == "+") {
                if (args.length == 1) {
                    throw new SQLException(query, query.length + 1);
                } else {
                    if (args[1] == "schema") {
                        if (args.length != 3) {
                            throw new SQLException(query, query.length + 1);
                        } else {
                            let name;
                            try {
                                name = eval(args[2]);
                            } catch {
                                throw new SQLException(query, query.length - args[2].length + 1, "Unexpected Token");
                            }
                            let files = fs.readdirSync(this.path);
                            if (files.includes(name + ".json")) {
                                throw new SQLException("Schema " + name + " already exists.");
                            } else {
                                fs.writeFileSync(path.join(this.path, name + ".json"), "{}");
                            }
                        }
                    } else if (args[1] == "table") {
                        if (args.length != 4) {
                            throw new SQLException(query, query.length + 1);
                        } else {
                            let name;
                            try {
                                name = eval(args[2]);
                            } catch {
                                throw new SQLException(query, query.length - args[2].length + 1, "Unexpected Token");
                            }
                            let files = fs.readdirSync(this.path);
                            if (files.includes(name + ".json")) {
                                let tableName;
                                try {
                                    tableName = eval(args[3]);
                                } catch {
                                    throw new SQLException(query, query.length - args[3].length + 1, "Unexpected Token");
                                }
                                let schema;
                                schema = JSON.parse(fs.readFileSync(path.join(this.path, name + ".json")), "utf8");
                                if (schema.hasOwnProperty(tableName)) {
                                    throw new SQLException("Table " + tableName + " already exists in schema " + name + ".");
                                } else {
                                    schema[tableName] = [];
                                    fs.writeFileSync(path.join(this.path, name + ".json"), JSON.stringify(schema), "utf8");
                                }
                            } else {
                                throw new SQLException("Schema " + name + " does not exists.");
                            }
                        }
                    } else {
                        if (args.length != 4) {
                            throw new SQLException(query, query.length + 1);
                        } else {
                            let name;
                            try {
                                name = eval(args[1]);
                            } catch {
                                throw new SQLException(query, query.length - args[1].length + 1, "Unexpected Token");
                            }
                            let files = fs.readdirSync(this.path);
                            if (files.includes(name + ".json")) {
                                let tableName;
                                    try {
                                        tableName = eval(args[2]);
                                    } catch {
                                        throw new SQLException(query, query.length - args[2].length + 1, "Unexpected Token");
                                    }
                                    let schema = JSON.parse(fs.readFileSync(path.join(this.path, name + ".json")), "utf8");
                                    if (schema.hasOwnProperty(tableName)) {
                                        const data = eval("(" + args[3] + ")");
                                        schema[tableName].push(data);
                                        fs.writeFileSync(path.join(this.path, name + ".json"), JSON.stringify(schema), "utf8");
                                    } else {
                                        throw new SQLException("Table " + tableName + " does not exist in schema " + name + ".");
                                    }
                            } else {
                                throw new SQLException("Schema " + name + " does not exists.");
                            }
                        }
                    }
                }
            } else if (args[0] == "-") {
                if (args.length == 1) {
                    throw new SQLException(query, query.length + 1);
                } else {
                    if (args[1] == "schema") {
                        if (args.length != 3) {
                            throw new SQLException(query, query.length + 1);
                        } else {
                            let name;
                            try {
                                name = eval(args[2]);
                            } catch {
                                throw new SQLException(query, query.length - args[2].length + 1, "Unexpected Token");
                            }
                            let files = fs.readdirSync(this.path);
                            if (files.includes(name + ".json")) {
                                fs.unlink(path.join(this.path, name + ".json"), function(err) {});
                            } else {
                                throw new SQLException("Schema " + name + " does not exists.");
                            }
                        }
                    } else if (args[1] == "table") {
                        if (args.length != 4) {
                            throw new SQLException(query, query.length + 1);
                        } else {
                            let name;
                            try {
                                name = eval(args[2]);
                            } catch {
                                throw new SQLException(query, query.length - args[2].length + 1, "Unexpected Token");
                            }
                            let files = fs.readdirSync(this.path);
                            if (files.includes(name + ".json")) {
                                let tableName;
                                try {
                                    tableName = eval(args[3]);
                                } catch {
                                    throw new SQLException(query, query.length - args[3].length + 1, "Unexpected Token");
                                }
                                let schema;
                                schema = JSON.parse(fs.readFileSync(path.join(this.path, name + ".json")), "utf8");
                                if (schema.hasOwnProperty(tableName)) {
                                    delete schema[tableName];
                                    fs.writeFileSync(path.join(this.path, name + ".json"), JSON.stringify(schema), "utf8");
                                } else {
                                    throw new SQLException("Table " + tableName + " does not exist in schema " + name + ".");
                                }
                            } else {
                                throw new SQLException("Schema " + name + " does not exists.");
                            }
                        }
                    } else {
                        if (args.length == 2) {
                            throw new SQLException(query, query.length + 1);
                        } else {
                            let name;
                            try {
                                name = eval(args[1]);
                            } catch {
                                throw new SQLException(query, query.length - args[1].length + 1, "Unexpected Token");
                            }
                            let files = fs.readdirSync(this.path);
                            if (files.includes(name + ".json")) {
                                let tableName;
                                    try {
                                        tableName = eval(args[2]);
                                    } catch {
                                        throw new SQLException(query, query.length - args[2].length + 1, "Unexpected Token");
                                    }
                                    let schema = JSON.parse(fs.readFileSync(path.join(this.path, name + ".json")), "utf8");
                                    if (schema.hasOwnProperty(tableName)) {
                                        if (args.length == 3) {
                                            schema[tableName] = [];
                                            fs.writeFileSync(path.join(this.path, name + ".json"), JSON.stringify(schema), "utf8");
                                        } else if (args.length == 4) {
                                            const conditions = eval("(" + args[3] + ")");
                                            for (let i = 0; i < schema[tableName].length; i++) {
                                                const row = schema[tableName][i];
                                                let del = true;
                                                del = parse(row, conditions, del);
                                                if (del) {
                                                    schema[tableName].splice(i, i + 1);
                                                }
                                            }
                                            fs.writeFileSync(path.join(this.path, name + ".json"), JSON.stringify(schema), "utf8");
                                        } else {
                                            throw new SQLException(query, query.length - args[4].length + 1);
                                        }
                                    } else {
                                        throw new SQLException("Table " + tableName + " does not exist in schema " + name + ".");
                                    }
                            } else {
                                throw new SQLException("Schema " + name + " does not exists.");
                            }
                        }
                    }
                }
            } else if (args[0] == "^") {
                if (args.length == 1) {
                    throw new SQLException(query, query.length + 1);
                } else {
                    if (args[1] == "schema") {
                        if (args.length != 4) {
                            throw new SQLException(query, query.length + 1)
                        } else {
                            let name;
                            try {
                                name = eval(args[2]);
                            } catch {
                                throw new SQLException(query, query.length - args[2].length + 1, "Unexpected Token");
                            }
                            let files = fs.readdirSync(this.path);
                            if (files.includes(name + ".json")) {
                                let newName;
                                try {
                                    newName = eval(args[3]);
                                } catch {
                                    throw new SQLException(query, query.length - args[3].length + 1, "Unexpected Token");
                                }
                                fs.renameSync(path.join(this.path, name + ".json"), path.join(this.path, newName + ".json"));
                            } else {
                                throw new SQLException("Schema " + name + " does not exists.");
                            }
                        }
                    } else if (args[1] == "table") {
                        if (args.length != 5) {
                            throw new SQLException(query, query.length + 1);
                        } else {
                            let name;
                            try {
                                name = eval(args[2]);
                            } catch {
                                throw new SQLException(query, query.length - args[2].length + 1, "Unexpected Token");
                            }
                            let files = fs.readdirSync(this.path);
                            if (files.includes(name + ".json")) {
                                let tableName;
                                try {
                                    tableName = eval(args[3]);
                                } catch {
                                    throw new SQLException(query, query.length - args[3].length + 1, "Unexpected Token");
                                }
                                let schema;
                                schema = JSON.parse(fs.readFileSync(path.join(this.path, name + ".json")), "utf8");
                                if (schema.hasOwnProperty(tableName)) {
                                    let newName;
                                    try {
                                        newName = eval(args[4]);
                                    } catch {
                                        throw new SQLException(query, query.length - args[4].length + 1, "Unexpected Token");
                                    }
                                    if (tableName != newName) {
                                        if (schema.hasOwnProperty(newName)) {
                                            throw new SQLException("New name already exists in schema " + name + ".");
                                        } else {
                                            schema[newName] = schema[tableName];
                                            delete schema[tableName];
                                            fs.writeFileSync(path.join(this.path, name + ".json"), JSON.stringify(schema), "utf8");
                                        }
                                    } else {
                                        throw new SQLException("New name is name as old name.");
                                    }
                                } else {
                                    throw new SQLException("Table " + tableName + " does not exist in schema " + name + ".");
                                }
                            } else {
                                throw new SQLException("Schema " + name + " does not exists.");
                            }
                        }
                    } else {
                        if (args.length != 5) {
                            throw new SQLException(query, query.length + 1);
                        } else {
                            let name;
                            try {
                                name = eval(args[1]);
                            } catch {
                                throw new SQLException(query, query.length - args[1].length + 1, "Unexpected Token");
                            }
                            let files = fs.readdirSync(this.path);
                            if (files.includes(name + ".json")) {
                                let tableName;
                                    try {
                                        tableName = eval(args[2]);
                                    } catch {
                                        throw new SQLException(query, query.length - args[2].length + 1, "Unexpected Token");
                                    }
                                    let schema = JSON.parse(fs.readFileSync(path.join(this.path, name + ".json")), "utf8");
                                    let updated = schema;
                                    if (schema.hasOwnProperty(tableName)) {
                                        const data = eval("(" + args[3] + ")");
                                        const conditions = eval("(" + args[4] + ")");
                                        for (let i = 0; i < schema[tableName].length; i++) {
                                            const row = schema[tableName][i];
                                            let upd = true;
                                            upd = parse(row, conditions, upd);
                                            if (upd) {
                                                for (let u in data) {
                                                    updated[tableName][i][u] = data[u];
                                                }
                                            }
                                        }
                                        fs.writeFileSync(path.join(this.path, name + ".json"), JSON.stringify(updated), "utf8");
                                    } else {
                                        throw new SQLException("Table " + tableName + " does not exist in schema " + name + ".");
                                    }
                            } else {
                                throw new SQLException("Schema " + name + " does not exists.");
                            }
                        }
                    }
                }
            } else if (args[0] == "-.") {
                
            } else {
                throw new SQLException(query, 1, "Unexpected Token")
            }
        } else {
            throw new SQLException("Query is empty.");
        }
    }
}

function parse(row, conditions, del, op) {
    try {
        if (op == undefined) {
            if (Object.keys(conditions).length == 1) {
                const key = Object.keys(conditions)[0];
                const values = conditions[Object.keys(conditions)[0]][0];
                const equals = conditions[Object.keys(conditions)[0]][1];
                if (key == "&" && conditions[key].constructor.name === "Object") {
                    del = del && parse(row, conditions[key], del, "&");
                } else if (key == "/" && conditions[key].constructor.name === "Object") {
                    del = parse(row, conditions[key], del, "/");
                } else {
                    if (values.length == 1 && equals.length == 1) {
                        if (equals[0]) {
                            if (row[key] == values[0]) {
                                del = true;
                            } else {
                                del = false;
                            }
                        } else {
                            if (row[key] != values[0]) {
                                del = true;
                            } else {
                                del = false;
                            }
                        }
                    } else {
                        throw new SQLException("Invalid condition parameters.");
                    }
                }
            } else {
                throw new SQLException("Invalid condition parameters.");
            }
            return del;
        } else {
            let internalDel = true;
            for (let i in conditions) {
                if (i == "&" && conditions[i].constructor.name === "Object") {
                    if (op == "&") {
                        internalDel = internalDel && parse(row, conditions[i], del, "&");
                    } else if (op == "/") {
                        internalDel = internalDel || parse(row, conditions[i], del, "&");
                    }
                } else if (i == "/" && conditions[i].constructor.name === "Object") {
                    if (op == "&") {
                        internalDel = internalDel && parse(row, conditions[i], del, "/");
                    } else if (op == "/") {
                        internalDel = internalDel || parse(row, conditions[i], del, "/");
                    }
                } else {
                    const key = i;
                    const values = conditions[i][0];
                    const equals = conditions[i][1];
                    if (values.length == equals.length) {
                        for (let n = 0; n < values.length; n++) {
                            if (equals[n]) {
                                if (row[key] == values[n]) {
                                    if (op == "&") {
                                        internalDel = internalDel && true;
                                    } else if (op == "/") {
                                        internalDel = internalDel || true;
                                    }
                                } else {
                                    if (op == "&") {
                                        internalDel = internalDel && false;
                                    } else if (op == "/") {
                                        internalDel = internalDel || false;
                                    }
                                }
                            } else {
                                if (row[key] != values[n]) {
                                    if (op == "&") {
                                        internalDel = internalDel && true;
                                    } else if (op == "/") {
                                        internalDel = internalDel || true;
                                    }
                                } else {
                                    if (op == "&") {
                                        internalDel = internalDel && false;
                                    } else if (op == "/") {
                                        internalDel = internalDel || false;
                                    }
                                }
                            }
                        }
                    } else {
                        throw new SQLException("Invalid condition parameters.");
                    }
                }
            }
            return internalDel;
        }
    } catch {
        throw new SQLException("Invalid condition parameters.");
    }
}

module.exports = { Database };
