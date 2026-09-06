"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cambiarContrasena = exports.perfil = exports.login = exports.registro = void 0;
const Usuario_1 = require("../models/Usuario");
const Oferente_1 = require("../models/Oferente");
const Postulante_1 = require("../models/Postulante");
const bcrypt_1 = require("../utils/bcrypt");
const jwt_1 = require("../utils/jwt");
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const registro = async (req, res, next) => {
    try {
        const { nombreUsuario, correo, contrasena, rol, ...datosPerfil } = req.body;
        const rolesPermitidos = ['oferente', 'solicitante', 'administrador'];
        if (!rolesPermitidos.includes(rol)) {
            throw new ApiError_1.default({
                name: 'VALIDATION_ERROR',
                message: 'Rol inválido. Debe ser oferente, solicitante o administrador',
                code: 'INVALID_ROLE',
                status: 400,
            });
        }
        // Verificar si el usuario ya existe
        const usuarioExistente = await Usuario_1.UsuarioModel.findOne({ correo });
        if (usuarioExistente) {
            throw new ApiError_1.default({
                name: 'CONFLICT',
                message: 'El correo ya está registrado',
                code: 'EMAIL_ALREADY_EXISTS',
                status: 409,
            });
        }
        // Hash de la contraseña
        const contrasenaHash = await (0, bcrypt_1.hashPassword)(contrasena);
        // Crear usuario
        const nuevoUsuario = await Usuario_1.UsuarioModel.create({
            nombreUsuario,
            correo,
            contrasena: contrasenaHash,
            rol,
        });
        // Los administradores también tienen perfil de oferente
        if (rol === 'oferente' || rol === 'administrador') {
            await Oferente_1.OferenteModel.create({
                usuario: nuevoUsuario._id,
                ...datosPerfil,
                correo,
            });
        }
        else if (rol === 'solicitante') {
            await Postulante_1.PostulanteModel.create({
                usuario: nuevoUsuario._id,
                ...datosPerfil,
                correo,
            });
        }
        // Generar token
        const token = (0, jwt_1.generateToken)({
            id: nuevoUsuario._id.toString(),
            correo: nuevoUsuario.correo,
            rol: nuevoUsuario.rol,
        });
        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            token,
            usuario: {
                id: nuevoUsuario._id,
                nombreUsuario: nuevoUsuario.nombreUsuario,
                correo: nuevoUsuario.correo,
                rol: nuevoUsuario.rol,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.registro = registro;
const login = async (req, res, next) => {
    try {
        const { correo, contrasena } = req.body;
        // Buscar usuario
        const usuario = await Usuario_1.UsuarioModel.findOne({ correo }).select('+contrasena');
        if (!usuario) {
            throw new ApiError_1.default({
                name: 'UNAUTHORIZED',
                message: 'Credenciales incorrectas',
                code: 'INVALID_CREDENTIALS',
                status: 401,
            });
        }
        // Verificar estado
        if (!usuario.estado) {
            throw new ApiError_1.default({
                name: 'UNAUTHORIZED',
                message: 'Usuario inactivo',
                code: 'USER_INACTIVE',
                status: 401,
            });
        }
        // Verificar contraseña
        const passwordValida = await (0, bcrypt_1.comparePassword)(contrasena, usuario.contrasena);
        if (!passwordValida) {
            throw new ApiError_1.default({
                name: 'UNAUTHORIZED',
                message: 'Credenciales incorrectas',
                code: 'INVALID_CREDENTIALS',
                status: 401,
            });
        }
        // Generar token
        const token = (0, jwt_1.generateToken)({
            id: usuario._id.toString(),
            correo: usuario.correo,
            rol: usuario.rol,
        });
        // Actualizar último acceso
        await Usuario_1.UsuarioModel.findByIdAndUpdate(usuario._id, { ultimoAcceso: new Date() });
        res.json({
            message: 'Login exitoso',
            token,
            usuario: {
                id: usuario._id,
                nombreUsuario: usuario.nombreUsuario,
                correo: usuario.correo,
                rol: usuario.rol,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
const perfil = async (req, res, next) => {
    try {
        const usuario = await Usuario_1.UsuarioModel.findById(req.user?.id);
        if (!usuario) {
            throw new ApiError_1.default({
                name: 'NOT_FOUND',
                message: 'Usuario no encontrado',
                code: 'USER_NOT_FOUND',
                status: 404,
            });
        }
        let perfil = null;
        if (usuario.rol === 'oferente') {
            perfil = await Oferente_1.OferenteModel.findOne({ usuario: usuario._id });
        }
        else if (usuario.rol === 'solicitante') {
            perfil = await Postulante_1.PostulanteModel.findOne({ usuario: usuario._id });
        }
        res.json({
            usuario: {
                id: usuario._id,
                nombreUsuario: usuario.nombreUsuario,
                correo: usuario.correo,
                rol: usuario.rol,
                estado: usuario.estado,
                fechaRegistro: usuario.fechaRegistro,
            },
            perfil,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.perfil = perfil;
const cambiarContrasena = async (req, res, next) => {
    try {
        const { contrasenaActual, nuevaContrasena } = req.body;
        const usuario = await Usuario_1.UsuarioModel.findById(req.user?.id).select('+contrasena');
        if (!usuario) {
            throw new ApiError_1.default({
                name: 'NOT_FOUND',
                message: 'Usuario no encontrado',
                code: 'USER_NOT_FOUND',
                status: 404,
            });
        }
        // Verificar contraseña actual
        const passwordValida = await (0, bcrypt_1.comparePassword)(contrasenaActual, usuario.contrasena);
        if (!passwordValida) {
            throw new ApiError_1.default({
                name: 'UNAUTHORIZED',
                message: 'Contraseña actual incorrecta',
                code: 'INVALID_CURRENT_PASSWORD',
                status: 401,
            });
        }
        // Hash nueva contraseña
        const nuevaContrasenaHash = await (0, bcrypt_1.hashPassword)(nuevaContrasena);
        usuario.contrasena = nuevaContrasenaHash;
        await usuario.save();
        res.json({ message: 'Contraseña actualizada exitosamente' });
    }
    catch (error) {
        next(error);
    }
};
exports.cambiarContrasena = cambiarContrasena;
//# sourceMappingURL=authController.js.map