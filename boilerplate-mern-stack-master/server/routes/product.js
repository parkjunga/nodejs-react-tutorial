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


router.post('/products',(req,res) => {

    let limit = req.body.limit ? parseInt(req.body.limit) : 20; // 스트링일 경우 숫자로 바꿔줌
    let skip = req.body.skip ? parseInt(req.body.skip) : 0;

    // filter가 추가됨 
    let findArgs = {};

    for(let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {

            findArgs[key] = req.body.filters[key]
        }
    }

    console.log('findArgs',findArgs);

    // product collection에 들어 있는 모든 상품 정보를 가져오기
    Product.find(findArgs) // 조건이 필요할 경우 ()안에 {} 에 넣음
            .populate('writer')  // writer 정보 다 가져오려고 
            .skip(skip)
            .limit(limit) // 여기까지 쿼리 생성임 몽고디비에 
            .exec((err,productInfo) => {
                if (err) return res.status(400).json({ success:false, err})
                return res.status(200).json({success:true, productInfo , postSize: productInfo.length })
            }) 

})

module.exports = router;