const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function(req, file, callback) {
      callback(null, path.join(__dirname,'..','/public/images/profile/temp'));
    },
    filename: function (req, file, callback) {
      req.tempImageName = file.originalname;
      req.tempImageExtension = path.extname(file.originalname);
      callback(null, file.originalname);
    }
});

const checkFileType = (file, callback) => {
  const fileTypes = /jpeg|jpg|png/;
  //checking the file extension
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
  //checking the mime type
  const mimeType = fileTypes.test(file.mimetype);
  //Extension name and mime type should be correct
  if(mimeType && extName) {
    return callback(null, true);
  } else{
    return callback("Images only");
  }
}
  
module.exports = multer({
    storage: storage,
    limits: { fileSize: 2000000 }, // 2 MB maximum
    fileFilter: (req, file, callback) => {checkFileType(file, callback);},
}).any();