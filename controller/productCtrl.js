const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");

// create a product
const createProduct = asyncHandler(async (req, res) => {
  try {
    const productData = await Product.create(req.body);
    res.status(201).json(productData);
  } catch (error) {
    throw new Error(error);
  }
});

// gat a product
const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    res.status(200).json({
      statusCode: 200,
      message: "success",
      product: product,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// get all products
const allProducts = asyncHandler(async (req, res) => {
    try{
        let allProduct= await Product.find()
        res.json({
            statusCode: 200,
            message: "success",
            product: allProduct
        })
    }
    catch(error){
        throw new Error(error)
    }
});

// update a product
const updateProduct = asyncHandler(async (req, res) => {
    const id= req.params
    try{
        const product= await Product.findByIdAndUpdate(id,{
            name : req?.body?.name,
        })
        res.json({
            statusCode: 200,
            message: "success",
            product: product
        })
    }
    catch(error){
        throw new Error(error)
    }
});

module.exports = { createProduct, getProduct, allProducts };
