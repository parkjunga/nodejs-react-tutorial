const express = require('express');
const router = express.Router();
const multer = require('multer');
const { Product } = require('../models/Product');
// multer 
var storage = multer.diskStorage({
    destination: function (req, file, cb) { // 어디에 파일이 저장되는지 
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) { //어떤 이름으로 파일 저장할지 
        cb(null, `${Date.now()}_${file.originalname}`)
    }
})

var uploads = multer({ storage: storage }).single('file');
router.post('/image',(req,res) => {
    // 가져온 이미지 저장  
    uploads(req,res, err =>{
        if(err) {
            return res.json({ success: false, err})
        }
        return res.json({success: true, filePath: res.req.file.path , fileName: res.req.file.filename})
    })
});


router.post('/', (req,res) =>  {
    //  받아온 정보들을 DB에 넣어준다.
    const product = new Product(req.body); //저장

    product.save((err) => {
        if (err) return res.status(400).json({success:false,err})
        return res.status(200).json({success:true});
    });
})

module.exports = router;