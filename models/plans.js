const mongoose = require("mongoose");

const planSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  prices: [
      {
        price_id: {
          type: String,
        },
        price: {
          type: Number,
        },
        duration: {
          type: Number,
        },
        is_active: {
          type: Number,
          default:1
        },
      },
  ],
  product_id: {
    type: String,
  },
  is_active: {
    type: Number,
  },
});

module.exports = mongoose.model("plans", planSchema);
