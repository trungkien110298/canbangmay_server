var User = require('../models/user');
var config = require('../config/database');
var jwt = require('jsonwebtoken');
var BlackList = require("../models/blackList");


exports.isAuthenticated = function (req, res, next) {
    if (req.headers &&
        req.headers.authorization &&
        req.headers.authorization.split(' ')[0] === 'JWT') {

        var jwtToken = req.headers.authorization.split(' ')[1];

        BlackList.findOne({ usedToken: jwtToken }, function (err, usedToken) {
            if (usedToken) {
                res.render('login.html');
            } else {
                jwt.verify(jwtToken, config.secret, { expiresInMinutes: 60 }, function (err, payload) {
                    if (err) {
                        res.render('login.html');
                    } else {
                        //console.log('decoder: ' + payload.phonenumber);
                        User.findOne({ phonenumber: payload.phonenumber }, function (err, user) {
                            if (user) {
                                //Authentication success!
                                req.body.id = user.id;
                                req.body.phonenumber = user.phonenumber;
                                next();
                            } else {
                                res.render('login.html');
                            }
                        })
                    }
                });
            }
        });

    } else {
        res.render('login.html');
    }
};