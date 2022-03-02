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

module.exports = { equalsIgnoreCase, sqlSyntaxError, getPosition };
