"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const errorHandler_1 = require("./middlewares/errorHandler");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const tipoMascotaRoutes_1 = __importDefault(require("./routes/tipoMascotaRoutes"));
const razaRoutes_1 = __importDefault(require("./routes/razaRoutes"));
const mascotaRoutes_1 = __importDefault(require("./routes/mascotaRoutes"));
const solicitudRoutes_1 = __importDefault(require("./routes/solicitudRoutes"));
const adopcionRoutes_1 = __importDefault(require("./routes/adopcionRoutes"));
const seguimientoRoutes_1 = __importDefault(require("./routes/seguimientoRoutes"));
const notificacionRoutes_1 = __importDefault(require("./routes/notificacionRoutes"));
const reporteRoutes_1 = __importDefault(require("./routes/reporteRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const app = (0, express_1.default)();
// Middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Rutas
app.use("/api/auth", authRoutes_1.default);
app.use("/api/tipos-mascota", tipoMascotaRoutes_1.default);
app.use("/api/razas", razaRoutes_1.default);
app.use("/api/mascotas", mascotaRoutes_1.default);
app.use("/api/solicitudes", solicitudRoutes_1.default);
app.use("/api/adopciones", adopcionRoutes_1.default);
app.use("/api/seguimientos", seguimientoRoutes_1.default);
app.use("/api/notificaciones", notificacionRoutes_1.default);
app.use("/api/reportes", reporteRoutes_1.default);
app.use("/api/admin", adminRoutes_1.default);
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
// Ruta de prueba
app.get("/", (req, res) => {
    res.send("🐾 API de Gestión de Adopciones de Mascotas - Sucre");
});
// Middleware de errores (debe ir al final)
app.use(errorHandler_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map