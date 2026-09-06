"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eliminarAdopcion = exports.misAdopciones = exports.actualizarEstadoAdopcion = exports.obtenerAdopcion = exports.listarAdopciones = exports.registrarAdopcion = void 0;
const Adopcion_1 = require("../models/Adopcion");
const SolicitudAdopcion_1 = require("../models/SolicitudAdopcion");
const Mascota_1 = require("../models/Mascota");
const Notificacion_1 = require("../models/Notificacion");
const Oferente_1 = require("../models/Oferente");
const Postulante_1 = require("../models/Postulante");
const ApiError_1 = __importDefault(require("../errors/ApiError"));
// ============================================
// CONTROLLERS
// ============================================
const registrarAdopcion = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const { solicitudId, condicionesAdopcion, compromisoFirmado, fechaEntrega } = req.body;
        // Verificar que la solicitud existe y está aprobada
        const solicitud = await SolicitudAdopcion_1.SolicitudAdopcionModel.findById(solicitudId)
            .populate('postulante')
            .populate('mascota');
        if (!solicitud) {
            throw new ApiError_1.default({
                name: 'NOT_FOUND',
                message: 'Solicitud no encontrada',
                code: 'SOLICITUD_NOT_FOUND',
                status: 404,
            });
        }
        if (solicitud.estadoSolicitud !== 'aprobada') {
            throw new ApiError_1.default({
                name: 'CONFLICT',
                message: 'La solicitud debe estar aprobada para registrar la adopción',
                code: 'SOLICITUD_NO_APROBADA',
                status: 409,
            });
        }
        // Verificar que el usuario sea admin o el oferente de la mascota
        if (req.user?.rol !== 'administrador') {
            // Buscar el oferente de la mascota
            const mascotaConOferente = await Mascota_1.MascotaModel.findById(solicitud.mascota._id)
                .populate('oferente');
            if (!mascotaConOferente) {
                throw new ApiError_1.default({
                    name: 'NOT_FOUND',
                    message: 'Mascota no encontrada',
                    code: 'MASCOTA_NOT_FOUND',
                    status: 404,
                });
            }
            const oferenteUsuario = mascotaConOferente.oferente.usuario;
            if (oferenteUsuario.toString() !== userId) {
                throw new ApiError_1.default({
                    name: 'FORBIDDEN',
                    message: 'No tiene permisos para registrar esta adopción',
                    code: 'NOT_OWNER',
                    status: 403,
                });
            }
        }
        // Verificar que la adopción no exista
        const adopcionExistente = await Adopcion_1.AdopcionModel.findOne({ solicitud: solicitudId });
        if (adopcionExistente) {
            throw new ApiError_1.default({
                name: 'CONFLICT',
                message: 'Ya existe una adopción para esta solicitud',
                code: 'ADOPCION_EXISTENTE',
                status: 409,
            });
        }
        // Obtener oferente y solicitante
        const oferente = await Oferente_1.OferenteModel.findOne({ usuario: userId });
        const postulante = await Postulante_1.PostulanteModel.findById(solicitud.postulante._id);
        if (!oferente || !postulante) {
            throw new ApiError_1.default({
                name: 'NOT_FOUND',
                message: 'Oferente o solicitante no encontrado',
                code: 'USER_NOT_FOUND',
                status: 404,
            });
        }
        // Crear adopción
        const adopcion = await Adopcion_1.AdopcionModel.create({
            solicitud: solicitudId,
            mascota: solicitud.mascota._id,
            oferente: oferente._id,
            solicitante: postulante._id,
            fechaAdopcion: fechaEntrega || new Date(),
            estado: 'activa',
        });
        // Actualizar estado de la mascota
        await Mascota_1.MascotaModel.findByIdAndUpdate(solicitud.mascota._id, {
            estadoAdopcion: 'adoptado',
            fechaAdopcion: new Date()
        });
        // Notificar al solicitante (postulante)
        await Notificacion_1.NotificacionModel.create({
            usuario: postulante.usuario,
            tipo: 'adopcion_registrada',
            titulo: '¡Adopción registrada!',
            mensaje: `La adopción de ${solicitud.mascota.nombre} ha sido registrada exitosamente`,
            enlace: `/adopciones/${adopcion._id}`,
            prioridad: 'alta',
        });
        // Notificar al oferente
        await Notificacion_1.NotificacionModel.create({
            usuario: userId,
            tipo: 'adopcion_registrada',
            titulo: '¡Adopción registrada!',
            mensaje: `La adopción de ${solicitud.mascota.nombre} ha sido registrada exitosamente`,
            enlace: `/adopciones/${adopcion._id}`,
            prioridad: 'media',
        });
        res.status(201).json(adopcion);
    }
    catch (error) {
        next(error);
    }
};
exports.registrarAdopcion = registrarAdopcion;
const listarAdopciones = async (req, res, next) => {
    try {
        const adopciones = await Adopcion_1.AdopcionModel.find()
            .populate({
            path: 'solicitud',
            populate: [
                { path: 'postulante', select: 'nombres apellidos telefono' },
                { path: 'mascota', select: 'nombre fotoPrincipal' },
            ],
        })
            .sort({ fechaAdopcion: -1 });
        res.json(adopciones);
    }
    catch (error) {
        next(error);
    }
};
exports.listarAdopciones = listarAdopciones;
const obtenerAdopcion = async (req, res, next) => {
    try {
        const { id } = req.params;
        const adopcion = await Adopcion_1.AdopcionModel.findById(id)
            .populate({
            path: 'solicitud',
            populate: [
                { path: 'postulante', select: 'nombres apellidos telefono correo direccion' },
                { path: 'mascota', populate: ['tipoMascota', 'raza', 'oferente'] },
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
        res.json(adopcion);
    }
    catch (error) {
        next(error);
    }
};
exports.obtenerAdopcion = obtenerAdopcion;
const actualizarEstadoAdopcion = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { estadoAdopcion, observaciones } = req.body;
        if (!['activa', 'anulada', 'finalizada'].includes(estadoAdopcion)) {
            throw new ApiError_1.default({
                name: 'VALIDATION_ERROR',
                message: 'Estado de adopción inválido',
                code: 'INVALID_ESTADO',
                status: 400,
            });
        }
        const adopcion = await Adopcion_1.AdopcionModel.findById(id);
        if (!adopcion) {
            throw new ApiError_1.default({
                name: 'NOT_FOUND',
                message: 'Adopción no encontrada',
                code: 'ADOPCION_NOT_FOUND',
                status: 404,
            });
        }
        // Si se finaliza, cambiar estado de la mascota
        if (estadoAdopcion === 'finalizada') {
            await Mascota_1.MascotaModel.findByIdAndUpdate(adopcion.mascota, {
                estadoAdopcion: 'adoptado'
            });
        }
        if (estadoAdopcion === 'anulada') {
            await Mascota_1.MascotaModel.findByIdAndUpdate(adopcion.mascota, {
                estadoAdopcion: 'disponible'
            });
        }
        adopcion.estado = estadoAdopcion;
        if (observaciones)
            adopcion.observaciones = observaciones;
        await adopcion.save();
        res.json({ message: 'Estado de adopción actualizado', adopcion });
    }
    catch (error) {
        next(error);
    }
};
exports.actualizarEstadoAdopcion = actualizarEstadoAdopcion;
const misAdopciones = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            throw new ApiError_1.default({
                name: 'UNAUTHORIZED',
                message: 'Usuario no autenticado',
                code: 'NOT_AUTHENTICATED',
                status: 401,
            });
        }
        // Buscar adopciones donde el usuario es oferente
        const oferente = await Oferente_1.OferenteModel.findOne({ usuario: userId });
        const oferenteId = oferente?._id;
        // Buscar adopciones donde el usuario es solicitante (postulante)
        const postulante = await Postulante_1.PostulanteModel.findOne({ usuario: userId });
        const postulanteId = postulante?._id;
        // Construir filtro
        const filter = {};
        if (oferenteId && postulanteId) {
            filter.$or = [
                { oferente: oferenteId },
                { solicitante: postulanteId }
            ];
        }
        else if (oferenteId) {
            filter.oferente = oferenteId;
        }
        else if (postulanteId) {
            filter.solicitante = postulanteId;
        }
        else {
            // Si no es oferente ni solicitante, devolver vacío
            return res.json([]);
        }
        const adopciones = await Adopcion_1.AdopcionModel.find(filter)
            .populate({
            path: 'solicitud',
            populate: [
                { path: 'postulante', select: 'nombres apellidos telefono correo' },
                { path: 'mascota', select: 'nombre fotoPrincipal tipoMascota raza' },
            ],
        })
            .populate('oferente', 'nombres apellidos telefono')
            .populate('solicitante', 'nombres apellidos telefono')
            .sort({ fechaAdopcion: -1 });
        res.json(adopciones);
    }
    catch (error) {
        next(error);
    }
};
exports.misAdopciones = misAdopciones;
const eliminarAdopcion = async (req, res, next) => {
    try {
        const { id } = req.params;
        const adopcion = await Adopcion_1.AdopcionModel.findById(id);
        if (!adopcion) {
            throw new ApiError_1.default({
                name: 'NOT_FOUND',
                message: 'Adopción no encontrada',
                code: 'ADOPCION_NOT_FOUND',
                status: 404,
            });
        }
        // Devolver mascota a disponible
        await Mascota_1.MascotaModel.findByIdAndUpdate(adopcion.mascota, {
            estadoAdopcion: 'disponible'
        });
        await Adopcion_1.AdopcionModel.findByIdAndDelete(id);
        res.json({ message: 'Adopción eliminada exitosamente' });
    }
    catch (error) {
        next(error);
    }
};
exports.eliminarAdopcion = eliminarAdopcion;
//# sourceMappingURL=adopcionController.js.map