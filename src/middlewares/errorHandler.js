"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const errorHandler = (err, req, res, _next) => {
    if (req.originalUrl.includes("/auth/signin")) {
        return res.status(401).json({
            message: "Credenciales incorrectas",
        });
    }
    if (err instanceof ApiError_1.default) {
        return res.status(err.status).json({
            message: err.message,
            code: err.code,
            name: err.name,
        });
    }
    console.error(err);
    return res.status(500).json({
        message: "Error interno del servidor",
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map