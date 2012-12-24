CommonManager = {
    sendError: function (res, message) {
        res.json({ error: message }, 500);
    },

    tryParseJson: function (data, onJson) {
        try {
            // Try parsing the JSON object.
            json = JSON.parse(data);

            onJson(json);
        }
        catch (err) {
            // Invalid JSON.
            onJson(null, { message: 'Invalid JSON object passed in query: ' + data + '. ' + err.message });
        }
    },

    cleanQuery: function (query, onQuery) {
        var cleanedQuery = {};

        try {
            // Try parsing the JSON object.
            cleanedQuery = JSON.parse(query);

            var index = query.indexOf('/');
            if (index > -1) {
                // This is a regular expression. Parse out the left and right portion of the expression and create a RegEx query.
                var left = query.substring(0, index - 1);
                var right = query.substr(index, query.length - index);

                // Clean the string.
                left = left.replace(/{/g, '');
                left = left.replace(/\"/g, '');
                left = left.replace(/:/g, '');
                right = right.replace(/}/g, '');
                right = right.replace(/\//g, '');
                right = right.replace(/\"/g, '');

                left = left.trim();
                right = right.trim();

                // Create the query.
                cleanedQuery[left] = { $regex: right, $options: 'ig' };
            }

            // Return result.
            onQuery(cleanedQuery);
        }
        catch (err) {
            // Invalid JSON.
            onQuery(null, { message: 'Invalid JSON object passed in query: ' + query + '. ' + err.message });
        }
    },

    isScriptInjection: function (req, res, json) {
        var result = false;

        if (req.query['script'] != '1') {
            // Enforce no script tags in json data, unless url contains ?script=1
            if (JSON.stringify(json).toLowerCase().indexOf('<script') != -1) {
                result = true;
            }
        }

        return result;
    }
}