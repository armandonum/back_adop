"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eliminarRaza = exports.actualizarRaza = exports.listarRazas = exports.crearRaza = void 0;
const Raza_1 = require("../models/Raza");
const Mascota_1 = require("../models/Mascota");
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const crearRaza = async (req, res, next) => {
    try {
        const { tipoMascota, nombreRaza, descripcion } = req.body;
        const existente = await Raza_1.RazaModel.findOne({ tipoMascota, nombreRaza });
        if (existente) {
            throw new ApiError_1.default({
                name: 'CONFLICT',
                message: 'La raza ya existe para este tipo de mascota',
                code: 'RAZA_EXISTS',
                status: 409,
            });
        }
        const raza = await Raza_1.RazaModel.create({ tipoMascota, nombreRaza, descripcion });
        res.status(201).json(raza);
    }
    catch (error) {
        next(error);
    }
};
exports.crearRaza = crearRaza;
const listarRazas = async (req, res, next) => {
    try {
        const { tipoMascota } = req.query;
        const filter = { estado: true };
        if (tipoMascota)
            filter.tipoMascota = tipoMascota;
        const razas = await Raza_1.RazaModel.find(filter).populate('tipoMascota', 'nombreTipo');
        res.json(razas);
    }
    catch (error) {
        next(error);
    }
};
exports.listarRazas = listarRazas;
const actualizarRaza = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { nombreRaza, descripcion } = req.body;
        const raza = await Raza_1.RazaModel.findByIdAndUpdate(id, { nombreRaza, descripcion }, { new: true, runValidators: true });
        if (!raza) {
            throw new ApiError_1.default({
                name: 'NOT_FOUND',
                message: 'Raza no encontrada',
                code: 'RAZA_NOT_FOUND',
                status: 404,
            });
        }
        res.json(raza);
    }
    catch (error) {
        next(error);
    }
};
exports.actualizarRaza = actualizarRaza;
const eliminarRaza = async (req, res, next) => {
    try {
        const { id } = req.params;
        const mascotas = await Mascota_1.MascotaModel.findOne({ raza: id, estado: true });
        if (mascotas) {
            throw new ApiError_1.default({
                name: 'CONFLICT',
                message: 'No se puede eliminar la raza porque tiene mascotas asociadas',
                code: 'RAZA_HAS_MASCOTAS',
                status: 409,
            });
        }
        const raza = await Raza_1.RazaModel.findByIdAndUpdate(id, { estado: false }, { new: true });
        if (!raza) {
            throw new ApiError_1.default({
                name: 'NOT_FOUND',
                message: 'Raza no encontrada',
                code: 'RAZA_NOT_FOUND',
                status: 404,
            });
        }
        res.json({ message: 'Raza eliminada', raza });
    }
    catch (error) {
        next(error);
    }
};
exports.eliminarRaza = eliminarRaza;
//# sourceMappingURL=razaController.js.map