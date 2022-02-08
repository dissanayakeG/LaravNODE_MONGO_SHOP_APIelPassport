const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.signUp = (req, res, next) => {
  //before saving we can check is email already used by User.find, if not execute below
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "mail exist",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err,
            });
          } else {
            const user = User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
            });

            user
              .save()
              .then((result) => {
                console.log(result);
                res.status(201).json({
                  message: "User created",
                });
              })
              .catch((err) => {
                console.log(err);
                res.status(500).json({
                  error: err,
                });
              });
          }
        });
      }
    });
};

exports.login = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        res.status(404).json({
          message: "User not found",
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth fail",
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id,
            },
            "anykey",
            {
              expiresIn: "1h",
            }
          );
          return res.status(200).json({
            message: "Auth success",
            token: token,
          });
        }
        return res.status(401).json({
          message: "Auth fail",
        });
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};
