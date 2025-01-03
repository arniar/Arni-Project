var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const cloudinary = require('../config/cloudinaryConfig')


var mainCategory = require('../models/mainCategory');
var subCategories = require('../models/subCategory');

/* GET home page. */
router.get('/admin-category', async function(req, res, next) {
    res.render('adminCategory'); // Pass as an object
});

router.post('/admin-category/table', async function (req, res, next) {
  let mainCategories=  await mainCategory.find();
  console.log(mainCategories)
  let subcategoriesCount = await subCategories.aggregate([{$group:{_id:"$mainCategory",count:{$sum:1} }}]).exec();
  console.log("go",subcategoriesCount)
  res.render('adminCategory/table', { mainCategories, subcategoriesCount }); // Pass as an object
});

router.patch('/mainCategoryOffer', async function (req, res, next) {
      let offer = req.body.offer;
      let Id = req.body.Id;
      console.log(offer)
      await mainCategory.updateOne({_id:Id},{$set:{offerPercentage:offer}})
      res.send("ok")
})

router.get('/adminCategory-search', async function (req, res, next) {

  let mainCategories = await mainCategory.find({mainCategoryName:{$regex:`${req.query.value}`, $options: 'i'}})
  let subcategoriesCount = await subCategories.aggregate([{$group:{_id:"$mainCategory",count:{$sum:1} }}]).exec();
  res.render('adminCategory/table', { mainCategories, subcategoriesCount })
})

router.post('/adminCategory-create', async (req, res) => {
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

    await mainCategory.create({ mainCategoryName:name,image:result.secure_url})
    
   res.redirect('/admin-category')
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: 'Failed to upload image to Cloudinary' });
  }
});

module.exports = router;
