// src/server.ts
import "dotenv/config";
import express, { Application, Request, Response, NextFunction } from "express";
import productsRouter from "./routes/products.routes";
//import salesRouter from "./routes/sales.routes";

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());

// Health check
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok" });
});

// Rutas
app.use("/products", productsRouter);
//app.use("/sales", salesRouter);

// 404
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

// Manejo de errores
app.use(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error("Unexpected error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
