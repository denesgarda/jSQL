const fs = require("fs");
const Logger = require("./logger");
const path = require("path");

function backup(database, query) {
    const backupPath = database.path + "/backups";
    const exists = fs.existsSync(backupPath);
    if (!exists) {
        fs.mkdirSync(backupPath);
    }
    let files = fs.readdirSync(backupPath);
    let id = Math.max.apply(Math, files) + 1;
    if ( id < 0 ) {
        id = 0;
    }
    copyFolderRecursiveSync(database.path, path.join(backupPath, id.toString()));
    const logger = new Logger(path.join(database.path, "query.log"));
    logger.log(logger.level.queryID(id), query);
}

function copyFolderRecursiveSync(source, target) {
    var files = [];
    var targetFolder = path.join(target);
    if (!fs.existsSync(targetFolder)) {
        fs.mkdirSync(targetFolder);
    }
    if (fs.lstatSync(source).isDirectory()) {
        files = fs.readdirSync(source);
        files.forEach(function(file) {
            var curSource = path.join(source, file);
            if (!fs.lstatSync(curSource).isDirectory()) {
                if (path.basename(curSource) != "query.log") {
                    copyFileSync(curSource, targetFolder);
                }
            }
        });
    }
}

function copyFileSync(source, target) {
    var targetFile = target;
    if (fs.existsSync(target)) {
        if (fs.lstatSync(target).isDirectory()) {
            targetFile = path.join(target, path.basename(source));
        }
    }
    fs.writeFileSync(targetFile, fs.readFileSync(source));
}

module.exports = backup;
