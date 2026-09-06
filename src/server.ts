// backend/src/server.ts
import app from "./app";
import dotenv from "dotenv";
import mongoose from "mongoose"; // ✅ Agregar esta importación
import { connectDB } from "./config/database/connection";

dotenv.config();

// ✅ En Vercel, la conexión se establece al recibir una petición
// Esta función se ejecuta en cada request
export default async function handler(req: any, res: any) {
  // ✅ Conectar a MongoDB si no está conectado
  if (mongoose.connection.readyState !== 1) {
    try {
      await connectDB();
      console.log('✅ MongoDB conectado en Vercel');
    } catch (error) {
      console.error('❌ Error al conectar MongoDB en Vercel:', error);
      return res.status(500).json({ 
        error: 'Error de conexión a la base de datos' 
      });
    }
  }
  
  // ✅ Pasar la petición a la app de Express
  return app(req, res);
}

// ✅ Solo usar en desarrollo local
if (process.env.NODE_ENV !== 'production') {
  const startServer = async () => {
    await connectDB();
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  };
  startServer();
}

// ✅ Exportar app para Vercel (fallback)
export { app };