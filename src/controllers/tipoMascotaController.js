"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eliminarTipoMascota = exports.actualizarTipoMascota = exports.listarTiposMascota = exports.crearTipoMascota = void 0;
const TipoMascota_1 = require("../models/TipoMascota");
const Mascota_1 = require("../models/Mascota");
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const crearTipoMascota = async (req, res, next) => {
    try {
        const { nombreTipo, descripcion } = req.body;
        const existente = await TipoMascota_1.TipoMascotaModel.findOne({ nombreTipo });
        if (existente) {
            throw new ApiError_1.default({
                name: 'CONFLICT',
                message: 'El tipo de mascota ya existe',
                code: 'TIPO_MASCOTA_EXISTS',
                status: 409,
            });
        }
        const tipoMascota = await TipoMascota_1.TipoMascotaModel.create({ nombreTipo, descripcion });
        res.status(201).json(tipoMascota);
    }
    catch (error) {
        next(error);
    }
};
exports.crearTipoMascota = crearTipoMascota;
const listarTiposMascota = async (req, res, next) => {
    try {
        const tipos = await TipoMascota_1.TipoMascotaModel.find({ estado: true });
        res.json(tipos);
    }
    catch (error) {
        next(error);
    }
};
exports.listarTiposMascota = listarTiposMascota;
const actualizarTipoMascota = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { nombreTipo, descripcion } = req.body;
        const tipoMascota = await TipoMascota_1.TipoMascotaModel.findByIdAndUpdate(id, { nombreTipo, descripcion }, { new: true, runValidators: true });
        if (!tipoMascota) {
            throw new ApiError_1.default({
                name: 'NOT_FOUND',
                message: 'Tipo de mascota no encontrado',
                code: 'TIPO_MASCOTA_NOT_FOUND',
                status: 404,
            });
        }
        res.json(tipoMascota);
    }
    catch (error) {
        next(error);
    }
};
exports.actualizarTipoMascota = actualizarTipoMascota;
const eliminarTipoMascota = async (req, res, next) => {
    try {
        const { id } = req.params;
        // Verificar si tiene mascotas asociadas
        const mascotas = await Mascota_1.MascotaModel.findOne({ tipoMascota: id, estado: true });
        if (mascotas) {
            throw new ApiError_1.default({
                name: 'CONFLICT',
                message: 'No se puede eliminar el tipo porque tiene mascotas asociadas',
                code: 'TIPO_MASCOTA_HAS_MASCOTAS',
                status: 409,
            });
        }
        const tipoMascota = await TipoMascota_1.TipoMascotaModel.findByIdAndUpdate(id, { estado: false }, { new: true });
        if (!tipoMascota) {
            throw new ApiError_1.default({
                name: 'NOT_FOUND',
                message: 'Tipo de mascota no encontrado',
                code: 'TIPO_MASCOTA_NOT_FOUND',
                status: 404,
            });
        }
        res.json({ message: 'Tipo de mascota eliminado', tipoMascota });
    }
    catch (error) {
        next(error);
    }
};
exports.eliminarTipoMascota = eliminarTipoMascota;
//# sourceMappingURL=tipoMascotaController.js.map