"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reporteSolicitudes = exports.reporteMascotas = exports.reporteAdopciones = exports.estadisticasGenerales = void 0;
const Usuario_1 = require("../models/Usuario");
const Mascota_1 = require("../models/Mascota");
const SolicitudAdopcion_1 = require("../models/SolicitudAdopcion");
const Adopcion_1 = require("../models/Adopcion");
const estadisticasGenerales = async (req, res, next) => {
    try {
        const [totalUsuarios, totalMascotas, totalSolicitudes, totalAdopciones] = await Promise.all([
            Usuario_1.UsuarioModel.countDocuments({ estado: true }),
            Mascota_1.MascotaModel.countDocuments({ estado: true }),
            SolicitudAdopcion_1.SolicitudAdopcionModel.countDocuments(),
            Adopcion_1.AdopcionModel.countDocuments(),
        ]);
        const [mascotasDisponibles, mascotasAdoptadas, solicitudesPendientes] = await Promise.all([
            Mascota_1.MascotaModel.countDocuments({ estado: true, estadoAdopcion: 'disponible' }),
            Mascota_1.MascotaModel.countDocuments({ estado: true, estadoAdopcion: 'adoptado' }),
            SolicitudAdopcion_1.SolicitudAdopcionModel.countDocuments({ estadoSolicitud: 'pendiente' }),
        ]);
        const usuariosPorRol = await Usuario_1.UsuarioModel.aggregate([
            { $match: { estado: true } },
            { $group: { _id: '$rol', count: { $sum: 1 } } },
        ]);
        const adopcionesPorMes = await Adopcion_1.AdopcionModel.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: '$fechaAdopcion' },
                        month: { $month: '$fechaAdopcion' },
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { '_id.year': -1, '_id.month': -1 } },
            { $limit: 12 },
        ]);
        res.json({
            totalUsuarios,
            totalMascotas,
            totalSolicitudes,
            totalAdopciones,
            mascotasDisponibles,
            mascotasAdoptadas,
            solicitudesPendientes,
            usuariosPorRol,
            adopcionesPorMes,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.estadisticasGenerales = estadisticasGenerales;
const reporteAdopciones = async (req, res, next) => {
    try {
        const { fechaInicio, fechaFin, estado } = req.query;
        const filter = {};
        if (fechaInicio || fechaFin) {
            filter.fechaAdopcion = {};
            if (fechaInicio)
                filter.fechaAdopcion.$gte = new Date(fechaInicio);
            if (fechaFin)
                filter.fechaAdopcion.$lte = new Date(fechaFin);
        }
        if (estado)
            filter.estadoAdopcion = estado;
        const adopciones = await Adopcion_1.AdopcionModel.find(filter)
            .populate({
            path: 'solicitud',
            populate: [
                { path: 'postulante', select: 'nombres apellidos telefono correo' },
                { path: 'mascota', select: 'nombre tipoMascota raza sexo edadAproxMeses' },
            ],
        })
            .sort({ fechaAdopcion: -1 });
        res.json(adopciones);
    }
    catch (error) {
        next(error);
    }
};
exports.reporteAdopciones = reporteAdopciones;
const reporteMascotas = async (req, res, next) => {
    try {
        const { estadoAdopcion, tipoMascota } = req.query;
        const filter = { estado: true };
        if (estadoAdopcion)
            filter.estadoAdopcion = estadoAdopcion;
        if (tipoMascota)
            filter.tipoMascota = tipoMascota;
        const mascotas = await Mascota_1.MascotaModel.find(filter)
            .populate('tipoMascota', 'nombreTipo')
            .populate('raza', 'nombreRaza')
            .populate('oferente', 'nombres apellidos telefono')
            .sort({ fechaRegistro: -1 });
        const total = mascotas.length;
        const porEstado = await Mascota_1.MascotaModel.aggregate([
            { $match: { estado: true } },
            { $group: { _id: '$estadoAdopcion', count: { $sum: 1 } } },
        ]);
        res.json({
            total,
            porEstado,
            mascotas,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.reporteMascotas = reporteMascotas;
const reporteSolicitudes = async (req, res, next) => {
    try {
        const { estadoSolicitud, fechaInicio, fechaFin } = req.query;
        const filter = {};
        if (estadoSolicitud)
            filter.estadoSolicitud = estadoSolicitud;
        if (fechaInicio || fechaFin) {
            filter.fechaSolicitud = {};
            if (fechaInicio)
                filter.fechaSolicitud.$gte = new Date(fechaInicio);
            if (fechaFin)
                filter.fechaSolicitud.$lte = new Date(fechaFin);
        }
        const solicitudes = await SolicitudAdopcion_1.SolicitudAdopcionModel.find(filter)
            .populate('postulante', 'nombres apellidos telefono correo')
            .populate('mascota', 'nombre fotoPrincipal')
            .sort({ fechaSolicitud: -1 });
        const total = solicitudes.length;
        const porEstado = await SolicitudAdopcion_1.SolicitudAdopcionModel.aggregate([
            { $group: { _id: '$estadoSolicitud', count: { $sum: 1 } } },
        ]);
        res.json({
            total,
            porEstado,
            solicitudes,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.reporteSolicitudes = reporteSolicitudes;
//# sourceMappingURL=reporteController.js.map