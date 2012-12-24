var mongo = require('mongoskin'),
    easypost = require('easypost'),
    config = require('../../config/config'),
    managers = require('../../managers/commonManager');

exports.get = function (req, res) {
    try {
        // Select the item by id.
        mongo.db(config.mongo.connectionString).collection('nest').findOne({ '_id': mongo.ObjectID.createFromHexString(req.params.itemId) }, function (err, document) {
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
}

exports.find = function (req, res) {
    CommonManager.cleanQuery(req.query['q'].toString(), function (query, err) {
        if (err != null) {
            CommonManager.sendError(res, err.message);
        }
        else {
            try {
                // Get collection.
                mongo.db(config.mongo.connectionString).collection('nest').find(query).toArray(function (err, items) {
                    if (!err && items != null) {
                        console.log('Found ' + items.length + ' records.');
                        res.json(items);
                    }
                    else {
                        // No document found.
                        res.json({ error: 'No records found.' }, 404);
                    }
                });
            }
            catch (err) {
                // Database error.
                CommonManager.sendError(res, err.message);
            }
        }
    });
}

exports.insert = function (req, res) {
    // Read post data.
    easypost.get(req, res, function (data) {
        // Parse the JSON object.
        CommonManager.tryParseJson(data, function (json, err) {
            if (err != null) {
                CommonManager.sendError(res, err.message);
            }
            else {
                // Check for script injection in json, unless url contains ?script=1
                if (CommonManager.isScriptInjection(req, res, json)) {
                    CommonManager.sendError(res, 'Script tags are not allowed.');
                }
                else {
                    try {
                        // Insert the new item.
                        mongo.db(config.mongo.connectionString).collection('nest').insert(json, { safe: true }, function (err) {
                            // Success.
                            res.json(json);
                        });
                    }
                    catch (err) {
                        // Database error.
                        CommonManager.sendError(res, err.message);
                    }
                }
            }
        });
    });
 };

exports.update = function (req, res) {
    // Read post data.
    easypost.get(req, res, function (data) {
        // Parse the JSON object.
        CommonManager.tryParseJson(data, function (json, err) {
            if (err != null) {
                CommonManager.sendError(res, err.message);
            }
            else {
                // Check for script injection in json, unless url contains ?script=1
                if (CommonManager.isScriptInjection(req, res, json)) {
                    CommonManager.sendError(res, 'Script tags are not allowed.');
                }
                else {
                    try {
                        // Update the record matching id.
                        mongo.db(config.mongo.connectionString).collection('nest').update({ '_id': new mongo.ObjectID(req.params.itemId) }, json, { safe: true, multi: false }, function (err, count) {
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
                }
            }
        });
    });
};

exports.delete = function (req, res) {
    try {
        // Update the record matching id.
        mongo.db(config.mongo.connectionString).collection('nest').remove({ '_id': mongo.ObjectID.createFromHexString(req.params.itemId) }, { safe: true, multi: false }, function (err, count) {
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
};

// String helpers
String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g, "");
};
