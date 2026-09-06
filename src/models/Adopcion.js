"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdopcionModel = void 0;
const mongoose_1 = require("mongoose");
const AdopcionSchema = new mongoose_1.Schema({
    solicitante: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Postulante',
        required: true,
    },
    oferente: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Oferente',
        required: true,
    },
    mascota: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Mascota',
        required: true,
    },
    solicitud: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'SolicitudAdopcion',
        required: true,
    },
    fechaAdopcion: {
        type: Date,
        default: Date.now,
    },
    estado: {
        type: String,
        enum: ['activa', 'finalizada', 'cancelada'],
        default: 'activa',
    },
    observaciones: {
        type: String,
        trim: true,
        maxlength: 500,
    },
}, {
    collection: 'adopciones',
    versionKey: false,
    timestamps: true,
});
AdopcionSchema.index({ solicitante: 1 });
AdopcionSchema.index({ oferente: 1 });
AdopcionSchema.index({ mascota: 1 });
AdopcionSchema.index({ solicitud: 1 });
AdopcionSchema.index({ estado: 1 });
exports.AdopcionModel = (0, mongoose_1.model)('Adopcion', AdopcionSchema);
//# sourceMappingURL=Adopcion.js.map