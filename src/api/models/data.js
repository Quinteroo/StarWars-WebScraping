const mongoose = require("mongoose")

const data = mongoose.model("data", new mongoose.Schema({
  img: String,
  name: String

}))

module.exports = data