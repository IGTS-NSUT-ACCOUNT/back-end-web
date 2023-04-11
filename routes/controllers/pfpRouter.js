const path= require('path')
const express = require('express');
const multer = require('multer');
const router = express.Router();
const { normalize } = require('path')
var slugify = require('slugify')

const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary')

let destination = 'uploads/';



const storageEngine = new CloudinaryStorage({
    cloudinary: cloudinary,
    folder: 'uploads',
    allowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'svg'],
    destination: function (req, file, cb) {
        cb(null, normalize(destination))
    },
    

});


const upload = multer(
    {storage: storageEngine}
);


router.post('/',upload.single('image'),(req,res)=>{
    res.send(`${req.file.path}`)
})


module.exports = router