const express= require('express');
const { createProduct, getProduct, allProducts, updateProduct, getDelete } = require('../controller/productCtrl');
const { isAdmin, authmiddleware } = require('../middleware/authmiddleware');
const router= express.Router();


router.post('/', authmiddleware, isAdmin, createProduct);
router.get('/allProduct', allProducts);
router.get('/:id', authmiddleware, isAdmin,  getProduct);
router.put('/update/:id', authmiddleware, isAdmin,  updateProduct);
router.delete('/:id', authmiddleware, isAdmin, getDelete)


module.exports= router;