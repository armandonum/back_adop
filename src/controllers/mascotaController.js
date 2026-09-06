"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.misMascotas = exports.eliminarMascota = exports.actualizarMascota = exports.obtenerMascota = exports.listarMascotas = exports.crearMascota = void 0;
const Mascota_1 = require("../models/Mascota");
const TipoMascota_1 = require("../models/TipoMascota");
const Raza_1 = require("../models/Raza");
const Oferente_1 = require("../models/Oferente");
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const fs_1 = __importDefault(require("fs"));
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
// Helper para eliminar archivos
const eliminarArchivo = (filePath) => {
    try {
        if (fs_1.default.existsSync(filePath)) {
            fs_1.default.unlinkSync(filePath);
        }
    }
    catch (error) {
        console.error('Error al eliminar archivo:', error);
    }
};
const crearMascota = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const datos = req.body;
        const files = req.files || {};
        // Obtener URLs de las imágenes
        let fotoPrincipal = '';
        let fotografias = [];
        if (files.fotoPrincipal && files.fotoPrincipal[0]) {
            fotoPrincipal = `${BASE_URL}/uploads/${files.fotoPrincipal[0].filename}`;
        }
        if (files.fotografias) {
            fotografias = files.fotografias.map(file => `${BASE_URL}/uploads/${file.filename}`);
        }
        // Verificar que el usuario es oferente
        const oferente = await Oferente_1.OferenteModel.findOne({ usuario: userId });
        if (!oferente) {
            throw new ApiError_1.default({
                name: 'FORBIDDEN',
                message: 'El usuario no es un oferente válido',
                code: 'NOT_OFFERENT',
                status: 403,
            });
        }
        // Verificar tipo de mascota
        const tipoMascota = await TipoMascota_1.TipoMascotaModel.findById(datos.tipoMascota);
        if (!tipoMascota || !tipoMascota.estado) {
            throw new ApiError_1.default({
                name: 'NOT_FOUND',
                message: 'Tipo de mascota no válido',
                code: 'INVALID_TIPO_MASCOTA',
                status: 404,
            });
        }
        // Verificar raza
        const raza = await Raza_1.RazaModel.findById(datos.raza);
        if (!raza || !raza.estado) {
            throw new ApiError_1.default({
                name: 'NOT_FOUND',
                message: 'Raza no válida',
                code: 'INVALID_RAZA',
                status: 404,
            });
        }
        // Crear mascota
        const mascota = await Mascota_1.MascotaModel.create({
            ...datos,
            oferente: oferente._id,
            fechaRegistro: new Date(),
            estadoAdopcion: datos.estadoAdopcion || 'borrador',
            fotoPrincipal: fotoPrincipal || datos.fotoPrincipal || '',
            fotografias: fotografias.length > 0 ? fotografias : (datos.fotografias || []),
        });
        res.status(201).json(mascota);
    }
    catch (error) {
        next(error);
    }
};
exports.crearMascota = crearMascota;
const listarMascotas = async (req, res, next) => {
    try {
        const { tipoMascota, raza, sexo, tamano, edadMin, edadMax, estadoAdopcion, busqueda } = req.query;
        const filter = { estado: true };
        if (estadoAdopcion) {
            filter.estadoAdopcion = estadoAdopcion;
        }
        else {
            filter.estadoAdopcion = 'disponible';
        }
        if (tipoMascota)
            filter.tipoMascota = tipoMascota;
        if (raza)
            filter.raza = raza;
        if (sexo)
            filter.sexo = sexo;
        if (tamano)
            filter.tamano = tamano;
        if (edadMin || edadMax) {
            filter.edadAproxMeses = {};
            if (edadMin)
                filter.edadAproxMeses.$gte = parseInt(edadMin);
            if (edadMax)
                filter.edadAproxMeses.$lte = parseInt(edadMax);
        }
        if (busqueda) {
            filter.$or = [
                { nombre: { $regex: busqueda, $options: 'i' } },
                { color: { $regex: busqueda, $options: 'i' } },
            ];
        }
        const mascotas = await Mascota_1.MascotaModel.find(filter)
            .populate('tipoMascota', 'nombreTipo')
            .populate('raza', 'nombreRaza')
            .populate('oferente', 'nombres apellidos')
            .sort({ fechaRegistro: -1 });
        res.json(mascotas);
    }
    catch (error) {
        next(error);
    }
};
exports.listarMascotas = listarMascotas;
const obtenerMascota = async (req, res, next) => {
    try {
        const { id } = req.params;
        const mascota = await Mascota_1.MascotaModel.findById(id)
            .populate('tipoMascota', 'nombreTipo')
            .populate('raza', 'nombreRaza')
            .populate('oferente', 'nombres apellidos telefono');
        if (!mascota || !mascota.estado) {
            throw new ApiError_1.default({
                name: 'NOT_FOUND',
                message: 'Mascota no encontrada',
                code: 'MASCOTA_NOT_FOUND',
                status: 404,
            });
        }
        res.json(mascota);
    }
    catch (error) {
        next(error);
    }
};
exports.obtenerMascota = obtenerMascota;
const actualizarMascota = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        const datos = req.body;
        const mascota = await Mascota_1.MascotaModel.findById(id);
        if (!mascota || !mascota.estado) {
            throw new ApiError_1.default({
                name: 'NOT_FOUND',
                message: 'Mascota no encontrada',
                code: 'MASCOTA_NOT_FOUND',
                status: 404,
            });
        }
        // Verificar que el usuario es el oferente o admin
        const oferente = await Oferente_1.OferenteModel.findOne({ usuario: userId });
        if (!oferente || mascota.oferente.toString() !== oferente._id.toString()) {
            if (req.user?.rol !== 'administrador') {
                throw new ApiError_1.default({
                    name: 'FORBIDDEN',
                    message: 'No tiene permisos para editar esta mascota',
                    code: 'NOT_OWNER',
                    status: 403,
                });
            }
        }
        if (datos.estadoAdopcion) {
            const estadosValidos = ['borrador', 'pendiente', 'publicado', 'disponible', 'adoptado', 'cancelado'];
            if (!estadosValidos.includes(datos.estadoAdopcion)) {
                throw new ApiError_1.default({
                    name: 'BAD_REQUEST',
                    message: `Estado de adopción no válido. Estados permitidos: ${estadosValidos.join(', ')}`,
                    code: 'INVALID_ESTADO',
                    status: 400,
                });
            }
        }
        const files = req.files || {};
        const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
        if (files.fotoPrincipal && files.fotoPrincipal[0]) {
            datos.fotoPrincipal = `${BASE_URL}/uploads/${files.fotoPrincipal[0].filename}`;
        }
        if (files.fotografias) {
            datos.fotografias = files.fotografias.map(file => `${BASE_URL}/uploads/${file.filename}`);
        }
        const mascotaActualizada = await Mascota_1.MascotaModel.findByIdAndUpdate(id, { ...datos }, { new: true, runValidators: true });
        res.json(mascotaActualizada);
    }
    catch (error) {
        console.error('❌ [actualizarMascota] Error:', error);
        next(error);
    }
};
exports.actualizarMascota = actualizarMascota;
const eliminarMascota = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        const mascota = await Mascota_1.MascotaModel.findById(id);
        if (!mascota || !mascota.estado) {
            throw new ApiError_1.default({
                name: 'NOT_FOUND',
                message: 'Mascota no encontrada',
                code: 'MASCOTA_NOT_FOUND',
                status: 404,
            });
        }
        // Verificar que el usuario es el oferente o admin
        const oferente = await Oferente_1.OferenteModel.findOne({ usuario: userId });
        if (!oferente || mascota.oferente.toString() !== oferente._id.toString()) {
            if (req.user?.rol !== 'administrador') {
                throw new ApiError_1.default({
                    name: 'FORBIDDEN',
                    message: 'No tiene permisos para eliminar esta mascota',
                    code: 'NOT_OWNER',
                    status: 403,
                });
            }
        }
        await Mascota_1.MascotaModel.findByIdAndUpdate(id, { estado: false, estadoAdopcion: 'cancelado' });
        res.json({ message: 'Mascota eliminada' });
    }
    catch (error) {
        next(error);
    }
};
exports.eliminarMascota = eliminarMascota;
const misMascotas = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const oferente = await Oferente_1.OferenteModel.findOne({ usuario: userId });
        if (!oferente) {
            throw new ApiError_1.default({
                name: 'NOT_FOUND',
                message: 'Perfil de oferente no encontrado',
                code: 'OFFERENT_NOT_FOUND',
                status: 404,
            });
        }
        const mascotas = await Mascota_1.MascotaModel.find({ oferente: oferente._id, estado: true })
            .populate('tipoMascota', 'nombreTipo')
            .populate('raza', 'nombreRaza')
            .sort({ fechaRegistro: -1 });
        res.json(mascotas);
    }
    catch (error) {
        next(error);
    }
};
exports.misMascotas = misMascotas;
//# sourceMappingURL=mascotaController.js.map