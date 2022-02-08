const Product = require("../models/product");
const mongoose = require("mongoose");

exports.getAllProducts = (req, res, next) => {
    Product.find()
      .select("name price _id")    
      .exec()
      .then((response) => {
        const passData = {
          count: response.length,
          products: response.map((resp) => {
            return {
              name: resp.name,
              price: resp.price,
              _id: resp._id,
              request: {
                type: "GET",
                url: "http://localhost:5000/products/" + resp._id,
              },
            };
          }),
        };
        res.status(200).json(passData);
      })
      .catch((err) => {
        console.log("err", err);
        res.status(500).json({ error: err });
      });
  }

  exports.saveProduct = (req, res, next) => {
    const product = new Product({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      price: req.body.price,
    });
    product
      .save()
      .then((result) => {
        console.log("result:", result);
        res.status(201).json({
          product: product,
        });
      })
      .catch((err) => {
        console.log("err", err);
        res.status(500).json({ error: err });
      });
  }

  exports.getProductById = (req, res, next) => {
    const id = req.params.productId;
  
    Product.findById(id)
      .exec()
      .then((response) => {
        if (response) {
          res.status(200).json(response);
        } else {
          res.status(404);
        }
      })
      .catch((err) => {
        console.log("err", err);
        res.status(500).json({ error: err });
      });
  }

  exports.updateProduct = (req, res, next) => {
    const id = req.params.productId;
  
    //request should look like [{"propname":"name", "value":"new val"}]
    const updateOps = {};
    for (let i = 0; i < req.body.length; i++) {
      updateOps[req.body[i].propName] = req.body[i].value;
    }
  
    Product.update({ _id: id }, { $set: updateOps })
      .exec()
      .then((response) => {
        res.status(200).json();
      })
      .catch((err) => {
        console.log("err", err);
        res.status(500).json({ error: err });
      });
  }

  exports.deleteProduct = (req, res, next) => {
    const id = req.params.productId;
  
    Product.remove({ _id: id })
      .exec()
      .then((response) => {
        res.status(200).json({ response });
      })
      .catch((err) => {
        console.log("err", err);
        res.status(500).json({ error: err });
      });
  }
