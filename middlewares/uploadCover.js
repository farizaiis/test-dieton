const multer = require("multer");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
    cloud_name: "dejongos",
    api_key: "155217614556815",
    api_secret: "sbMGKszwfhFQ2oUxV4ZwYgc_Qcg",
});

module.exports = (fieldName) => {
    const storage = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: {
            folder: "cover"
        }
        })
    
        const upload = multer({ storage: storage }).single(fieldName)

    return (req, res, next) => {
        upload(req, res, (err) => {
            return next();
        });
    }
}