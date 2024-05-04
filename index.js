const scraper = require("./src/scraper/scraper.js")
const express = require("express")
const cors = require("cors")
const { connectDB } = require("./src/config/connectDB.js")



const app = express()
app.use(express.json())
app.use(cors())

connectDB()

app.use("/api/v1/scraper", async (req, res, next) => {
  try {
    await scraper("https://www.starwars.com/databank");
    console.log("✅ scraper y almacenamiento en BBDD correcto");

  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    res.status(500).json({ error: "❌ Hubo un error al procesar la solicitud" });
  }
});


app.use("*", (req, res, next) => {
  return res.status(404).json("❌ Ruta no encontrada")
})


app.listen("4000", () => {
  console.log("✅ Servidor levantado en http://localhost:4000");
})

