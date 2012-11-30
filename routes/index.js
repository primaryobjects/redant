var config = require('../config/config');

exports.index = function(req, res){
  res.render('index', { title: 'RedAnt', version: config.version });
};