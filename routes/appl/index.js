var mongo = require('mongodb'),
    config = require('../../config/config'),
    managers = require('../../managers/commonManager');

exports.getItemId = function (req, res) {
    // Open connection.
    mongo.connect(config.mongo.connectionString2, function (err, connection) {
        // Get collection.
        connection.collection('appl_7', function (err, collection) {
            collection.findOne({ 'item_id': req.params.value }, function (err, item) {
                // Verify we have a document.
                if (!err && item != null) {
                    res.send(JSON.stringify(item));
                }
                else {
                    // No document found.
                    res.writeHead(404, {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*"
                    });

                    res.end(JSON.stringify({ error: 'ItemId not found.', id: req.params.value }));
                }
            });
        });
    });
}

exports.getCity = function (req, res) {
    // Open connection.
    mongo.connect(config.mongo.connectionString2, function (err, connection) {
        // Get collection.
        connection.collection('appl_7', function (err, collection) {
            collection.find({ 'city': req.params.value }).toArray(function (err, items) {
                if (!err && items != null) {
                    res.send(JSON.stringify(items));
                }
                else {
                    // No document found.
                    res.writeHead(404, {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*"
                    });

                    res.end(JSON.stringify({ error: 'City not found.', id: req.params.value }));
                }
            });
        });
    });
}