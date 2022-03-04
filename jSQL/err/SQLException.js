function SQLException(message, location, problem) {
    let error;
    if (location) {
        if (problem) {
            let spaces = "";
            for (let i = 1; i < location; i++) {
                spaces += " ";
            }
            error = new SyntaxError("There was an error in your SQL syntax." + "\n\n    " + message + "\n    " + spaces + "^\n    " + problem + "\n");
        } else {
            let spaces = "";
            for (let i = 1; i < location; i++) {
                spaces += " ";
            }
            error = new SyntaxError("There was an error in your SQL syntax." + "\n\n    " + message + "\n    " + spaces + "^\n");
        }
    } else {
        error = new Error(message);
    }
    return error;
}

module.exports = SQLException;
