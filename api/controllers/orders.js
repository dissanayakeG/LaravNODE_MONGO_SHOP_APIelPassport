const Order = require("../models/order");
const mongoose = require("mongoose");

exports.getAllOrders = (req, res, next) => {
  Order.find()
    .select("product quantity _id")
    .populate("product", "name")
    .exec()
    .then((response) => {
      const passData = {
        count: response.length,
        orders: response.map((resp) => {
          return {
            product: resp.product,
            quantity: resp.quantity,
            _id: resp._id,
            request: {
              type: "GET",
              url: "http://localhost:5000/orders/" + resp._id,
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
};

exports.addNewOrder = (req, res, next) => {
  //try check is product id exist by Product.findById then execute below code
  const order = new Order({
    _id: new mongoose.Types.ObjectId(),
    quantity: req.body.quantity,
    product: req.body.productId,
  });

  order
    .save()
    .then((response) => {
      res.status(201).json({ response });
    })
    .catch((err) => {
      console.log("error", err);
      res.status(500).json({ err });
    });
};

exports.getOrderById = (req, res, next) => {
  const id = req.params.orderId;

  Order.findById(id)
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
};

exports.deleteOrder = (req, res, next) => {
  const id = req.params.orderId;

  Order.remove({ _id: id })
    .exec()
    .then((response) => {
      res.status(200).json({ response });
    })
    .catch((err) => {
      console.log("err", err);
      res.status(500).json({ error: err });
    });
};
