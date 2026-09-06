// backend/src/server.ts
import app from "./app";
import dotenv from "dotenv";
import { connectDB } from "./config/database/connection";
import { env } from "./config/env";

// ✅ Solo conectar a DB en desarrollo local
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
  const startServer = async () => {
    await connectDB();
    const PORT = env.port || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  };
  startServer();
}

// ✅ IMPORTANTE: Exportar app para Vercel
export default app;