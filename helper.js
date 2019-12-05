const toTitleCase = (str) => {
    return str.toString().replace(
        /\w\S*/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

exports.toTitleCase = toTitleCase;