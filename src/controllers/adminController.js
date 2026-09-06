"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listarTodasSolicitudes = exports.listarTodasMascotas = exports.cambiarEstadoUsuario = exports.listarUsuarios = void 0;
const Usuario_1 = require("../models/Usuario");
const Oferente_1 = require("../models/Oferente");
const Postulante_1 = require("../models/Postulante");
const Mascota_1 = require("../models/Mascota");
const SolicitudAdopcion_1 = require("../models/SolicitudAdopcion");
const ApiError_1 = __importDefault(require("../errors/ApiError"));
// ============================================
// GESTIÓN DE USUARIOS
// ============================================
const listarUsuarios = async (req, res, next) => {
    try {
        const usuarios = await Usuario_1.UsuarioModel.find()
            .select('-contrasena')
            .sort({ fechaRegistro: -1 });
        // Obtener perfiles adicionales
        const usuariosConPerfil = await Promise.all(usuarios.map(async (usuario) => {
            let perfil = null;
            if (usuario.rol === 'oferente') {
                perfil = await Oferente_1.OferenteModel.findOne({ usuario: usuario._id });
            }
            else if (usuario.rol === 'solicitante') {
                perfil = await Postulante_1.PostulanteModel.findOne({ usuario: usuario._id });
            }
            return {
                ...usuario.toObject(),
                perfil,
            };
        }));
        res.json(usuariosConPerfil);
    }
    catch (error) {
        next(error);
    }
};
exports.listarUsuarios = listarUsuarios;
const cambiarEstadoUsuario = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { estado } = req.body; // true o false
        const usuario = await Usuario_1.UsuarioModel.findById(id);
        if (!usuario) {
            throw new ApiError_1.default({
                name: 'NOT_FOUND',
                message: 'Usuario no encontrado',
                code: 'USER_NOT_FOUND',
                status: 404,
            });
        }
        // No permitir desactivar al propio admin
        if (usuario._id.toString() === req.user?.id && usuario.rol === 'administrador') {
            throw new ApiError_1.default({
                name: 'FORBIDDEN',
                message: 'No puedes desactivar tu propio usuario',
                code: 'CANNOT_DEACTIVATE_SELF',
                status: 403,
            });
        }
        usuario.estado = estado;
        await usuario.save();
        res.json({ message: `Usuario ${estado ? 'activado' : 'desactivado'}`, usuario });
    }
    catch (error) {
        next(error);
    }
};
exports.cambiarEstadoUsuario = cambiarEstadoUsuario;
// ============================================
// GESTIÓN DE MASCOTAS (Admin)
// ============================================
const listarTodasMascotas = async (req, res, next) => {
    try {
        const { estadoAdopcion, tipoMascota } = req.query;
        const filter = {};
        if (estadoAdopcion)
            filter.estadoAdopcion = estadoAdopcion;
        if (tipoMascota)
            filter.tipoMascota = tipoMascota;
        const mascotas = await Mascota_1.MascotaModel.find(filter)
            .populate('tipoMascota', 'nombreTipo')
            .populate('raza', 'nombreRaza')
            .populate('oferente', 'nombres apellidos telefono')
            .sort({ fechaRegistro: -1 });
        res.json(mascotas);
    }
    catch (error) {
        next(error);
    }
};
exports.listarTodasMascotas = listarTodasMascotas;
// ============================================
// GESTIÓN DE SOLICITUDES (Admin)
// ============================================
const listarTodasSolicitudes = async (req, res, next) => {
    try {
        const { estadoSolicitud } = req.query;
        const filter = {};
        if (estadoSolicitud)
            filter.estadoSolicitud = estadoSolicitud;
        const solicitudes = await SolicitudAdopcion_1.SolicitudAdopcionModel.find(filter)
            .populate('postulante', 'nombres apellidos telefono correo')
            .populate('mascota', 'nombre fotoPrincipal')
            .populate('oferente', 'nombres apellidos')
            .sort({ fechaSolicitud: -1 });
        res.json(solicitudes);
    }
    catch (error) {
        next(error);
    }
};
exports.listarTodasSolicitudes = listarTodasSolicitudes;
//# sourceMappingURL=adminController.js.map