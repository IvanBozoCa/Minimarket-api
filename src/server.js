// src/server.js
const express = require("express");
const productsRouter = require("./routes/products.routes")
const salesRouter = require("./routes/sales.routes")

const app = express()
const PORT = process.env.PORT || 3000;

//Middleware para parsear JSON en el loby
app.use(express.json());

//Endpoint simple para verificar que el servidor esta vivo
app.get("/health",(req,res)=> {
    res.json({status:"ok"});
});

//Rutas Principales
app.use("/products", productsRouter);
app.use("/sales",salesRouter);

// Middleware para rutas no encontradas (404)
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// Middleware de manejo de errores generales (500)
app.use((err, req, res, next) => {
  console.error("Unexpected error:", err);
  res.status(500).json({ message: "Internal server error" });
});

// Levantar el servidor
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});