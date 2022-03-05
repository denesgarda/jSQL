const fs = require("fs");

class Logger {
    level = {
        info: "JSQL/INFO",
        query: "JSQL/QUERY",
        queryID: function(id) {
            return this.query + " ID=" + id;
        }
    }

    constructor(path) {
        this.path = path;
    }

    log(level, log) {
        const exists = fs.existsSync(this.path);
        if (!exists) {
            fs.writeFileSync(this.path, "");
        }
        const date = new Date(Date.now());
        const string = "[" + date.toDateString() + " " + date.toTimeString() + "] [" + level + "]: " + log + "\n";
        fs.appendFileSync(this.path, string);
    }
}

module.exports = Logger;
