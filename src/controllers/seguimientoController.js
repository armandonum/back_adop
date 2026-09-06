"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.obtenerSeguimiento = exports.listarSeguimientos = exports.crearSeguimiento = void 0;
const Seguimiento_1 = require("../models/Seguimiento");
const Adopcion_1 = require("../models/Adopcion");
const Notificacion_1 = require("../models/Notificacion");
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const crearSeguimiento = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const { adopcionId, tipo, estadoMascota, descripcion, observaciones, fotografias, proximoSeguimiento } = req.body;
        // Verificar adopción
        const adopcion = await Adopcion_1.AdopcionModel.findById(adopcionId)
            .populate({
            path: 'solicitud',
            populate: [
                { path: 'postulante', select: 'usuario' },
                { path: 'mascota', select: 'nombre' },
            ],
        });
        if (!adopcion) {
            throw new ApiError_1.default({
                name: 'NOT_FOUND',
                message: 'Adopción no encontrada',
                code: 'ADOPCION_NOT_FOUND',
                status: 404,
            });
        }
        // Determinar rol del realizador
        const rolRealizador = req.user?.rol === 'administrador' ? 'admin' : 'oferente';
        const seguimiento = await Seguimiento_1.SeguimientoModel.create({
            adopcion: adopcionId,
            tipo,
            estadoMascota,
            descripcion,
            observaciones,
            fotografias: fotografias || [],
            realizadoPor: userId,
            rolRealizador,
            proximoSeguimiento,
        });
        // Notificar al adoptante
        const postulante = adopcion.solicitud.postulante;
        await Notificacion_1.NotificacionModel.create({
            usuario: postulante.usuario,
            tipo: 'seguimiento_nuevo',
            titulo: 'Nuevo seguimiento de adopción',
            mensaje: `Se ha registrado un seguimiento para ${adopcion.solicitud.mascota.nombre}`,
            enlace: `/seguimientos/${seguimiento._id}`,
            prioridad: 'media',
        });
        res.status(201).json(seguimiento);
    }
    catch (error) {
        next(error);
    }
};
exports.crearSeguimiento = crearSeguimiento;
const listarSeguimientos = async (req, res, next) => {
    try {
        const { adopcionId } = req.query;
        const filter = {};
        if (adopcionId)
            filter.adopcion = adopcionId;
        const seguimientos = await Seguimiento_1.SeguimientoModel.find(filter)
            .populate('realizadoPor', 'nombreUsuario correo')
            .sort({ fechaSeguimiento: -1 });
        res.json(seguimientos);
    }
    catch (error) {
        next(error);
    }
};
exports.listarSeguimientos = listarSeguimientos;
const obtenerSeguimiento = async (req, res, next) => {
    try {
        const { id } = req.params;
        const seguimiento = await Seguimiento_1.SeguimientoModel.findById(id)
            .populate('realizadoPor', 'nombreUsuario correo')
            .populate('adopcion');
        if (!seguimiento) {
            throw new ApiError_1.default({
                name: 'NOT_FOUND',
                message: 'Seguimiento no encontrado',
                code: 'SEGUIMIENTO_NOT_FOUND',
                status: 404,
            });
        }
        res.json(seguimiento);
    }
    catch (error) {
        next(error);
    }
};
exports.obtenerSeguimiento = obtenerSeguimiento;
//# sourceMappingURL=seguimientoController.js.map