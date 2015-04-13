var fs = require('fs'),
    path = require('path'),
    fileType = require('file-type');

module.exports = function (serverObj, callback) {
  var res = serverObj.res,
      url = serverObj.url,
      file_path = process.cwd() + url,
      mime;

  fs.readFile(file_path, function (err, data) {
    if (err) {
      res.writeHead(404);
      return res.end(JSON.stringify(err));
    }

    mime = fileType(data) || {mime: 'text/plain'};

    res.writeHead(200, mime.mime);

    if (mime.mime.search('image') !== -1) {
      res.end(data, 'binary');
    }

    res.end(data);
  });
};
