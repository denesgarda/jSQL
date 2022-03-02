const sqlSyntaxError = "There was an error in your SQL syntax.";

function equalsIgnoreCase(s1, s2) {
    return s1.toUpperCase() === s2.toUpperCase();
}

module.exports = { equalsIgnoreCase, sqlSyntaxError };
