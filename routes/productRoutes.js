const express= require('express');
const { createProduct, getProduct, allProducts } = require('../controller/productCtrl');
const router= express.Router();

router.post('/', createProduct);
router.get('/allProduct', allProducts);
router.get('/:id', getProduct);


module.exports= router;