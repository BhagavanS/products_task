const Product = require("../models/ProductModel");
const { body,validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
const auth = require("../middlewares/jwt");
var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);

function ProductData(data) {
	this.id = data._id;
	this.category= data.category;
	this.title = data.title;
	this.price = data.price;
	this.description = data.description;
	this.createdAt = data.createdAt;
}


exports.getAllProducts = [
	auth,
	function (req, res) {
		try {
			Product.find().then((products)=>{
				if(products.length > 0){
					return apiResponse.successResponseWithData(res, "Operation success", products);
				}else{
					return apiResponse.successResponseWithData(res, "Operation success", []);
				}
			});
		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}
];




exports.addProducts = [
	auth,
	body("title", "Title must not be empty.").isLength({ min: 1 }).trim(),
	body("description", "must not be empty").isLength({ min: 1 }).trim().custom((value,{req}) => {
		return Product.findOne({category : value,user: req.user._id}).then(item => {
			if (item) {
				return Promise.reject("Product is already existed.");
			}
		});
	}),
	sanitizeBody("*").escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			var product = new Product(
				{ category: req.body.category,
					user: req.user,
					title: req.body.title,
					price: req.body.price,
					description:req.body.description
				});
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}
			else {
				product.save(function (err) {
					if (err) { return apiResponse.ErrorResponse(res, err); }
					let productData = new ProductData(product);
					return apiResponse.successResponseWithData(res,"Product Added Success.", productData);
				});
			}
		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}
];


exports.updateProduct = [
	auth,
	body("title", "Title must not be empty.").isLength({ min: 1 }).trim(),
	body("description", "Description must not be empty.").isLength({ min: 1 }).trim(),
	body("category", "category must not be empty").isLength({ min: 1 }).trim().custom((value,{req}) => {
		return Product.findOne({title : value,user: req.user._id, _id: { "$ne": req.params.id }}).then(product => {
			if (product) {
				return Promise.reject("Product already existed.");
			}
		});
	}),
	sanitizeBody("*").escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			var product = new Product(
				{ category: req.body.category,
					title: req.body.title,
					price: req.body.price,
					description:req.body.description,
					_id:req.params.id
				});

			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}
			else {
				if(!mongoose.Types.ObjectId.isValid(req.params.id)){
					return apiResponse.validationErrorWithData(res, "Invalid Error.", "Invalid ID");
				}else{
					Product.findById(req.params.id, function (err, foundItem) {
						if(foundItem === null){
							return apiResponse.notFoundResponse(res,"Product not exists with this id");
						}else{
							if(foundItem.user.toString() !== req.user._id){
								return apiResponse.unauthorizedResponse(res, "You are not authorized to do this operation.");
							}else{
								Product.findByIdAndUpdate(req.params.id, product,function (err) {
									if (err) { 
										return apiResponse.ErrorResponse(res, err); 
									}else{
										let data = new ProductData(product);
										return apiResponse.successResponseWithData(res,"Product updated Success.", data);
									}
								});
							}
						}
					});
				}
			}
		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

 
exports.deleteProduct = [
	auth,
	function (req, res) {
		if(!mongoose.Types.ObjectId.isValid(req.params.id)){
			return apiResponse.validationErrorWithData(res, "Invalid Error.", "Invalid ID");
		}
		try {
			Product.findById(req.params.id, function (err, foundBook) {
				if(foundBook === null){
					return apiResponse.notFoundResponse(res,"Product not exists with this id");
				}else{
					if(foundBook.user.toString() !== req.user._id){
						return apiResponse.unauthorizedResponse(res, "You are not authorized to do this operation.");
					}else{
						Product.findByIdAndRemove(req.params.id,function (err) {
							if (err) { 
								return apiResponse.ErrorResponse(res, err); 
							}else{
								return apiResponse.successResponse(res,"Product delete Success.");
							}
						});
					}
				}
			});
		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}
];