var mongo = require('mongodb'),
    config = require('../../config/config'),
    managers = require('../../managers/commonManager');

exports.get = function (req, res) {
    // Open connection.
    mongo.connect(config.mongo.connectionString, function (err, connection) {
        // Get collection.
        connection.collection('nest', function (err, collection) {
            try {
                // Select the item by id.
                collection.findOne({ '_id': new mongo.ObjectID(req.params.itemId) }, function (err, document) {
                    // Verify we have a document.
                    if (!err && document != null) {
                        res.writeHead(200, {
                            "Content-Type": "application/json",
                            "Access-Control-Allow-Origin": "*"
                        });

                        res.end(JSON.stringify(document));
                    }
                    else {
                        // No document found.
                        res.writeHead(404, {
                            "Content-Type": "application/json",
                            "Access-Control-Allow-Origin": "*"
                        });

                        res.end(JSON.stringify({ error: 'ID not found.', id: req.params.itemId }));
                    }
                });
            }
            catch (err) {
                // Database error.
                CommonManager.sendError(res, err.message);
            }
        });
    });
}

exports.insert = function (req, res) {
    // Open connection.
    mongo.connect(config.mongo.connectionString, function (err, connection) {
        // Get collection.
        connection.collection('nest', function (err, collection) {
            try {
                // Insert the new item.
                collection.insert(req.body, { safe: true }, function (err) {
                    // Success.
                    res.writeHead(200, {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*"
                    });

                    res.end(JSON.stringify(req.body));
                });
            }
            catch (err) {
                // Database error.
                CommonManager.sendError(res, err.message);
            }
        });
    });
};

exports.update = function (req, res) {
    // Open connection.
    mongo.connect(config.mongo.connectionString, function (err, connection) {
        // Get the collection.
        connection.collection('nest', function (err, collection) {
            try {
                // Update the record matching id.
                collection.update({ '_id': new mongo.ObjectID(req.params.itemId) }, req.body, { safe: true, multi: false }, function (err, count) {
                    // Verify a document was updated by checking the count.
                    if (!err && count > 0) {
                        // Success.
                        res.writeHead(200, {
                            "Content-Type": "application/json",
                            "Access-Control-Allow-Origin": "*"
                        });

                        res.end(JSON.stringify({ document: req.body, updated: count }));
                    }
                    else {
                        // Error, check if it's a database error or just no records updated.
                        if (err != null) {
                            // Error during update.
                            CommonManager.sendError(res, err.message);
                        }
                        else {
                            // No records updated.
                            res.writeHead(404, {
                                "Content-Type": "application/json",
                                "Access-Control-Allow-Origin": "*"
                            });

                            res.end(JSON.stringify({ error: 'No record updated', id: req.params.itemId }));
                        }
                    }
                });
            }
            catch (err) {
                // Database error.
                CommonManager.sendError(res, err.message);
            }
        });
    });
};