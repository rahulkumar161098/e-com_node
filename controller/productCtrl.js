const { query } = require("express");
const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const slugify = require('slugify')

// create a product
const createProduct = asyncHandler(async (req, res) => {
  try {
    if(req.body.title){
        req.body.slug= slugify(req.body.title)
    }
    const productData = await Product.create(req.body);
    res.status(201).json(productData);
  } catch (error) {
    throw new Error(error);
  }
});

// gat a product by id
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


// update a product
const updateProduct = asyncHandler(async (req, res) => {
    const {id}= req.params
    try{
        const product= await Product.findByIdAndUpdate(id, req.body,
        {
          new: true
        })
        res.json({
            // statusCode: 200,
            // message: "success",
            product: product
        },
        )
    }
    catch(error){
        throw new Error(error)
    }
});

// delete a product
const getDelete= asyncHandler(
  async (req, res)=>{
    const {id}= req.params;
    try{
      const delProduct= await Product.findByIdAndDelete(id);
      res.json({
        statusCode: 200,
        message: " Product deleted successfully"
      })
    }
    catch(error){
      throw new Error(error)
    }
  }
)


// get all products
const allProducts = asyncHandler(async (req, res) => {

  try{
    const queryObj= {...req.query}
    
    const includeFields= ["page", "limit", "sort", "fields"]
    includeFields.forEach((el)=> delete queryObj[el])
    console.log(includeFields);
    console.log("query obj", queryObj);
    let query= JSON.stringify(queryObj)
    console.log("query ", query);

      let allProduct= await Product.find(req.query)
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

module.exports = { createProduct, getProduct, allProducts, updateProduct, getDelete };
