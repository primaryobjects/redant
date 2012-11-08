CommonManager = {
    sendError: function (res, message) {
        res.json({ error: message }, 500);
    },

    getPostData: function (req, res, onData) {
        var content = '';

        req.on('data', function (data) {
            if (content.length > 1e6) {
                // Flood attack or faulty client, nuke request.
                res.json({ error: 'Request entity too large.' }, 413);
            }

            content += data;
        });

        req.on('end', function () {
            // Return the posted data.
            onData(content);
        });
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