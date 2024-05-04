const mongoose = require("mongoose")
require('dotenv').config();


const connectDB = async () => {

  const URI = process.env.URI

  if (!URI) {
    throw new Error("❌ URI no encontrada en las variables de entorno");
  }

  try {
    await mongoose.connect(URI.toString()) //{ useNewUrlParser: true, useUnifiedTopology: true })
    console.log("✅ Conectado a la BBDD");
  } catch (error) {
    console.log("❌ No conectado a DDBB");
    console.log(error);
  }
}

module.exports = { connectDB }