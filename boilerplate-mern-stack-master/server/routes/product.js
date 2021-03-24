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
    let term = req.body.searchTerm

    // filter가 추가됨 
    let findArgs = {};

    for(let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {

            if (key === 'price') {
                findArgs[key] = {
                    $gte: req.body.filters[key][0], //이것보다크고
                    $lte: req.body.filters[key][1] //이것보다 작은 mongodb에서 사용
                }
            } else {
                findArgs[key] = req.body.filters[key]; 
            }
        }
    }

    console.log('findArgs',findArgs);

    if (term) {
        // product collection에 들어 있는 모든 상품 정보를 가져오기
        Product.find(findArgs) // 조건이 필요할 경우 ()안에 {} 에 넣음
            .find({ $text: { $search: term }}) //find가 한개 더 추가됨, mongo db에서 제공해주는 $text
            .populate('writer')  // writer 정보 다 가져오려고 
            .skip(skip)
            .limit(limit) // 여기까지 쿼리 생성임 몽고디비에 
            .exec((err,productInfo) => {
                if (err) return res.status(400).json({ success:false, err})
                return res.status(200).json({success:true, productInfo , postSize: productInfo.length })
        }) 
    } else {
        // product collection에 들어 있는 모든 상품 정보를 가져오기
        Product.find(findArgs) // 조건이 필요할 경우 ()안에 {} 에 넣음
            .populate('writer')  // writer 정보 다 가져오려고 
            .skip(skip)
            .limit(limit) // 여기까지 쿼리 생성임 몽고디비에 
            .exec((err,productInfo) => {
                if (err) return res.status(400).json({ success:false, err})
                return res.status(200).json({success:true, productInfo , postSize: productInfo.length })
        }) 
    }
})

//id=123123123,324234234,324234234  type=array
router.get('/products_by_id', (req, res) => {

    let type = req.query.type
    let productIds = req.query.id

    if (type === "array") {
        //id=123123123,324234234,324234234 이거를 
        //productIds = ['123123123', '324234234', '324234234'] 이런식으로 바꿔주기
        let ids = req.query.id.split(',')
        productIds = ids.map(item => {
            return item
        })

    }

    //productId를 이용해서 DB에서  productId와 같은 상품의 정보를 가져온다.

    Product.find({ _id: { $in: productIds } })
        .populate('writer')
        .exec((err, product) => {
            if (err) return res.status(400).send(err)
            return res.status(200).send(product)
        })


})

module.exports = router;