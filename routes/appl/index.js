var mongo = require('mongoskin'),
    config = require('../../config/config');
exports.getItemId = function (req, res) {
    // Get collection.
    mongo.db(config.mongo.connectionString2).collection('appl_7').findOne({ 'item_id': req.params.value }, function (err, item) {
        // Verify we have a document.
        if (!err && item != null) {
            res.json(item);
        }
        else {
            // No document found.
            res.json({ error: 'No records found. ItemId ' + req.params.value }, 404);
        }
    });
}

exports.getCity = function (req, res) {
    // Get collection.
    mongo.db(config.mongo.connectionString2).collection('appl_7').find({ 'city': req.params.value }).toArray(function (err, items) {
        if (!err && items != null) {
            res.json(items);
        }
        else {
            // No document found.
            res.json({ error: 'City not found. City ' + req.params.value }, 404);
        }
    });
}