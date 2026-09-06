"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validacionesSolicitud = exports.validacionesMascota = exports.validacionesLogin = exports.validacionesRegistro = exports.validate = void 0;
const express_validator_1 = require("express-validator");
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const validate = (validations) => {
    return async (req, res, next) => {
        await Promise.all(validations.map(validation => validation.run(req)));
        const errors = (0, express_validator_1.validationResult)(req);
        if (errors.isEmpty()) {
            return next();
        }
        const errorMessages = errors.array().map(err => err.msg).join(', ');
        throw new ApiError_1.default({
            name: 'VALIDATION_ERROR',
            message: errorMessages,
            code: 'VALIDATION_FAILED',
            status: 400,
        });
    };
};
exports.validate = validate;
exports.validacionesRegistro = [
    (0, express_validator_1.body)('nombreUsuario').notEmpty().withMessage('El nombre de usuario es obligatorio').isLength({ max: 50 }),
    (0, express_validator_1.body)('correo').isEmail().withMessage('Email inválido'),
    (0, express_validator_1.body)('contrasena').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    (0, express_validator_1.body)('rol').isIn(['oferente', 'solicitante', 'administrador']).withMessage('Rol inválido'),
];
exports.validacionesLogin = [
    (0, express_validator_1.body)('correo').isEmail().withMessage('Email inválido'),
    (0, express_validator_1.body)('contrasena').notEmpty().withMessage('La contraseña es obligatoria'),
];
exports.validacionesMascota = [
    (0, express_validator_1.body)('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    (0, express_validator_1.body)('tipoMascota').notEmpty().withMessage('El tipo de mascota es obligatorio'),
    (0, express_validator_1.body)('raza').notEmpty().withMessage('La raza es obligatoria'),
    (0, express_validator_1.body)('sexo').isIn(['macho', 'hembra']).withMessage('Sexo inválido'),
    (0, express_validator_1.body)('edadAproxMeses').isNumeric().withMessage('La edad debe ser un número'),
    (0, express_validator_1.body)('tamano').isIn(['pequeno', 'mediano', 'grande']).withMessage('Tamaño inválido'),
    (0, express_validator_1.body)('color').notEmpty().withMessage('El color es obligatorio'),
    (0, express_validator_1.body)('estadoSalud').notEmpty().withMessage('El estado de salud es obligatorio'),
];
exports.validacionesSolicitud = [
    (0, express_validator_1.body)('mascotaId').notEmpty().withMessage('La mascota es obligatoria'),
    (0, express_validator_1.body)('motivoPostulacion').notEmpty().withMessage('El motivo de postulación es obligatorio'),
];
//# sourceMappingURL=validation.js.map