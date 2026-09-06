"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eliminarNotificacion = exports.marcarTodasComoLeidas = exports.marcarComoLeida = exports.listarNotificaciones = void 0;
const Notificacion_1 = require("../models/Notificacion");
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const listarNotificaciones = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const { leido } = req.query;
        const filter = { usuario: userId };
        if (leido !== undefined)
            filter.leido = leido === 'true';
        const notificaciones = await Notificacion_1.NotificacionModel.find(filter)
            .sort({ createdAt: -1 })
            .limit(100);
        const noLeidas = await Notificacion_1.NotificacionModel.countDocuments({
            usuario: userId,
            leido: false,
        });
        res.json({
            notificaciones,
            noLeidas,
            total: notificaciones.length,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.listarNotificaciones = listarNotificaciones;
const marcarComoLeida = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        const notificacion = await Notificacion_1.NotificacionModel.findOne({ _id: id, usuario: userId });
        if (!notificacion) {
            throw new ApiError_1.default({
                name: 'NOT_FOUND',
                message: 'Notificación no encontrada',
                code: 'NOTIFICACION_NOT_FOUND',
                status: 404,
            });
        }
        notificacion.leido = true;
        notificacion.fechaLectura = new Date();
        await notificacion.save();
        res.json({ message: 'Notificación marcada como leída', notificacion });
    }
    catch (error) {
        next(error);
    }
};
exports.marcarComoLeida = marcarComoLeida;
const marcarTodasComoLeidas = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        await Notificacion_1.NotificacionModel.updateMany({ usuario: userId, leido: false }, { leido: true, fechaLectura: new Date() });
        res.json({ message: 'Todas las notificaciones marcadas como leídas' });
    }
    catch (error) {
        next(error);
    }
};
exports.marcarTodasComoLeidas = marcarTodasComoLeidas;
const eliminarNotificacion = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        const notificacion = await Notificacion_1.NotificacionModel.findOneAndDelete({ _id: id, usuario: userId });
        if (!notificacion) {
            throw new ApiError_1.default({
                name: 'NOT_FOUND',
                message: 'Notificación no encontrada',
                code: 'NOTIFICACION_NOT_FOUND',
                status: 404,
            });
        }
        res.json({ message: 'Notificación eliminada' });
    }
    catch (error) {
        next(error);
    }
};
exports.eliminarNotificacion = eliminarNotificacion;
//# sourceMappingURL=notificacionController.js.map