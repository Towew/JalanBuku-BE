const multer = require("multer");

exports.uploadFiles = (bookPdf, bookImg) => {
  // Destination & rename file
  const storage = multer.diskStorage({
    /* destination: function (req, file, cb) {
      if (file.fieldname === bookPdf) {
        cb(null, "uploads/pdf");
      } else {
        cb(null, "uploads/image");
      }
    }, */
    destination: function (req, file, cb) {
      cb(null, "uploads");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname.replace(/\s/g, ""));
    },
  });

  // Filter extension file
  const fileFilter = function (req, file, cb) {
    if (file.fieldname == bookImg) {
      if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)) {
        req.fileValidationError = {
          message: "Only image files are allowed!",
        };
        return cb(new Error("Only image files are allowed!", false));
      }
    }

    if (file.fieldname == bookPdf) {
      if (!file.originalname.match(/\.(pdf|PDF)$/)) {
        req.fileValidationError = {
          message: "Only PDF files are allowed!",
        };
        return cb(new Error("Only PDF files are allowed!", false));
      }
    }
    cb(null, true);
  };

  // Maximum file size
  // MB -> KB -> byte
  const sizeInMB = 20;
  const maxSize = sizeInMB * 1024 * 1000;

  const upload = multer({
    storage,
    fileFilter,
    limits: {
      fileSize: maxSize,
    },
  }).fields([
    { name: bookImg, maxCount: 1 },
    {
      name: bookPdf,
      maxCount: 1,
    },
  ]);

  // HANDLER filter, doesn't file, LIMIT SIZE

  return (req, res, next) => {
    upload(req, res, function (err) {
      if (req.fileValidationError) {
        return res.status(400).send(req.fileValidationError);
      }

      if (!req.file && err) {
        return res.status(400).send({
          message: "Please select files to upload",
          err,
        });
      }

      if (err) {
        if (err.code == "LIMIT_FILE_SIZE") {
          return res.status(400).send({
            message: "Max file sized 10MB",
          });
        }

        return res.status(400).send(err);
      }

      // if okay
      return next();
    });
  };
};
