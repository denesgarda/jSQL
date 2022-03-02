function SQLException(message, query, location) {
    let error;
    if (query && location) {
        let spaces = "";
        for (let i = 1; i < location; i++) {
            spaces += " ";
        }
        error = new Error(message + "\n\n    " + query + "\n    " + spaces + "^\n");
    } else {
        error = new Error(message);
    }
    return error;
}

module.exports = SQLException;
