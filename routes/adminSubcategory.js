var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const cloudinary = require('../config/cloudinaryConfig')


var mainCategory = require('../models/mainCategory');
var subCategory = require('../models/subCategory');
var productDB = require('../models/product');

/* GET home page. */
router.get('/', async function(req, res, next) {
    req.session.mainCategoryId = req.query.id;
    console.log("id:",req.query.id)
    let mainCategories = await mainCategory.find({});
    res.render('adminSubcategory',{mainCategories}); // Pass as an object
});

router.post('/table', async function (req, res, next) {
    try {
      let subCategories = await subCategory.find({mainCategory:req.session.mainCategoryId});
      let mainCategories = await mainCategory.find({}, '_id mainCategoryName');
      let products = await productDB.aggregate([
        { $group: { _id: "$subCategory", count: { $sum: 1 } } }
      ]).exec();
      res.render('adminSubcategory/table', { mainCategories, subCategories, products });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal Server Error");
    }
  });

  router.patch('/offer', async function (req, res, next) {
    let offer = req.body.offer;
    let Id = req.body.Id;
    console.log(offer)
    await subCategory.updateOne({_id:Id},{$set:{offerPercentage:offer}})
    res.send("ok")
})

router.get('/search', async function (req, res, next) {

  let subCategories = await subCategory.find({mainCategory:req.session.mainCategoryId,subCategoryName:{$regex:`${req.query.value}`, $options: 'i'}});
      let mainCategories = await mainCategory.find({}, '_id mainCategoryName');
      let products = await productDB.aggregate([
        { $group: { _id: "$subCategory", count: { $sum: 1 } } }
      ]).exec();
  
      console.log(subCategories, mainCategories, products);
      res.render('adminSubcategory/table', { mainCategories, subCategories, products });
})
  
router.post('/create', async (req, res) => {
  try {
    const { croppedImage } = req.body; // Assume `image` is a base64-encoded string
    const name = req.body.name;

    if (!croppedImage) {
      return res.status(400).json({ error: 'No image provided in the request body' });
    }

    // Upload the image to Cloudinary
    const result = await cloudinary.uploader.upload(croppedImage, {
      folder: 'adminCategory' // Optional: specify a folder in Cloudinary
    });

    await subCategory.create({ subCategoryName:name,image:result.secure_url,mainCategory:req.session.mainCategoryId})
    
   res.redirect(`/admin/subCategory?id=${req.session.mainCategoryId}`)
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: 'Failed to upload image to Cloudinary' });
  }
});

router.post('/edit', async (req, res) => {
  try {
    console.log(req.body);
    const { croppedImage, name, id } = req.body;

    // Validate required fields
    if (!id || !name) {
      return res.status(400).json({ error: 'ID and Name are required fields.' });
    }

    // If no image is provided, only update the name
    if (!croppedImage) {
      console.log('No image provided, updating name only');
      await subCategory.updateOne({ _id: id }, { subCategoryName: name });
      return res.redirect(`/admin/subCategory?id=${req.session.mainCategoryId}`);
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(croppedImage, {
      folder: 'adminCategory'
    });

    // Update both name and image
    await subCategory.updateOne(
      { _id: id },
      { subCategoryName: name, image: result.secure_url }
    );

    res.redirect('/admin/subCategory');
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: 'Failed to process request.' });
  }
});

router.patch('/inactivate', async (req, res) => {
  try{
    const id = req.body.id;
    await subCategory.updateOne({_id:id},{status:"inactive"})
    res.send("ok")
  }
  catch(error){
    console.log(error)
  }
})

router.patch('/activate', async (req, res) => {
  try{
    const id = req.body.id;
    await subCategory.updateOne({_id:id},{status:"active"})
    res.send("ok")
  }
  catch(error){
    console.log(error)
  }
})

router.delete('/delete', async (req, res) => {
  try{
    const id = req.body.id;
    await subCategory.deleteOne({_id:id})
    res.send("ok")
  }
  catch(error){
    console.log(error)
  }
})
  module.exports = router;
