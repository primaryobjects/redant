CommonManager = {
    sendError: function (res, message) {
        res.writeHead(500, {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        });

        res.end(JSON.stringify({ error: message }));
    }
}