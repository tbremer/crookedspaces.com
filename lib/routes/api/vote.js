var MongoClient = require('mongodb').MongoClient,
    dbPort = process.env.DB_PORT || 27017,
    dbUrl = process.env.DB_URL || 'mongodb://localhost';
    db_w_UN = process.env.DB_WRITE_UN,
    db_w_PW = process.env.DB_WRITE_PW;

module.exports = function (serverObj) {
  var res = serverObj.res,
      url = serverObj.url,
      query = serverObj.query;

  // Connection URL
  var url = dbUrl + ':' + dbPort + '/crookedspaces';
  // Use connect method to connect to the Server
  MongoClient.connect(url, function(err, db) {
    if (err) {
      throw new Error(err);
    }

    db.authenticate("crookedSpacesWrite", "1234", function (error, connected) {
      if (error) {
        throw new Error(error);
      }
      console.log(connected);
      insertDocuments(db, function(results) {
          db.close();
          res.end(JSON.stringify(results));
        });
    });
  });
};


var insertDocuments = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('votes');
  // Insert some documents
  collection.insert([
    {a : 1}, {a : 2}, {a : 3}
  ], function(err, result) {
    if (err) {
      throw new Error(err);
    }

    callback(result);
  });
}
