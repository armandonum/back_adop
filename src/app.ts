// backend/src/app.ts
import express from "express";
import cors from "cors";
import path from 'path';
import { errorHandler } from "./middlewares/errorHandler";

import authRoutes from "./routes/authRoutes";
import tipoMascotaRoutes from "./routes/tipoMascotaRoutes";
import razaRoutes from "./routes/razaRoutes";
import mascotaRoutes from "./routes/mascotaRoutes";
import solicitudRoutes from "./routes/solicitudRoutes";
import adopcionRoutes from "./routes/adopcionRoutes";
import seguimientoRoutes from "./routes/seguimientoRoutes";
import notificacionRoutes from "./routes/notificacionRoutes";
import reporteRoutes from "./routes/reporteRoutes";
import adminRoutes from "./routes/adminRoutes";

const app = express();

// ✅ CORS - Permite ambos orígenes
app.use(cors({
  origin: [
    'https://front-adop.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true
}));

app.use(express.json());

// ✅ Rutas
app.use("/api/auth", authRoutes);
app.use("/api/tipos-mascota", tipoMascotaRoutes);
app.use("/api/razas", razaRoutes);
app.use("/api/mascotas", mascotaRoutes);
app.use("/api/solicitudes", solicitudRoutes);
app.use("/api/adopciones", adopcionRoutes);
app.use("/api/seguimientos", seguimientoRoutes);
app.use("/api/notificaciones", notificacionRoutes);
app.use("/api/reportes", reporteRoutes);
app.use("/api/admin", adminRoutes);

// ✅ Servir archivos estáticos (uploads)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ✅ Ruta de prueba
app.get("/", (req, res) => {
  res.json({ 
    message: "API de Gestión de Adopciones de Mascotas - Sucre",
    status: "online",
    version: "1.0.0"
  });
});

// ✅ Ruta de health check para Vercel
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Middleware de errores (debe ir al final)
app.use(errorHandler);

export default app;