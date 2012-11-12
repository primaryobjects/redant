﻿var mongo = require('mongodb'),
    config = require('../../config/config'),
    managers = require('../../managers/commonManager'),
    util = require('util');

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
                        res.json(document);
                    }
                    else {
                        // No document found.
                        res.json({ error: 'ID not found.', id: req.params.itemId }, 404);
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

String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g, "");
};

exports.find = function (req, res) {
    // Open connection.
    mongo.connect(config.mongo.connectionString, function (err, connection) {
        var q = req.query['q'].toString();
        var query = {};
        console.log(q);

        try {
            // Try parsing the JSON object.
            query = JSON.parse(q);

            var index = q.indexOf('/');
            if (index > -1) {
                // This is a regular expression. Parse out the left and right portion of the expression and create a RegEx query.
                var left = q.substring(0, index - 1);
                var right = q.substr(index, q.length - index);

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
                query[left] = { $regex: right, $options: 'ig' };

                console.log(query);
            }
        }
        catch (err) {
            // Invalid JSON.
            CommonManager.sendError(res, 'Invalid JSON object passed in query: ' + q + '. ' + err.message);
            return;
        }

        // Get collection.
        connection.collection('nest', function (err, collection) {
            collection.find(query).toArray(function (err, items) {
                if (!err && items != null) {
                    console.log('Found ' + items.length + ' records.');
                    res.json(items);
                }
                else {
                    // No document found.
                    res.json({ error: 'No records found.' }, 404);
                }
            });
        });
    });
}

exports.insert = function (req, res) {
    // Read post data.
    CommonManager.getPostData(req, res, function (data) {
        // Parse the JSON object.
        CommonManager.tryParseJson(data, function (json, err) {
            if (err != null) {
                CommonManager.sendError(res, err.message);
            }
            else {
                // Open connection.
                mongo.connect(config.mongo.connectionString, function (err, connection) {
                    // Get collection.
                    connection.collection('nest', function (err, collection) {
                        try {
                            // Insert the new item.
                            collection.insert(json, { safe: true }, function (err) {
                                // Success.
                                res.json(json);
                            });
                        }
                        catch (err) {
                            // Database error.
                            CommonManager.sendError(res, err.message);
                        }
                    });
                });
            }
        });
    });
};

exports.update = function (req, res) {
    // Read post data.
    CommonManager.getPostData(req, res, function (data) {
        // Parse the JSON object.
        CommonManager.tryParseJson(data, function (json, err) {
            if (err != null) {
                CommonManager.sendError(res, err.message);
            }
            else {
                // Open connection.
                mongo.connect(config.mongo.connectionString, function (err, connection) {
                    // Get the collection.
                    connection.collection('nest', function (err, collection) {
                        try {
                            // Update the record matching id.
                            collection.update({ '_id': new mongo.ObjectID(req.params.itemId) }, json, { safe: true, multi: false }, function (err, count) {
                                // Verify a document was updated by checking the count.
                                if (!err && count > 0) {
                                    // Success.
                                    res.json({ document: json, updated: count });
                                }
                                else {
                                    // Error, check if it's a database error or just no records updated.
                                    if (err != null) {
                                        // Error during update.
                                        CommonManager.sendError(res, err.message);
                                    }
                                    else {
                                        // No records updated.
                                        res.json({ error: 'No record updated', id: req.params.itemId }, 404);
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
            }
        });
    });
};

exports.delete = function (req, res) {
    // Open connection.
    mongo.connect(config.mongo.connectionString, function (err, connection) {
        // Get the collection.
        connection.collection('nest', function (err, collection) {
            try {
                // Update the record matching id.
                collection.remove({ '_id': new mongo.ObjectID(req.params.itemId) }, { safe: true, multi: false }, function (err, count) {
                    // Verify a document was updated by checking the count.
                    if (!err && count > 0) {
                        // Success.
                        res.json({ id: req.params.itemId, deleted: count });
                    }
                    else {
                        // Error, check if it's a database error or just no records updated.
                        if (err != null) {
                            // Error during update.
                            CommonManager.sendError(res, err.message);
                        }
                        else {
                            // No records updated.
                            res.json({ error: 'No record deleted', id: req.params.itemId }, 404);
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