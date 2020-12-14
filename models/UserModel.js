var mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
	firstName: {type: String, required: true},
	lastName: {type: String, required: true},
	email: {type: String, required: true},
	password: {type: String, required: true},
	mobile: {type: String, required: true},
	age: {type: String, required: true},
	photo:{ type : String, required: false, default: null },
	lat:{ type : Number, required: false, default: null },
	long:{ type : Number, required: false, default: null },
	loginTimestamp:{ type : Date, required: false, default: null },
	status: {type: Boolean, required: true, default: 1},
    passwordToken: {type: String, required: false}
}, {timestamps: true});

// Virtual for user's full name
UserSchema
	.virtual("fullName")
	.get(function () {
		return this.firstName + " " + this.lastName;
	});

module.exports = mongoose.model("User", UserSchema);