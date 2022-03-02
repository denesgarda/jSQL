const SQLException = require("./err/SQLException");

const sqlSyntaxError = "There was an error in your SQL syntax.";

function equalsIgnoreCase(s1, s2) {
    return s1.toUpperCase() === s2.toUpperCase();
}

function getPosition(str, pat, n){
    var L= str.length, i= -1;
    while(n-- && i++<L){
        i= str.indexOf(pat, i);
        if (i < 0) break;
    }
    return i;
}

function parseValues(query) {
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    }
    function replaceAll(str, find, replace) {
        return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
    }
    let postValues = query.substring(query.toUpperCase().indexOf("VALUES") + 7);
    postValues = replaceAll(postValues, "(", "[");
    postValues = replaceAll(postValues, ")", "]");
    let values;
    try {
        values = eval("[" + postValues + "]");
    } catch (e) {
        throw new SQLException(sqlSyntaxError, query, query.toUpperCase().indexOf("VALUES") + 8);
    }
    return values;
}

function parseColumns(query, rawColumns) {
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    }
    function replaceAll(str, find, replace) {
        return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
    }
    rawColumns = replaceAll(rawColumns, "(", "[");
    rawColumns = replaceAll(rawColumns, ")", "]");
    let columns;
    try {
        columns = eval("[" + rawColumns + "]");
    } catch (e) {
        throw new SQLException(sqlSyntaxError, query, query.indexOf(rawColumns));
    }
    return columns;
}

module.exports = { equalsIgnoreCase, sqlSyntaxError, getPosition, parseValues, parseColumns };
