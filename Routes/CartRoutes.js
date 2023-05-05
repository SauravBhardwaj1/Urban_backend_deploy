const express= require('express');

const { cartModel } = require('../model/cartModel');

const cartRoutes = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     NewProduct:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: product name.
 *         category:
 *           type: string
 *           description: category of product.
 *         image:
 *           type: string
 *           description: link of product image.
 *         price:
 *           type: integer
 *           description: price of product.
 *     RegResult:
 *       type: object
 *       properties:
 *         msg:
 *           type: string
 *           description: message
 *           example: User Registered Succesfully. 
 *     LogReq:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           description: message
 *           example: Albin@gmail.com.
 *         password:
 *           type: string
 *           description: message
 *           example: Albin123.
 *     AddResponse:
 *       type: object
 *       properties:
 *         msg:
 *           type: string
 *           description: message
 *           example: Product Added Succesfully.
 */

/**
 * @swagger
 * /products/add:
 *  post:
 *    summary: To add new Products.
 *    tags: [Products]
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *            $ref: '#/components/schemas/NewProduct' 
 *    responses:
 *     200:
 *       description: The user was successfully registered
 *       content:
 *         application/json:
 *            schema:
 *               $ref: '#/components/schemas/AddResponse'
 *     400:
 *       description: Bad Request      
 */


// POST Route
cartRoutes.post("/add",async (req,res)=>{
    try {
        const product =  new cartModel(req.body)
        await product.save()
        res.status(200).send({"msg": "Product added successfully"})
    } catch (error) {
        res.status(400).send({"err":error.message})
    }
})


// Getting All products
cartRoutes.get("/",async (req,res)=>{
    let {Mens, Womens }= req.query
    console.log(Mens,Womens)
    try {
        let product
        if(Mens){
            product = await cartModel.find({Mens})
        } else if(Womens){
            product = await cartModel.find({Womens})
        }else if(Mens == undefined && Womens == undefined){
            product = await cartModel.find()
        }
        res.send(product);
    } catch (error) {
        res.status(400).send({"err":error.message})
    }
})

/**
 * @swagger
 * /products/:
 *  get:
 *    summary: To get  all products.
 *    tags: [Products]
 *    security:
 *      - bearerAuth: []
 *    responses:
 *     200:
 *       description: List of all Products
 *       content:
 *         application/json:
 *            schema:
 *               $ref: '#/components/schemas/NewProduct'
 *     400:
 *       description: Bad Request      
 */
// Filtering 
cartRoutes.get("/filter",async (req,res)=>{
    let {category, brand, strike_price} = req.query
    // console.log(category,brand,strike_price)
    try {
        let product;
        if(category){
            product = await cartModel.find({category})
        }
        else if(brand){
             product = await cartModel.find({brand})
        }
        else if(strike_price){
             product = await cartModel.find({strike_price})
        }
        res.send(product);

    } catch (error) {
        res.status(400).send({"err":error.message})
    }
})


/**
 * @swagger
 * /products/{id}:
 *  patch:
 *    summary: To update product by id.
 *    parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the product.
 *         schema:
 *           type: string
 *    tags: [Products]
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *            $ref: '#/components/schemas/NewProduct'
 *    responses:
 *     200:
 *       description: Product updated
 *       content:
 *         application/json:
 *            schema:
 *               type: object
 *               properties:
 *                  msg:
 *                    type: string
 *                    description: message 
 *                    example: Product updated successfully
 *     400:
 *       description: Bad Request 
 *       content:
 *          application/json:
 *            schema:
 *               type: object
 *               properties:
 *                  msg:
 *                    type: string
 *                    description: message 
 *                    example: Invalid id    
 */


cartRoutes.patch("/:id",async (req,res)=>{
    try {
        const existsId = await cartModel.findOne({"_id":req.params.id});
        if(existsId) {
            await cartModel.findByIdAndUpdate(req.params.id,req.body);
            res.status(200).send({"msg": "Product updated successfully"})
        }else{
            res.status(404).send({"msg": "Product not found"});
        }
    } catch (error) {
        res.status(404).send({"msg": error.message});
    }
})

/**
 * @swagger
 * /products/{id}:
 *  delete:
 *    summary: To remove product by id.
 *    parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the product.
 *         schema:
 *           type: string
 *    tags: [Products]
 *    security:
 *      - bearerAuth: []
 *    responses:
 *     200:
 *       description: Product deleted 
 *       content:
 *         application/json:
 *            schema:
 *               type: object
 *               properties:
 *                  msg:
 *                    type: string
 *                    description: message 
 *                    example: Product deleted successfully
 *     400:
 *       description: Bad Request 
 *       content:
 *          application/json:
 *            schema:
 *               type: object
 *               properties:
 *                  msg:
 *                    type: string
 *                    description: message 
 *                    example: Invalid id    
 */


//Delete ROute
cartRoutes.delete("/:id",async (req,res)=>{
    try {
        const existsId = await cartModel.findOne({"_id":req.params.id});
        if(existsId) {
            await cartModel.findByIdAndDelete(req.params.id);
            res.status(200).send({"msg": "Product deleted successfully"})
        }else{
            res.status(404).send({"msg": "Product not found"});
        }
    } catch (error) {
        res.status(404).send({"msg": error.message});
    }
})


/**
 * @swagger
 * /products/search?q={Title}:
 *  get:
 *    summary: To Search product by title.
 *    parameters:
 *       - in: path
 *         name: Title
 *         required: true
 *         description: Title of the product.
 *         schema:
 *           type: string
 *    tags: [Products]
 *    security:
 *      - bearerAuth: []
 *    responses:
 *     200:
 *       description: Product updated
 *       content:
 *         application/json:
 *            schema:
 *               type: object
 *               properties:
 *                  msg:
 *                    type: string
 *                    description: message 
 *                    example: Product updated successfully
 *     400:
 *       description: Bad Request 
 *       content:
 *          application/json:
 *            schema:
 *               type: object
 *               properties:
 *                  msg:
 *                    type: string
 *                    description: message 
 *                    example: Invalid id    
 */


// Searching Functionality
cartRoutes.get("/search",async(req,res)=>{
    const {q} = req.query
    try {
        const products = await cartModel.find({ title: { $regex: new RegExp(q, "i") } })
        res.status(200).send(products)
    } catch (error) {
        res.status(400).send({"msg":error})
    }
})


/**
 * @swagger
 * /products/search/{id}:
 *  get:
 *    summary: To get product by id.
 *    parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the product.
 *         schema:
 *           type: string
 *    tags: [Products]
 *    security:
 *      - bearerAuth: []
 *    responses:
 *     200:
 *       description: Single Product 
 *       content:
 *         application/json:
 *            schema:
 *               $ref: '#/components/schemas/NewProduct'
 *     400:
 *       description: Bad Request 
 *       content:
 *          application/json:
 *            schema:
 *               type: object
 *               properties:
 *                  msg:
 *                    type: string
 *                    description: message 
 *                    example: Invalid id    
 */

//GET BY ID
cartRoutes.get("/search/:id",async(req,res)=>{
    const {id} = req.params
    try {
        const products = await cartModel.findOne({_id:id})
        res.status(200).send(products)
    } catch (error) {
        res.status(400).send({"msg":error})
    }
 })


 module.exports = {cartRoutes}