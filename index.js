const express=require("express");
const app=express();
const mongoose=require("mongoose");
const bodyParser=require("body-parser");
const port=process.env.PORT || 4000;


mongoose.connect("mongodb://127.0.0.1:27017/productCollections",{ useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
    console.log("mongodb connected successfully");
}).catch((err)=>{
    console.log(err);
});

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.json());

const product=new mongoose.Schema({name:String,description:String,price:Number})

const Products=new mongoose.model("products",product);

// Create product
app.post("/product/new", async (req, res) => {
    try {
      const newProduct = await Products.create(req.body);
      res.status(201).json({
        success: true,
        message: "Product created successfully",
        newProduct,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  });
  
  // Get all products
  app.get("/allproducts", async (req, res) => {
    try {
      const allProducts = await Products.find();
      res.status(200).json({
        success: true,
        allProducts,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  });
  
  // Update product by ID
  app.put("/product/update/:id", async (req, res) => {
    try {
      const updatedProduct = await Products.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updatedProduct) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }
      res.status(200).json({
        success: true,
        message: "Product updated successfully",
        updatedProduct,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  });
  
  // Delete product by ID
  app.delete("/product/delete/:id", async (req, res) => {
    try {
      const deletedProduct = await Products.findByIdAndDelete(req.params.id);
      if (!deletedProduct) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }
      res.status(200).json({
        success: true,
        message: "Product deleted successfully",
        deletedProduct,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  });
  
app.listen(port,()=>{
    console.log(`Server is running on ${port}`);
})
