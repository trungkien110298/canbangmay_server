var express = require("express");
var api_login = express.Router();
var jwt = require("jsonwebtoken");
var User = require("../models/user");
var config = require("../config/database");

api_login.get("/api-login", function (req, res) {
	return res.render("login.html");
});

api_login.post("/api-login", function (req, res) {
	console.log("/api-login");
	User.findOne({ username: req.body.username }, function (err, user) {
		if (err) throw err;

		if (!user) {
			res.status(200).send({ code: 9995, message: "User is not existed" });
		} else {
			// check if password matches
			user.comparePassword(req.body.password, function (err, isMatch) {
				if (isMatch && !err) {
					// if user is found and password is right create a token
					var payload = { phonenumber: user.phonenumber };
					var token = jwt.sign(payload, config.secret, { expiresIn: "1h" });
					// return the information including token as JSON
					res.json({
						code: 1000,
						message: "OK",
						data: [
							{
								id: user.id,
								username: user.username,
								token: "JWT " + token,
								avatar: user.avatar
							}
						]
					});
				} else {
					res.status(200).send({ code: 1004, message: "Wrong password" });
				}
			});
		}
	});
});

module.exports = api_login;
