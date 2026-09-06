"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelarSolicitud = exports.obtenerSolicitud = exports.responderSolicitud = exports.solicitudesRecibidas = exports.listarSolicitudes = exports.crearSolicitud = void 0;
const SolicitudAdopcion_1 = require("../models/SolicitudAdopcion");
const Mascota_1 = require("../models/Mascota");
const Postulante_1 = require("../models/Postulante");
const Oferente_1 = require("../models/Oferente");
const Notificacion_1 = require("../models/Notificacion");
const Adopcion_1 = require("../models/Adopcion");
const ApiError_1 = __importDefault(require("../errors/ApiError"));
// ============================================
// CONTROLLERS
// ============================================
const crearSolicitud = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const { mascotaId, motivoPostulacion, ...evaluacion } = req.body;
        // Verificar que el usuario es solicitante
        const postulante = await Postulante_1.PostulanteModel.findOne({ usuario: userId });
        if (!postulante) {
            throw new ApiError_1.default({
                name: 'FORBIDDEN',
                message: 'El usuario no es un solicitante válido',
                code: 'NOT_POSTULANTE',
                status: 403,
            });
        }
        const mascota = await Mascota_1.MascotaModel.findById(mascotaId)
            .populate('oferente');
        if (!mascota || !mascota.estado) {
            throw new ApiError_1.default({
                name: 'NOT_FOUND',
                message: 'Mascota no encontrada',
                code: 'MASCOTA_NOT_FOUND',
                status: 404,
            });
        }
        if (mascota.estadoAdopcion !== 'disponible' && mascota.estadoAdopcion !== 'pendiente') {
            throw new ApiError_1.default({
                name: 'CONFLICT',
                message: 'La mascota ya no está disponible',
                code: 'MASCOTA_NO_DISPONIBLE',
                status: 409,
            });
        }
        // Verificar si ya postuló
        const solicitudExistente = await SolicitudAdopcion_1.SolicitudAdopcionModel.findOne({
            postulante: postulante._id,
            mascota: mascotaId,
            estadoSolicitud: { $in: ['pendiente', 'aprobada'] },
        });
        if (solicitudExistente) {
            throw new ApiError_1.default({
                name: 'CONFLICT',
                message: 'Ya has postulado a esta mascota',
                code: 'SOLICITUD_DUPLICADA',
                status: 409,
            });
        }
        // Obtener el oferente de la mascota
        const oferente = await Oferente_1.OferenteModel.findOne({ _id: mascota.oferente._id });
        if (!oferente) {
            throw new ApiError_1.default({
                name: 'NOT_FOUND',
                message: 'Oferente no encontrado',
                code: 'OFERENTE_NOT_FOUND',
                status: 404,
            });
        }
        // Crear solicitud
        const solicitud = await SolicitudAdopcion_1.SolicitudAdopcionModel.create({
            postulante: postulante._id,
            mascota: mascotaId,
            oferente: oferente._id,
            motivoPostulacion,
            ...evaluacion,
            fechaSolicitud: new Date(),
        });
        // Cambiar estado de la mascota a pendiente
        await Mascota_1.MascotaModel.findByIdAndUpdate(mascotaId, { estadoAdopcion: 'pendiente' });
        await Notificacion_1.NotificacionModel.create({
            usuario: mascota.oferente.usuario,
            tipo: 'solicitud_nueva',
            titulo: 'Nueva solicitud de adopción',
            mensaje: `El postulante ${postulante.nombres} ${postulante.apellidos} ha solicitado adoptar a ${mascota.nombre}`,
            enlace: `/solicitudes/${solicitud._id}`,
            prioridad: 'alta',
        });
        res.status(201).json(solicitud);
    }
    catch (error) {
        console.error('❌ [crearSolicitud] Error:', error);
        next(error);
    }
};
exports.crearSolicitud = crearSolicitud;
const listarSolicitudes = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const postulante = await Postulante_1.PostulanteModel.findOne({ usuario: userId });
        if (!postulante) {
            throw new ApiError_1.default({
                name: 'NOT_FOUND',
                message: 'Perfil de solicitante no encontrado',
                code: 'POSTULANTE_NOT_FOUND',
                status: 404,
            });
        }
        const filter = { postulante: postulante._id };
        const solicitudes = await SolicitudAdopcion_1.SolicitudAdopcionModel.find(filter);
        res.json(solicitudes);
    }
    catch (error) {
        console.error('❌ [listarSolicitudes] Error:', error);
        next(error);
    }
};
exports.listarSolicitudes = listarSolicitudes;
const solicitudesRecibidas = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const { estadoSolicitud } = req.query;
        const oferente = await Oferente_1.OferenteModel.findOne({ usuario: userId });
        if (!oferente) {
            throw new ApiError_1.default({
                name: 'NOT_FOUND',
                message: 'Perfil de oferente no encontrado',
                code: 'OFFERENT_NOT_FOUND',
                status: 404,
            });
        }
        // Buscar mascotas del oferente
        const mascotas = await Mascota_1.MascotaModel.find({ oferente: oferente._id, estado: true });
        const mascotaIds = mascotas.map(m => m._id);
        const filter = { mascota: { $in: mascotaIds } };
        if (estadoSolicitud)
            filter.estadoSolicitud = estadoSolicitud;
        const solicitudes = await SolicitudAdopcion_1.SolicitudAdopcionModel.find(filter)
            .populate('postulante', 'nombres apellidos telefono correo')
            .populate('mascota', 'nombre fotoPrincipal')
            .sort({ fechaSolicitud: -1 });
        res.json(solicitudes);
    }
    catch (error) {
        console.error('❌ [solicitudesRecibidas] Error:', error);
        next(error);
    }
};
exports.solicitudesRecibidas = solicitudesRecibidas;
// ============================================
// ============================================
const responderSolicitud = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        const { accion, observaciones } = req.body;
        if (!['aprobada', 'rechazada'].includes(accion)) {
            throw new ApiError_1.default({
                name: 'VALIDATION_ERROR',
                message: 'Acción inválida. Debe ser aprobada o rechazada',
                code: 'INVALID_ACTION',
                status: 400,
            });
        }
        const solicitud = await SolicitudAdopcion_1.SolicitudAdopcionModel.findById(id)
            .populate('mascota')
            .populate('postulante');
        if (!solicitud) {
            throw new ApiError_1.default({
                name: 'NOT_FOUND',
                message: 'Solicitud no encontrada',
                code: 'SOLICITUD_NOT_FOUND',
                status: 404,
            });
        }
        // Verificar que el usuario es el oferente de la mascota
        const oferente = await Oferente_1.OferenteModel.findOne({ usuario: userId });
        if (!oferente || solicitud.mascota.oferente.toString() !== oferente._id.toString()) {
            if (req.user?.rol !== 'administrador') {
                throw new ApiError_1.default({
                    name: 'FORBIDDEN',
                    message: 'No tiene permisos para responder esta solicitud',
                    code: 'NOT_OWNER',
                    status: 403,
                });
            }
        }
        if (solicitud.estadoSolicitud !== 'pendiente') {
            throw new ApiError_1.default({
                name: 'CONFLICT',
                message: 'La solicitud ya fue respondida',
                code: 'SOLICITUD_YA_RESPONDIDA',
                status: 409,
            });
        }
        solicitud.estadoSolicitud = accion;
        solicitud.fechaRespuesta = new Date();
        if (observaciones)
            solicitud.observaciones = observaciones;
        await solicitud.save();
        if (accion === 'aprobada') {
            try {
                const adopcion = await Adopcion_1.AdopcionModel.create({
                    solicitante: solicitud.postulante._id,
                    oferente: oferente._id,
                    mascota: solicitud.mascota._id,
                    solicitud: solicitud._id,
                    fechaAdopcion: new Date(),
                    estado: 'activa',
                    observaciones: observaciones || 'Adopción aprobada por el oferente'
                });
                await Mascota_1.MascotaModel.findByIdAndUpdate(solicitud.mascota._id, {
                    estadoAdopcion: 'adoptado',
                    fechaAdopcion: new Date()
                });
                await Notificacion_1.NotificacionModel.create({
                    usuario: solicitud.postulante.usuario,
                    tipo: 'solicitud_aprobada',
                    titulo: '¡Adopción aprobada!',
                    mensaje: `¡Felicidades! Tu solicitud para adoptar a ${solicitud.mascota.nombre} ha sido aprobada. La adopción se ha registrado exitosamente.`,
                    enlace: `/adopciones/${adopcion._id}`,
                    prioridad: 'alta',
                });
                await Notificacion_1.NotificacionModel.create({
                    usuario: userId,
                    tipo: 'adopcion_registrada',
                    titulo: '¡Adopción registrada!',
                    mensaje: `La adopción de ${solicitud.mascota.nombre} ha sido registrada exitosamente.`,
                    enlace: `/adopciones/${adopcion._id}`,
                    prioridad: 'media',
                });
            }
            catch (error) {
                console.error('❌ [responderSolicitud] ERROR AL CREAR ADOPCIÓN:', error);
                throw error;
            }
        }
        else {
            // Devolver mascota a disponible
            await Mascota_1.MascotaModel.findByIdAndUpdate(solicitud.mascota._id, {
                estadoAdopcion: 'disponible'
            });
            // Notificar al solicitante que fue rechazada
            await Notificacion_1.NotificacionModel.create({
                usuario: solicitud.postulante.usuario,
                tipo: 'solicitud_rechazada',
                titulo: 'Solicitud rechazada',
                mensaje: `Lo sentimos, tu solicitud para adoptar a ${solicitud.mascota.nombre} ha sido rechazada.`,
                enlace: `/mis-solicitudes`,
                prioridad: 'media',
            });
        }
        res.json({
            message: `Solicitud ${accion} exitosamente`,
            solicitud,
            adopcionCreada: accion === 'aprobada'
        });
    }
    catch (error) {
        console.error('❌ [responderSolicitud] ERROR GENERAL:', error);
        next(error);
    }
};
exports.responderSolicitud = responderSolicitud;
const obtenerSolicitud = async (req, res, next) => {
    try {
        const { id } = req.params;
        const solicitud = await SolicitudAdopcion_1.SolicitudAdopcionModel.findById(id)
            .populate('postulante')
            .populate({
            path: 'mascota',
            populate: [
                { path: 'tipoMascota', select: 'nombreTipo' },
                { path: 'raza', select: 'nombreRaza' },
                { path: 'oferente', select: 'nombres apellidos telefono' },
            ],
        });
        if (!solicitud) {
            throw new ApiError_1.default({
                name: 'NOT_FOUND',
                message: 'Solicitud no encontrada',
                code: 'SOLICITUD_NOT_FOUND',
                status: 404,
            });
        }
        res.json(solicitud);
    }
    catch (error) {
        console.error('❌ [obtenerSolicitud] Error:', error);
        next(error);
    }
};
exports.obtenerSolicitud = obtenerSolicitud;
const cancelarSolicitud = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        const solicitud = await SolicitudAdopcion_1.SolicitudAdopcionModel.findById(id)
            .populate('mascota');
        if (!solicitud) {
            throw new ApiError_1.default({
                name: 'NOT_FOUND',
                message: 'Solicitud no encontrada',
                code: 'SOLICITUD_NOT_FOUND',
                status: 404,
            });
        }
        // Verificar que el usuario es el postulante
        const postulante = await Postulante_1.PostulanteModel.findOne({ usuario: userId });
        if (!postulante || solicitud.postulante.toString() !== postulante._id.toString()) {
            throw new ApiError_1.default({
                name: 'FORBIDDEN',
                message: 'No tiene permisos para cancelar esta solicitud',
                code: 'NOT_OWNER',
                status: 403,
            });
        }
        if (solicitud.estadoSolicitud !== 'pendiente') {
            throw new ApiError_1.default({
                name: 'CONFLICT',
                message: 'Solo se pueden cancelar solicitudes pendientes',
                code: 'SOLICITUD_NO_CANCELABLE',
                status: 409,
            });
        }
        solicitud.estadoSolicitud = 'cancelada';
        await solicitud.save();
        // Devolver mascota a disponible
        await Mascota_1.MascotaModel.findByIdAndUpdate(solicitud.mascota._id, { estadoAdopcion: 'disponible' });
        res.json({ message: 'Solicitud cancelada', solicitud });
    }
    catch (error) {
        console.error('❌ [cancelarSolicitud] Error:', error);
        next(error);
    }
};
exports.cancelarSolicitud = cancelarSolicitud;
//# sourceMappingURL=solicitudController.js.map