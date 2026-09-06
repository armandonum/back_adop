"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeguimientoModel = void 0;
const mongoose_1 = require("mongoose");
const seguimientoSchema = new mongoose_1.Schema({
    adopcion: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Adopcion',
        required: true,
    },
    fechaSeguimiento: {
        type: Date,
        default: Date.now,
    },
    tipo: {
        type: String,
        required: true,
        enum: ['inicial', 'mensual', 'trimestral', 'eventual'],
        maxlength: 30,
    },
    estadoMascota: {
        type: String,
        required: true,
        enum: ['excelente', 'bien', 'regular', 'malo', 'critico'],
        maxlength: 30,
    },
    descripcion: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000,
    },
    observaciones: {
        type: String,
        trim: true,
        maxlength: 1000,
    },
    realizadoPor: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true,
    },
    rolRealizador: {
        type: String,
        required: true,
        enum: ['admin', 'oferente', 'veterinario'],
        default: 'admin',
        maxlength: 30,
    },
    fotografias: {
        type: [String],
        default: [],
    },
    proximoSeguimiento: {
        type: Date,
    },
}, {
    collection: 'seguimientos',
    versionKey: false,
    timestamps: true,
});
seguimientoSchema.index({ adopcion: 1 });
seguimientoSchema.index({ fechaSeguimiento: -1 });
seguimientoSchema.index({ estadoMascota: 1 });
seguimientoSchema.index({ realizadoPor: 1 });
exports.SeguimientoModel = (0, mongoose_1.model)('Seguimiento', seguimientoSchema);
//# sourceMappingURL=Seguimiento.js.map