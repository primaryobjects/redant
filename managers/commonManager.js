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
    }
}