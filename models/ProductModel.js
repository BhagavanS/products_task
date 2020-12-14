var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ProductSchema = new Schema({
	category: {type: String, required: true},
	title: {type: String, required: true},
	price: {type: String, required: true,immutable: true},
	description: {type: String, required: true},
	user: { type: Schema.ObjectId, ref: "User", required: true },
}, {timestamps: true});

module.exports = mongoose.model("Product", ProductSchema);