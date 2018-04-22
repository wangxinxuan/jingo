var fs = require('fs')
var router = require('express').Router()
var app = require('../lib/app').getInstance()
var multer = require('multer')

var uploadFilePath = app.locals.config.get('features').uploadFilePath;
var upload = multer({ dest: uploadFilePath });

router.post('/', upload.single('editormd-image-file'), function (req, res, next) {
  // console.log(req.file);

  var originalname = req.file.originalname;
  var expandedName = originalname.slice(
		originalname.lastIndexOf('.'),
		originalname.length
	);
  var uploadedFileName = req.file.filename + expandedName;
  var uploadedFilePath = req.file.path + expandedName;
  fs.readFile(req.file.path, function (err, data) {
    fs.writeFile(uploadedFilePath, data, function (err) {
      var response;
      if (err) {
        response = {
          success: 0,
          message: 'File uploaded failed'
        }
        console.error('File uploaded failed:', err);
      } else {
        // remove temp file
        fs.unlink(req.file.path, function (err) {
          if (err) {
            console.error('remove upload temp file failed:', req.file.path);
          }
        });
        response = {
          success: 1,
          message: 'File uploaded successfully',
          url: '/upload/' + uploadedFileName
        };
        // console.log(response);
      }
      res.end(JSON.stringify(response));
    });
  });
});

module.exports = router;