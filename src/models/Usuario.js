"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioModel = void 0;
const mongoose_1 = require("mongoose");
const usuarioSchema = new mongoose_1.Schema({
    nombreUsuario: {
        type: String,
        required: true,
        trim: true,
        maxlength: 80,
    },
    correo: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        maxlength: 100,
    },
    contrasena: {
        type: String,
        required: true,
        maxlength: 255,
        select: false,
    },
    rol: {
        type: String,
        required: true,
        enum: ['oferente', 'solicitante', 'administrador'],
        maxlength: 30,
    },
    estado: {
        type: Boolean,
        default: true,
    },
    fechaRegistro: {
        type: Date,
        default: Date.now,
    },
    ultimoAcceso: {
        type: Date,
    },
}, {
    collection: 'usuarios',
    versionKey: false,
    timestamps: true,
});
usuarioSchema.index({ correo: 1 });
usuarioSchema.index({ rol: 1 });
exports.UsuarioModel = (0, mongoose_1.model)('Usuario', usuarioSchema);
//# sourceMappingURL=Usuario.js.map